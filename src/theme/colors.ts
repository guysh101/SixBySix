// Gem-World design tokens — DRIFT redesign

export const Colors = {
  // Legacy slots kept for backward compatibility
  BG: '#FFF8EC',
  BG_CARD: '#FFFDF6',
  BOARD_BG: '#3D2175',
  BOARD_BORDER: '#7551C2',
  CELL_BG: '#2A1755',
  CELL_BORDER: '#7551C2',
  P1_A: '#FF6253',
  P1_B: '#D92632',
  P2_A: '#4F9CF7',
  P2_B: '#1D63C8',
  TEXT_PRIMARY: '#4A2C6E',
  TEXT_SECONDARY: '#8468AC',
  TEXT_MUTED: '#8468AC',
  GOLD: '#FFC93C',
  AMBER: '#E8960C',
  BORDER_LIGHT: '#FFFFFF',
  BORDER_MEDIUM: '#E8D8FF',
} as const;

// Core palette
export const Palette = {
  ink: '#4A2C6E',
  inkSoft: '#8468AC',
  cream: '#FFF8EC',
  panel: '#FFFDF6',
  gold: '#FFC93C',
  goldDeep: '#E8960C',
  plumShadow: 'rgba(58,28,99,0.30)',
  white: '#FFFFFF',
} as const;

// Sky gradient stops (top → bottom)
export const SKY_GRADIENT: [string, string, string, string] = [
  '#2FA8EC',
  '#6CC8F5',
  '#B6E6FA',
  '#FFE9C4',
];

// Gem radial palettes: [light, mid, deep, outline]
export type GemPalette = { light: string; mid: string; deep: string; outline: string };

export const GEM_PALETTES = {
  red:    { light: '#FFB5A6', mid: '#FF6253', deep: '#D92632', outline: '#A8131F' },
  blue:   { light: '#A9D5FF', mid: '#4F9CF7', deep: '#1D63C8', outline: '#0E4694' },
  green:  { light: '#C9F2A4', mid: '#7ED957', deep: '#3FA72A', outline: '#2C7F1D' },
  fire:   { light: '#FFDCA3', mid: '#FF9A3C', deep: '#E05E12', outline: '#B34607' },
  ice:    { light: '#E2F8FF', mid: '#6FD3F2', deep: '#2391C9', outline: '#156F9E' },
  galaxy: { light: '#E3C4FF', mid: '#A86CE8', deep: '#6E35B0', outline: '#4F2384' },
  gold:   { light: '#FFF3B2', mid: '#FFD24A', deep: '#E8960C', outline: '#B86F05' },
} as const;

// Map player → gem palette
export const PLAYER_GEM: Record<'p1' | 'p2', GemPalette> = {
  p1: GEM_PALETTES.red,
  p2: GEM_PALETTES.blue,
};

// Juicy button variants: [hi, lo, deep]
export type ButtonVariant = 'pink' | 'blue' | 'green' | 'gold' | 'ghost';
export const BUTTON_COLORS: Record<ButtonVariant, { hi: string; lo: string; deep: string }> = {
  pink:  { hi: '#FF7DAE', lo: '#F23E7C', deep: '#B81E55' },
  blue:  { hi: '#5FB2F7', lo: '#2470DB', deep: '#134B9E' },
  green: { hi: '#8BE25E', lo: '#4CB52E', deep: '#2F851A' },
  gold:  { hi: '#FFD955', lo: '#FFA31A', deep: '#C26E05' },
  ghost: { hi: 'rgba(255,255,255,0.30)', lo: 'rgba(255,255,255,0.16)', deep: 'rgba(255,255,255,0.22)' },
} as const;

// Rarity chip colors (updated to match Gem-World)
export const RARITY_HEX = {
  common:    '#8A9BB0',
  rare:      '#2FBFB0',
  epic:      '#9B59B6',
  legendary: '#E8A50C',
} as const;

// Board
export const BOARD = {
  bg:          ['#4B2F8C', '#38216B'] as [string, string],
  border:      '#7551C2',
  base3d:      '#271253',
  cellBg:      ['#2A1755', '#382371'] as [string, string],
  radius:      26,
  cellRadius:  15,
  cellSize:    58,
  gemSize:     46,
  gap:         7,
  padding:     12,
} as const;

// HUD
export const HUD = {
  cardBg:      'rgba(255,255,255,0.82)',
  cardBorder:  '#FFFFFF',
  cardRadius:  18,
  slotEmpty:   'rgba(74,44,110,0.18)',
} as const;

// Map skin ID → gem palette
export function getSkinGemPalette(skinId: string): GemPalette {
  const map: Record<string, GemPalette> = {
    classic_red:  GEM_PALETTES.red,
    classic_teal: GEM_PALETTES.blue,
    neon:         GEM_PALETTES.green,
    fire:         GEM_PALETTES.fire,
    ice:          GEM_PALETTES.ice,
    galaxy:       GEM_PALETTES.galaxy,
    gold:         GEM_PALETTES.gold,
  };
  return map[skinId] ?? GEM_PALETTES.red;
}

// Fonts
export const Fonts = {
  display: 'LilitaOne_400Regular',
  ui:      'Baloo2_500Medium',
  uiBold:  'Baloo2_800ExtraBold',
} as const;
