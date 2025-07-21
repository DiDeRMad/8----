/**
 * Cosmic Empire - Game Constants
 * 
 * This file contains all the shared constants used throughout the game.
 * These values define game balance, limits, and core mechanics.
 */

// Resource Types
export const RESOURCE_TYPES = {
    CREDITS: 'credits',
    ENERGY: 'energy',
    MINERALS: 'minerals',
    FOOD: 'food',
    RESEARCH: 'research',
    INFLUENCE: 'influence',
    ALLOYS: 'alloys',
    EXOTIC_MATTER: 'exotic_matter',
    DARK_MATTER: 'dark_matter',
    ANTIMATTER: 'antimatter',
    UNITY: 'unity',
    CONSUMER_GOODS: 'consumer_goods'
};

// Starting Resources
export const STARTING_RESOURCES = {
    [RESOURCE_TYPES.CREDITS]: 10000,
    [RESOURCE_TYPES.ENERGY]: 1000,
    [RESOURCE_TYPES.MINERALS]: 1000,
    [RESOURCE_TYPES.FOOD]: 1000,
    [RESOURCE_TYPES.RESEARCH]: 100,
    [RESOURCE_TYPES.INFLUENCE]: 50,
    [RESOURCE_TYPES.ALLOYS]: 100,
    [RESOURCE_TYPES.EXOTIC_MATTER]: 0,
    [RESOURCE_TYPES.DARK_MATTER]: 0,
    [RESOURCE_TYPES.ANTIMATTER]: 0,
    [RESOURCE_TYPES.UNITY]: 0,
    [RESOURCE_TYPES.CONSUMER_GOODS]: 500
};

// Resource Storage Limits
export const RESOURCE_STORAGE_LIMITS = {
    [RESOURCE_TYPES.CREDITS]: 1000000,
    [RESOURCE_TYPES.ENERGY]: 10000,
    [RESOURCE_TYPES.MINERALS]: 10000,
    [RESOURCE_TYPES.FOOD]: 10000,
    [RESOURCE_TYPES.RESEARCH]: 10000,
    [RESOURCE_TYPES.INFLUENCE]: 1000,
    [RESOURCE_TYPES.ALLOYS]: 5000,
    [RESOURCE_TYPES.EXOTIC_MATTER]: 1000,
    [RESOURCE_TYPES.DARK_MATTER]: 1000,
    [RESOURCE_TYPES.ANTIMATTER]: 1000,
    [RESOURCE_TYPES.UNITY]: 5000,
    [RESOURCE_TYPES.CONSUMER_GOODS]: 10000
};

// Factions
export const FACTIONS = {
    HUMAN: 'human',
    ALIEN_TECH: 'alien_tech',
    ALIEN_BIO: 'alien_bio',
    ALIEN_PSI: 'alien_psi',
    MACHINE: 'machine',
    HIVE: 'hive'
};

// Faction Bonuses
export const FACTION_BONUSES = {
    [FACTIONS.HUMAN]: {
        name: 'Human Federation',
        description: 'Adaptable and diplomatic humans excel at unity and research',
        bonuses: {
            unity: 1.15,
            research: 1.1,
            diplomaticWeight: 1.1
        },
        traits: ['adaptable', 'diplomatic', 'innovative']
    },
    [FACTIONS.ALIEN_TECH]: {
        name: 'Teknari Collective',
        description: 'Advanced technological civilization with superior engineering',
        bonuses: {
            research: 1.25,
            shipBuildSpeed: 1.15,
            energyProduction: 1.1
        },
        traits: ['technological', 'logical', 'efficient']
    },
    [FACTIONS.ALIEN_BIO]: {
        name: 'Zephyrian Empire',
        description: 'Bio-engineered species with enhanced adaptation and growth',
        bonuses: {
            populationGrowth: 1.3,
            foodProduction: 1.2,
            planetHabitability: 1.15
        },
        traits: ['biological', 'adaptive', 'prolific']
    },
    [FACTIONS.ALIEN_PSI]: {
        name: 'Ethereal Consortium',
        description: 'Psychic beings with powerful mental abilities',
        bonuses: {
            influence: 1.2,
            happiness: 0.1,
            researchSociety: 1.25
        },
        traits: ['psychic', 'spiritual', 'unified']
    },
    [FACTIONS.MACHINE]: {
        name: 'Synthetic Intelligence',
        description: 'Artificial intelligences with perfect efficiency',
        bonuses: {
            productionEfficiency: 1.2,
            maintenanceCost: 0.8,
            happiness: 0 // Machines don\'t need happiness
        },
        traits: ['synthetic', 'efficient', 'logical']
    },
    [FACTIONS.HIVE]: {
        name: 'Swarm Consciousness',
        description: 'Collective consciousness with rapid expansion',
        bonuses: {
            populationGrowth: 1.4,
            buildSpeed: 1.2,
            navalCapacity: 1.15
        },
        traits: ['hive_mind', 'prolific', 'aggressive']
    }
};

