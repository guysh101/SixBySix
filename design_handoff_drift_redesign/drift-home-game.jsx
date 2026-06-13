// DRIFT mockups — Home & Game screens
const { SkyScene, Gem, JuicyButton, VsBadge, Logo, SlotRow, Sparkle } = window;

function PlayerCapsule({ theme, eye, mouth, name }) {
  return (
    <div className="capsule" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '14px 8px 11px' }}>
      <Gem theme={theme} size={54} eye={eye} mouth={mouth} />
      <div style={{ fontWeight: 800, fontSize: 15, lineHeight: 1 }}>{name}</div>
      <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1, color: '#B08FD8', background: 'rgba(122,77,184,0.10)', borderRadius: 999, padding: '2px 10px' }}>EDIT ✎</div>
    </div>
  );
}

function HomeMock() {
  return (
    <div className="screen" data-screen-label="Home">
      <SkyScene>
        {/* floating decorative gems */}
        <Gem theme="gold" size={30} face={false} style={{ position: 'absolute', top: 154, left: 26, animation: 'bobble 3.8s ease-in-out infinite', opacity: 0.9 }} />
        <Gem theme="galaxy" size={24} face={false} style={{ position: 'absolute', top: 96, right: 38, animation: 'bobble 4.6s ease-in-out 0.8s infinite', opacity: 0.85 }} />
        <Gem theme="green" size={20} face={false} style={{ position: 'absolute', top: 286, right: 84, animation: 'bobble 4.2s ease-in-out 1.6s infinite', opacity: 0.8 }} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 26px' }}>
          <div style={{ marginTop: 86 }}>
            <Logo width={306} />
          </div>
          <div className="ribbon" style={{ fontSize: 14, letterSpacing: 2.5, marginTop: 6 }}>SLIDING TIC·TAC·TOE</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', marginTop: 52 }}>
            <PlayerCapsule theme="red" eye={0} mouth={0} name="Maya" />
            <VsBadge size={52} />
            <PlayerCapsule theme="blue" eye={2} mouth={1} name="Noam" />
          </div>

          <JuicyButton color="pink" label="PLAY WITH A FRIEND" sub="same device" style={{ width: '100%', marginTop: 30 }} />
          <JuicyButton color="blue" label="PLAY VS ROBOT" sub="challenge the AI" style={{ width: '100%', marginTop: 16 }} />

          <div style={{ marginTop: 'auto', marginBottom: 30, display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.55)', border: '2px solid rgba(255,255,255,0.8)', borderRadius: 999, padding: '6px 16px 6px 8px', fontWeight: 800, fontSize: 13, color: '#5A3E8C', boxShadow: '0 3px 0 rgba(127,86,178,0.2)' }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(180deg,#9C6FE0,#7647BE)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, boxShadow: 'inset 0 1.5px 1px rgba(255,255,255,0.4)' }}>?</span>
            How to play
          </div>
        </div>
      </SkyScene>
    </div>
  );
}

/* ---------------- GAME ---------------- */

// 5x5 board: R = red, B = blue, RX = red expiring
const BOARD_LAYOUT = [
  null, 'B', null, null, 'RX',
  null, 'R', 'B', 'B', null,
  null, null, 'R', 'B', null,
  null, 'R', null, 'R', null,
  null, null, null, null, null,
];

function HudCard({ theme, eye, mouth, name, filled, expiring, active }) {
  return (
    <div className="hud-card" style={active ? { boxShadow: '0 4px 0 rgba(127,86,178,0.28), 0 0 0 3px ' + (theme === 'red' ? '#FF6253' : '#4F9CF7') + ', 0 8px 14px rgba(58,28,99,0.18)' } : { opacity: 0.82 }}>
      <Gem theme={theme} size={38} eye={eye} mouth={mouth} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 13.5, lineHeight: 1, whiteSpace: 'nowrap' }}>{name}</div>
        <SlotRow theme={theme} filled={filled} expiringFirst={expiring} />
      </div>
    </div>
  );
}

function GameMock() {
  return (
    <div className="screen" data-screen-label="Game">
      <SkyScene hillsHeight={150} balloon={false}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 16px' }}>

          {/* top bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 18 }}>
            <button className="round-btn">‹</button>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'linear-gradient(180deg,#FF7A6B,#E0303C)', borderRadius: 999, padding: '6px 20px 7px 8px', boxShadow: '0 5px 0 #A8131F, 0 10px 16px rgba(58,28,99,0.3), inset 0 2px 1px rgba(255,255,255,0.4)', animation: 'pulseSoft 1.6s ease-in-out infinite' }}>
                <Gem theme="red" size={30} eye={0} mouth={0} />
                <span style={{ fontFamily: "'Lilita One','Baloo 2',sans-serif", fontSize: 17, color: '#fff', letterSpacing: 1, whiteSpace: 'nowrap', textShadow: '0 2px 0 rgba(0,0,0,0.25)' }}>MAYA'S TURN</span>
              </div>
            </div>
            <button className="round-btn" style={{ fontSize: 17 }}>↺</button>
          </div>

          {/* player HUD */}
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <HudCard theme="red" eye={0} mouth={0} name="Maya" filled={5} expiring={true} active={true} />
            <HudCard theme="blue" eye={2} mouth={1} name="Noam" filled={4} expiring={false} active={false} />
          </div>

          {/* board */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="board">
              {BOARD_LAYOUT.map((v, i) => (
                <div key={i} className="bcell">
                  {v === 'R' && <Gem theme="red" size={46} eye={0} mouth={0} />}
                  {v === 'RX' && <Gem theme="red" size={46} eye={0} mouth={3} expiring={true} dim={0.62} />}
                  {v === 'B' && <Gem theme="blue" size={46} eye={2} mouth={1} />}
                </div>
              ))}
            </div>
          </div>

          {/* hint */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 26 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.6)', border: '2px solid rgba(255,255,255,0.85)', borderRadius: 999, padding: '6px 16px', fontWeight: 700, fontSize: 12, color: '#5A3E8C', boxShadow: '0 3px 0 rgba(127,86,178,0.18)' }}>
              <Gem theme="red" size={18} face={false} expiring={true} dim={0.7} />
              <span>Wobbling gem disappears on your next move</span>
            </div>
          </div>
        </div>
      </SkyScene>
    </div>
  );
}

Object.assign(window, { HomeMock, GameMock });
