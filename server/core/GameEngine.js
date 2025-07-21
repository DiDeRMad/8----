const EventEmitter = require('events');
const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');

// Import game systems
const UniverseManager = require('./UniverseManager');
const EconomyManager = require('./EconomyManager');
const CombatManager = require('./CombatManager');
const ResearchManager = require('./ResearchManager');
const DiplomacyManager = require('./DiplomacyManager');
const AIManager = require('./AIManager');
const PhysicsEngine = require('./PhysicsEngine');

// Import game entities
const Player = require('../entities/Player');
const Empire = require('../entities/Empire');
const StarSystem = require('../entities/StarSystem');
const Planet = require('../entities/Planet');
const Fleet = require('../entities/Fleet');
const Ship = require('../entities/Ship');
const Building = require('../entities/Building');
const Resource = require('../entities/Resource');

// Import game constants
const GameConstants = require('../../shared/GameConstants');
const GameConfig = require('../../shared/GameConfig');

class GameEngine extends EventEmitter {
    constructor(database, socketIo) {
        super();
        this.db = database;
        this.io = socketIo;
        
        // Game state
        this.gameState = {
            status: 'initializing',
            currentTick: 0,
            lastUpdate: Date.now(),
            players: new Map(),
            empires: new Map(),
            starSystems: new Map(),
            planets: new Map(),
            fleets: new Map(),
            battles: new Map(),
            tradeRoutes: new Map(),
            diplomatic_relations: new Map(),
            research_projects: new Map(),
            events: [],
            economy: {
                globalMarket: new Map(),
                priceHistory: new Map(),
                supplyDemand: new Map()
            }
        };
        
        // Game managers
        this.universeManager = null;
        this.economyManager = null;
        this.combatManager = null;
        this.researchManager = null;
        this.diplomacyManager = null;
        this.aiManager = null;
        this.physicsEngine = null;
        
        // Game loop timers
        this.gameLoopInterval = null;
        this.universeSimulationInterval = null;
        this.economicSimulationInterval = null;
        this.aiUpdateInterval = null;
        
        // Performance tracking
        this.performance = {
            gameLoopTime: 0,
            universeSimTime: 0,
            economicSimTime: 0,
            aiUpdateTime: 0,
            lastFrameTime: Date.now()
        };
        
        // Game settings
        this.settings = {
            tickRate: GameConfig.TICK_RATE || 1000, // ms
            universeUpdateRate: GameConfig.UNIVERSE_UPDATE_RATE || 5000,
            economicUpdateRate: GameConfig.ECONOMIC_UPDATE_RATE || 10000,
            aiUpdateRate: GameConfig.AI_UPDATE_RATE || 2000,
            maxPlayersPerGalaxy: GameConfig.MAX_PLAYERS_PER_GALAXY || 100,
            autoSaveInterval: GameConfig.AUTO_SAVE_INTERVAL || 60000
        };
    }

    async initialize() {
        console.log('🚀 Initializing Game Engine...');
        
        try {
            // Initialize game managers
            await this.initializeManagers();
            
            // Load game state from database
            await this.loadGameState();
            
            // Initialize universe if empty
            await this.initializeUniverse();
            
            // Setup event listeners
            this.setupEventListeners();
            
            this.gameState.status = 'running';
            console.log('✅ Game Engine initialized successfully');
            
        } catch (error) {
            console.error('❌ Game Engine initialization failed:', error);
            throw error;
        }
    }

    async initializeManagers() {
        // Initialize core managers
        this.universeManager = new UniverseManager(this);
        this.economyManager = new EconomyManager(this);
        this.combatManager = new CombatManager(this);
        this.researchManager = new ResearchManager(this);
        this.diplomacyManager = new DiplomacyManager(this);
        this.aiManager = new AIManager(this);
        this.physicsEngine = new PhysicsEngine(this);
        
        // Initialize all managers
        await Promise.all([
            this.universeManager.initialize(),
            this.economyManager.initialize(),
            this.combatManager.initialize(),
            this.researchManager.initialize(),
            this.diplomacyManager.initialize(),
            this.aiManager.initialize(),
            this.physicsEngine.initialize()
        ]);
    }

