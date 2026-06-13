# Claude Code prompt — paste this into Claude Code at the root of the SixBySix repo

> Tip: drop the whole `design_handoff_drift_redesign/` folder into the repo first (e.g. at the repo root or `/docs`), commit it, then paste the prompt below. Claude Code can open `DRIFT Mockups.html` in context and read the README for exact tokens.

---

You are working in my Expo / React Native game **SixBySix** (a 5×5 sliding tic-tac-toe). I want to **completely re-skin it** into a bright, polished "candy game" art direction — think *Cookie Jam* — using the design references in `design_handoff_drift_redesign/`. This is a **visual redesign only: do not change any game rules, logic, navigation, or store APIs.**

**Before writing code:**
1. Read `design_handoff_drift_redesign/README.md` end-to-end — it has every color, gradient, radius, font, layout, and motion spec.
2. Open `design_handoff_drift_redesign/DRIFT Mockups.html` to see the 4 target screens (Home, Game, Win, Profile) and their animations.
3. Skim the current code: `App.tsx`, `src/theme/colors.ts`, `src/screens/*`, `src/components/{Cell,GameBoard,AvatarFace,AvatarBadge}.tsx`, `src/store/*`, `src/game/gameLogic.ts`. Match the existing patterns (StyleSheet, Animated, expo-linear-gradient, zustand, react-navigation).

**The world / art direction:**
- Every screen sits on a shared animated **SkyScene**: vertical sky gradient (`#2FA8EC → #6CC8F5 → #B6E6FA → #FFE9C4`), a sun with rotating rays in the top-left, drifting clouds, 3 birds flying across with flapping wings, a bobbing hot-air balloon (omit on the Game screen), a rainbow behind the hills, and layered rolling hills with trees (pink fruit), swaying flowers, glowing crystals, bushes, and big corner leaves. Build these with `react-native-svg` + `Animated` (loops, `useNativeDriver` where possible).
- Game pieces are **glossy gems with the existing avatar faces**: radial light→mid→deep gradient, dark outline stroke, white gloss highlight, inner + drop shadows. Player 1 = red, Player 2 = blue (palettes in the README).
- Buttons are **tactile 3D "juicy" buttons** (solid bottom edge that compresses on press). Cards/capsules are cream with white borders + soft plum 3D shadow. Headings use **Lilita One**, UI uses **Baloo 2** (`@expo-google-fonts/lilita-one`, `@expo-google-fonts/baloo-2`) — replace Orbitron.

**Implement in this order, pausing after each so I can run it on device:**
1. **Tokens + fonts:** rewrite `src/theme/colors.ts` with the Gem-World tokens (keep the export shape; add gem palettes + button + gradient tokens). Swap fonts in `App.tsx`.
2. **Shared primitives:** a `SkyScene` background component and reusable `Gem`, `JuicyButton`, `Ribbon`, `Coin/CoinChip`, `SectionTag`, `Capsule` components under `src/components/`.
3. **Board & pieces:** restyle `Cell.tsx` (socket cells) and the `Gem` piece, keeping the `pieceColors`/`pieceAvatar` props and the ghost-removal effect. Restyle the **expiring piece** as a dimmed, wobbling gem with a dashed spinning/blinking ring (replaces the amber ring). Keep `BOARD_SIZE`-driven grid.
4. **HomeScreen:** logo, ribbon subtitle, player capsules + VS badge, two juicy play buttons (wire to existing `setGameMode` + navigation), "How to play" pill.
5. **GameScreen:** turn banner (current player's color, pulsing), two HUD cards with 5-dot piece slots (active highlighted), centered board, hint pill.
6. **Win state:** ray burst, confetti, popping stars, gold "X WINS!" ribbon, giant bouncing winning gem, coin-reward chip, Play Again / Home buttons. Trigger from existing win detection.
7. **ProfileScreen:** header with coin chip, bobbing hero gem + editable name, stats capsules, AVATAR picker (eyes/mouths → existing `AvatarConfig`), GEM SHOP skin cards with rarity chips + equip/price states (→ existing skins/`getSkin`).

**Constraints:**
- Keep all existing store APIs, `gameLogic.ts`, and navigation params (`Profile` takes `{ playerSlot }`) intact.
- No new game features, no rule changes, no copy changes beyond what the mockups show.
- Keep it performant on device — lightweight idle animation loops, `useNativeDriver: true` where possible.
- After each step, give me a one-line summary + anything you couldn't translate 1:1 from the HTML (e.g. CSS effects with no RN equivalent) and how you approximated it.

Start with step 1.
