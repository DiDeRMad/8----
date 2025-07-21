import './styles/main.css';
import { GameEngine } from './game/GameEngine';
import { AuthManager } from './auth/AuthManager';
import { UIManager } from './ui/UIManager';
import { SocketManager } from './network/SocketManager';
import { NotificationManager } from './ui/NotificationManager';
import { LoadingManager } from './ui/LoadingManager';

/**
 * Cosmic Empire - Main Client Application
 * 
 * This is the entry point for the client-side game application.
 * It manages the authentication, game engine, UI, and network communications.
 */
class CosmicEmpireClient {
    constructor() {
        this.gameEngine = null;
        this.authManager = null;
        this.uiManager = null;
        this.socketManager = null;
        this.notificationManager = null;
        this.loadingManager = null;
        
        // Game state
        this.currentUser = null;
        this.gameState = {
            isAuthenticated: false,
            isInGame: false,
            gameData: null
        };
        
        // Settings
        this.settings = {
            apiUrl: process.env.API_URL || 'http://localhost:3000',
            socketUrl: process.env.SOCKET_URL || 'http://localhost:3000',
            debugMode: process.env.NODE_ENV === 'development'
        };
        
        // Performance monitoring
        this.performance = {
            frameRate: 0,
            lastFrameTime: 0,
            frameCount: 0,
            startTime: Date.now()
        };
        
        // Initialize the application
        this.initialize();
    }

    async initialize() {
        console.log('🚀 Initializing Cosmic Empire Client...');
        
        try {
            // Initialize loading manager first
            this.loadingManager = new LoadingManager();
            await this.loadingManager.show();
            
            // Initialize core managers
            await this.initializeManagers();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Check for existing authentication
            await this.checkAuthStatus();
            
            // Hide loading screen
            await this.loadingManager.hide();
            
            console.log('✅ Cosmic Empire Client initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize client:', error);
            this.showCriticalError('Failed to initialize game. Please refresh the page.');
        }
    }

    async initializeManagers() {
        this.loadingManager.updateProgress(20, 'Initializing managers...');
        
        // Initialize notification manager
        this.notificationManager = new NotificationManager();
        
        // Initialize authentication manager
        this.loadingManager.updateProgress(30, 'Setting up authentication...');
        this.authManager = new AuthManager(this.settings.apiUrl);
        
        // Initialize UI manager
        this.loadingManager.updateProgress(50, 'Loading user interface...');
        this.uiManager = new UIManager();
        
        // Initialize socket manager
        this.loadingManager.updateProgress(70, 'Connecting to game servers...');
        this.socketManager = new SocketManager(this.settings.socketUrl);
        
        // Initialize game engine
        this.loadingManager.updateProgress(90, 'Loading game engine...');
        this.gameEngine = new GameEngine();
        
        this.loadingManager.updateProgress(100, 'Ready to play!');
    }

    setupEventListeners() {
        // Authentication events
        this.authManager.on('login_success', this.handleLoginSuccess.bind(this));
        this.authManager.on('login_error', this.handleLoginError.bind(this));
        this.authManager.on('logout', this.handleLogout.bind(this));
        this.authManager.on('registration_success', this.handleRegistrationSuccess.bind(this));
        this.authManager.on('registration_error', this.handleRegistrationError.bind(this));
        
        // Socket events
        this.socketManager.on('connected', this.handleSocketConnected.bind(this));
        this.socketManager.on('disconnected', this.handleSocketDisconnected.bind(this));
        this.socketManager.on('game_state_update', this.handleGameStateUpdate.bind(this));
        this.socketManager.on('notification', this.handleNotification.bind(this));
        this.socketManager.on('error', this.handleSocketError.bind(this));
        
        // Game engine events
        this.gameEngine.on('ready', this.handleGameEngineReady.bind(this));
        this.gameEngine.on('error', this.handleGameEngineError.bind(this));
        this.gameEngine.on('action', this.handleGameAction.bind(this));
        
        // UI events
        this.uiManager.on('login_requested', this.handleLoginRequest.bind(this));
        this.uiManager.on('register_requested', this.handleRegisterRequest.bind(this));
        this.uiManager.on('logout_requested', this.handleLogoutRequest.bind(this));
        this.uiManager.on('game_action', this.handleUIGameAction.bind(this));
        
        // Window events
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        window.addEventListener('resize', this.handleWindowResize.bind(this));
        window.addEventListener('focus', this.handleWindowFocus.bind(this));
        window.addEventListener('blur', this.handleWindowBlur.bind(this));
        
        // Performance monitoring
        this.startPerformanceMonitoring();
        
        // Global error handling
        window.addEventListener('error', this.handleGlobalError.bind(this));
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
    }