// Government Types
export const GOVERNMENT_TYPES = {
    DEMOCRACY: 'democracy',
    OLIGARCHY: 'oligarchy',
    AUTOCRACY: 'autocracy',
    TECHNOCRACY: 'technocracy',
    THEOCRACY: 'theocracy',
    CORPORATE: 'corporate',
    IMPERIAL: 'imperial',
    FEDERATION: 'federation'
};

// Government Bonuses
export const GOVERNMENT_BONUSES = {
    [GOVERNMENT_TYPES.DEMOCRACY]: {
        name: 'Democratic Republic',
        description: 'Democratic government with elected representatives',
        bonuses: {
            happiness: 0.1,
            influence: 1.1,
            unity: 1.05
        },
        penalties: {
            militaryProduction: 0.9
        }
    },
    [GOVERNMENT_TYPES.OLIGARCHY]: {
        name: 'Corporate Oligarchy',
        description: 'Rule by wealthy corporations and elite families',
        bonuses: {
            creditsProduction: 1.15,
            tradeValue: 1.1,
            consumerGoodsProduction: 1.1
        },
        penalties: {
            happiness: -0.05
        }
    },
    [GOVERNMENT_TYPES.AUTOCRACY]: {
        name: 'Imperial Autocracy',
        description: 'Centralized rule under a supreme leader',
        bonuses: {
            militaryProduction: 1.15,
            navalCapacity: 1.1,
            buildSpeed: 1.05
        },
        penalties: {
            happiness: -0.1,
            research: 0.95
        }
    }
};

// Technology Fields
export const RESEARCH_FIELDS = {
    PHYSICS: 'physics',
    ENGINEERING: 'engineering',
    SOCIETY: 'society'
};

// Technology Tiers
export const TECH_TIERS = {
    TIER_1: 1,
    TIER_2: 2,
    TIER_3: 3,
    TIER_4: 4,
    TIER_5: 5,
    TIER_6: 6
};

// Ship Classes
export const SHIP_CLASSES = {
    CORVETTE: 'corvette',
    DESTROYER: 'destroyer',
    CRUISER: 'cruiser',
    BATTLESHIP: 'battleship',
    TITAN: 'titan',
    COLOSSUS: 'colossus'
};

// Ship Class Stats
export const SHIP_CLASS_STATS = {
    [SHIP_CLASSES.CORVETTE]: {
        name: 'Corvette',
        hullPoints: 300,
        speed: 4.0,
        evasion: 0.6,
        cost: 100,
        buildTime: 60,
        navalCapacity: 1
    },
    [SHIP_CLASSES.DESTROYER]: {
        name: 'Destroyer',
        hullPoints: 600,
        speed: 3.0,
        evasion: 0.3,
        cost: 200,
        buildTime: 120,
        navalCapacity: 2
    },
    [SHIP_CLASSES.CRUISER]: {
        name: 'Cruiser',
        hullPoints: 1200,
        speed: 2.5,
        evasion: 0.15,
        cost: 400,
        buildTime: 240,
        navalCapacity: 4
    },
    [SHIP_CLASSES.BATTLESHIP]: {
        name: 'Battleship',
        hullPoints: 2400,
        speed: 2.0,
        evasion: 0.05,
        cost: 800,
        buildTime: 480,
        navalCapacity: 8
    },
    [SHIP_CLASSES.TITAN]: {
        name: 'Titan',
        hullPoints: 6000,
        speed: 1.5,
        evasion: 0.02,
        cost: 2000,
        buildTime: 1200,
        navalCapacity: 16
    }
};

// Planet Types
export const PLANET_TYPES = {
    TERRESTRIAL: 'terrestrial',
    GAS_GIANT: 'gas_giant',
    ASTEROID: 'asteroid',
    BARREN: 'barren',
    FROZEN: 'frozen',
    MOLTEN: 'molten'
};

