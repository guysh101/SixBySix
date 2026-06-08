# PLAN.md — SixBySix Roadmap

## סטטוס נוכחי: Phase 1 MVP ✅ + Phase 2 בתהליך

---

## Phase 1 — MVP ✅ הושלם

- [x] לוח 6x6 עם UI
- [x] לוגיקת sliding window (MAX 6 כלים, ה-7 מוחק את הישן)
- [x] בדיקת ניצחון (5 ברצף — אנכי/אופקי/אלכסוני)
- [x] Pass-and-play (2 שחקנים על אותו מכשיר)
- [x] AI בסיסי (win → block → center bias)
- [x] Draw detection (אחרי 100 תורות)
- [x] Expiry indicator (טבעת זהובה רק לשחקן הנוכחי)
- [x] Piece age opacity (כלי ישן = שקוף יותר)
- [x] Haptic feedback על הנחת כלי
- [x] Release APK נבנה ועובד

## Phase 2 — Polish 🔄 בתהליך

### אנימציות (עדיפות גבוהה)
- [ ] **Piece placement animation** — `Animated.spring` scale 0→1 כשכלי מונח
- [ ] **Piece removal animation** — fade-out/shrink לפני שהכלי נמחק
  - דורש two-phase render: אנימציה → עדכון state
- [ ] **Win celebration** — scale-bounce על status box + confetti או flash
- [ ] **Winning line highlight** — החזר `winningCells: number[]` מ-`checkWinner`, הצג glow ב-Cell

### UX
- [ ] **Responsive cell size** — `(screenWidth - 64) / 6 - 4` במקום hardcoded 52px
- [ ] **Score tracking** — `{ p1: number, p2: number, draws: number }` בstore
- [ ] **Turn counter** — הצג "תור X/100" ב-GameScreen (warning אחרי תור 80)
- [ ] **How to play modal** — זמין מHomeScreen וGameScreen

## Phase 3 — Customization 📋 מתוכנן

### Avatar Builder
- [ ] Base shape (circle/square/star/5 אפשרויות)
- [ ] Color picker
- [ ] Accessories (20+ — crown, glasses, ...)
- [ ] Trail effects (fire, sparkle, ...)
- [ ] שמירה ב-AsyncStorage

### Skin Unlocks (Progression)
- [ ] 10 ניצחונות → accessory חדש
- [ ] 25 ניצחונות → trail effect
- [ ] Battle Pass שבועי (3 skins בלעדיים)

## Phase 4 — Online Multiplayer 📋 מתוכנן

- [ ] Firebase auth
- [ ] Realtime 1v1 matchmaking
- [ ] Optimistic UI + conflict resolution
- [ ] Leaderboard

## Phase 5 — Monetization 📋 מתוכנן

| מסלול | מנגנון |
|-------|--------|
| Free base | פרסומות בין משחקים |
| Skin packs | $1.99-$4.99 |
| Battle Pass | $3.99/שבוע |
| Remove Ads | $2.99 one-time |

---

## בעיות ידועות / חוב טכני

| בעיה | פרטים | עדיפות |
|------|--------|--------|
| AI חלש | אין lookahead, רק win/block + random | גבוהה |
| אין persistence | game state נאבד כשהאפליקציה נסגרת | בינונית |
| 52px hardcoded | overflow על iPhone SE (320pt) | גבוהה |
| אין sound | expo-av לא מותקן | נמוכה |
| אין landscape support | layout שבור בlandscape | נמוכה |
| RTL arrow | "← בית" מבלבל ב-RTL context | נמוכה |

---

## החלטות design שהתקבלו

| נושא | החלטה | נימוק |
|------|--------|-------|
| WIN_LENGTH | 5 ברצף | playtesting נדרש — אולי לשנות ל-4 |
| MAX_PIECES | 6 | בדיקה בpractice נדרשת |
| Draw threshold | 100 תורות | שמרני, ניתן להוריד ל-60 |
| Expiry indicator | רק לשחקן הנוכחי | UX decision — מונע בלבול |
| AI player | תמיד p2 | hardcoded, ניתן להגדיר |
| Colors | p1=#FF6B6B, p2=#4ECDC4 | single source ב-Cell.tsx |