    async loadGameState() {
        console.log('📂 Loading game state from database...');
        
        try {
            // Load players
            const players = await this.db.getPlayers();
            for (const playerData of players) {
                const player = new Player(playerData);
                this.gameState.players.set(player.id, player);
            }
            
            // Load empires
            const empires = await this.db.getEmpires();
            for (const empireData of empires) {
                const empire = new Empire(empireData);
                this.gameState.empires.set(empire.id, empire);
            }
            
            // Load star systems
            const starSystems = await this.db.getStarSystems();
            for (const systemData of starSystems) {
                const starSystem = new StarSystem(systemData);
                this.gameState.starSystems.set(starSystem.id, starSystem);
            }
            
            // Load planets
            const planets = await this.db.getPlanets();
            for (const planetData of planets) {
                const planet = new Planet(planetData);
                this.gameState.planets.set(planet.id, planet);
            }
            
            // Load fleets
            const fleets = await this.db.getFleets();
            for (const fleetData of fleets) {
                const fleet = new Fleet(fleetData);
                this.gameState.fleets.set(fleet.id, fleet);
            }
            
            console.log(`✅ Loaded: ${this.gameState.players.size} players, ${this.gameState.empires.size} empires, ${this.gameState.starSystems.size} systems`);
            
        } catch (error) {
            console.error('Error loading game state:', error);
            // Continue with empty state if loading fails
        }
    }

    async initializeUniverse() {
        if (this.gameState.starSystems.size === 0) {
            console.log('🌌 Generating initial universe...');
            await this.universeManager.generateUniverse();
        }
    }

    setupEventListeners() {
        // Player events
        this.on('player_joined', this.handlePlayerJoined.bind(this));
        this.on('player_left', this.handlePlayerLeft.bind(this));
        
        // Empire events
        this.on('empire_created', this.handleEmpireCreated.bind(this));
        this.on('empire_destroyed', this.handleEmpireDestroyed.bind(this));
        
        // Combat events
        this.on('battle_started', this.handleBattleStarted.bind(this));
        this.on('battle_ended', this.handleBattleEnded.bind(this));
        
        // Economic events
        this.on('trade_completed', this.handleTradeCompleted.bind(this));
        this.on('market_fluctuation', this.handleMarketFluctuation.bind(this));
        
        // Research events
        this.on('research_completed', this.handleResearchCompleted.bind(this));
        this.on('technology_unlocked', this.handleTechnologyUnlocked.bind(this));
        
        // Diplomatic events
        this.on('alliance_formed', this.handleAllianceFormed.bind(this));
        this.on('war_declared', this.handleWarDeclared.bind(this));
    }

    startGameLoop() {
        console.log('🔄 Starting main game loop...');
        
        this.gameLoopInterval = setInterval(() => {
            const startTime = Date.now();
            
            try {
                this.updateGameState();
                this.broadcastGameState();
                
                this.performance.gameLoopTime = Date.now() - startTime;
                this.performance.lastFrameTime = Date.now();
                
            } catch (error) {
                console.error('Game loop error:', error);
            }
            
        }, this.settings.tickRate);
    }

    startUniverseSimulation() {
        console.log('🌌 Starting universe simulation...');
        
        this.universeSimulationInterval = setInterval(() => {
            const startTime = Date.now();
            
            try {
                this.universeManager.updateUniverse();
                this.physicsEngine.updatePhysics();
                
                this.performance.universeSimTime = Date.now() - startTime;
                
            } catch (error) {
                console.error('Universe simulation error:', error);
            }
            
        }, this.settings.universeUpdateRate);
    }

    startEconomicSimulation() {
        console.log('💰 Starting economic simulation...');
        
        this.economicSimulationInterval = setInterval(() => {
            const startTime = Date.now();
            
            try {
                this.economyManager.updateEconomy();
                this.economyManager.processTradeRoutes();
                this.economyManager.updateMarketPrices();
                
                this.performance.economicSimTime = Date.now() - startTime;
                
            } catch (error) {
                console.error('Economic simulation error:', error);
            }
            
        }, this.settings.economicUpdateRate);
    }

    startAIUpdates() {
        console.log('🤖 Starting AI updates...');
        
        this.aiUpdateInterval = setInterval(() => {
            const startTime = Date.now();
            
            try {
                this.aiManager.updateAI();
                
                this.performance.aiUpdateTime = Date.now() - startTime;
                
            } catch (error) {
                console.error('AI update error:', error);
            }
            
        }, this.settings.aiUpdateRate);
    }

    updateGameState() {
        this.gameState.currentTick++;
        this.gameState.lastUpdate = Date.now();
        
        // Update all game entities
        this.updatePlayers();
        this.updateEmpires();
        this.updateFleets();
        this.updateBattles();
        this.updateResearch();
        this.updateDiplomacy();
        
        // Process events
        this.processEvents();
        
        // Auto-save periodically
        if (this.gameState.currentTick % (this.settings.autoSaveInterval / this.settings.tickRate) === 0) {
            this.autoSave();
        }
    }

    updatePlayers() {
        for (const player of this.gameState.players.values()) {
            if (player.isOnline) {
                player.update(this.gameState);
            }
        }
    }

    updateEmpires() {
        for (const empire of this.gameState.empires.values()) {
            empire.update(this.gameState);
            
            // Update empire resources
            this.economyManager.updateEmpireResources(empire);
            
            // Update empire research
            this.researchManager.updateEmpireResearch(empire);
        }
    }