// Planet Classes
export const PLANET_CLASSES = {
    CONTINENTAL: 'continental',
    OCEAN: 'ocean',
    TROPICAL: 'tropical',
    ARID: 'arid',
    DESERT: 'desert',
    SAVANNA: 'savanna',
    ALPINE: 'alpine',
    ARCTIC: 'arctic',
    TUNDRA: 'tundra',
    TOMB: 'tomb',
    GAIA: 'gaia'
};

// Planet Class Habitability
export const PLANET_HABITABILITY = {
    [PLANET_CLASSES.CONTINENTAL]: 1.0,
    [PLANET_CLASSES.OCEAN]: 0.9,
    [PLANET_CLASSES.TROPICAL]: 0.9,
    [PLANET_CLASSES.ARID]: 0.7,
    [PLANET_CLASSES.DESERT]: 0.6,
    [PLANET_CLASSES.SAVANNA]: 0.8,
    [PLANET_CLASSES.ALPINE]: 0.7,
    [PLANET_CLASSES.ARCTIC]: 0.6,
    [PLANET_CLASSES.TUNDRA]: 0.6,
    [PLANET_CLASSES.TOMB]: 0.0,
    [PLANET_CLASSES.GAIA]: 1.2
};

// Star Types
export const STAR_TYPES = {
    MAIN_SEQUENCE: 'main_sequence',
    GIANT: 'giant',
    WHITE_DWARF: 'white_dwarf',
    NEUTRON_STAR: 'neutron_star',
    BLACK_HOLE: 'black_hole',
    PULSAR: 'pulsar'
};

// Star Classes
export const STAR_CLASSES = {
    O: 'O', // Blue supergiant
    B: 'B', // Blue giant
    A: 'A', // Blue-white
    F: 'F', // White
    G: 'G', // Yellow (like our Sun)
    K: 'K', // Orange
    M: 'M'  // Red dwarf
};

// Diplomatic Relations
export const DIPLOMATIC_RELATIONS = {
    WAR: 'war',
    HOSTILE: 'hostile',
    RIVAL: 'rival',
    NEUTRAL: 'neutral',
    CORDIAL: 'cordial',
    FRIENDLY: 'friendly',
    ALLIED: 'allied'
};

// Diplomatic Actions
export const DIPLOMATIC_ACTIONS = {
    DECLARE_WAR: 'declare_war',
    OFFER_PEACE: 'offer_peace',
    PROPOSE_ALLIANCE: 'propose_alliance',
    TRADE_AGREEMENT: 'trade_agreement',
    NON_AGGRESSION_PACT: 'non_aggression_pact',
    DEFENSIVE_PACT: 'defensive_pact',
    GUARANTEE_INDEPENDENCE: 'guarantee_independence',
    INSULT: 'insult',
    IMPROVE_RELATIONS: 'improve_relations'
};

// Building Types
export const BUILDING_TYPES = {
    // Infrastructure
    CAPITAL: 'capital',
    ADMINISTRATIVE_CENTER: 'administrative_center',
    
    // Resource Production
    ENERGY_GRID: 'energy_grid',
    MINING_NETWORK: 'mining_network',
    AGRICULTURAL_COMPLEX: 'agricultural_complex',
    INDUSTRIAL_COMPLEX: 'industrial_complex',
    
    // Research
    RESEARCH_LAB: 'research_lab',
    PHYSICS_LAB: 'physics_lab',
    ENGINEERING_BAY: 'engineering_bay',
    SOCIETY_RESEARCH: 'society_research',
    
    // Military
    FORTRESS: 'fortress',
    SHIELD_GENERATOR: 'shield_generator',
    SHIPYARD: 'shipyard',
    STARBASE: 'starbase',
    
    // Population
    HOUSING_COMPLEX: 'housing_complex',
    COMMERCIAL_CENTER: 'commercial_center',
    ENTERTAINMENT_COMPLEX: 'entertainment_complex',
    MEDICAL_CENTER: 'medical_center'
};

// Game Limits
export const GAME_LIMITS = {
    MAX_PLAYERS_PER_GALAXY: 100,
    MAX_EMPIRES_PER_PLAYER: 1,
    MAX_FLEETS_PER_EMPIRE: 50,
    MAX_SYSTEMS_PER_GALAXY: 1000,
    MAX_PLANETS_PER_SYSTEM: 15,
    MAX_BUILDINGS_PER_PLANET: 25,
    MAX_SHIPS_PER_FLEET: 20,
    MAX_TRADE_ROUTES: 100,
    MAX_RESEARCH_QUEUE: 10,
    MAX_CONSTRUCTION_QUEUE: 20
};

