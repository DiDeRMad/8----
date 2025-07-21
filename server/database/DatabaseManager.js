const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs').promises;

class DatabaseManager {
    constructor() {
        this.dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/cosmic_empire.db');
        this.db = null;
        this.isInitialized = false;
        
        // Prepare statements for better performance
        this.preparedStatements = {};
    }

    async initialize() {
        console.log('🗄️ Initializing database...');
        
        try {
            // Ensure data directory exists
            const dataDir = path.dirname(this.dbPath);
            await fs.mkdir(dataDir, { recursive: true });
            
            // Open database connection
            this.db = new sqlite3.Database(this.dbPath);
            
            // Enable foreign keys and WAL mode for better performance
            await this.runQuery('PRAGMA foreign_keys = ON');
            await this.runQuery('PRAGMA journal_mode = WAL');
            await this.runQuery('PRAGMA synchronous = NORMAL');
            await this.runQuery('PRAGMA cache_size = 10000');
            
            // Create tables
            await this.createTables();
            
            // Prepare statements
            await this.prepareStatements();
            
            this.isInitialized = true;
            console.log('✅ Database initialized successfully');
            
        } catch (error) {
            console.error('❌ Database initialization failed:', error);
            throw error;
        }
    }

    async createTables() {
        const tables = [
            // Players table
            `CREATE TABLE IF NOT EXISTS players (
                id TEXT PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                empire_id TEXT,
                created_at INTEGER NOT NULL,
                last_login INTEGER,
                total_playtime INTEGER DEFAULT 0,
                is_online BOOLEAN DEFAULT 0,
                socket_id TEXT,
                preferences TEXT,
                achievements TEXT,
                statistics TEXT,
                FOREIGN KEY (empire_id) REFERENCES empires(id)
            )`,
            
            // Empires table
            `CREATE TABLE IF NOT EXISTS empires (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                player_id TEXT NOT NULL,
                faction TEXT NOT NULL,
                color TEXT NOT NULL,
                capital_planet_id TEXT,
                home_system_id TEXT,
                government_type TEXT DEFAULT 'democracy',
                culture TEXT DEFAULT 'human',
                created_at INTEGER NOT NULL,
                total_population BIGINT DEFAULT 0,
                total_systems INTEGER DEFAULT 0,
                total_planets INTEGER DEFAULT 0,
                total_fleets INTEGER DEFAULT 0,
                empire_level INTEGER DEFAULT 1,
                experience_points BIGINT DEFAULT 0,
                reputation INTEGER DEFAULT 0,
                resources TEXT,
                technologies TEXT,
                policies TEXT,
                FOREIGN KEY (player_id) REFERENCES players(id),
                FOREIGN KEY (capital_planet_id) REFERENCES planets(id),
                FOREIGN KEY (home_system_id) REFERENCES star_systems(id)
            )`,
            
            // Star Systems table
            `CREATE TABLE IF NOT EXISTS star_systems (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                galaxy_id TEXT NOT NULL,
                position_x REAL NOT NULL,
                position_y REAL NOT NULL,
                position_z REAL NOT NULL,
                star_type TEXT NOT NULL,
                star_class TEXT NOT NULL,
                star_mass REAL NOT NULL,
                star_temperature INTEGER NOT NULL,
                star_luminosity REAL NOT NULL,
                planet_count INTEGER DEFAULT 0,
                asteroid_belts INTEGER DEFAULT 0,
                discovered_by TEXT,
                discovered_at INTEGER,
                explored_by TEXT,
                security_level REAL DEFAULT 1.0,
                nebula_effects TEXT,
                special_features TEXT,
                trade_routes TEXT,
                INDEX(galaxy_id),
                INDEX(discovered_by),
                FOREIGN KEY (discovered_by) REFERENCES empires(id)
            )`,
            
            // Planets table
            `CREATE TABLE IF NOT EXISTS planets (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                system_id TEXT NOT NULL,
                orbit_position INTEGER NOT NULL,
                planet_type TEXT NOT NULL,
                planet_class TEXT NOT NULL,
                size REAL NOT NULL,
                mass REAL NOT NULL,
                gravity REAL NOT NULL,
                atmosphere TEXT NOT NULL,
                temperature REAL NOT NULL,
                water_coverage REAL DEFAULT 0,
                habitability REAL DEFAULT 0,
                owner_empire_id TEXT,
                population BIGINT DEFAULT 0,
                max_population BIGINT DEFAULT 0,
                colonized_at INTEGER,
                development_level INTEGER DEFAULT 0,
                infrastructure_level INTEGER DEFAULT 0,
                defense_level INTEGER DEFAULT 0,
                happiness REAL DEFAULT 0.5,
                productivity REAL DEFAULT 1.0,
                resources TEXT,
                buildings TEXT,
                modifiers TEXT,
                special_features TEXT,
                INDEX(system_id),
                INDEX(owner_empire_id),
                FOREIGN KEY (system_id) REFERENCES star_systems(id),
                FOREIGN KEY (owner_empire_id) REFERENCES empires(id)
            )`,
            
            // Fleets table
            `CREATE TABLE IF NOT EXISTS fleets (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                empire_id TEXT NOT NULL,
                admiral_id TEXT,
                current_system_id TEXT,
                destination_system_id TEXT,
                position_x REAL NOT NULL,
                position_y REAL NOT NULL,
                position_z REAL NOT NULL,
                velocity_x REAL DEFAULT 0,
                velocity_y REAL DEFAULT 0,
                velocity_z REAL DEFAULT 0,
                fleet_size INTEGER DEFAULT 0,
                total_firepower INTEGER DEFAULT 0,
                total_defense INTEGER DEFAULT 0,
                total_speed REAL DEFAULT 0,
                supply_level REAL DEFAULT 1.0,
                morale REAL DEFAULT 1.0,
                experience INTEGER DEFAULT 0,
                status TEXT DEFAULT 'idle',
                mission_type TEXT,
                mission_target TEXT,
                estimated_arrival INTEGER,
                formation TEXT DEFAULT 'standard',
                stance TEXT DEFAULT 'neutral',
                ships TEXT,
                equipment TEXT,
                INDEX(empire_id),
                INDEX(current_system_id),
                FOREIGN KEY (empire_id) REFERENCES empires(id),
                FOREIGN KEY (current_system_id) REFERENCES star_systems(id),
                FOREIGN KEY (destination_system_id) REFERENCES star_systems(id)
            )`,
            
            // Ships table
            `CREATE TABLE IF NOT EXISTS ships (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                fleet_id TEXT NOT NULL,
                ship_class TEXT NOT NULL,
                ship_type TEXT NOT NULL,
                design_id TEXT NOT NULL,
                hull_points INTEGER NOT NULL,
                max_hull_points INTEGER NOT NULL,
                shield_points INTEGER DEFAULT 0,
                max_shield_points INTEGER DEFAULT 0,
                armor_points INTEGER DEFAULT 0,
                max_armor_points INTEGER DEFAULT 0,
                firepower INTEGER DEFAULT 0,
                defense INTEGER DEFAULT 0,
                speed REAL DEFAULT 0,
                maneuverability REAL DEFAULT 0,
                experience INTEGER DEFAULT 0,
                veterancy_level INTEGER DEFAULT 0,
                crew_count INTEGER DEFAULT 0,
                max_crew_count INTEGER DEFAULT 0,
                supply_consumption REAL DEFAULT 1.0,
                maintenance_cost INTEGER DEFAULT 0,
                components TEXT,
                weapons TEXT,
                equipment TEXT,
                modifiers TEXT,
                INDEX(fleet_id),
                FOREIGN KEY (fleet_id) REFERENCES fleets(id)
            )`,
            
            // Buildings table
            `CREATE TABLE IF NOT EXISTS buildings (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                planet_id TEXT NOT NULL,
                building_type TEXT NOT NULL,
                building_class TEXT NOT NULL,
                level INTEGER DEFAULT 1,
                max_level INTEGER DEFAULT 10,
                construction_progress REAL DEFAULT 1.0,
                power_consumption INTEGER DEFAULT 0,
                maintenance_cost INTEGER DEFAULT 0,
                population_required INTEGER DEFAULT 0,
                effects TEXT,
                modifiers TEXT,
                INDEX(planet_id),
                FOREIGN KEY (planet_id) REFERENCES planets(id)
            )`,
            
            // Research Projects table
            `CREATE TABLE IF NOT EXISTS research_projects (
                id TEXT PRIMARY KEY,
                empire_id TEXT NOT NULL,
                technology_id TEXT NOT NULL,
                research_field TEXT NOT NULL,
                progress REAL DEFAULT 0,
                total_cost INTEGER NOT NULL,
                research_speed REAL DEFAULT 1.0,
                priority INTEGER DEFAULT 5,
                started_at INTEGER NOT NULL,
                estimated_completion INTEGER,
                prerequisites TEXT,
                scientists_assigned INTEGER DEFAULT 0,
                research_bonus REAL DEFAULT 0,
                INDEX(empire_id),
                FOREIGN KEY (empire_id) REFERENCES empires(id)
            )`,
            
            // Diplomatic Relations table
            `CREATE TABLE IF NOT EXISTS diplomatic_relations (
                id TEXT PRIMARY KEY,
                empire1_id TEXT NOT NULL,
                empire2_id TEXT NOT NULL,
                relation_type TEXT NOT NULL,
                trust_level REAL DEFAULT 0,
                trade_agreement BOOLEAN DEFAULT 0,
                non_aggression_pact BOOLEAN DEFAULT 0,
                alliance_level INTEGER DEFAULT 0,
                war_weariness REAL DEFAULT 0,
                created_at INTEGER NOT NULL,
                last_updated INTEGER NOT NULL,
                expires_at INTEGER,
                proposals TEXT,
                history TEXT,
                INDEX(empire1_id),
                INDEX(empire2_id),
                FOREIGN KEY (empire1_id) REFERENCES empires(id),
                FOREIGN KEY (empire2_id) REFERENCES empires(id),
                UNIQUE(empire1_id, empire2_id)
            )`,
            
            // Trade Routes table
            `CREATE TABLE IF NOT EXISTS trade_routes (
                id TEXT PRIMARY KEY,
                empire_id TEXT NOT NULL,
                source_planet_id TEXT NOT NULL,
                destination_planet_id TEXT NOT NULL,
                resource_type TEXT NOT NULL,
                quantity_per_turn INTEGER NOT NULL,
                price_per_unit REAL NOT NULL,
                total_value REAL NOT NULL,
                distance REAL NOT NULL,
                security_level REAL DEFAULT 1.0,
                efficiency REAL DEFAULT 1.0,
                created_at INTEGER NOT NULL,
                status TEXT DEFAULT 'active',
                transport_fleets TEXT,
                INDEX(empire_id),
                INDEX(source_planet_id),
                INDEX(destination_planet_id),
                FOREIGN KEY (empire_id) REFERENCES empires(id),
                FOREIGN KEY (source_planet_id) REFERENCES planets(id),
                FOREIGN KEY (destination_planet_id) REFERENCES planets(id)
            )`,
            
            // Battles table
            `CREATE TABLE IF NOT EXISTS battles (
                id TEXT PRIMARY KEY,
                system_id TEXT NOT NULL,
                position_x REAL NOT NULL,
                position_y REAL NOT NULL,
                position_z REAL NOT NULL,
                battle_type TEXT NOT NULL,
                status TEXT NOT NULL,
                started_at INTEGER NOT NULL,
                ended_at INTEGER,
                duration INTEGER DEFAULT 0,
                participants TEXT NOT NULL,
                result TEXT,
                casualties TEXT,
                loot TEXT,
                experience_gained TEXT,
                INDEX(system_id),
                FOREIGN KEY (system_id) REFERENCES star_systems(id)
            )`,
            
            // Game Events table
            `CREATE TABLE IF NOT EXISTS game_events (
                id TEXT PRIMARY KEY,
                event_type TEXT NOT NULL,
                empire_id TEXT,
                system_id TEXT,
                planet_id TEXT,
                fleet_id TEXT,
                severity TEXT DEFAULT 'info',
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                data TEXT,
                created_at INTEGER NOT NULL,
                expires_at INTEGER,
                is_global BOOLEAN DEFAULT 0,
                is_read BOOLEAN DEFAULT 0,
                INDEX(empire_id),
                INDEX(created_at),
                FOREIGN KEY (empire_id) REFERENCES empires(id),
                FOREIGN KEY (system_id) REFERENCES star_systems(id),
                FOREIGN KEY (planet_id) REFERENCES planets(id),
                FOREIGN KEY (fleet_id) REFERENCES fleets(id)
            )`,
            
            // Market Prices table
            `CREATE TABLE IF NOT EXISTS market_prices (
                id TEXT PRIMARY KEY,
                resource_type TEXT NOT NULL,
                system_id TEXT,
                price REAL NOT NULL,
                supply INTEGER DEFAULT 0,
                demand INTEGER DEFAULT 0,
                volatility REAL DEFAULT 0,
                last_updated INTEGER NOT NULL,
                price_history TEXT,
                INDEX(resource_type),
                INDEX(system_id),
                INDEX(last_updated),
                FOREIGN KEY (system_id) REFERENCES star_systems(id)
            )`,
            
            // Technologies table
            `CREATE TABLE IF NOT EXISTS technologies (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT NOT NULL,
                research_field TEXT NOT NULL,
                tier INTEGER NOT NULL,
                cost INTEGER NOT NULL,
                prerequisites TEXT,
                effects TEXT,
                unlocks TEXT,
                is_rare BOOLEAN DEFAULT 0,
                discovery_chance REAL DEFAULT 1.0
            )`,
            
            // Game Config table
            `CREATE TABLE IF NOT EXISTS game_config (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                last_updated INTEGER NOT NULL
            )`
        ];

        for (const tableSQL of tables) {
            await this.runQuery(tableSQL);
        }
        
        console.log('✅ Database tables created successfully');
    }

