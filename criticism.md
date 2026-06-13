# ביקורת מוצר מקיפה — DRIFT (SixBySix)
## מנקודת מבט מבקר משחקים מקצועי בפאזל-קז'ואל

## ציון כללי: 6.5 / 10

פרוטוטיפ מבטיח עם art direction ברמת שוק ומכניקה מרכזית מעניינת, אבל חסרות שכבות קריטיות שמפרידות בין דמו טכני למוצר שמחזיק שחקנים.

---

## 1. חווית משתמש (UX) — 5/10

### מה עובד
- **HUD cards עם slot dots** — פתרון ויזואלי חכם. השחקן רואה כמה כלים יש לו על הלוח בלי לספור. הנקודה המהבהבת של ה-expiring piece נותנת forewarning ויזואלי.
- **Turn pill** עם שם השחקן + פולס עדין (scale 1.0→1.06) מבהיר את התור.
- **Ghost piece fade-out** (300ms opacity + scale shrink) כשכלי נמחק — feedback מינימלי אבל קיים.
- **Expiring gem** עם wobble + spinning dashed ring + blink — מבדיל בבירור בין כלי רגיל לכלי שעומד להיעלם.

### מה לא עובד
- **"How to play" הוא כפתור מת.** ב-`HomeScreen.tsx` שורות 181-187 — זה `View` פשוט, לא `TouchableOpacity`, אין `onPress`, ואין מסך הסבר. שחקן חדש שלוחץ — לא קורה כלום. מכניקת sliding window לא אינטואיטיבית. בלי הסבר, שחקן חדש יניח 5 כלים, יראה שהשישי מוחק את הראשון, ולא יבין למה.
- **אין שום הסבר על המכניקה בשום מקום באפליקציה.** אין tooltip, אין tutorial, אין first-time popup. ההודעה "Marked piece slides off next move" מופיעה רק כשכבר יש 5 כלים על הלוח, וגם אז היא pill קטן בתחתית עם פונט 11px.
- **Win overlay מציג "+25 coins earned" hardcoded** (`GameScreen.tsx:287`) אבל `coinReward` ב-`profileStore.ts:16-19` מחזירה: Draw=5, Winner vs-ai=15, Winner pass-and-play=25, Loser=10. ב-VS AI השחקן רואה "+25" אבל מקבל 15.
- **ב-Draw ה-coin chip מוסתר** — condition `!isDraw` בשורה 284 מסתירה אותו. שחקן בדרו לא יודע שקיבל 5 coins.
- **אין אישור על reset.** כפתור ↺ קורא `resetGame` ישירות. לחיצה בטעות מוחקת הכל.
- **אין build-up לרגע הניצחון.** Win overlay מופיע מיידית — אין dramatic pause, אין stagger, אין סאונד.

### Quick wins
1. הפוך "How to play" ל-`TouchableOpacity` עם modal שמסביר 3 כללים
2. תקן "+25" ל-dynamic value לפי `coinReward`
3. הוסף confirmation dialog ל-reset

---

## 2. מכניקת משחק — 7/10

### מה עובד
- **Sliding window — הרעיון הטוב ביותר במשחק.** הופך tic-tac-toe ממשחק solved למשחק אסטרטגי דינמי. כל מהלך הוא decision point כפול.
- **הלוגיקה ב-`gameLogic.ts` מוצקה.** `wouldWin()` (שורות 78-92) מתחשב ב-sliding window לפני בדיקת ניצחון.
- **`findWinningLine` עובד נכון** — 4 כיוונים, אוסף רצף לשני הצדדים.
- **`applyMove`** — clean ו-immutable, מחזיר state חדש.

### מה מדאיג
- **4 ברצף על לוח 5×5 עם 5 כלים — המתמטיקה צפופה.** צריך 80% מהכלים בקו אחד. ניצחון דורש שהיריב לא יחסום — defense-first ו-frustrating.
- **Draw threshold של 60 תורות נדיב מדי** (`MAX_TURNS_BEFORE_DRAW = 60`). Steady state מגיע בתור 10-12. מ-12 עד 60 זה 48 תורות cycling חסר תכלית. שחקני casual ינטשו אחרי 90 שניות.
- **אין וריאציות.** מצב יחיד, board size יחיד, win length יחיד.

### Quick wins
1. הורד `MAX_TURNS_BEFORE_DRAW` ל-30 (או 24)
2. שקול `WIN_LENGTH = 3` כמצב "Quick Game"

---

## 3. AI — 4/10

ה-AI ב-`aiPlayer.ts` (30 שורות):
1. אם אפשר לנצח — נצח (שורות 12-14)
2. אם השחקן עומד לנצח — חסום (שורות 16-19)
3. אחרת — תא אקראי ממרכז הלוח (שורות 22-29)

### בעיות
- **אין look-ahead.** לא בונה fork (שני איומים מקבילים).
- **אין מודעות ל-sliding window של עצמו.** לא בודק איזה כלי שלו עומד להיעלם.
- **אין מודעות ל-expiring piece של היריב.** לא מנצל הזדמנויות.
- **Center bias חסר משמעות.** `r >= 1 && r <= 4` על 5×5 = 16 מתוך 25 תאים. ה-center האמיתי הוא (2,2).
- **Delay קבוע 500ms** מרגיש מלאכותי.