    updateFleets() {
        for (const fleet of this.gameState.fleets.values()) {
            fleet.update(this.gameState);
            
            // Check for fleet encounters
            this.checkFleetEncounters(fleet);
        }
    }

    updateBattles() {
        for (const battle of this.gameState.battles.values()) {
            const result = this.combatManager.updateBattle(battle);
            
            if (result.finished) {
                this.emit('battle_ended', battle, result);
                this.gameState.battles.delete(battle.id);
            }
        }
    }

    updateResearch() {
        for (const empire of this.gameState.empires.values()) {
            const completedProjects = this.researchManager.updateResearch(empire);
            
            for (const project of completedProjects) {
                this.emit('research_completed', empire, project);
            }
        }
    }

    updateDiplomacy() {
        this.diplomacyManager.updateDiplomacy();
    }

    processEvents() {
        const currentEvents = [...this.gameState.events];
        this.gameState.events = [];
        
        for (const event of currentEvents) {
            this.processEvent(event);
        }
    }

    processEvent(event) {
        switch (event.type) {
            case 'system_discovered':
                this.handleSystemDiscovered(event);
                break;
            case 'planet_colonized':
                this.handlePlanetColonized(event);
                break;
            case 'resource_depleted':
                this.handleResourceDepleted(event);
                break;
            case 'technology_breakthrough':
                this.handleTechnologyBreakthrough(event);
                break;
            default:
                console.warn('Unknown event type:', event.type);
        }
    }

    checkFleetEncounters(fleet) {
        // Check for encounters with other fleets
        const nearbyFleets = this.getNearbyFleets(fleet);
        
        for (const otherFleet of nearbyFleets) {
            if (this.shouldInitiateCombat(fleet, otherFleet)) {
                this.initiateCombat(fleet, otherFleet);
            }
        }
    }

    getNearbyFleets(fleet, radius = 1000) {
        const nearbyFleets = [];
        
        for (const otherFleet of this.gameState.fleets.values()) {
            if (otherFleet.id !== fleet.id) {
                const distance = this.calculateDistance(fleet.position, otherFleet.position);
                if (distance <= radius) {
                    nearbyFleets.push(otherFleet);
                }
            }
        }
        
        return nearbyFleets;
    }

    shouldInitiateCombat(fleet1, fleet2) {
        const empire1 = this.gameState.empires.get(fleet1.empireId);
        const empire2 = this.gameState.empires.get(fleet2.empireId);
        
        if (!empire1 || !empire2) return false;
        
        // Check diplomatic relations
        const relation = this.diplomacyManager.getRelation(empire1.id, empire2.id);
        
        return relation === 'war' || (fleet1.isAggressive && fleet2.isAggressive);
    }

    initiateCombat(fleet1, fleet2) {
        const battle = this.combatManager.createBattle(fleet1, fleet2);
        this.gameState.battles.set(battle.id, battle);
        this.emit('battle_started', battle);
    }

    calculateDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        const dz = pos1.z - pos2.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    broadcastGameState() {
        // Send different data to different player groups
        this.broadcastToPlayers();
        this.broadcastToSpectators();
        this.broadcastGlobalUpdates();
    }

    broadcastToPlayers() {
        for (const player of this.gameState.players.values()) {
            if (player.isOnline && player.socketId) {
                const playerGameState = this.getPlayerGameState(player);
                this.io.to(player.socketId).emit('game_state_update', playerGameState);
            }
        }
    }

    broadcastToSpectators() {
        const spectatorData = this.getSpectatorGameState();
        this.io.to('spectators').emit('spectator_update', spectatorData);
    }

    broadcastGlobalUpdates() {
        const globalData = this.getGlobalGameState();
        this.io.emit('global_update', globalData);
    }

    getPlayerGameState(player) {
        const empire = this.gameState.empires.get(player.empireId);
        if (!empire) return null;
        
        return {
            player: player.getPublicData(),
            empire: empire.getDetailedData(),
            visibleSystems: this.getVisibleSystems(empire),
            ownFleets: this.getEmpireFleets(empire.id),
            visibleFleets: this.getVisibleFleets(empire),
            activeBattles: this.getEmpireBattles(empire.id),
            diplomacy: this.diplomacyManager.getEmpireDiplomacy(empire.id),
            research: this.researchManager.getEmpireResearch(empire.id),
            economy: this.economyManager.getEmpireEconomy(empire.id),
            events: this.getEmpireEvents(empire.id),
            timestamp: Date.now()
        };
    }

    getSpectatorGameState() {
        return {
            galaxyOverview: this.getGalaxyOverview(),
            activeBattles: Array.from(this.gameState.battles.values()),
            economicData: this.economyManager.getGlobalEconomicData(),
            diplomaticMap: this.diplomacyManager.getDiplomaticMap(),
            timestamp: Date.now()
        };
    }

