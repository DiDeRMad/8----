const path = require('path');
const fs = require('fs').promises;
const DatabaseManager = require('../server/database/DatabaseManager');

/**
 * Database Initialization Script
 * 
 * This script initializes the SQLite database with:
 * - All necessary tables
 * - Initial game data (technologies, resources, etc.)
 * - Default configuration
 * - Sample data for development
 */
class DatabaseInitializer {
    constructor() {
        this.db = new DatabaseManager();
    }

    async initialize() {
        console.log('🚀 Initializing Cosmic Empire Database...');
        
        try {
            // Initialize database connection and tables
            await this.db.initialize();
            
            // Insert initial game data
            await this.insertInitialData();
            
            // Insert sample data for development
            if (process.env.NODE_ENV === 'development') {
                await this.insertSampleData();
            }
            
            console.log('✅ Database initialization completed successfully');
            
        } catch (error) {
            console.error('❌ Database initialization failed:', error);
            throw error;
        } finally {
            await this.db.close();
        }
    }

    async insertInitialData() {
        console.log('📊 Inserting initial game data...');
        
        // Insert technologies
        await this.insertTechnologies();
        
        // Insert game configuration
        await this.insertGameConfig();
        
        console.log('✅ Initial game data inserted');
    }

    async insertTechnologies() {
        const technologies = [
            // Engineering Technologies
            {
                id: 'basic_engineering',
                name: 'Basic Engineering',
                description: 'Fundamental engineering principles for space construction.',
                research_field: 'engineering',
                tier: 1,
                cost: 100,
                prerequisites: JSON.stringify([]),
                effects: JSON.stringify({
                    buildingBuildSpeed: 1.1,
                    unlocks: ['improved_engineering', 'basic_weapons']
                }),
                unlocks: JSON.stringify(['improved_engineering', 'basic_weapons']),
                is_rare: false,
                discovery_chance: 1.0
            },
            {
                id: 'improved_engineering',
                name: 'Improved Engineering',
                description: 'Advanced engineering techniques for faster construction.',
                research_field: 'engineering',
                tier: 2,
                cost: 250,
                prerequisites: JSON.stringify(['basic_engineering']),
                effects: JSON.stringify({
                    buildingBuildSpeed: 1.25,
                    unlocks: ['advanced_engineering', 'starbase_construction']
                }),
                unlocks: JSON.stringify(['advanced_engineering', 'starbase_construction']),
                is_rare: false,
                discovery_chance: 1.0
            },
            {
                id: 'basic_weapons',
                name: 'Basic Weapons',
                description: 'Elementary weapon systems for ship armament.',
                research_field: 'engineering',
                tier: 2,
                cost: 200,
                prerequisites: JSON.stringify(['basic_engineering']),
                effects: JSON.stringify({
                    shipFirepower: 1.15,
                    unlocks: ['advanced_weapons', 'missile_technology']
                }),
                unlocks: JSON.stringify(['advanced_weapons', 'missile_technology']),
                is_rare: false,
                discovery_chance: 1.0
            },
            
            // Physics Technologies
            {
                id: 'basic_physics',
                name: 'Basic Physics',
                description: 'Fundamental understanding of physical laws.',
                research_field: 'physics',
                tier: 1,
                cost: 100,
                prerequisites: JSON.stringify([]),
                effects: JSON.stringify({
                    researchSpeed: 1.1,
                    unlocks: ['advanced_physics', 'energy_systems']
                }),
                unlocks: JSON.stringify(['advanced_physics', 'energy_systems']),
                is_rare: false,
                discovery_chance: 1.0
            },
            {
                id: 'advanced_physics',
                name: 'Advanced Physics',
                description: 'Complex physics theories enabling new technologies.',
                research_field: 'physics',
                tier: 2,
                cost: 300,
                prerequisites: JSON.stringify(['basic_physics']),
                effects: JSON.stringify({
                    researchSpeed: 1.2,
                    unlocks: ['quantum_physics', 'ftl_theory']
                }),
                unlocks: JSON.stringify(['quantum_physics', 'ftl_theory']),
                is_rare: false,
                discovery_chance: 1.0
            },
            {
                id: 'energy_systems',
                name: 'Energy Systems',
                description: 'Advanced energy generation and storage systems.',
                research_field: 'physics',
                tier: 2,
                cost: 220,
                prerequisites: JSON.stringify(['basic_physics']),
                effects: JSON.stringify({
                    energyProduction: 1.2,
                    unlocks: ['fusion_power', 'shield_technology']
                }),
                unlocks: JSON.stringify(['fusion_power', 'shield_technology']),
                is_rare: false,
                discovery_chance: 1.0
            },
            
            // Society Technologies
            {
                id: 'basic_society',
                name: 'Basic Society',
                description: 'Fundamental social and administrative structures.',
                research_field: 'society',
                tier: 1,
                cost: 100,
                prerequisites: JSON.stringify([]),
                effects: JSON.stringify({
                    administrativeCapacity: 10,
                    unlocks: ['colonial_administration', 'diplomatic_protocols']
                }),
                unlocks: JSON.stringify(['colonial_administration', 'diplomatic_protocols']),
                is_rare: false,
                discovery_chance: 1.0
            },
            {
                id: 'colonial_administration',
                name: 'Colonial Administration',
                description: 'Efficient management of colonial territories.',
                research_field: 'society',
                tier: 2,
                cost: 250,
                prerequisites: JSON.stringify(['basic_society']),
                effects: JSON.stringify({
                    administrativeCapacity: 15,
                    planetHappiness: 0.1,
                    unlocks: ['planetary_unification', 'galactic_bureaucracy']
                }),
                unlocks: JSON.stringify(['planetary_unification', 'galactic_bureaucracy']),
                is_rare: false,
                discovery_chance: 1.0
            },
            {
                id: 'diplomatic_protocols',
                name: 'Diplomatic Protocols',
                description: 'Formal diplomatic procedures for interstellar relations.',
                research_field: 'society',
                tier: 2,
                cost: 200,
                prerequisites: JSON.stringify(['basic_society']),
                effects: JSON.stringify({
                    diplomaticWeight: 1.15,
                    unlocks: ['galactic_diplomacy', 'trade_agreements']
                }),
                unlocks: JSON.stringify(['galactic_diplomacy', 'trade_agreements']),
                is_rare: false,
                discovery_chance: 1.0
            },
            
            // Advanced Technologies
            {
                id: 'ftl_theory',
                name: 'FTL Theory',
                description: 'Theoretical foundation for faster-than-light travel.',
                research_field: 'physics',
                tier: 3,
                cost: 500,
                prerequisites: JSON.stringify(['advanced_physics']),
                effects: JSON.stringify({
                    fleetSpeed: 1.5,
                    unlocks: ['warp_drive', 'jump_drive']
                }),
                unlocks: JSON.stringify(['warp_drive', 'jump_drive']),
                is_rare: false,
                discovery_chance: 1.0
            },
            {
                id: 'artificial_intelligence',
                name: 'Artificial Intelligence',
                description: 'Advanced AI systems for automation and decision making.',
                research_field: 'physics',
                tier: 4,
                cost: 800,
                prerequisites: JSON.stringify(['quantum_physics', 'advanced_computing']),
                effects: JSON.stringify({
                    researchSpeed: 1.3,
                    productionEfficiency: 1.2,
                    unlocks: ['sentient_ai', 'machine_intelligence']
                }),
                unlocks: JSON.stringify(['sentient_ai', 'machine_intelligence']),
                is_rare: true,
                discovery_chance: 0.7
            }
        ];

        for (const tech of technologies) {
            await this.db.runQuery(`
                INSERT OR IGNORE INTO technologies (
                    id, name, description, research_field, tier, cost, prerequisites,
                    effects, unlocks, is_rare, discovery_chance
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                tech.id, tech.name, tech.description, tech.research_field, tech.tier,
                tech.cost, tech.prerequisites, tech.effects, tech.unlocks,
                tech.is_rare, tech.discovery_chance
            ]);
        }

        console.log(`  📚 Inserted ${technologies.length} technologies`);
    }

    async insertGameConfig() {
        const configs = [
            { key: 'game_version', value: '1.0.0' },
            { key: 'tick_rate', value: '1000' },
            { key: 'max_players_per_galaxy', value: '100' },
            { key: 'starting_credits', value: '10000' },
            { key: 'starting_energy', value: '1000' },
            { key: 'starting_minerals', value: '1000' },
            { key: 'starting_food', value: '1000' },
            { key: 'starting_research', value: '100' },
            { key: 'starting_influence', value: '50' },
            { key: 'starting_alloys', value: '100' },
            { key: 'galaxy_size', value: '1000' },
            { key: 'star_density', value: '0.3' },
            { key: 'habitable_worlds_modifier', value: '1.0' },
            { key: 'ai_aggressiveness', value: '1.0' },
            { key: 'random_events_frequency', value: '1.0' },
            { key: 'crisis_strength', value: '1.0' },
            { key: 'victory_year', value: '2500' },
            { key: 'research_speed_modifier', value: '1.0' },
            { key: 'economic_growth_modifier', value: '1.0' },
            { key: 'fleet_cap_modifier', value: '1.0' }
        ];

        for (const config of configs) {
            await this.db.runQuery(`
                INSERT OR REPLACE INTO game_config (key, value, last_updated)
                VALUES (?, ?, ?)
            `, [config.key, config.value, Date.now()]);
        }

        console.log(`  ⚙️ Inserted ${configs.length} configuration entries`);
    }

    async insertSampleData() {
        console.log('🧪 Inserting sample data for development...');
        
        // Create sample player
        const samplePlayerId = 'sample-player-1';
        const samplePlayerPassword = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/dE.8QJqKZN5.a3a.C'; // "password"
        
        await this.db.runQuery(`
            INSERT OR IGNORE INTO players (
                id, username, email, password_hash, created_at, is_online
            ) VALUES (?, ?, ?, ?, ?, ?)
        `, [
            samplePlayerId, 'TestCommander', 'test@cosmic-empire.game', 
            samplePlayerPassword, Date.now(), false
        ]);

        // Create sample empire
        const sampleEmpireId = 'sample-empire-1';
        const sampleResources = {
            credits: 50000,
            energy: 5000,
            minerals: 5000,
            food: 5000,
            research: 500,
            influence: 200,
            alloys: 500,
            exotic_matter: 10
        };

        const sampleTechnologies = {
            researched: ['basic_engineering', 'basic_physics', 'basic_society', 'improved_engineering'],
            available: ['advanced_physics', 'basic_weapons', 'colonial_administration'],
            current: 'advanced_physics',
            researchProgress: 150,
            researchSpeed: 1.2
        };

        const samplePolicies = {
            economic: 'balanced',
            military: 'defensive',
            diplomatic: 'neutral',
            research: 'balanced'
        };

        await this.db.runQuery(`
            INSERT OR IGNORE INTO empires (
                id, name, player_id, faction, color, government_type, culture,
                created_at, total_population, empire_level, experience_points,
                resources, technologies, policies
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            sampleEmpireId, 'Terran Federation', samplePlayerId, 'human', '#0066CC',
            'democracy', 'human', Date.now(), 1000000, 3, 1250,
            JSON.stringify(sampleResources), JSON.stringify(sampleTechnologies),
            JSON.stringify(samplePolicies)
        ]);

        // Update player with empire ID
        await this.db.runQuery(`
            UPDATE players SET empire_id = ? WHERE id = ?
        `, [sampleEmpireId, samplePlayerId]);

        // Create sample star system
        const sampleSystemId = 'sample-system-sol';
        await this.db.runQuery(`
            INSERT OR IGNORE INTO star_systems (
                id, name, galaxy_id, position_x, position_y, position_z,
                star_type, star_class, star_mass, star_temperature, star_luminosity,
                planet_count, discovered_by, discovered_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            sampleSystemId, 'Sol System', 'galaxy-1', 0, 0, 0,
            'main_sequence', 'G', 1.0, 5778, 1.0, 4, sampleEmpireId, Date.now()
        ]);

        // Create sample planets
        const samplePlanets = [
            {
                id: 'planet-earth',
                name: 'Earth',
                orbit: 3,
                type: 'terrestrial',
                class: 'continental',
                size: 1.0,
                habitability: 0.9,
                owner: sampleEmpireId,
                population: 1000000
            },
            {
                id: 'planet-mars',
                name: 'Mars',
                orbit: 4,
                type: 'terrestrial',
                class: 'arid',
                size: 0.53,
                habitability: 0.3,
                owner: null,
                population: 0
            }
        ];

        for (const planet of samplePlanets) {
            await this.db.runQuery(`
                INSERT OR IGNORE INTO planets (
                    id, name, system_id, orbit_position, planet_type, planet_class,
                    size, mass, gravity, atmosphere, temperature, habitability,
                    owner_empire_id, population, colonized_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                planet.id, planet.name, sampleSystemId, planet.orbit, planet.type,
                planet.class, planet.size, planet.size, planet.size * 9.8,
                'breathable', 288, planet.habitability, planet.owner, planet.population,
                planet.owner ? Date.now() : null
            ]);
        }

        // Create sample fleet
        const sampleFleetId = 'sample-fleet-1';
        await this.db.runQuery(`
            INSERT OR IGNORE INTO fleets (
                id, name, empire_id, current_system_id, position_x, position_y, position_z,
                fleet_size, total_firepower, total_defense, total_speed, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            sampleFleetId, '1st Fleet', sampleEmpireId, sampleSystemId, 0, 0, 0,
            5, 150, 100, 2.5, 'idle'
        ]);

        console.log('  🧪 Sample data inserted successfully');
    }
}

// Run the initialization
async function main() {
    const initializer = new DatabaseInitializer();
    
    try {
        await initializer.initialize();
        console.log('\n🎉 Database initialization completed!');
        console.log('\n📋 Summary:');
        console.log('  ✅ Database tables created');
        console.log('  ✅ Technologies inserted');
        console.log('  ✅ Game configuration set');
        
        if (process.env.NODE_ENV === 'development') {
            console.log('  ✅ Sample data for development');
            console.log('\n🎮 You can now start the server and use these test credentials:');
            console.log('  Username: TestCommander');
            console.log('  Password: password');
        }
        
        process.exit(0);
        
    } catch (error) {
        console.error('\n💥 Initialization failed:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = DatabaseInitializer;