    async prepareStatements() {
        // Prepare frequently used statements for better performance
        this.preparedStatements = {
            getPlayer: this.db.prepare('SELECT * FROM players WHERE id = ?'),
            getPlayerByUsername: this.db.prepare('SELECT * FROM players WHERE username = ?'),
            insertPlayer: this.db.prepare(`
                INSERT INTO players (id, username, email, password_hash, created_at)
                VALUES (?, ?, ?, ?, ?)
            `),
            updatePlayerLastLogin: this.db.prepare(`
                UPDATE players SET last_login = ?, is_online = 1, socket_id = ? WHERE id = ?
            `),
            updatePlayerOffline: this.db.prepare(`
                UPDATE players SET is_online = 0, socket_id = NULL WHERE id = ?
            `),
            
            getEmpire: this.db.prepare('SELECT * FROM empires WHERE id = ?'),
            getEmpireByPlayer: this.db.prepare('SELECT * FROM empires WHERE player_id = ?'),
            insertEmpire: this.db.prepare(`
                INSERT INTO empires (id, name, player_id, faction, color, created_at, resources, technologies, policies)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `),
            
            getSystemsInGalaxy: this.db.prepare('SELECT * FROM star_systems WHERE galaxy_id = ?'),
            getPlanetsInSystem: this.db.prepare('SELECT * FROM planets WHERE system_id = ?'),
            getFleetsInSystem: this.db.prepare('SELECT * FROM fleets WHERE current_system_id = ?'),
            
            insertBattle: this.db.prepare(`
                INSERT INTO battles (id, system_id, position_x, position_y, position_z, battle_type, status, started_at, participants)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `),
            
            insertGameEvent: this.db.prepare(`
                INSERT INTO game_events (id, event_type, empire_id, severity, title, description, data, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `)
        };
    }

