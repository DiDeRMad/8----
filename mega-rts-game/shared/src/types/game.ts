import { GameId, PlayerId, Timestamp, Vector2D } from './index';
import { GameMap } from './map';
import { Player } from './player';
import { Alliance } from './alliance';
import { GameSettings } from './settings';

// Game state enum
export enum GameState {
  WAITING = 'WAITING',
  STARTING = 'STARTING',
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  ENDING = 'ENDING',
  ENDED = 'ENDED',
  ABANDONED = 'ABANDONED'
}

// Game modes
export enum GameMode {
  CLASSIC = 'CLASSIC',
  RANKED = 'RANKED',
  TOURNAMENT = 'TOURNAMENT',
  CUSTOM = 'CUSTOM',
  CAMPAIGN = 'CAMPAIGN',
  TUTORIAL = 'TUTORIAL',
  SURVIVAL = 'SURVIVAL',
  CONQUEST = 'CONQUEST',
  DOMINATION = 'DOMINATION',
  ANNIHILATION = 'ANNIHILATION',
  ECONOMY = 'ECONOMY',
  DIPLOMACY = 'DIPLOMACY',
  SCENARIO = 'SCENARIO'
}

// Victory conditions
export enum VictoryCondition {
  ELIMINATION = 'ELIMINATION',
  DOMINATION = 'DOMINATION',
  WONDER = 'WONDER',
  SCORE = 'SCORE',
  TIME_LIMIT = 'TIME_LIMIT',
  CAPTURE_THE_FLAG = 'CAPTURE_THE_FLAG',
  KING_OF_THE_HILL = 'KING_OF_THE_HILL',
  ECONOMIC = 'ECONOMIC',
  DIPLOMATIC = 'DIPLOMATIC',
  CUSTOM = 'CUSTOM'
}

// Game speed
export enum GameSpeed {
  SLOW = 0.5,
  NORMAL = 1,
  FAST = 1.5,
  VERY_FAST = 2,
  ULTRA_FAST = 3
}

// Difficulty levels
export enum Difficulty {
  BEGINNER = 'BEGINNER',
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD',
  EXPERT = 'EXPERT',
  INSANE = 'INSANE',
  LEGENDARY = 'LEGENDARY'
}

// Weather conditions
export enum Weather {
  CLEAR = 'CLEAR',
  RAIN = 'RAIN',
  STORM = 'STORM',
  SNOW = 'SNOW',
  FOG = 'FOG',
  SANDSTORM = 'SANDSTORM',
  VOLCANIC_ASH = 'VOLCANIC_ASH',
  AURORA = 'AURORA'
}

// Time of day
export enum TimeOfDay {
  DAWN = 'DAWN',
  MORNING = 'MORNING',
  NOON = 'NOON',
  AFTERNOON = 'AFTERNOON',
  DUSK = 'DUSK',
  NIGHT = 'NIGHT',
  MIDNIGHT = 'MIDNIGHT'
}

// Season
export enum Season {
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  AUTUMN = 'AUTUMN',
  WINTER = 'WINTER'
}

// Main game interface
export interface Game {
  id: GameId;
  name: string;
  description: string;
  mode: GameMode;
  state: GameState;
  settings: GameSettings;
  map: GameMap;
  players: Player[];
  alliances: Alliance[];
  host: PlayerId;
  createdAt: Timestamp;
  startedAt?: Timestamp;
  endedAt?: Timestamp;
  lastUpdateAt: Timestamp;
  currentTick: number;
  speed: GameSpeed;
  isPaused: boolean;
  pausedBy?: PlayerId;
  pausedAt?: Timestamp;
  victoryConditions: VictoryCondition[];
  winner?: PlayerId | AllianceId;
  statistics: GameStatistics;
  replay?: GameReplay;
  metadata: GameMetadata;
  environment: GameEnvironment;
  events: GameEventLog[];
  chat: GameChat[];
}

// Game settings
export interface GameSettings {
  maxPlayers: number;
  minPlayers: number;
  isPrivate: boolean;
  password?: string;
  allowSpectators: boolean;
  maxSpectators: number;
  allowLateJoin: boolean;
  allowReconnect: boolean;
  reconnectTimeout: number;
  turnTimeLimit?: number;
  gameTimeLimit?: number;
  startingResources: ResourceSettings;
  fogOfWar: boolean;
  allowCheats: boolean;
  allowMods: boolean;
  mods: string[];
  difficulty: Difficulty;
  aiPlayers: AIPlayerSettings[];
  handicaps: HandicapSettings;
  restrictions: GameRestrictions;
  advanced: AdvancedSettings;
}

