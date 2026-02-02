
export enum Role {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export type ModalityType = 'text' | 'image' | 'data' | 'system';
export type PlatformType = 'enterprise' | 'android' | 'ios' | 'pc';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  isThinking?: boolean;
  type?: ModalityType;
  imageUrl?: string;
}

export interface EvolutionState {
  level: string;
  efficiency: number;
  syncStatus: number;
  intelligenceScore: number;
  networkSaturation: number;
  platform: PlatformType;
  battery: number;
  storage: string;
  ram: string;
}

export interface ChartDataPoint {
  time: string;
  efficiency: number;
  saturation: number;
}