    // Player operations
    async getPlayers() {
        return this.allQuery('SELECT * FROM players');
    }

    async getPlayer(playerId) {
        return this.getQuery('SELECT * FROM players WHERE id = ?', [playerId]);
    }

    async getPlayerByUsername(username) {
        return this.getQuery('SELECT * FROM players WHERE username = ?', [username]);
    }

    async createPlayer(playerData) {
        const { id, username, email, passwordHash } = playerData;
        return this.runQuery(
            'INSERT INTO players (id, username, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)',
            [id, username, email, passwordHash, Date.now()]
        );
    }

    async updatePlayer(playerId, updateData) {
        const fields = Object.keys(updateData);
        const values = Object.values(updateData);
        const setClause = fields.map(field => `${field} = ?`).join(', ');
        
        return this.runQuery(
            `UPDATE players SET ${setClause} WHERE id = ?`,
            [...values, playerId]
        );
    }

    async savePlayers(players) {
        const stmt = this.db.prepare(`
            INSERT OR REPLACE INTO players (
                id, username, email, password_hash, empire_id, created_at, last_login,
                total_playtime, is_online, socket_id, preferences, achievements, statistics
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const transaction = this.db.prepare('BEGIN TRANSACTION');
        const commit = this.db.prepare('COMMIT');
        
        try {
            transaction.run();
            
            for (const player of players) {
                stmt.run([
                    player.id, player.username, player.email, player.passwordHash,
                    player.empireId, player.createdAt, player.lastLogin,
                    player.totalPlaytime, player.isOnline, player.socketId,
                    JSON.stringify(player.preferences), JSON.stringify(player.achievements),
                    JSON.stringify(player.statistics)
                ]);
            }
            
            commit.run();
        } catch (error) {
            this.db.prepare('ROLLBACK').run();
            throw error;
        }
    }

    // Empire operations
    async getEmpires() {
        return this.allQuery('SELECT * FROM empires');
    }

    async getEmpire(empireId) {
        return this.getQuery('SELECT * FROM empires WHERE id = ?', [empireId]);
    }

    async createEmpire(empireData) {
        const {
            id, name, playerId, faction, color, capitalPlanetId, homeSystemId,
            governmentType, culture, resources, technologies, policies
        } = empireData;
        
        return this.runQuery(`
            INSERT INTO empires (
                id, name, player_id, faction, color, capital_planet_id, home_system_id,
                government_type, culture, created_at, resources, technologies, policies
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            id, name, playerId, faction, color, capitalPlanetId, homeSystemId,
            governmentType, culture, Date.now(),
            JSON.stringify(resources), JSON.stringify(technologies), JSON.stringify(policies)
        ]);
    }