    getGlobalGameState() {
        return {
            serverStatus: {
                uptime: process.uptime(),
                playerCount: this.getActivePlayerCount(),
                empireCount: this.gameState.empires.size,
                activeBattles: this.gameState.battles.size,
                performance: this.performance
            },
            currentTick: this.gameState.currentTick,
            timestamp: Date.now()
        };
    }

    // Event handlers
    handlePlayerJoined(player) {
        console.log(`👤 Player ${player.username} joined the game`);
        this.gameState.players.set(player.id, player);
    }

    handlePlayerLeft(player) {
        console.log(`👤 Player ${player.username} left the game`);
        if (this.gameState.players.has(player.id)) {
            this.gameState.players.get(player.id).isOnline = false;
        }
    }

    handleEmpireCreated(empire) {
        console.log(`🏛️ Empire ${empire.name} created`);
        this.gameState.empires.set(empire.id, empire);
    }

    handleEmpireDestroyed(empire) {
        console.log(`💥 Empire ${empire.name} destroyed`);
        this.gameState.empires.delete(empire.id);
    }

    handleBattleStarted(battle) {
        console.log(`⚔️ Battle started between fleets`);
        this.broadcastBattleUpdate(battle);
    }

    handleBattleEnded(battle, result) {
        console.log(`🏁 Battle ended with result: ${result.winner}`);
        this.broadcastBattleResult(battle, result);
    }

    // Utility methods
    getActivePlayerCount() {
        return Array.from(this.gameState.players.values()).filter(p => p.isOnline).length;
    }

    getActiveGalaxyCount() {
        return this.universeManager.getActiveGalaxyCount();
    }

    getVisibleSystems(empire) {
        return this.universeManager.getVisibleSystems(empire);
    }

    getEmpireFleets(empireId) {
        return Array.from(this.gameState.fleets.values()).filter(f => f.empireId === empireId);
    }

    getVisibleFleets(empire) {
        return this.universeManager.getVisibleFleets(empire);
    }

    getEmpireBattles(empireId) {
        return Array.from(this.gameState.battles.values()).filter(b => 
            b.participants.some(p => p.empireId === empireId)
        );
    }

    getEmpireEvents(empireId) {
        return this.gameState.events.filter(e => e.empireId === empireId);
    }

    getGalaxyOverview() {
        return this.universeManager.getGalaxyOverview();
    }

    async autoSave() {
        try {
            await this.saveAllGameState();
            console.log('💾 Auto-save completed');
        } catch (error) {
            console.error('Auto-save failed:', error);
        }
    }

    async saveAllGameState() {
        console.log('💾 Saving game state...');
        
        try {
            await Promise.all([
                this.savePlayersState(),
                this.saveEmpiresState(),
                this.saveUniverseState(),
                this.saveFleetsState(),
                this.saveEconomyState(),
                this.saveDiplomacyState(),
                this.saveResearchState()
            ]);
            
            console.log('✅ Game state saved successfully');
        } catch (error) {
            console.error('❌ Failed to save game state:', error);
            throw error;
        }
    }

    async savePlayersState() {
        const players = Array.from(this.gameState.players.values());
        await this.db.savePlayers(players);
    }

    async saveEmpiresState() {
        const empires = Array.from(this.gameState.empires.values());
        await this.db.saveEmpires(empires);
    }

    async saveUniverseState() {
        const starSystems = Array.from(this.gameState.starSystems.values());
        const planets = Array.from(this.gameState.planets.values());
        await Promise.all([
            this.db.saveStarSystems(starSystems),
            this.db.savePlanets(planets)
        ]);
    }

    async saveFleetsState() {
        const fleets = Array.from(this.gameState.fleets.values());
        await this.db.saveFleets(fleets);
    }

    async saveEconomyState() {
        await this.economyManager.saveEconomyState();
    }

    async saveDiplomacyState() {
        await this.diplomacyManager.saveDiplomacyState();
    }

    async saveResearchState() {
        await this.researchManager.saveResearchState();
    }

    stop() {
        console.log('🛑 Stopping Game Engine...');
        
        // Clear all intervals
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
        }
        
        if (this.universeSimulationInterval) {
            clearInterval(this.universeSimulationInterval);
            this.universeSimulationInterval = null;
        }
        
        if (this.economicSimulationInterval) {
            clearInterval(this.economicSimulationInterval);
            this.economicSimulationInterval = null;
        }
        
        if (this.aiUpdateInterval) {
            clearInterval(this.aiUpdateInterval);
            this.aiUpdateInterval = null;
        }
        
        this.gameState.status = 'stopped';
        console.log('✅ Game Engine stopped');
    }
}

module.exports = GameEngine;