    async checkAuthStatus() {
        try {
            const authData = await this.authManager.checkExistingAuth();
            
            if (authData && authData.player) {
                this.currentUser = authData.player;
                this.gameState.isAuthenticated = true;
                
                // Connect to game socket
                await this.socketManager.connect(authData.accessToken);
                
                // Initialize game interface
                this.uiManager.showGameInterface();
                this.gameState.isInGame = true;
                
                this.notificationManager.show({
                    type: 'success',
                    title: 'Welcome back!',
                    message: `Welcome back, ${this.currentUser.username}!`
                });
                
            } else {
                // Show authentication modal
                this.uiManager.showAuthModal();
            }
            
        } catch (error) {
            console.error('Auth check failed:', error);
            this.uiManager.showAuthModal();
        }
    }

    // Authentication event handlers
    async handleLoginSuccess(authData) {
        this.currentUser = authData.player;
        this.gameState.isAuthenticated = true;
        
        this.notificationManager.show({
            type: 'success',
            title: 'Login Successful',
            message: `Welcome to Cosmic Empire, ${this.currentUser.username}!`
        });
        
        // Hide auth modal
        this.uiManager.hideAuthModal();
        
        // Connect to game socket
        try {
            await this.socketManager.connect(authData.accessToken);
        } catch (error) {
            console.error('Failed to connect to game:', error);
            this.notificationManager.show({
                type: 'error',
                title: 'Connection Failed',
                message: 'Failed to connect to game servers. Please try again.'
            });
        }
    }

    handleLoginError(error) {
        this.notificationManager.show({
            type: 'error',
            title: 'Login Failed',
            message: error.message || 'Invalid credentials. Please try again.'
        });
    }

    async handleRegistrationSuccess(authData) {
        this.currentUser = authData.player;
        this.gameState.isAuthenticated = true;
        
        this.notificationManager.show({
            type: 'success',
            title: 'Empire Created!',
            message: `Welcome to the galaxy, ${this.currentUser.username}! Your empire awaits.`
        });
        
        // Hide auth modal
        this.uiManager.hideAuthModal();
        
        // Connect to game socket
        try {
            await this.socketManager.connect(authData.accessToken);
        } catch (error) {
            console.error('Failed to connect to game:', error);
            this.notificationManager.show({
                type: 'error',
                title: 'Connection Failed',
                message: 'Failed to connect to game servers. Please try again.'
            });
        }
    }

    handleRegistrationError(error) {
        this.notificationManager.show({
            type: 'error',
            title: 'Registration Failed',
            message: error.message || 'Failed to create empire. Please try again.'
        });
    }

    async handleLogout() {
        this.currentUser = null;
        this.gameState.isAuthenticated = false;
        this.gameState.isInGame = false;
        
        // Disconnect from game
        await this.socketManager.disconnect();
        
        // Reset game engine
        this.gameEngine.reset();
        
        // Show auth modal
        this.uiManager.showAuthModal();
        this.uiManager.hideGameInterface();
        
        this.notificationManager.show({
            type: 'info',
            title: 'Logged Out',
            message: 'You have been logged out successfully.'
        });
    }

    // Socket event handlers
    handleSocketConnected() {
        console.log('Connected to game server');
        
        // Show game interface
        this.uiManager.showGameInterface();
        this.gameState.isInGame = true;
        
        this.notificationManager.show({
            type: 'success',
            title: 'Connected',
            message: 'Successfully connected to game servers.'
        });
    }

    handleSocketDisconnected(reason) {
        console.log('Disconnected from game server:', reason);
        
        this.gameState.isInGame = false;
        
        this.notificationManager.show({
            type: 'warning',
            title: 'Disconnected',
            message: 'Lost connection to game servers. Attempting to reconnect...'
        });
        
        // Attempt to reconnect
        if (this.gameState.isAuthenticated) {
            setTimeout(() => {
                this.socketManager.reconnect();
            }, 3000);
        }
    }

    handleGameStateUpdate(gameData) {
        this.gameState.gameData = gameData;
        
        // Update game engine
        this.gameEngine.updateGameState(gameData);
        
        // Update UI
        this.uiManager.updateGameData(gameData);
        
        // Update player info
        if (gameData.player) {
            this.currentUser = { ...this.currentUser, ...gameData.player };
        }
    }

    handleNotification(notification) {
        this.notificationManager.show(notification);
        
        // Also add to game log if it's a game event
        if (notification.gameEvent) {
            this.uiManager.addLogEntry(notification);
        }
    }

    handleSocketError(error) {
        console.error('Socket error:', error);
        
        this.notificationManager.show({
            type: 'error',
            title: 'Connection Error',
            message: 'Network error occurred. Please check your connection.'
        });
    }

    // Game engine event handlers
    handleGameEngineReady() {
        console.log('Game engine ready');
    }

    handleGameEngineError(error) {
        console.error('Game engine error:', error);
        
        this.notificationManager.show({
            type: 'error',
            title: 'Game Error',
            message: 'An error occurred in the game engine.'
        });
    }

    handleGameAction(action) {
        // Send game action to server
        this.socketManager.sendGameAction(action);
    }

    // UI event handlers
    async handleLoginRequest(credentials) {
        try {
            await this.authManager.login(credentials);
        } catch (error) {
            console.error('Login request failed:', error);
        }
    }

    async handleRegisterRequest(registrationData) {
        try {
            await this.authManager.register(registrationData);
        } catch (error) {
            console.error('Registration request failed:', error);
        }
    }

