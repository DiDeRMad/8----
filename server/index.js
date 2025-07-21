const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Import game modules
const GameEngine = require('./core/GameEngine');
const DatabaseManager = require('./database/DatabaseManager');
const AuthController = require('./controllers/AuthController');
const GameController = require('./controllers/GameController');
const PlayerController = require('./controllers/PlayerController');
const UniverseController = require('./controllers/UniverseController');
const TradingController = require('./controllers/TradingController');
const CombatController = require('./controllers/CombatController');
const DiplomacyController = require('./controllers/DiplomacyController');
const ResearchController = require('./controllers/ResearchController');

// Import middleware
const authMiddleware = require('./middleware/authMiddleware');
const rateLimitMiddleware = require('./middleware/rateLimitMiddleware');
const gameStateMiddleware = require('./middleware/gameStateMiddleware');

// Import socket handlers
const SocketManager = require('./socket/SocketManager');

class CosmicEmpireServer {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketIo(this.server, {
            cors: {
                origin: process.env.CLIENT_URL || "http://localhost:3001",
                methods: ["GET", "POST"]
            },
            pingTimeout: 60000,
            pingInterval: 25000
        });
        
        this.port = process.env.PORT || 3000;
        this.gameEngine = null;
        this.socketManager = null;
        
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeDatabase();
        this.initializeGameEngine();
        this.initializeSocketHandlers();
    }

    initializeMiddleware() {
        // Security middleware
        this.app.use(helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"],
                    connectSrc: ["'self'", "ws:", "wss:"]
                }
            }
        }));
        
        // CORS
        this.app.use(cors({
            origin: process.env.CLIENT_URL || "http://localhost:3001",
            credentials: true
        }));
        
        // Compression and parsing
        this.app.use(compression());
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
        
        // Logging
        this.app.use(morgan('combined'));
        
        // Rate limiting
        this.app.use('/api', rateLimitMiddleware);
        
        // Static files
        this.app.use(express.static(path.join(__dirname, '../client/dist')));
        
        // Game state middleware for protected routes
        this.app.use('/api/game', gameStateMiddleware);
    }

    initializeRoutes() {
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                gameEngine: this.gameEngine ? 'running' : 'not_initialized'
            });
        });

        // Authentication routes
        this.app.use('/api/auth', AuthController);
        
        // Game routes (protected)
        this.app.use('/api/game', authMiddleware, GameController);
        this.app.use('/api/player', authMiddleware, PlayerController);
        this.app.use('/api/universe', authMiddleware, UniverseController);
        this.app.use('/api/trading', authMiddleware, TradingController);
        this.app.use('/api/combat', authMiddleware, CombatController);
        this.app.use('/api/diplomacy', authMiddleware, DiplomacyController);
        this.app.use('/api/research', authMiddleware, ResearchController);

        // Serve client app for any other routes
        this.app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../client/dist/index.html'));
        });

        // Error handling middleware
        this.app.use((err, req, res, next) => {
            console.error('Server error:', err);
            res.status(500).json({
                error: 'Internal server error',
                message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
            });
        });
    }

    async initializeDatabase() {
        try {
            this.db = new DatabaseManager();
            await this.db.initialize();
            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Database initialization failed:', error);
            process.exit(1);
        }
    }

    async initializeGameEngine() {
        try {
            this.gameEngine = new GameEngine(this.db, this.io);
            await this.gameEngine.initialize();
            
            // Start game loops
            this.gameEngine.startGameLoop();
            this.gameEngine.startUniverseSimulation();
            this.gameEngine.startEconomicSimulation();
            
            console.log('Game engine initialized and started');
        } catch (error) {
            console.error('Game engine initialization failed:', error);
            process.exit(1);
        }
    }

    initializeSocketHandlers() {
        this.socketManager = new SocketManager(this.io, this.gameEngine, this.db);
        this.socketManager.initialize();
        
        console.log('Socket handlers initialized');
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(`🚀 Cosmic Empire Server running on port ${this.port}`);
            console.log(`🌌 Game ready for players!`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
            
            // Log server stats
            this.logServerStats();
        });

        // Graceful shutdown
        process.on('SIGTERM', this.gracefulShutdown.bind(this));
        process.on('SIGINT', this.gracefulShutdown.bind(this));
    }

    logServerStats() {
        setInterval(() => {
            const memUsage = process.memoryUsage();
            const playerCount = this.gameEngine ? this.gameEngine.getActivePlayerCount() : 0;
            const galaxyCount = this.gameEngine ? this.gameEngine.getActiveGalaxyCount() : 0;
            
            console.log(`📈 Server Stats: ${playerCount} players, ${galaxyCount} galaxies, ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB RAM`);
        }, 60000); // Log every minute
    }

    async gracefulShutdown() {
        console.log('🛑 Shutting down Cosmic Empire Server...');
        
        // Stop accepting new connections
        this.server.close(() => {
            console.log('✅ HTTP server closed');
        });
        
        // Save game state
        if (this.gameEngine) {
            await this.gameEngine.saveAllGameState();
            this.gameEngine.stop();
            console.log('✅ Game state saved');
        }
        
        // Close database connections
        if (this.db) {
            await this.db.close();
            console.log('✅ Database connections closed');
        }
        
        process.exit(0);
    }
}

// Start the server
const server = new CosmicEmpireServer();
server.start();

module.exports = CosmicEmpireServer;