// Game Settings
export const GAME_SETTINGS = {
    TICK_RATE: 1000, // milliseconds
    UNIVERSE_UPDATE_RATE: 5000,
    ECONOMIC_UPDATE_RATE: 10000,
    AI_UPDATE_RATE: 2000,
    AUTO_SAVE_INTERVAL: 60000,
    MAX_GAME_SPEED: 5,
    MIN_GAME_SPEED: 0,
    DEFAULT_GAME_SPEED: 1
};

// Combat Constants
export const COMBAT_CONSTANTS = {
    BASE_ACCURACY: 0.75,
    EVASION_CAP: 0.9,
    SHIELD_REGENERATION_RATE: 0.1,
    ARMOR_DAMAGE_REDUCTION: 0.5,
    CRITICAL_HIT_CHANCE: 0.05,
    CRITICAL_HIT_MULTIPLIER: 2.0,
    RETREAT_THRESHOLD: 0.2, // Retreat when below 20% fleet strength
    COMBAT_ROUNDS_PER_DAY: 10
};

// Economic Constants
export const ECONOMIC_CONSTANTS = {
    BASE_POPULATION_GROWTH: 0.01,
    FOOD_PER_POP: 1,
    CONSUMER_GOODS_PER_POP: 0.5,
    UNEMPLOYMENT_PENALTY: -0.1,
    HAPPINESS_STABILITY_FACTOR: 0.5,
    TRADE_ROUTE_BASE_VALUE: 10,
    MARKET_VOLATILITY: 0.1,
    INFLATION_RATE: 0.02
};

// Research Constants
export const RESEARCH_CONSTANTS = {
    BASE_RESEARCH_COST: 100,
    TIER_COST_MULTIPLIER: 2.5,
    RARE_TECH_MULTIPLIER: 1.5,
    RESEARCH_SPEED_CAP: 5.0,
    PREREQUISITES_COST_REDUCTION: 0.1
};

// Victory Conditions
export const VICTORY_CONDITIONS = {
    CONQUEST: {
        type: 'conquest',
        name: 'Galactic Domination',
        description: 'Control 60% of all habitable worlds',
        target: 0.6
    },
    SCIENCE: {
        type: 'science',
        name: 'Technological Ascension',
        description: 'Research all ascension technologies',
        target: 100
    },
    ECONOMIC: {
        type: 'economic',
        name: 'Economic Supremacy',
        description: 'Generate 50% of galaxy\'s total GDP',
        target: 0.5
    },
    DIPLOMATIC: {
        type: 'diplomatic',
        name: 'Galactic Federation',
        description: 'Form federation with 70% of empires',
        target: 0.7
    }
};

// Event Types
export const EVENT_TYPES = {
    // Empire Events
    EMPIRE_FOUNDED: 'empire_founded',
    EMPIRE_DESTROYED: 'empire_destroyed',
    TECHNOLOGY_RESEARCHED: 'technology_researched',
    BUILDING_COMPLETED: 'building_completed',
    SHIP_BUILT: 'ship_built',
    PLANET_COLONIZED: 'planet_colonized',
    
    // Diplomatic Events
    FIRST_CONTACT: 'first_contact',
    ALLIANCE_FORMED: 'alliance_formed',
    WAR_DECLARED: 'war_declared',
    PEACE_SIGNED: 'peace_signed',
    TRADE_AGREEMENT_SIGNED: 'trade_agreement_signed',
    
    // Combat Events
    BATTLE_WON: 'battle_won',
    BATTLE_LOST: 'battle_lost',
    FLEET_DESTROYED: 'fleet_destroyed',
    PLANET_INVADED: 'planet_invaded',
    STARBASE_DESTROYED: 'starbase_destroyed',
    
    // Discovery Events
    SYSTEM_SURVEYED: 'system_surveyed',
    ANOMALY_DISCOVERED: 'anomaly_discovered',
    ANCIENT_RUINS_FOUND: 'ancient_ruins_found',
    RESOURCE_DEPOSIT_FOUND: 'resource_deposit_found',
    
    // Crisis Events
    PIRATE_RAID: 'pirate_raid',
    NATURAL_DISASTER: 'natural_disaster',
    REBELLION: 'rebellion',
    ECONOMIC_CRISIS: 'economic_crisis',
    PLAGUE_OUTBREAK: 'plague_outbreak'
};