    async saveEmpires(empires) {
        const stmt = this.db.prepare(`
            INSERT OR REPLACE INTO empires (
                id, name, player_id, faction, color, capital_planet_id, home_system_id,
                government_type, culture, created_at, total_population, total_systems,
                total_planets, total_fleets, empire_level, experience_points, reputation,
                resources, technologies, policies
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const transaction = this.db.prepare('BEGIN TRANSACTION');
        const commit = this.db.prepare('COMMIT');
        
        try {
            transaction.run();
            
            for (const empire of empires) {
                stmt.run([
                    empire.id, empire.name, empire.playerId, empire.faction, empire.color,
                    empire.capitalPlanetId, empire.homeSystemId, empire.governmentType,
                    empire.culture, empire.createdAt, empire.totalPopulation, empire.totalSystems,
                    empire.totalPlanets, empire.totalFleets, empire.empireLevel,
                    empire.experiencePoints, empire.reputation,
                    JSON.stringify(empire.resources), JSON.stringify(empire.technologies),
                    JSON.stringify(empire.policies)
                ]);
            }
            
            commit.run();
        } catch (error) {
            this.db.prepare('ROLLBACK').run();
            throw error;
        }
    }

    // Star System operations
    async getStarSystems() {
        return this.allQuery('SELECT * FROM star_systems');
    }

    async getStarSystemsInGalaxy(galaxyId) {
        return this.allQuery('SELECT * FROM star_systems WHERE galaxy_id = ?', [galaxyId]);
    }

    async saveStarSystems(systems) {
        const stmt = this.db.prepare(`
            INSERT OR REPLACE INTO star_systems (
                id, name, galaxy_id, position_x, position_y, position_z,
                star_type, star_class, star_mass, star_temperature, star_luminosity,
                planet_count, asteroid_belts, discovered_by, discovered_at, explored_by,
                security_level, nebula_effects, special_features, trade_routes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const transaction = this.db.prepare('BEGIN TRANSACTION');
        const commit = this.db.prepare('COMMIT');
        
        try {
            transaction.run();
            
            for (const system of systems) {
                stmt.run([
                    system.id, system.name, system.galaxyId, system.position.x,
                    system.position.y, system.position.z, system.starType, system.starClass,
                    system.starMass, system.starTemperature, system.starLuminosity,
                    system.planetCount, system.asteroidBelts, system.discoveredBy,
                    system.discoveredAt, system.exploredBy, system.securityLevel,
                    JSON.stringify(system.nebulaEffects), JSON.stringify(system.specialFeatures),
                    JSON.stringify(system.tradeRoutes)
                ]);
            }
            
            commit.run();
        } catch (error) {
            this.db.prepare('ROLLBACK').run();
            throw error;
        }
    }

    // Planet operations
    async getPlanets() {
        return this.allQuery('SELECT * FROM planets');
    }

    async getPlanetsInSystem(systemId) {
        return this.allQuery('SELECT * FROM planets WHERE system_id = ?', [systemId]);
    }

    async savePlanets(planets) {
        const stmt = this.db.prepare(`
            INSERT OR REPLACE INTO planets (
                id, name, system_id, orbit_position, planet_type, planet_class,
                size, mass, gravity, atmosphere, temperature, water_coverage,
                habitability, owner_empire_id, population, max_population, colonized_at,
                development_level, infrastructure_level, defense_level, happiness,
                productivity, resources, buildings, modifiers, special_features
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const transaction = this.db.prepare('BEGIN TRANSACTION');
        const commit = this.db.prepare('COMMIT');
        
        try {
            transaction.run();
            
            for (const planet of planets) {
                stmt.run([
                    planet.id, planet.name, planet.systemId, planet.orbitPosition,
                    planet.planetType, planet.planetClass, planet.size, planet.mass,
                    planet.gravity, planet.atmosphere, planet.temperature, planet.waterCoverage,
                    planet.habitability, planet.ownerEmpireId, planet.population, planet.maxPopulation,
                    planet.colonizedAt, planet.developmentLevel, planet.infrastructureLevel,
                    planet.defenseLevel, planet.happiness, planet.productivity,
                    JSON.stringify(planet.resources), JSON.stringify(planet.buildings),
                    JSON.stringify(planet.modifiers), JSON.stringify(planet.specialFeatures)
                ]);
            }
            
            commit.run();
        } catch (error) {
            this.db.prepare('ROLLBACK').run();
            throw error;
        }
    }

    // Fleet operations
    async getFleets() {
        return this.allQuery('SELECT * FROM fleets');
    }

    async getFleetsInSystem(systemId) {
        return this.allQuery('SELECT * FROM fleets WHERE current_system_id = ?', [systemId]);
    }

    async saveFleets(fleets) {
        const stmt = this.db.prepare(`
            INSERT OR REPLACE INTO fleets (
                id, name, empire_id, admiral_id, current_system_id, destination_system_id,
                position_x, position_y, position_z, velocity_x, velocity_y, velocity_z,
                fleet_size, total_firepower, total_defense, total_speed, supply_level,
                morale, experience, status, mission_type, mission_target, estimated_arrival,
                formation, stance, ships, equipment
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const transaction = this.db.prepare('BEGIN TRANSACTION');
        const commit = this.db.prepare('COMMIT');
        
        try {
            transaction.run();
            
            for (const fleet of fleets) {
                stmt.run([
                    fleet.id, fleet.name, fleet.empireId, fleet.admiralId,
                    fleet.currentSystemId, fleet.destinationSystemId,
                    fleet.position.x, fleet.position.y, fleet.position.z,
                    fleet.velocity.x, fleet.velocity.y, fleet.velocity.z,
                    fleet.fleetSize, fleet.totalFirepower, fleet.totalDefense, fleet.totalSpeed,
                    fleet.supplyLevel, fleet.morale, fleet.experience, fleet.status,
                    fleet.missionType, fleet.missionTarget, fleet.estimatedArrival,
                    fleet.formation, fleet.stance, JSON.stringify(fleet.ships),
                    JSON.stringify(fleet.equipment)
                ]);
            }
            
            commit.run();
        } catch (error) {
            this.db.prepare('ROLLBACK').run();
            throw error;
        }
    }

    // Battle operations
    async createBattle(battleData) {
        const {
            id, systemId, position, battleType, status, startedAt, participants
        } = battleData;
        
        return this.runQuery(`
            INSERT INTO battles (
                id, system_id, position_x, position_y, position_z, battle_type,
                status, started_at, participants
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            id, systemId, position.x, position.y, position.z, battleType,
            status, startedAt, JSON.stringify(participants)
        ]);
    }

    async updateBattle(battleId, updateData) {
        const fields = Object.keys(updateData);
        const values = Object.values(updateData);
        const setClause = fields.map(field => `${field} = ?`).join(', ');
        
        return this.runQuery(
            `UPDATE battles SET ${setClause} WHERE id = ?`,
            [...values, battleId]
        );
    }

    // Generic database operations
    runQuery(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        });
    }

    getQuery(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    allQuery(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async close() {
        if (this.db) {
            return new Promise((resolve) => {
                this.db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err);
                    } else {
                        console.log('✅ Database connection closed');
                    }
                    resolve();
                });
            });
        }
    }

    // Utility methods
    async vacuum() {
        await this.runQuery('VACUUM');
    }

    async getStats() {
        const stats = await Promise.all([
            this.getQuery("SELECT COUNT(*) as count FROM players"),
            this.getQuery("SELECT COUNT(*) as count FROM empires"),
            this.getQuery("SELECT COUNT(*) as count FROM star_systems"),
            this.getQuery("SELECT COUNT(*) as count FROM planets"),
            this.getQuery("SELECT COUNT(*) as count FROM fleets"),
            this.getQuery("SELECT COUNT(*) as count FROM battles")
        ]);

        return {
            players: stats[0].count,
            empires: stats[1].count,
            starSystems: stats[2].count,
            planets: stats[3].count,
            fleets: stats[4].count,
            battles: stats[5].count
        };
    }
}

module.exports = DatabaseManager;