// Resource settings
export interface ResourceSettings {
  multiplier: number;
  startingGold: number;
  startingWood: number;
  startingStone: number;
  startingFood: number;
  startingEnergy: number;
  startingPopulation: number;
  maxPopulation: number;
  resourceCaps: {
    gold?: number;
    wood?: number;
    stone?: number;
    food?: number;
    energy?: number;
  };
}

// AI player settings
export interface AIPlayerSettings {
  playerId: PlayerId;
  difficulty: Difficulty;
  personality: AIPersonality;
  strategy: AIStrategy;
  aggressiveness: number;
  expansiveness: number;
  diplomacy: number;
  economy: number;
  military: number;
  technology: number;
}

// AI personality types
export enum AIPersonality {
  AGGRESSIVE = 'AGGRESSIVE',
  DEFENSIVE = 'DEFENSIVE',
  ECONOMIC = 'ECONOMIC',
  EXPANSIONIST = 'EXPANSIONIST',
  DIPLOMATIC = 'DIPLOMATIC',
  BALANCED = 'BALANCED',
  UNPREDICTABLE = 'UNPREDICTABLE',
  RUSHER = 'RUSHER',
  TURTLE = 'TURTLE',
  BOOMER = 'BOOMER'
}

// AI strategy
export enum AIStrategy {
  RUSH = 'RUSH',
  BOOM = 'BOOM',
  TURTLE = 'TURTLE',
  EXPAND = 'EXPAND',
  HARASS = 'HARASS',
  TECH = 'TECH',
  MIXED = 'MIXED'
}

// Handicap settings
export interface HandicapSettings {
  [playerId: string]: {
    resourceMultiplier: number;
    unitHealthMultiplier: number;
    unitDamageMultiplier: number;
    buildSpeedMultiplier: number;
    researchSpeedMultiplier: number;
    visionRangeMultiplier: number;
  };
}

// Game restrictions
export interface GameRestrictions {
  bannedUnits: string[];
  bannedBuildings: string[];
  bannedTechnologies: string[];
  bannedStrategies: string[];
  maxUnitsPerType: { [unitType: string]: number };
  maxBuildingsPerType: { [buildingType: string]: number };
  ageLimit?: number;
  techLimit?: number;
}

// Advanced settings
export interface AdvancedSettings {
  randomEvents: boolean;
  disasters: boolean;
  tradingEnabled: boolean;
  diplomacyEnabled: boolean;
  espionageEnabled: boolean;
  heroesEnabled: boolean;
  relicsEnabled: boolean;
  wondersEnabled: boolean;
  uniqueUnitsEnabled: boolean;
  formationsEnabled: boolean;
  moraleEnabled: boolean;
  supplyLinesEnabled: boolean;
  terraformingEnabled: boolean;
  undergroundEnabled: boolean;
  navalCombatEnabled: boolean;
  aerialCombatEnabled: boolean;
  siegeWarfareEnabled: boolean;
}

// Game statistics
export interface GameStatistics {
  duration: number;
  totalUnitsCreated: number;
  totalUnitsKilled: number;
  totalBuildingsConstructed: number;
  totalBuildingsDestroyed: number;
  totalResourcesGathered: { [resource: string]: number };
  totalResourcesSpent: { [resource: string]: number };
  totalDamageDealt: number;
  totalDamageReceived: number;
  totalExperienceGained: number;
  totalTechnologiesResearched: number;
  totalTradesCompleted: number;
  totalBattlesFought: number;
  largestArmy: number;
  highestScore: number;
  mostValuablePlayer?: PlayerId;
  playerStatistics: { [playerId: string]: PlayerGameStatistics };
}

