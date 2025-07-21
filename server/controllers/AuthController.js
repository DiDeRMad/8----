const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
const rateLimit = require('express-rate-limit');

const DatabaseManager = require('../database/DatabaseManager');
const Player = require('../entities/Player');
const Empire = require('../entities/Empire');

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // limit each IP to 3 registration attempts per hour
    message: 'Too many registration attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

class AuthController {
    constructor() {
        this.db = new DatabaseManager();
        this.setupRoutes();
    }

    setupRoutes() {
        // Registration
        router.post('/register', registerLimiter, this.register.bind(this));
        
        // Login
        router.post('/login', authLimiter, this.login.bind(this));
        
        // Logout
        router.post('/logout', this.logout.bind(this));
        
        // Refresh token
        router.post('/refresh', this.refreshToken.bind(this));
        
        // Verify token
        router.get('/verify', this.verifyToken.bind(this));
        
        // Password reset request
        router.post('/forgot-password', authLimiter, this.forgotPassword.bind(this));
        
        // Password reset
        router.post('/reset-password', authLimiter, this.resetPassword.bind(this));
        
        // Change password
        router.post('/change-password', this.changePassword.bind(this));
    }

    async register(req, res) {
        try {
            const { username, email, password, empireData } = req.body;

            // Validate input
            const validation = this.validateRegistrationInput({ username, email, password, empireData });
            if (!validation.isValid) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: validation.errors
                });
            }

            // Check if user already exists
            const existingUserByEmail = await this.db.getPlayerByUsername(email);
            const existingUserByUsername = await this.db.getPlayerByUsername(username);

            if (existingUserByEmail) {
                return res.status(409).json({
                    error: 'User already exists',
                    message: 'An account with this email already exists'
                });
            }

            if (existingUserByUsername) {
                return res.status(409).json({
                    error: 'User already exists',
                    message: 'An account with this username already exists'
                });
            }

            // Hash password
            const passwordHash = await bcrypt.hash(password, 12);

            // Create player
            const playerId = uuidv4();
            const player = new Player({
                id: playerId,
                username,
                email,
                passwordHash,
                createdAt: Date.now(),
                isOnline: false,
                preferences: {
                    theme: 'dark',
                    language: 'en',
                    soundEnabled: true,
                    musicEnabled: true,
                    notifications: true,
                    autoSave: true
                },
                achievements: [],
                statistics: {
                    gamesPlayed: 0,
                    totalPlaytime: 0,
                    battlesWon: 0,
                    battlesLost: 0,
                    planetsColonized: 0,
                    resourcesGathered: 0,
                    technologiesResearched: 0,
                    alliancesFormed: 0
                }
            });

            // Create empire
            const empireId = uuidv4();
            const empire = new Empire({
                id: empireId,
                name: empireData.name,
                playerId: playerId,
                faction: empireData.faction,
                color: empireData.color,
                governmentType: empireData.governmentType || 'democracy',
                culture: empireData.culture || 'human',
                createdAt: Date.now(),
                resources: {
                    credits: 10000,
                    energy: 1000,
                    minerals: 1000,
                    food: 1000,
                    research: 100,
                    influence: 50,
                    alloys: 100,
                    exotic_matter: 0
                },
                technologies: {
                    researched: ['basic_engineering', 'basic_physics', 'basic_society'],
                    available: ['improved_engineering', 'basic_weapons', 'colonial_administration'],
                    current: null
                },
                policies: {
                    economic: 'balanced',
                    military: 'defensive',
                    diplomatic: 'neutral',
                    research: 'balanced'
                }
            });

            player.empireId = empireId;

            // Save to database
            await this.db.createPlayer({
                id: playerId,
                username,
                email,
                passwordHash
            });

            await this.db.createEmpire({
                id: empireId,
                name: empire.name,
                playerId: playerId,
                faction: empire.faction,
                color: empire.color,
                governmentType: empire.governmentType,
                culture: empire.culture,
                resources: empire.resources,
                technologies: empire.technologies,
                policies: empire.policies
            });

            // Generate tokens
            const { accessToken, refreshToken } = this.generateTokens(player);

            // Set refresh token as httpOnly cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.status(201).json({
                message: 'Registration successful',
                player: {
                    id: player.id,
                    username: player.username,
                    email: player.email,
                    empireId: empire.id,
                    empireName: empire.name,
                    faction: empire.faction,
                    createdAt: player.createdAt
                },
                accessToken
            });

        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                error: 'Registration failed',
                message: 'An error occurred during registration'
            });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;

            // Validate input
            if (!username || !password) {
                return res.status(400).json({
                    error: 'Validation failed',
                    message: 'Username and password are required'
                });
            }

            // Find user by username or email
            let player = await this.db.getPlayerByUsername(username);
            if (!player) {
                // Try email if username not found
                const playerData = await this.db.getQuery(
                    'SELECT * FROM players WHERE email = ?',
                    [username]
                );
                if (playerData) {
                    player = new Player(playerData);
                }
            } else {
                player = new Player(player);
            }

            if (!player) {
                return res.status(401).json({
                    error: 'Authentication failed',
                    message: 'Invalid credentials'
                });
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(password, player.passwordHash);
            if (!isValidPassword) {
                return res.status(401).json({
                    error: 'Authentication failed',
                    message: 'Invalid credentials'
                });
            }

            // Get empire data
            const empireData = await this.db.getEmpire(player.empireId);
            const empire = empireData ? new Empire(empireData) : null;

            // Update last login
            await this.db.updatePlayer(player.id, {
                last_login: Date.now(),
                is_online: true
            });

            // Generate tokens
            const { accessToken, refreshToken } = this.generateTokens(player);

            // Set refresh token as httpOnly cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.json({
                message: 'Login successful',
                player: {
                    id: player.id,
                    username: player.username,
                    email: player.email,
                    empireId: empire?.id,
                    empireName: empire?.name,
                    faction: empire?.faction,
                    lastLogin: Date.now(),
                    preferences: player.preferences,
                    statistics: player.statistics
                },
                empire: empire ? {
                    id: empire.id,
                    name: empire.name,
                    faction: empire.faction,
                    color: empire.color,
                    level: empire.empireLevel,
                    resources: empire.resources,
                    totalPopulation: empire.totalPopulation,
                    totalSystems: empire.totalSystems,
                    totalPlanets: empire.totalPlanets
                } : null,
                accessToken
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                error: 'Login failed',
                message: 'An error occurred during login'
            });
        }
    }

    async logout(req, res) {
        try {
            const { playerId } = req.body;

            if (playerId) {
                // Update player online status
                await this.db.updatePlayer(playerId, {
                    is_online: false,
                    socket_id: null
                });
            }

            // Clear refresh token cookie
            res.clearCookie('refreshToken');

            res.json({
                message: 'Logout successful'
            });

        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                error: 'Logout failed',
                message: 'An error occurred during logout'
            });
        }
    }

    async refreshToken(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                return res.status(401).json({
                    error: 'No refresh token',
                    message: 'Refresh token not provided'
                });
            }

            // Verify refresh token
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_key');
            
            // Get player data
            const playerData = await this.db.getPlayer(decoded.playerId);
            if (!playerData) {
                return res.status(401).json({
                    error: 'Invalid token',
                    message: 'Player not found'
                });
            }

            const player = new Player(playerData);

            // Generate new access token
            const { accessToken } = this.generateTokens(player);

            res.json({
                accessToken,
                player: {
                    id: player.id,
                    username: player.username,
                    empireId: player.empireId
                }
            });

        } catch (error) {
            console.error('Token refresh error:', error);
            res.status(401).json({
                error: 'Token refresh failed',
                message: 'Invalid or expired refresh token'
            });
        }
    }

    async verifyToken(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({
                    error: 'No token',
                    message: 'Access token not provided'
                });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
            
            const playerData = await this.db.getPlayer(decoded.playerId);
            if (!playerData) {
                return res.status(401).json({
                    error: 'Invalid token',
                    message: 'Player not found'
                });
            }

            res.json({
                valid: true,
                player: {
                    id: decoded.playerId,
                    username: decoded.username,
                    empireId: decoded.empireId
                }
            });

        } catch (error) {
            res.status(401).json({
                valid: false,
                error: 'Invalid token'
            });
        }
    }

    async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            if (!email || !validator.isEmail(email)) {
                return res.status(400).json({
                    error: 'Validation failed',
                    message: 'Valid email is required'
                });
            }

            // In a real application, you would send an email with a reset link
            // For this demo, we'll just return a success message
            res.json({
                message: 'Password reset email sent',
                details: 'If an account with this email exists, a password reset link has been sent.'
            });

        } catch (error) {
            console.error('Forgot password error:', error);
            res.status(500).json({
                error: 'Password reset failed',
                message: 'An error occurred while processing the password reset request'
            });
        }
    }

    async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;

            // Validate input
            if (!token || !newPassword) {
                return res.status(400).json({
                    error: 'Validation failed',
                    message: 'Reset token and new password are required'
                });
            }

            const passwordValidation = this.validatePassword(newPassword);
            if (!passwordValidation.isValid) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: passwordValidation.errors
                });
            }

            // In a real application, you would verify the reset token
            // For this demo, we'll just return a success message
            res.json({
                message: 'Password reset successful',
                details: 'Your password has been successfully reset.'
            });

        } catch (error) {
            console.error('Reset password error:', error);
            res.status(500).json({
                error: 'Password reset failed',
                message: 'An error occurred while resetting the password'
            });
        }
    }

    async changePassword(req, res) {
        try {
            const { playerId, currentPassword, newPassword } = req.body;

            if (!playerId || !currentPassword || !newPassword) {
                return res.status(400).json({
                    error: 'Validation failed',
                    message: 'Player ID, current password, and new password are required'
                });
            }

            const passwordValidation = this.validatePassword(newPassword);
            if (!passwordValidation.isValid) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: passwordValidation.errors
                });
            }

            // Get player data
            const playerData = await this.db.getPlayer(playerId);
            if (!playerData) {
                return res.status(404).json({
                    error: 'Player not found',
                    message: 'Player does not exist'
                });
            }

            // Verify current password
            const isValidPassword = await bcrypt.compare(currentPassword, playerData.password_hash);
            if (!isValidPassword) {
                return res.status(401).json({
                    error: 'Authentication failed',
                    message: 'Current password is incorrect'
                });
            }

            // Hash new password
            const newPasswordHash = await bcrypt.hash(newPassword, 12);

            // Update password
            await this.db.updatePlayer(playerId, {
                password_hash: newPasswordHash
            });

            res.json({
                message: 'Password changed successfully'
            });

        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({
                error: 'Password change failed',
                message: 'An error occurred while changing the password'
            });
        }
    }

    validateRegistrationInput({ username, email, password, empireData }) {
        const errors = [];

        // Username validation
        if (!username || username.length < 3 || username.length > 20) {
            errors.push('Username must be between 3 and 20 characters');
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            errors.push('Username can only contain letters, numbers, and underscores');
        }

        // Email validation
        if (!email || !validator.isEmail(email)) {
            errors.push('Valid email address is required');
        }

        // Password validation
        const passwordValidation = this.validatePassword(password);
        if (!passwordValidation.isValid) {
            errors.push(...passwordValidation.errors);
        }

        // Empire data validation
        if (!empireData || !empireData.name || !empireData.faction || !empireData.color) {
            errors.push('Empire name, faction, and color are required');
        }

        if (empireData?.name && (empireData.name.length < 3 || empireData.name.length > 30)) {
            errors.push('Empire name must be between 3 and 30 characters');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    validatePassword(password) {
        const errors = [];

        if (!password || password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        if (!/(?=.*[a-z])/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/(?=.*\d)/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        if (!/(?=.*[@$!%*?&])/.test(password)) {
            errors.push('Password must contain at least one special character (@$!%*?&)');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    generateTokens(player) {
        const payload = {
            playerId: player.id,
            username: player.username,
            empireId: player.empireId
        };

        const accessToken = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_key',
            { expiresIn: '7d' }
        );

        return { accessToken, refreshToken };
    }
}

// Create and export the router
const authController = new AuthController();
module.exports = router;