    async handleLogoutRequest() {
        try {
            await this.authManager.logout();
        } catch (error) {
            console.error('Logout request failed:', error);
        }
    }

    handleUIGameAction(action) {
        // Forward UI actions to game engine
        this.gameEngine.processAction(action);
    }

    // Window event handlers
    handleBeforeUnload(event) {
        if (this.gameState.isInGame) {
            // Save game state before leaving
            this.socketManager.sendGameAction({
                type: 'save_game',
                timestamp: Date.now()
            });
            
            // Show confirmation dialog
            event.preventDefault();
            event.returnValue = 'Are you sure you want to leave? Your game progress will be saved.';
            return event.returnValue;
        }
    }

    handleWindowResize() {
        // Notify game engine of resize
        if (this.gameEngine) {
            this.gameEngine.handleResize();
        }
        
        // Update UI layout
        if (this.uiManager) {
            this.uiManager.handleResize();
        }
    }

    handleWindowFocus() {
        // Resume game if it was paused
        if (this.gameEngine) {
            this.gameEngine.resume();
        }
        
        // Reconnect socket if needed
        if (this.gameState.isAuthenticated && !this.socketManager.isConnected()) {
            this.socketManager.reconnect();
        }
    }

    handleWindowBlur() {
        // Pause game when window loses focus
        if (this.gameEngine) {
            this.gameEngine.pause();
        }
    }

    // Performance monitoring
    startPerformanceMonitoring() {
        setInterval(() => {
            this.updatePerformanceStats();
        }, 1000);
        
        // Frame rate monitoring
        const measureFrameRate = () => {
            this.performance.frameCount++;
            const now = Date.now();
            
            if (now - this.performance.lastFrameTime >= 1000) {
                this.performance.frameRate = this.performance.frameCount;
                this.performance.frameCount = 0;
                this.performance.lastFrameTime = now;
            }
            
            requestAnimationFrame(measureFrameRate);
        };
        
        requestAnimationFrame(measureFrameRate);
    }

    updatePerformanceStats() {
        const memoryUsage = performance.memory ? {
            used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
            total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
            limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
        } : null;
        
        this.performance.memory = memoryUsage;
        
        // Log performance issues
        if (this.performance.frameRate < 30) {
            console.warn('Low frame rate detected:', this.performance.frameRate);
        }
        
        if (memoryUsage && memoryUsage.used > 100) {
            console.warn('High memory usage:', memoryUsage.used + 'MB');
        }
    }

    // Error handling
    handleGlobalError(event) {
        console.error('Global error:', event.error);
        
        this.notificationManager.show({
            type: 'error',
            title: 'Application Error',
            message: 'An unexpected error occurred. Please refresh the page if problems persist.'
        });
        
        // Send error report if in production
        if (this.settings.debugMode === false) {
            this.sendErrorReport(event.error);
        }
    }

    handleUnhandledRejection(event) {
        console.error('Unhandled promise rejection:', event.reason);
        
        this.notificationManager.show({
            type: 'error',
            title: 'Network Error',
            message: 'A network error occurred. Please check your connection.'
        });
    }

    sendErrorReport(error) {
        // Send error report to server for monitoring
        if (this.socketManager && this.socketManager.isConnected()) {
            this.socketManager.send('error_report', {
                error: {
                    message: error.message,
                    stack: error.stack,
                    timestamp: Date.now()
                },
                user: this.currentUser ? this.currentUser.id : null,
                performance: this.performance,
                userAgent: navigator.userAgent
            });
        }
    }

    showCriticalError(message) {
        // Show critical error that prevents game from running
        document.body.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: #0B1426;
                color: #FFFFFF;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                font-family: Arial, sans-serif;
                text-align: center;
                z-index: 9999;
            ">
                <h1 style="color: #FF4757; margin-bottom: 20px;">⚠️ Critical Error</h1>
                <p style="margin-bottom: 30px; max-width: 500px;">${message}</p>
                <button onclick="window.location.reload()" style="
                    background: #00D4FF;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                ">Reload Game</button>
            </div>
        `;
    }

    // Public API
    getGameState() {
        return this.gameState;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getPerformanceStats() {
        return this.performance;
    }

    // Debug methods (only available in development)
    debug() {
        if (this.settings.debugMode) {
            return {
                gameState: this.gameState,
                user: this.currentUser,
                performance: this.performance,
                managers: {
                    auth: this.authManager,
                    ui: this.uiManager,
                    socket: this.socketManager,
                    game: this.gameEngine,
                    notifications: this.notificationManager
                }
            };
        }
        return null;
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create global game client instance
    window.CosmicEmpire = new CosmicEmpireClient();
    
    // Expose debug methods in development
    if (process.env.NODE_ENV === 'development') {
        window.debug = () => window.CosmicEmpire.debug();
        console.log('🔧 Debug mode enabled. Use debug() in console for debugging tools.');
    }
});

// Hot module replacement for development
if (module.hot) {
    module.hot.accept();
}