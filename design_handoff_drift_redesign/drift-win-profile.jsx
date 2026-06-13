// DRIFT mockups — Win & Profile screens
const { SkyScene, Gem, JuicyButton, Coin, CoinChip, StarTrio, Confetti, Face, GEM_THEMES } = window;

function WinMock() {
  return (
    <div className="screen" data-screen-label="Win">
      <SkyScene dim={true} hills={true}>
        <div className="rays"></div>
        <Confetti count={20} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 30px' }}>

          <div style={{ marginTop: 110 }}>
            <StarTrio size={58} />
          </div>

          <div className="ribbon ribbon-gold" style={{ fontSize: 32, letterSpacing: 2, marginTop: 8, padding: '10px 34px 13px' }}>
            MAYA WINS!
          </div>

          <div style={{ marginTop: 44, animation: 'bounceBig 1.5s ease-in-out infinite', transformOrigin: 'bottom center' }}>
            <Gem theme="red" size={150} eye={1} mouth={2} />
          </div>
          {/* gem shadow */}
          <div style={{ width: 110, height: 16, borderRadius: '50%', background: 'rgba(40,16,80,0.35)', marginTop: 10, filter: 'blur(3px)' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 26, background: 'rgba(255,255,255,0.92)', borderRadius: 999, padding: '7px 20px 7px 9px', boxShadow: '0 4px 0 rgba(186,138,64,0.4), 0 8px 14px rgba(0,0,0,0.25)' }}>
            <Coin size={26} />
            <span style={{ fontFamily: "'Lilita One','Baloo 2',sans-serif", fontSize: 20, color: '#B07708' }}>+25</span>
            <span style={{ fontWeight: 800, fontSize: 13, color: '#8468AC' }}>coins earned</span>
          </div>

          <div style={{ width: '100%', marginTop: 'auto', marginBottom: 34, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <JuicyButton color="gold" label="PLAY AGAIN" style={{ width: '100%' }} />
            <JuicyButton color="ghost" label="HOME" style={{ width: '100%' }} />
          </div>
        </div>
      </SkyScene>
    </div>
  );
}

/* ---------------- PROFILE ---------------- */

const SKINS = [
  { name: 'Cherry',   theme: 'red',    rarity: 'COMMON',    rcolor: '#8A9BB0', state: 'on' },
  { name: 'Lime',     theme: 'green',  rarity: 'RARE',      rcolor: '#2FBFB0', state: 'owned' },
  { name: 'Fire',     theme: 'fire',   rarity: 'RARE',      rcolor: '#2FBFB0', state: 150 },
  { name: 'Ice',      theme: 'ice',    rarity: 'EPIC',      rcolor: '#9B59B6', state: 200 },
  { name: 'Galaxy',   theme: 'galaxy', rarity: 'EPIC',      rcolor: '#9B59B6', state: 300 },
  { name: 'Gold',     theme: 'gold',   rarity: 'LEGENDARY', rcolor: '#E8A50C', state: 500 },
];

function SkinCard({ skin }) {
  return (
    <div className={'skin-card' + (skin.state === 'on' ? ' equipped' : '')}>
      {skin.state === 'on' && <div className="tile-check" style={{ top: -7, right: -7 }}>✓</div>}
      <Gem theme={skin.theme} size={42} face={false} />
      <div style={{ fontWeight: 800, fontSize: 11.5, lineHeight: 1 }}>{skin.name}</div>
      <div className="rarity-chip" style={{ background: skin.rcolor }}>{skin.rarity}</div>
      {skin.state === 'on' && <div style={{ fontSize: 10, fontWeight: 800, color: '#4CB52E' }}>EQUIPPED</div>}
      {skin.state === 'owned' && <div style={{ fontSize: 10, fontWeight: 800, color: '#8468AC' }}>OWNED</div>}
      {typeof skin.state === 'number' && (
        <div className="price-chip"><Coin size={14} />{skin.state}</div>
      )}
    </div>
  );
}

function PickerTile({ eye, mouth, selected, label }) {
  return (
    <div className={'picker-tile' + (selected ? ' selected' : '')}>
      {selected && <div className="tile-check">✓</div>}
      <Gem theme="red" size={32} eye={eye} mouth={mouth} />
      <div style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: 0.5, color: '#8468AC' }}>{label}</div>
    </div>
  );
}

function ProfileMock() {
  return (
    <div className="screen" data-screen-label="Profile">
      <SkyScene hillsHeight={120}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 20px' }}>

          {/* header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 18 }}>
            <button className="round-btn">‹</button>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <div className="ribbon" style={{ fontSize: 16, letterSpacing: 3, padding: '6px 24px 8px' }}>PROFILE</div>
            </div>
            <CoinChip amount={240} />
          </div>

          {/* hero */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 22 }}>
            <div style={{ animation: 'bobble 3.6s ease-in-out infinite' }}>
              <Gem theme="red" size={98} eye={0} mouth={0} />
            </div>
            <div style={{ width: 76, height: 12, borderRadius: '50%', background: 'rgba(40,16,80,0.22)', marginTop: 8, filter: 'blur(2px)' }}></div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
              <span style={{ fontFamily: "'Lilita One','Baloo 2',sans-serif", fontSize: 26, textShadow: '0 2px 0 rgba(255,255,255,0.8)' }}>Maya</span>
              <span style={{ fontSize: 14, color: '#B08FD8' }}>✎</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: '#fff', background: 'linear-gradient(180deg,#FF7A6B,#E0303C)', borderRadius: 999, padding: '2px 12px 3px', marginTop: 4, boxShadow: '0 2px 0 #A8131F', textShadow: '0 1px 0 rgba(0,0,0,0.2)' }}>CHERRY SKIN</div>
          </div>

          {/* stats */}
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            {[['32', 'GAMES'], ['18', 'WINS'], ['56%', 'WIN RATE']].map(([v, l]) => (
              <div key={l} className="capsule stat-card">
                <div className="stat-value">{v}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>

          {/* avatar builder */}
          <div style={{ marginTop: 20 }}>
            <span className="section-tag">AVATAR</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
            <div style={{ display: 'flex', gap: 7, justifyContent: 'space-between' }}>
              <PickerTile eye={0} mouth={0} selected={true} label="DOTS" />
              <PickerTile eye={1} mouth={0} selected={false} label="WIDE" />
              <PickerTile eye={2} mouth={0} selected={false} label="COOL" />
              <PickerTile eye={3} mouth={0} selected={false} label="WINK" />
            </div>
            <div style={{ display: 'flex', gap: 7, justifyContent: 'space-between' }}>
              <PickerTile eye={0} mouth={0} selected={true} label="SMILE" />
              <PickerTile eye={0} mouth={1} selected={false} label="SMIRK" />
              <PickerTile eye={0} mouth={2} selected={false} label="OPEN" />
              <PickerTile eye={0} mouth={3} selected={false} label="FROWN" />
            </div>
          </div>

          {/* skins */}
          <div style={{ marginTop: 20 }}>
            <span className="section-tag">GEM SHOP</span>
          </div>
          <div style={{ display: 'flex', gap: 9, marginTop: 10, overflow: 'hidden', paddingBottom: 6 }}>
            {SKINS.map(s => <SkinCard key={s.name} skin={s} />)}
          </div>
        </div>
      </SkyScene>
    </div>
  );
}

Object.assign(window, { WinMock, ProfileMock });
