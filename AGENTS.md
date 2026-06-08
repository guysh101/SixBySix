# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

---

# Agent Guidelines — SixBySix

## לפני כתיבת קוד
1. קרא `CLAUDE.md` להבנת ה-stack והמבנה
2. קרא `PLAN.md` לראות מה מתוכנן ומה כבר נבנה
3. הרץ `npx tsc --noEmit` לפני ואחרי שינויים

## כללים קריטיים
- **אל תגדיר `PLAYER_COLORS` מחדש** — יבוא תמיד מ-`src/components/Cell.tsx`
- **`wouldWin()` חייב לקבל `moveHistory`** — בלי זה ה-AI מקבל false positives
- **אל תוסיף fields לZustand store** בלי לנקות dead code — `aiPlayer` כבר הוסר
- **React.memo על Cell** — אל תסיר, יש 36 instances
- **Haptics** — כל `makeMove` דרך ה-UI צריך `Haptics.impactAsync(Light)` לפניו
- **TypeScript strict** — אין `any`, אין `as unknown`, אין `@ts-ignore`

## Build ידני ל-Android
```bash
# חייב Java 21 מ-Android Studio (לא Java 26 של המערכת)
cd android && ANDROID_HOME=~/Library/Android/sdk JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew assembleRelease
```

## טעויות נפוצות לא לחזור עליהן
- ❌ `const blockState = { ...state, currentTurn: 'p1' }` ואז `applyMove` — משחית moveHistory
- ❌ `Animated.loop(...).start()` בלי cleanup `return () => anim.stop()`
- ❌ `gameState` כ-dependency ב-AI useEffect — משתמשים ב-`gameStateRef`
- ❌ `pieceAge ? ...` במקום `pieceAge !== null ? ...` — ageage=0 יהיה falsy
- ❌ הגדרת `RootStackParamList` בתוך קובץ screen — מוגדר ב-`App.tsx`
