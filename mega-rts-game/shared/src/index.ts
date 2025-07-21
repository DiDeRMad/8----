// Main entry point for @mega-rts/shared
// This module contains all shared types, interfaces, constants, and utilities
// used across both backend and frontend applications

// Export all types
export * from './types';
export * from './interfaces';
export * from './enums';
export * from './constants';
export * from './utils';
export * from './validators';

// Game-specific exports
export * from './types/game';
export * from './types/player';
export * from './types/units';
export * from './types/buildings';
export * from './types/resources';
export * from './types/map';
export * from './types/combat';
export * from './types/technology';
export * from './types/alliance';
export * from './types/chat';
export * from './types/events';
export * from './types/achievements';
export * from './types/leaderboard';
export * from './types/marketplace';
export * from './types/quests';

// Network protocol exports
export * from './types/network';
export * from './types/packets';
export * from './types/commands';

// Authentication and authorization
export * from './types/auth';
export * from './types/permissions';

// Database models
export * from './types/models';

// API contracts
export * from './types/api';
export * from './types/responses';
export * from './types/errors';

// Utility functions
export * from './utils/math';
export * from './utils/physics';
export * from './utils/pathfinding';
export * from './utils/collision';
export * from './utils/serialization';
export * from './utils/validation';
export * from './utils/crypto';
export * from './utils/time';
export * from './utils/random';

// Constants
export * from './constants/game';
export * from './constants/units';
export * from './constants/buildings';
export * from './constants/resources';
export * from './constants/technology';
export * from './constants/balance';

// Validators
export * from './validators/game';
export * from './validators/player';
export * from './validators/auth';
export * from './validators/commands';

// Version information
export const VERSION = '1.0.0';
export const API_VERSION = 'v1';
export const PROTOCOL_VERSION = 1;