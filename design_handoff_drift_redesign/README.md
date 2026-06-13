# Handoff: DRIFT — "Gem World" Visual Redesign

## Overview
This package re-skins the existing **5x5 / SixBySix** sliding tic-tac-toe app (Expo / React Native) into a polished, candy-game art direction in the spirit of *Cookie Jam*. The game **logic, rules, navigation and state stay exactly as they are** — this is a **visual redesign only**. Every screen gets a bright "floating gem islands in the sky" world: animated sky, sun, clouds, birds, balloon, rainbow, rolling hills with trees/flowers/crystals, and glossy gem game-pieces that keep the existing avatar faces.

## About the Design Files
The files in this bundle are **design references created in HTML/React-DOM** — prototypes showing the intended look, color, and motion. They are **not** production code to copy line-for-line. Your job is to **recreate these designs in the existing React Native + Expo codebase**, using its established patterns: `StyleSheet`, `Animated`, `expo-linear-gradient`, `react-native-svg`, the existing `zustand` stores, and `@react-navigation/native-stack`. Where the HTML uses CSS gradients/box-shadows/SVG, translate them to the RN equivalents (see "RN Translation Notes" below).

## Fidelity
**High-fidelity (hifi).** Colors, gradients, radii, typography, and motion are final. Recreate pixel-faithfully. The reference frames are designed at **390 × 844** (logical points — iPhone 12/13/14 class). Use flex layouts so it scales to other devices.

## Files in this bundle
- `DRIFT Mockups.html` — open in any browser to see all 4 screens live (pan/zoom canvas; click a screen for fullscreen).
- `drift-theme.css` — all the visual tokens: gem gloss, juicy buttons, ribbons, board, HUD, panels, keyframes.
- `drift-shared.jsx` — the reusable pieces: `Gem`, `Face`, `SkyScene` (sun/clouds/birds/balloon/rainbow/hills/flowers/crystals/leaves), `JuicyButton`, `Ribbon`-styling, `Coin`, `SlotRow`, `VsBadge`, `Logo`, `StarTrio`, `Confetti`.
- `drift-home-game.jsx` — Home + Game screen mocks.
- `drift-win-profile.jsx` — Win + Profile screen mocks.
- `design-canvas.jsx` — only the presentation harness; ignore for implementation.

---

## Design Tokens

### Core palette
| Token | Hex | Use |
|---|---|---|
| `ink` | `#4A2C6E` | primary text (deep plum) |
| `ink-soft` | `#8468AC` | secondary text |
| `cream` | `#FFF8EC` | warm panel base |
| `panel` | `#FFFDF6` | card top |
| `gold` | `#FFC93C` | coins, stars, highlights |
| `gold-deep` | `#E8960C` | gold shadow / depth |
| `plum-shadow` | `rgba(58,28,99,0.30)` | soft drop shadow color |

### Sky gradient (vertical, top→bottom)
`#2FA8EC 0%` → `#6CC8F5 38%` → `#B6E6FA 66%` → `#FFE9C4 100%`

### Player / gem palettes
Each gem is a radial gradient `light → mid → deep` with a darker `outline` stroke. **Player 1 = red (Cherry/Sapphire pair), Player 2 = blue.**
| Theme | light | mid | deep | outline |
|---|---|---|---|---|
| **red** (P1) | `#FFB5A6` | `#FF6253` | `#D92632` | `#A8131F` |
| **blue** (P2) | `#A9D5FF` | `#4F9CF7` | `#1D63C8` | `#0E4694` |
| green | `#C9F2A4` | `#7ED957` | `#3FA72A` | `#2C7F1D` |
| fire | `#FFDCA3` | `#FF9A3C` | `#E05E12` | `#B34607` |
| ice | `#E2F8FF` | `#6FD3F2` | `#2391C9` | `#156F9E` |
| galaxy | `#E3C4FF` | `#A86CE8` | `#6E35B0` | `#4F2384` |
| gold | `#FFF3B2` | `#FFD24A` | `#E8960C` | `#B86F05` |

Gem gradient: `radial-gradient(circle at 33% 27%, light 0%, mid 46%, deep 100%)`, border = `outline` at ~6% of size, plus inner shadows (dark bottom, white top highlight) and a soft outer drop shadow. A white gloss ellipse sits top-left (~30%×16% at 12%,7%).

### Juicy button gradients (top→bottom + 3D "deep" base + press)
The button has a solid bottom edge (`box-shadow: 0 6px 0 deep`) that compresses to `0 2px 0` on `:active` with a `translateY(4px)`.
| Variant | hi | lo | deep |
|---|---|---|---|
| pink | `#FF7DAE` | `#F23E7C` | `#B81E55` |
| blue | `#5FB2F7` | `#2470DB` | `#134B9E` |
| green | `#8BE25E` | `#4CB52E` | `#2F851A` |
| gold | `#FFD955` | `#FFA31A` | `#C26E05` |
| ghost | translucent white fill + `inset 0 0 0 2.5px rgba(255,255,255,0.65)` |

