const { v4: uuidv4 } = require('uuid');

class Player {
    constructor(data = {}) {
        this.id = data.id || uuidv4();
        this.username = data.username || '';
        this.email = data.email || '';
        this.passwordHash = data.password_hash || data.passwordHash || '';
        this.empireId = data.empire_id || data.empireId || null;
        this.createdAt = data.created_at || data.createdAt || Date.now();
        this.lastLogin = data.last_login || data.lastLogin || null;
        this.totalPlaytime = data.total_playtime || data.totalPlaytime || 0;
        this.isOnline = data.is_online || data.isOnline || false;
        this.socketId = data.socket_id || data.socketId || null;
        
        // Player preferences
        this.preferences = this.parseJsonField(data.preferences) || {
            theme: 'dark',
            language: 'en',
            soundEnabled: true,
            musicEnabled: true,
            soundVolume: 0.7,
            musicVolume: 0.5,
            notifications: true,
            autoSave: true,
            tooltips: true,
            animations: true,
            cameraSpeed: 1.0,
            zoomSensitivity: 1.0,
            hotkeys: {
                buildShip: 'B',
                research: 'R',
                diplomacy: 'D',
                economy: 'E',
                fleets: 'F',
                systems: 'S',
                planets: 'P',
                pause: 'SPACE'
            },
            uiLayout: {
                minimap: { visible: true, position: 'bottom-right' },
                resourceBar: { visible: true, position: 'top' },
                eventLog: { visible: true, position: 'bottom-left' },
                quickActions: { visible: true, position: 'right' }
            }
        };
        
        // Player achievements
        this.achievements = this.parseJsonField(data.achievements) || [];
        
        // Player statistics
        this.statistics = this.parseJsonField(data.statistics) || {
            gamesPlayed: 0,
            totalPlaytime: 0,
            battlesWon: 0,
            battlesLost: 0,
            battlesDrawn: 0,
            planetsColonized: 0,
            planetsLost: 0,
            systemsExplored: 0,
            resourcesGathered: {
                credits: 0,
                energy: 0,
                minerals: 0,
                food: 0,
                research: 0,
                influence: 0,
                alloys: 0,
                exotic_matter: 0
            },
            technologiesResearched: 0,
            alliancesFormed: 0,
            warsDeclareds: 0,
            tradingVolume: 0,
            shipsBuilt: 0,
            shipsLost: 0,
            buildingsConstructed: 0,
            populationGrown: 0,
            highestEmpireLevel: 1,
            longestGameDuration: 0,
            biggestFleetSize: 0,
            mostSystemsControlled: 0,
            mostPlanetsControlled: 0,
            highestResearchPoints: 0,
            fastestTechnologyResearch: 0,
            mostPowerfulShipBuilt: '',
            firstContactsMade: 0,
            diplomaticProposalsSent: 0,
            diplomaticProposalsReceived: 0,
            marketTransactions: 0,
            eventsTriggered: 0
        };
        
        // Session data
        this.sessionStartTime = null;
        this.currentSessionPlaytime = 0;
        this.lastActivity = Date.now();
        this.lastHeartbeat = Date.now();
        
        // Game state
        this.currentGameId = null;
        this.isSpectating = false;
        this.spectatingGameId = null;
        
        // Temporary session data (not persisted)
        this.connectionQuality = 'good'; // good, fair, poor
        this.latency = 0;
        this.lastPingTime = Date.now();
    }

    // Utility method to parse JSON fields from database
    parseJsonField(field) {
        if (typeof field === 'string') {
            try {
                return JSON.parse(field);
            } catch (e) {
                console.warn('Failed to parse JSON field:', field);
                return null;
            }
        }
        return field;
    }

    // Start a new game session
    startSession() {
        this.sessionStartTime = Date.now();
        this.currentSessionPlaytime = 0;
        this.isOnline = true;
        this.lastActivity = Date.now();
        this.lastHeartbeat = Date.now();
    }

    // End game session
    endSession() {
        if (this.sessionStartTime) {
            const sessionDuration = Date.now() - this.sessionStartTime;
            this.currentSessionPlaytime = sessionDuration;
            this.totalPlaytime += sessionDuration;
            this.statistics.totalPlaytime = this.totalPlaytime;
        }
        
        this.isOnline = false;
        this.socketId = null;
        this.sessionStartTime = null;
        this.currentSessionPlaytime = 0;
    }

    // Update player activity
    updateActivity() {
        this.lastActivity = Date.now();
    }

    // Update heartbeat
    updateHeartbeat() {
        this.lastHeartbeat = Date.now();
    }

    // Check if player is idle
    isIdle(idleThreshold = 300000) { // 5 minutes
        return Date.now() - this.lastActivity > idleThreshold;
    }

