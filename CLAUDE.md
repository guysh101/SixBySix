@AGENTS.md

# SixBySix — 6x6 Sliding Tic-Tac-Toe

## פרויקט
משחק מובייל ל-Android/iOS — גרסת Tic-Tac-Toe על לוח 6x6 עם מכניזם sliding window.

## Stack
- **Expo 56.0.3** + React Native 0.85.3 + React 19
- **TypeScript 6** — strict mode, zero any/ts-ignore
- **React Navigation v7** — native stack
- **Zustand v5** — game state
- **expo-haptics** — haptic feedback (מחובר)
- **expo-linear-gradient** — מותקן, טרם בשימוש

## מבנה תיקיות
```
src/
  game/
    gameLogic.ts    — לוגיקת המשחק הטהורה (applyMove, wouldWin, getExpiringPiece)
    aiPlayer.ts     — AI opponent (wouldWin-based win/block + center bias)
  store/
    gameStore.ts    — Zustand store (gameState, gameMode, makeMove, resetGame)
  components/
    Cell.tsx        — תא בודד + PLAYER_COLORS export + React.memo
    GameBoard.tsx   — לוח 6x6, expiry רק לשחקן הנוכחי
  screens/
    HomeScreen.tsx  — בחירת מצב משחק
    GameScreen.tsx  — מסך משחק + AI + haptics
App.tsx             — NavigationContainer + Stack
```

## כללי מפתח
- **PLAYER_COLORS** מוגדר פעם אחת ב-`Cell.tsx` ומיובא משם לכל מקום
- **wouldWin()** חייב לקבל `moveHistory` — מסמלז sliding window לפני בדיקת ניצחון
- **getExpiringPiece()** מחזירה רק לשחקן הנוכחי בRendering
- **Haptics** — `Haptics.impactAsync(Light)` על כל הנחת כלי ב-`handleCellPress`
- אין circular imports: screens → components → game logic

## Build
```bash
# TypeScript check
npx tsc --noEmit

# Expo dev server
npx expo start

# Android release APK (ידני)
cd android && ANDROID_HOME=~/Library/Android/sdk JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew assembleRelease
# APK: android/app/build/outputs/apk/release/app-release.apk
```

## פרמטרי המשחק
| קבוע | ערך | משמעות |
|------|-----|---------|
| `BOARD_SIZE` | 6 | 6x6 לוח |
| `MAX_PIECES_PER_PLAYER` | 6 | כלים מקסימום |
| `WIN_LENGTH` | 5 | 5 ברצף לניצחון |
| `MAX_TURNS_BEFORE_DRAW` | 100 | תורות לתיקו |