Button label: Baloo 2, 800 weight, 20px, white, `text-shadow: 0 2px 0 rgba(0,0,0,0.28)`. Optional sub-label 12.5px below.

### Game board
- Panel: `linear-gradient(180deg, #4B2F8C, #38216B)`, border `3px #7551C2`, radius `26px`, 3D base `0 10px 0 #271253` + drop shadow + inner top highlight.
- Cells: `58×58`, radius `15px`, `linear-gradient(180deg,#2A1755,#382371)`, **inset** shadow so each cell looks like a socket. Grid gap `7px`. (Render an N×N grid where N = the existing `BOARD_SIZE` constant — the mock shows 5×5.)
- Gems on board render at `46px`.

### Typography
- **Display / logo / numbers / ribbons:** `Lilita One` (Google Font). Replaces the current `Orbitron_900Black`.
- **UI / body / buttons / labels:** `Baloo 2` (weights 500–800). Replaces `Orbitron_400Regular`.
- Expo packages: `@expo-google-fonts/lilita-one`, `@expo-google-fonts/baloo-2`.

### Radii & shadows
- Cards/capsules: radius 18–22px, white 2.5–3px border, 3D base shadow `0 4–6px 0 rgba(127,86,178,0.25–0.35)` + soft `0 8–22px` plum drop.
- Round icon buttons: 42px circle, cream gradient, gold-tinted 3D base, press = translateY(3px).

---

## Screens / Views

### 1 · Home (`HomeScreen`)
**Purpose:** entry point — pick game mode, see the two players.
**Layout (top→bottom, centered, 26px side padding):**
1. `Logo` "DRIFT" (~306px wide) — Lilita One, plum outline + pink-white gradient fill + purple stroke, gentle tilt/bob, sparkles. Top margin ~86px.
2. Ribbon sub-title "SLIDING TIC·TAC·TOE" (pink ribbon, 14px, letter-spacing 2.5).
3. Player row: **PlayerCapsule** (gem + name + "EDIT ✎" pill) — `VS` star-badge — **PlayerCapsule**. Tapping a capsule → `Profile` with `{ playerSlot }`.
4. `JuicyButton` pink "PLAY WITH A FRIEND" / sub "same device" → sets `gameMode: 'pass-and-play'`, navigates `Game`.
5. `JuicyButton` blue "PLAY VS ROBOT" / sub "challenge the AI" → `gameMode: 'vs-ai'`, navigates `Game`.
6. Bottom: translucent "How to play" pill with a `?` chip.
Behind everything: full `SkyScene` + a few decorative floating gems (gold/galaxy/green) bobbing.

