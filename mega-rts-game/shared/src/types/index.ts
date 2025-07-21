// Base types used throughout the application

// Primitive ID types
export type PlayerId = string;
export type GameId = string;
export type UnitId = string;
export type BuildingId = string;
export type AllianceId = string;
export type ChatRoomId = string;
export type ResourceId = string;
export type TechnologyId = string;
export type QuestId = string;
export type AchievementId = string;
export type ItemId = string;
export type SkillId = string;
export type BuffId = string;
export type DebuffId = string;

// Coordinate system
export interface Vector2D {
  x: number;
  y: number;
}

export interface Vector3D extends Vector2D {
  z: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Circle {
  x: number;
  y: number;
  radius: number;
}

// Time-related types
export type Timestamp = number;
export type Duration = number;

// Generic result types
export interface Result<T, E = Error> {
  success: boolean;
  data?: T;
  error?: E;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Event system
export interface GameEvent<T = any> {
  id: string;
  type: string;
  timestamp: Timestamp;
  data: T;
  source?: string;
  target?: string;
}

// Color representation
export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface HSLColor {
  h: number;
  s: number;
  l: number;
  a?: number;
}

// Generic stats interface
export interface Stats {
  [key: string]: number | string | boolean;
}

// Range type for min/max values
export interface Range {
  min: number;
  max: number;
}

// Weight system for random selection
export interface WeightedItem<T> {
  item: T;
  weight: number;
}

// Tree structure
export interface TreeNode<T> {
  id: string;
  data: T;
  children: TreeNode<T>[];
  parent?: string;
}

// Graph structure
export interface GraphNode<T> {
  id: string;
  data: T;
  edges: GraphEdge[];
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  data?: any;
}

// Grid system
export interface GridCell<T = any> {
  x: number;
  y: number;
  data?: T;
  walkable: boolean;
  cost: number;
}

export interface Grid<T = any> {
  width: number;
  height: number;
  cells: GridCell<T>[][];
}

// Notification system
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Timestamp;
  read: boolean;
  data?: any;
}

// Currency types
export interface Currency {
  gold: number;
  gems: number;
  energy: number;
  experience: number;
}

// Damage types
export interface Damage {
  physical: number;
  magical: number;
  true: number;
  elemental?: {
    fire?: number;
    water?: number;
    earth?: number;
    air?: number;
    light?: number;
    dark?: number;
  };
}

// Defense types
export interface Defense {
  armor: number;
  magicResist: number;
  dodge: number;
  block: number;
  parry: number;
}

// Export all sub-modules
export * from './game';
export * from './player';
export * from './units';
export * from './buildings';
export * from './resources';
export * from './map';
export * from './combat';
export * from './technology';
export * from './alliance';
export * from './chat';
export * from './events';
export * from './achievements';
export * from './leaderboard';
export * from './marketplace';
export * from './quests';
export * from './network';
export * from './packets';
export * from './commands';
export * from './auth';
export * from './permissions';
export * from './models';
export * from './api';
export * from './responses';
export * from './errors';