**שחקן בינוני מנצח כמעט כל פעם אחרי 3-4 משחקים.**

### Quick wins
1. הוסף double-threat detection
2. Variability ל-delay: `300 + Math.random() * 600`ms
3. תעדוף תא (2,2) ממש

### עבודה גדולה
- Minimax עם alpha-beta pruning ל-depth 3-4

---

## 4. Progression & Retention — 4/10

### מה קיים
- מטבעות (50 התחלתיים, 5-25 per game)
- 7 סקינים ב-4 rarities (100-500 coins)
- Avatar: 4 eyes × 4 mouths = 16 שילובים
- סטטיסטיקות עם persistence (AsyncStorage)

### מה חסר
- **אין meta-game** — אין levels, achievements, daily challenges, leaderboard
- **אחרי ~50 משחקים** אפשר לקנות את כל הסקינים (1,250 coins סה"כ) — ואז אין מטרה
- **אין streak / daily reward** — אין סיבה לחזור מחר
- **מטבעות חסרי משמעות** מעבר לקוסמטיקה — אין power-ups, boosters, unlockable modes
- **אין social layer** — אין share, online challenge, spectate

### Quick wins
1. הוסף 10-15 achievements עם coin rewards
2. Win streak counter שמכפיל coins
3. Stat נוסף: "fastest win"

---

## 5. עיצוב ויזואלי — 8/10

### מה מצוין
- **SkyScene** (408 שורות) — שמש עם ray rotation, 3 עננים אסינכרוניים, 3 ציפורים, קשת, בלון, sparkles, גבעות בשכבות עם עצים/קריסטלים/פרחים. SVG native ואנימטיבי.
- **Gem component** — radial gradient + gloss + inner shadow = 3D משכנע. AvatarFace נותן personality.
- **JuicyButton** — LinearGradient, gloss, 3D depth, press animation. Premium casual.
- **Board 3D effect** — base layer + gradient surface + inner highlight.
- **Typography** — LilitaOne (display) + Baloo2 (UI). שילוב מושלם לז'אנר.
- **Ribbon + Capsule** — רכיבים מלוטשים עם 3D depth.

### מה חלש
- **אפס סאונד.** אין dependency על expo-av. כל האנימציות בשקט מוחלט. הסאונד הוא ה-dopamine delivery mechanism העיקרי בקז'ואל.
- **Confetti פשוט מדי** — 12 מלבנים בקו ישר, בלי varied shapes או physics.
- **Placement animation** (200ms, scale 0.3→1.3→1.0) — קצרה, בלי particle burst או ripple.
- **Win overlay חסר stagger timing** — הכל מופיע בו-זמנית.

### Quick wins
1. הוסף expo-av עם 4 sfx: place, win, remove, button-tap
2. הארך placement animation ל-350ms
3. הוסף particle burst סביב gem בהנחה

---

## 6. באגים

| # | באג | חומרה | מיקום |
|---|-----|--------|-------|
| 1 | "+25 coins" hardcoded — מציג 25 תמיד | גבוהה | `GameScreen.tsx:287` vs `profileStore.ts:16-19` |
| 2 | "How to play" = View בלי onPress | גבוהה | `HomeScreen.tsx:182-187` |
| 3 | ב-Draw ה-coin chip מוסתר | בינונית | `GameScreen.tsx:284` |
| 4 | Win overlay animations בלי cleanup | בינונית | `GameScreen.tsx:206-226` |
| 5 | אין haptic על AI move | נמוכה | `GameScreen.tsx:393` |
| 6 | שם "SixBySix" על לוח 5×5 | נמוכה | CLAUDE.md vs gameLogic.ts:20 |

---

## 7. סיכום

| קטגוריה | ציון |
|----------|------|
| First-time UX | 4/10 |
| Core Mechanics | 7/10 |
| AI Quality | 4/10 |
| Visual Design | 8/10 |
| Sound & Juice | 2/10 |
| Progression | 4/10 |
| Retention hooks | 2/10 |
| Polish & Bugs | 5/10 |
| **Overall** | **6.5/10** |

---

## סדרי עדיפויות

### Quick Wins (יום עבודה)
1. תקן "How to play" — modal עם 3 שלבים
2. תקן coin display — ערך דינמי
3. הורד draw threshold ל-30
4. הוסף 4 sound effects (expo-av)
5. הוסף confirmation ל-reset

### Medium Efforts (שבוע)
1. AI difficulty levels (Easy/Medium/Hard)
2. Achievement system (10-15 achievements)
3. Tutorial flow מונפש

### Big Bets (חודש+)
1. Online multiplayer
2. Daily challenges + ranked mode

---

**שורה תחתונה:** ה-art direction ברמת שוק, ה-sliding window הוא twist לגיטימי, והקוד נקי. אבל בלי tutorial, סאונד, AI מאתגר, ו-progression — המשחק לא יחזיק שחקנים מעבר ל-5 דקות. תתחיל מ-5 ה-quick wins ויש לך משחק שאפשר לשחרר לבטא.