### 2 · Game (`GameScreen`)
**Purpose:** play the match.
**Layout:**
- Top bar: round back button `‹` · centered **turn banner** (rounded pill in the *current* player's color, gem + "MAYA'S TURN" in Lilita One, gently pulsing) · round reset button `↺`.
- Player **HUD** row: two `HudCard`s (gem + name + `SlotRow` of 5 dots showing pieces in play). The **active** player's card gets a colored ring + full opacity; the other is dimmed to ~0.82.
- **Board** centered (the floating purple panel described above).
- Hint pill at the bottom: a small wobbling dim gem + "Wobbling gem disappears on your next move".
- This screen uses `balloon={false}` and shorter hills so the board has room.
**Key mechanic visual:** the piece that will be removed next (existing `getExpiringPiece`) renders **dimmed (~0.62) + wobble animation + a dashed spinning/blinking ring** instead of the old amber ring.

### 3 · Win (overlay or end-state in `GameScreen`)
**Purpose:** celebrate the winner.
**Layout (centered, sky dimmed ~50%):**
- Rotating gold **ray burst** behind center + falling **confetti**.
- `StarTrio` (3 popping stars) at top (~110px).
- Gold **ribbon** "MAYA WINS!" (Lilita One, 32px).
- Giant winning **gem** (150px) with a big squash-&-stretch bounce + soft ground shadow.
- Coin reward chip: coin + "+25" + "coins earned".
- Bottom buttons: gold `JuicyButton` "PLAY AGAIN" (→ `resetGame`), ghost `JuicyButton` "HOME".

### 4 · Profile (`ProfileScreen`)
**Purpose:** edit avatar + buy/equip gem skins.
**Layout (20px side padding):**
- Header: back `‹` · "PROFILE" ribbon · `CoinChip` (coin + balance) on the right.
- Hero: large bobbing gem (98px) with the player's current skin/face + ground shadow, editable name (Lilita One 26px + ✎), and a skin badge pill.
- Stats row: 3 cream capsules — GAMES / WINS / WIN RATE (Lilita One value + tiny caps label).
- **AVATAR** section tag (purple pill) → two rows of `PickerTile`s: eye styles (DOTS/WIDE/COOL/WINK) and mouth styles (SMILE/SMIRK/OPEN/FROWN). Selected tile gets a gold border + green ✓ badge. Maps to existing `AvatarConfig`.
- **GEM SHOP** section tag → horizontal row of `SkinCard`s. Each: gem swatch, name, rarity chip (COMMON `#8A9BB0`, RARE `#2FBFB0`, EPIC `#9B59B6`, LEGENDARY `#E8A50C`), and state — EQUIPPED (gold border+✓) / OWNED / price chip with coin. Maps to existing `Skin` / `getSkin` / rarity data.

---

## Interactions & Behavior / Motion (the design is "maximum juice")
- **Sky/world (all screens, looping):** clouds drift horizontally (16/21/26s), sun rays rotate (42s), 3 birds fly left→right with flapping wings (17/24/21s) + vertical bob, balloon bobs (4.8s), flowers & corner leaves sway (3.6–6s).
- **Sparkles:** twinkle scale+rotate (2.6s) at several fixed spots.
- **Turn banner:** subtle `pulseSoft` scale (1.6s).
- **Gem placement (recommended):** squash & stretch drop (`Animated.spring` on scale, overshoot).
- **Expiring piece:** `gemWobble` rotate ±5° (0.7s) + dashed ring spin (7s) + blink (0.9s).
- **Win:** ray-burst spin, confetti fall (2.8–3.4s staggered), winning gem `bounceBig` (1.5s loop), stars `starPop` (spring) staggered.
- **Buttons:** press = translateY down + shadow collapse (tactile 3D).
- Respect `prefers-reduced-motion` on web; on native, keep idle loops lightweight (`useNativeDriver: true`).

### RN Translation Notes
- **Gradients:** CSS `linear/radial-gradient` → `expo-linear-gradient` (`LinearGradient`); for the radial gem gloss use `react-native-svg` `<RadialGradient>` or a `LinearGradient` + overlaid white gloss `View`.
- **Outlines / multi-layer text (logo, ribbons):** use `react-native-svg` `<Text>` with `stroke` + `paintOrder`, or stacked `Text` layers.
- **`box-shadow: 0 6px 0 color` (the 3D button base):** RN has no spread-less hard shadow — emulate with a second `View` layer offset down behind the button, or a bottom border + container. Keep `:active` press via `Pressable` + `Animated` translateY.
- **`inset` shadows (cells):** layer a dark semi-transparent gradient/overlay inside the cell view.
- **Confetti / ray burst / clouds / birds / flowers:** build with `react-native-svg` shapes; animate via `Animated`/`react-native-reanimated`. (Optional: a Lottie file for confetti.)
- **`animation` keyframes:** convert to `Animated.loop(Animated.timing/spring)`.

## State Management (unchanged)
Keep the existing `zustand` stores and logic:
- `gameStore`: `gameState`, `gameMode ('pass-and-play' | 'vs-ai')`, `makeMove`, `resetGame`, `setGameMode`.
- `profileStore`: `p1`, `p2`, avatar config, `activeSkinId`, coins, owned skins, stats.
- `gameLogic.ts`: `BOARD_SIZE`, `MAX_PIECES_PER_PLAYER`, `getExpiringPiece`, `getPieceAges`, `applyMove`, win detection. **Do not change the rules.**
- Navigation: `Home / Game / Profile` native-stack (Profile takes `{ playerSlot }`).

## What changes vs. the current code
- `src/theme/colors.ts` → replace the brown/parchment palette with the Gem-World tokens above (keep the same export shape; add gem palette + button tokens).
- Fonts in `App.tsx` → swap Orbitron for Lilita One + Baloo 2.
- `Cell.tsx` / `GameBoard.tsx` → new socket cells + glossy `Gem` piece (keep `pieceAvatar`/`pieceColors` props and the ghost-removal effect; restyle the expiring state).
- `HomeScreen` / `GameScreen` / `ProfileScreen` → re-layout per the specs above; add a shared `SkyScene` background component.
- `AvatarFace.tsx` stays (faces are reused inside the gem); `AvatarBadge` becomes the glossy `Gem`.

## Assets
No external image assets — everything is drawn with gradients + SVG. Fonts come from Google Fonts via Expo packages. If you prefer, the confetti can be a Lottie JSON instead of hand-rolled SVG.