    // Check if player connection is alive
    isConnectionAlive(timeoutThreshold = 60000) { // 1 minute
        return Date.now() - this.lastHeartbeat < timeoutThreshold;
    }

    // Update player preferences
    updatePreferences(newPreferences) {
        this.preferences = { ...this.preferences, ...newPreferences };
    }

    // Add achievement
    addAchievement(achievementId, data = {}) {
        const achievement = {
            id: achievementId,
            unlockedAt: Date.now(),
            progress: 100,
            ...data
        };
        
        // Check if already unlocked
        const existingIndex = this.achievements.findIndex(a => a.id === achievementId);
        if (existingIndex === -1) {
            this.achievements.push(achievement);
            return true;
        }
        
        return false;
    }

    // Update achievement progress
    updateAchievementProgress(achievementId, progress, maxProgress = 100) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (achievement) {
            achievement.progress = Math.min(progress, maxProgress);
            if (achievement.progress >= maxProgress && !achievement.completed) {
                achievement.completed = true;
                achievement.completedAt = Date.now();
                return true; // Achievement completed
            }
        }
        return false;
    }

    // Update statistics
    updateStatistic(statName, value, operation = 'add') {
        if (this.statistics.hasOwnProperty(statName)) {
            switch (operation) {
                case 'add':
                    if (typeof this.statistics[statName] === 'object') {
                        // Handle nested objects like resourcesGathered
                        Object.keys(value).forEach(key => {
                            if (this.statistics[statName][key] !== undefined) {
                                this.statistics[statName][key] += value[key];
                            }
                        });
                    } else {
                        this.statistics[statName] += value;
                    }
                    break;
                case 'set':
                    this.statistics[statName] = value;
                    break;
                case 'max':
                    this.statistics[statName] = Math.max(this.statistics[statName], value);
                    break;
                case 'min':
                    this.statistics[statName] = Math.min(this.statistics[statName], value);
                    break;
            }
        }
    }

    // Increment a simple statistic
    incrementStat(statName, amount = 1) {
        this.updateStatistic(statName, amount, 'add');
    }

    // Set maximum value for a statistic
    setMaxStat(statName, value) {
        this.updateStatistic(statName, value, 'max');
    }

    // Get player's current level based on experience or playtime
    getLevel() {
        // Level based on total playtime (in hours)
        const hoursPlayed = this.totalPlaytime / (1000 * 60 * 60);
        return Math.floor(Math.sqrt(hoursPlayed)) + 1;
    }

    // Get player's experience points
    getExperiencePoints() {
        // Experience based on various activities
        let exp = 0;
        exp += this.statistics.battlesWon * 100;
        exp += this.statistics.planetsColonized * 50;
        exp += this.statistics.technologiesResearched * 75;
        exp += this.statistics.systemsExplored * 25;
        exp += this.statistics.alliancesFormed * 150;
        exp += this.achievements.length * 200;
        exp += Math.floor(this.totalPlaytime / (1000 * 60)); // 1 exp per minute
        
        return exp;
    }

    // Get player rank based on level
    getRank() {
        const level = this.getLevel();
        if (level >= 50) return 'Galactic Emperor';
        if (level >= 40) return 'Supreme Admiral';
        if (level >= 30) return 'Fleet Admiral';
        if (level >= 25) return 'Admiral';
        if (level >= 20) return 'Commodore';
        if (level >= 15) return 'Captain';
        if (level >= 10) return 'Commander';
        if (level >= 5) return 'Lieutenant';
        if (level >= 2) return 'Ensign';
        return 'Rookie';
    }

    // Get player efficiency rating
    getEfficiencyRating() {
        if (this.statistics.gamesPlayed === 0) return 0;
        
        const winRate = this.statistics.battlesWon / (this.statistics.battlesWon + this.statistics.battlesLost + this.statistics.battlesDrawn);
        const avgPlanetsPerGame = this.statistics.planetsColonized / this.statistics.gamesPlayed;
        const avgTechPerGame = this.statistics.technologiesResearched / this.statistics.gamesPlayed;
        
        // Weighted efficiency score
        return Math.round((winRate * 40 + avgPlanetsPerGame * 2 + avgTechPerGame * 3) * 10) / 10;
    }

    // Update player with game state
    update(gameState) {
        this.updateActivity();
        
        // Update current session playtime
        if (this.sessionStartTime) {
            this.currentSessionPlaytime = Date.now() - this.sessionStartTime;
        }
        
        // Check for new achievements based on statistics
        this.checkAchievements();
    }

    // Check for achievement unlocks
    checkAchievements() {
        const achievementChecks = [
            // First steps
            { id: 'first_login', condition: () => this.lastLogin !== null },
            { id: 'first_battle', condition: () => this.statistics.battlesWon + this.statistics.battlesLost > 0 },
            { id: 'first_planet', condition: () => this.statistics.planetsColonized > 0 },
            { id: 'first_tech', condition: () => this.statistics.technologiesResearched > 0 },
            { id: 'first_alliance', condition: () => this.statistics.alliancesFormed > 0 },
            
            // Combat achievements
            { id: 'victor', condition: () => this.statistics.battlesWon >= 1 },
            { id: 'warrior', condition: () => this.statistics.battlesWon >= 10 },
            { id: 'conqueror', condition: () => this.statistics.battlesWon >= 50 },
            { id: 'destroyer', condition: () => this.statistics.battlesWon >= 100 },
            
            // Exploration achievements
            { id: 'explorer', condition: () => this.statistics.systemsExplored >= 5 },
            { id: 'pathfinder', condition: () => this.statistics.systemsExplored >= 25 },
            { id: 'galactic_explorer', condition: () => this.statistics.systemsExplored >= 100 },
            
            // Colony achievements
            { id: 'colonist', condition: () => this.statistics.planetsColonized >= 1 },
            { id: 'empire_builder', condition: () => this.statistics.planetsColonized >= 10 },
            { id: 'galactic_ruler', condition: () => this.statistics.planetsColonized >= 50 },
            
            // Research achievements
            { id: 'scientist', condition: () => this.statistics.technologiesResearched >= 5 },
            { id: 'researcher', condition: () => this.statistics.technologiesResearched >= 25 },
            { id: 'innovator', condition: () => this.statistics.technologiesResearched >= 50 },
            
            // Time-based achievements
            { id: 'dedicated', condition: () => this.totalPlaytime >= 3600000 }, // 1 hour
            { id: 'veteran', condition: () => this.totalPlaytime >= 36000000 }, // 10 hours
            { id: 'legend', condition: () => this.totalPlaytime >= 180000000 }, // 50 hours
            
            // Level achievements
            { id: 'rising_star', condition: () => this.getLevel() >= 5 },
            { id: 'commander', condition: () => this.getLevel() >= 10 },
            { id: 'admiral', condition: () => this.getLevel() >= 20 },
            { id: 'emperor', condition: () => this.getLevel() >= 50 }
        ];
        
        for (const check of achievementChecks) {
            if (check.condition() && !this.achievements.find(a => a.id === check.id)) {
                this.addAchievement(check.id);
            }
        }
    }

    // Get public data (safe to send to clients)
    getPublicData() {
        return {
            id: this.id,
            username: this.username,
            empireId: this.empireId,
            level: this.getLevel(),
            rank: this.getRank(),
            experiencePoints: this.getExperiencePoints(),
            efficiencyRating: this.getEfficiencyRating(),
            isOnline: this.isOnline,
            lastLogin: this.lastLogin,
            createdAt: this.createdAt,
            achievementCount: this.achievements.length,
            statistics: {
                gamesPlayed: this.statistics.gamesPlayed,
                battlesWon: this.statistics.battlesWon,
                planetsColonized: this.statistics.planetsColonized,
                technologiesResearched: this.statistics.technologiesResearched,
                systemsExplored: this.statistics.systemsExplored
            }
        };
    }

    // Get private data (only for the player themselves)
    getPrivateData() {
        return {
            ...this.getPublicData(),
            email: this.email,
            preferences: this.preferences,
            achievements: this.achievements,
            statistics: this.statistics,
            totalPlaytime: this.totalPlaytime,
            currentSessionPlaytime: this.currentSessionPlaytime,
            connectionQuality: this.connectionQuality,
            latency: this.latency
        };
    }

    // Get database save data
    getDatabaseData() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            passwordHash: this.passwordHash,
            empireId: this.empireId,
            createdAt: this.createdAt,
            lastLogin: this.lastLogin,
            totalPlaytime: this.totalPlaytime,
            isOnline: this.isOnline,
            socketId: this.socketId,
            preferences: JSON.stringify(this.preferences),
            achievements: JSON.stringify(this.achievements),
            statistics: JSON.stringify(this.statistics)
        };
    }

    // Validate player data
    validate() {
        const errors = [];
        
        if (!this.username || this.username.length < 3) {
            errors.push('Username must be at least 3 characters long');
        }
        
        if (!this.email || !this.email.includes('@')) {
            errors.push('Valid email is required');
        }
        
        if (!this.passwordHash) {
            errors.push('Password hash is required');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Clone player (for backup/restore)
    clone() {
        return new Player(this.getDatabaseData());
    }

    // Compare with another player for equality
    equals(otherPlayer) {
        return this.id === otherPlayer.id;
    }

    // String representation
    toString() {
        return `Player(${this.username}, Level ${this.getLevel()}, ${this.getRank()})`;
    }
}

module.exports = Player;