export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Skin {
  id: string;
  name: string;
  rarity: Rarity;
  colors: [string, string];
  glowColor: string;
  price?: number;
}

export interface PlayerStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
}

export interface AvatarConfig {
  eyeStyle: number;   // 0-3
  mouthStyle: number; // 0-3
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
  { id: 'classic_red',  name: 'Classic Red',  rarity: 'common',    colors: ['#C0392B', '#8B1A1A'], glowColor: '#C0392B' },
  { id: 'classic_teal', name: 'Classic Teal', rarity: 'common',    colors: ['#2C4A6B', '#1A3050'], glowColor: '#2C4A6B' },
  { id: 'neon',         name: 'Neon',         rarity: 'rare',      colors: ['#27AE60', '#1E8449'], glowColor: '#27AE60', price: 100 },
  { id: 'fire',         name: 'Fire',         rarity: 'rare',      colors: ['#E67E22', '#A04000'], glowColor: '#E67E22', price: 150 },
  { id: 'ice',          name: 'Ice',          rarity: 'epic',      colors: ['#2980B9', '#1A5276'], glowColor: '#2980B9', price: 200 },
  { id: 'galaxy',       name: 'Galaxy',       rarity: 'epic',      colors: ['#8E44AD', '#5B2C6F'], glowColor: '#8E44AD', price: 300 },
  { id: 'gold',         name: 'Gold',         rarity: 'legendary', colors: ['#C9A84C', '#9A7D0A'], glowColor: '#C9A84C', price: 500 },
];

export function createDefaultProfile(id: 'p1' | 'p2'): PlayerProfile {
  return {
    id,
    name: id === 'p1' ? 'Player 1' : 'Player 2',
    avatar: { eyeStyle: 0, mouthStyle: 0 },
    activeSkinId: id === 'p1' ? 'classic_red' : 'classic_teal',
    unlockedSkinIds: id === 'p1' ? ['classic_red'] : ['classic_teal'],
    stats: { gamesPlayed: 0, wins: 0, losses: 0, draws: 0 },
    coins: 50,
  };
}

export function getSkin(skinId: string): Skin {
  return SKINS_CATALOG.find(s => s.id === skinId) ?? SKINS_CATALOG[0];
}