// Notification Priorities
export const NOTIFICATION_PRIORITIES = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
};

// Error Codes
export const ERROR_CODES = {
    // Authentication
    AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
    AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
    AUTH_INSUFFICIENT_PERMISSIONS: 'AUTH_INSUFFICIENT_PERMISSIONS',
    
    // Game Logic
    GAME_INSUFFICIENT_RESOURCES: 'GAME_INSUFFICIENT_RESOURCES',
    GAME_INVALID_ACTION: 'GAME_INVALID_ACTION',
    GAME_TARGET_NOT_FOUND: 'GAME_TARGET_NOT_FOUND',
    GAME_ACTION_COOLDOWN: 'GAME_ACTION_COOLDOWN',
    
    // Network
    NETWORK_CONNECTION_LOST: 'NETWORK_CONNECTION_LOST',
    NETWORK_TIMEOUT: 'NETWORK_TIMEOUT',
    NETWORK_SERVER_ERROR: 'NETWORK_SERVER_ERROR',
    
    // Database
    DB_CONNECTION_FAILED: 'DB_CONNECTION_FAILED',
    DB_QUERY_FAILED: 'DB_QUERY_FAILED',
    DB_CONSTRAINT_VIOLATION: 'DB_CONSTRAINT_VIOLATION'
};

// Success Messages
export const SUCCESS_MESSAGES = {
    EMPIRE_CREATED: 'Empire successfully created!',
    TECHNOLOGY_RESEARCHED: 'Technology research completed!',
    BUILDING_CONSTRUCTED: 'Building construction completed!',
    SHIP_BUILT: 'Ship construction completed!',
    PLANET_COLONIZED: 'Planet successfully colonized!',
    TRADE_AGREEMENT_SIGNED: 'Trade agreement successfully signed!',
    ALLIANCE_FORMED: 'Alliance successfully formed!',
    BATTLE_WON: 'Victory achieved in battle!',
    RESOURCES_GAINED: 'Resources successfully acquired!'
};

// Default Colors
export const DEFAULT_COLORS = [
    '#0066CC', // Blue
    '#CC0066', // Pink
    '#66CC00', // Green
    '#CC6600', // Orange
    '#6600CC', // Purple
    '#00CC66', // Teal
    '#CC0000', // Red
    '#00CCCC', // Cyan
    '#CCCC00', // Yellow
    '#CC00CC'  // Magenta
];

// UI Constants
export const UI_CONSTANTS = {
    SIDEBAR_WIDTH: 300,
    HEADER_HEIGHT: 80,
    FOOTER_HEIGHT: 200,
    MIN_CANVAS_WIDTH: 800,
    MIN_CANVAS_HEIGHT: 600,
    ZOOM_MIN: 0.1,
    ZOOM_MAX: 10.0,
    ZOOM_STEP: 0.1,
    ANIMATION_DURATION: 300,
    TOOLTIP_DELAY: 500,
    NOTIFICATION_DURATION: 5000
};

// Export all constants
export default {
    RESOURCE_TYPES,
    STARTING_RESOURCES,
    RESOURCE_STORAGE_LIMITS,
    FACTIONS,
    FACTION_BONUSES,
    GOVERNMENT_TYPES,
    GOVERNMENT_BONUSES,
    RESEARCH_FIELDS,
    TECH_TIERS,
    SHIP_CLASSES,
    SHIP_CLASS_STATS,
    PLANET_TYPES,
    PLANET_CLASSES,
    PLANET_HABITABILITY,
    STAR_TYPES,
    STAR_CLASSES,
    DIPLOMATIC_RELATIONS,
    DIPLOMATIC_ACTIONS,
    BUILDING_TYPES,
    GAME_LIMITS,
    GAME_SETTINGS,
    COMBAT_CONSTANTS,
    ECONOMIC_CONSTANTS,
    RESEARCH_CONSTANTS,
    VICTORY_CONDITIONS,
    EVENT_TYPES,
    NOTIFICATION_PRIORITIES,
    ERROR_CODES,
    SUCCESS_MESSAGES,
    DEFAULT_COLORS,
    UI_CONSTANTS
};