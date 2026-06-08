export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Skin {
  id: string;
  name: string;
  rarity: Rarity;
  colors: [string, string];
  glowColor: string;
  price?: number;
}

export interface AvatarConfig {
  skinColor: string;
  eyeStyle: number;
  mouthStyle: number;
  hairStyle: number;
  hairColor: string;
}

export interface PlayerStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
}

export interface PlayerProfile {
  id: 'p1' | 'p2';
  name: string;
  avatar: AvatarConfig;
  activeSkinId: string;
  unlockedSkinIds: string[];
  stats: PlayerStats;
  coins: number;
}

export const RARITY_COLORS: Record<Rarity, string> = {
  common: '#8899AA',
  rare: '#4ECDC4',
  epic: '#9B59B6',
  legendary: '#FFD700',
};

export const SKINS_CATALOG: Skin[] = [
  { id: 'classic_red',  name: 'Classic Red',  rarity: 'common',    colors: ['#FF5757', '#CC3030'], glowColor: '#FF5757' },
  { id: 'classic_teal', name: 'Classic Teal', rarity: 'common',    colors: ['#00E5CC', '#009988'], glowColor: '#00E5CC' },
  { id: 'neon',         name: 'Neon',         rarity: 'rare',      colors: ['#00FF88', '#00CC66'], glowColor: '#00FF88', price: 100 },
  { id: 'fire',         name: 'Fire',         rarity: 'rare',      colors: ['#FF8C00', '#CC3300'], glowColor: '#FF8C00', price: 150 },
  { id: 'ice',          name: 'Ice',          rarity: 'epic',      colors: ['#80DFFF', '#0099CC'], glowColor: '#80DFFF', price: 200 },
  { id: 'galaxy',       name: 'Galaxy',       rarity: 'epic',      colors: ['#BF7FE0', '#6C3483'], glowColor: '#BF7FE0', price: 300 },
  { id: 'gold',         name: 'Gold',         rarity: 'legendary', colors: ['#FFD700', '#CC9900'], glowColor: '#FFD700', price: 500 },
];

const DEFAULT_AVATAR: AvatarConfig = {
  skinColor: '#FFCC99',
  eyeStyle: 0,
  mouthStyle: 0,
  hairStyle: 0,
  hairColor: '#333333',
};

export function createDefaultProfile(id: 'p1' | 'p2'): PlayerProfile {
  return {
    id,
    name: id === 'p1' ? 'Player 1' : 'Player 2',
    avatar: DEFAULT_AVATAR,
    activeSkinId: id === 'p1' ? 'classic_red' : 'classic_teal',
    unlockedSkinIds: id === 'p1' ? ['classic_red'] : ['classic_teal'],
    stats: { gamesPlayed: 0, wins: 0, losses: 0, draws: 0 },
    coins: 50,
  };
}

export function getSkin(skinId: string): Skin {
  return SKINS_CATALOG.find(s => s.id === skinId) ?? SKINS_CATALOG[0];
}