// Player game statistics
export interface PlayerGameStatistics {
  playerId: PlayerId;
  score: number;
  rank: number;
  unitsCreated: number;
  unitsLost: number;
  unitsKilled: number;
  buildingsConstructed: number;
  buildingsLost: number;
  buildingsDestroyed: number;
  resourcesGathered: { [resource: string]: number };
  resourcesSpent: { [resource: string]: number };
  resourcesTributed: { [resource: string]: number };
  damageDealt: number;
  damageReceived: number;
  experienceGained: number;
  technologiesResearched: number;
  agesAdvanced: number;
  wondersBuilt: number;
  heroesRecruited: number;
  relicsCollected: number;
  tradesCompleted: number;
  battlesWon: number;
  battlesLost: number;
  highestPopulation: number;
  militaryScore: number;
  economyScore: number;
  technologyScore: number;
  societyScore: number;
  timeline: GameEvent[];
}

// Game metadata
export interface GameMetadata {
  version: string;
  checksum: string;
  seed: number;
  locale: string;
  region: string;
  server: string;
  rated: boolean;
  tournament?: TournamentInfo;
  tags: string[];
  customData: { [key: string]: any };
}

// Tournament info
export interface TournamentInfo {
  id: string;
  name: string;
  round: number;
  bracket: string;
  prize: number;
}

// Game environment
export interface GameEnvironment {
  weather: Weather;
  timeOfDay: TimeOfDay;
  season: Season;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  ambientLight: number;
  terrainModifiers: TerrainModifier[];
  globalEffects: GlobalEffect[];
}

// Terrain modifier
export interface TerrainModifier {
  id: string;
  type: string;
  area: Vector2D[];
  effects: {
    movementSpeed?: number;
    attackRange?: number;
    defense?: number;
    healing?: number;
    resourceGathering?: number;
  };
  duration?: number;
}

// Global effect
export interface GlobalEffect {
  id: string;
  name: string;
  description: string;
  icon: string;
  effects: { [key: string]: number };
  duration?: number;
  source?: string;
}

// Game event for timeline
export interface GameEvent {
  timestamp: Timestamp;
  tick: number;
  type: string;
  playerId?: PlayerId;
  data: any;
  importance: EventImportance;
}

// Event importance
export enum EventImportance {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// Game chat message
export interface GameChat {
  id: string;
  timestamp: Timestamp;
  playerId: PlayerId;
  message: string;
  type: ChatType;
  recipients: PlayerId[];
  metadata?: {
    language?: string;
    translated?: boolean;
    flagged?: boolean;
  };
}

// Chat type
export enum ChatType {
  ALL = 'ALL',
  TEAM = 'TEAM',
  ALLIANCE = 'ALLIANCE',
  PRIVATE = 'PRIVATE',
  SYSTEM = 'SYSTEM',
  SPECTATOR = 'SPECTATOR'
}

// Game replay data
export interface GameReplay {
  id: string;
  gameId: GameId;
  version: string;
  compressed: boolean;
  size: number;
  duration: number;
  frames: ReplayFrame[];
  checkpoints: ReplayCheckpoint[];
  metadata: ReplayMetadata;
}

// Replay frame
export interface ReplayFrame {
  tick: number;
  timestamp: Timestamp;
  commands: any[];
  events: any[];
  state?: any;
}

// Replay checkpoint
export interface ReplayCheckpoint {
  tick: number;
  timestamp: Timestamp;
  state: any;
}

// Replay metadata
export interface ReplayMetadata {
  players: ReplayPlayerInfo[];
  mapName: string;
  gameMode: GameMode;
  duration: number;
  winner?: PlayerId | AllianceId;
  highlights: ReplayHighlight[];
}

// Replay player info
export interface ReplayPlayerInfo {
  playerId: PlayerId;
  name: string;
  civilization: string;
  team: number;
  color: string;
  isAI: boolean;
  rating?: number;
}

// Replay highlight
export interface ReplayHighlight {
  tick: number;
  timestamp: Timestamp;
  type: string;
  description: string;
  players: PlayerId[];
  position?: Vector2D;
}

// Game phase
export enum GamePhase {
  EARLY_GAME = 'EARLY_GAME',
  MID_GAME = 'MID_GAME',
  LATE_GAME = 'LATE_GAME',
  END_GAME = 'END_GAME'
}

// Victory statistics
export interface VictoryStatistics {
  condition: VictoryCondition;
  achievedAt: Timestamp;
  achievedBy: PlayerId | AllianceId;
  details: {
    score?: number;
    unitsRemaining?: number;
    buildingsRemaining?: number;
    territoryCaptured?: number;
    wondersBuilt?: number;
    relicsCollected?: number;
    enemiesEliminated?: PlayerId[];
  };
}

// Export additional types
export type AllianceId = string;