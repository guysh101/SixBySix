// DRIFT — shared components: gems, faces, scenery, buttons
const GEM_THEMES = {
  red:    { light: '#FFB5A6', mid: '#FF6253', deep: '#D92632', outline: '#A8131F' },
  blue:   { light: '#A9D5FF', mid: '#4F9CF7', deep: '#1D63C8', outline: '#0E4694' },
  green:  { light: '#C9F2A4', mid: '#7ED957', deep: '#3FA72A', outline: '#2C7F1D' },
  fire:   { light: '#FFDCA3', mid: '#FF9A3C', deep: '#E05E12', outline: '#B34607' },
  ice:    { light: '#E2F8FF', mid: '#6FD3F2', deep: '#2391C9', outline: '#156F9E' },
  galaxy: { light: '#E3C4FF', mid: '#A86CE8', deep: '#6E35B0', outline: '#4F2384' },
  gold:   { light: '#FFF3B2', mid: '#FFD24A', deep: '#E8960C', outline: '#B86F05' },
};

function Face({ eye = 0, mouth = 0, size = 40, style = {} }) {
  const s = size / 40;
  const W = 'rgba(255,255,255,0.95)';
  const bw = Math.max(1.5, 2 * s);
  const lx = size * 0.32, rx = size * 0.68, ey = size * 0.36;
  const mx = size * 0.5, my = size * 0.60;
  const els = [];
  const dot = (key, cx, r) => els.push(
    <div key={key} style={{ position: 'absolute', width: r * 2, height: r * 2, borderRadius: '50%', background: W, left: cx - r, top: ey - r }}></div>
  );
  const bar = (key, cx, w, h) => els.push(
    <div key={key} style={{ position: 'absolute', width: w, height: h, borderRadius: h / 2, background: W, left: cx - w / 2, top: ey - h / 2 }}></div>
  );
  if (eye === 0) { dot('l', lx, Math.max(2, 3.5 * s)); dot('r', rx, Math.max(2, 3.5 * s)); }
  else if (eye === 1) { dot('l', lx, Math.max(3, 5 * s)); dot('r', rx, Math.max(3, 5 * s)); }
  else if (eye === 2) { bar('l', lx, Math.max(7, 9 * s), Math.max(2, 2.5 * s)); bar('r', rx, Math.max(7, 9 * s), Math.max(2, 2.5 * s)); }
  else { dot('l', lx, Math.max(2.5, 4 * s)); bar('r', rx, Math.max(6, 8 * s), Math.max(1.5, 2 * s)); }

  const mw = Math.max(10, 14 * s), mh = Math.max(4, 6 * s);
  let mouthEl = null;
  if (mouth === 0) {
    mouthEl = <div style={{ position: 'absolute', left: mx - mw / 2, top: my, width: mw, height: mh, boxSizing: 'border-box', border: bw + 'px solid ' + W, borderTopWidth: 0, borderBottomLeftRadius: mh, borderBottomRightRadius: mh }}></div>;
  } else if (mouth === 1) {
    const sw = Math.max(8, 10 * s), sh = Math.max(3, 5 * s);
    mouthEl = <div style={{ position: 'absolute', left: mx - sw / 3, top: my, width: sw, height: sh, boxSizing: 'border-box', border: bw + 'px solid ' + W, borderTopWidth: 0, borderRightWidth: bw * 0.3, borderBottomLeftRadius: sh, borderBottomRightRadius: 1 }}></div>;
  } else if (mouth === 2) {
    const ow = Math.max(6, 8 * s), oh = Math.max(4, 6 * s);
    mouthEl = <div style={{ position: 'absolute', left: mx - ow / 2, top: my, width: ow, height: oh, borderRadius: Math.min(ow, oh) / 2, background: W }}></div>;
  } else {
    mouthEl = <div style={{ position: 'absolute', left: mx - mw / 2, top: my - mh / 2, width: mw, height: mh, boxSizing: 'border-box', border: bw + 'px solid ' + W, borderBottomWidth: 0, borderTopLeftRadius: mh, borderTopRightRadius: mh }}></div>;
  }
  return (
    <div style={{ position: 'absolute', width: size, height: size, left: '50%', top: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', ...style }}>
      {els}
      {mouthEl}
    </div>
  );
}

function Gem({ theme = 'red', size = 48, eye = 0, mouth = 0, face = true, expiring = false, dim = 1, style = {}, className = '' }) {
  const t = typeof theme === 'string' ? GEM_THEMES[theme] : theme;
  const bw = Math.max(2, size * 0.06);
  return (
    <div
      className={'gem' + (expiring ? ' gem-expiring' : '') + (className ? ' ' + className : '')}
      style={{
        width: size,
        height: size,
        opacity: dim,
        background: 'radial-gradient(circle at 33% 27%, ' + t.light + ' 0%, ' + t.mid + ' 46%, ' + t.deep + ' 100%)',
        border: bw + 'px solid ' + t.outline,
        boxShadow:
          'inset 0 ' + (-size * 0.12) + 'px ' + (size * 0.18) + 'px rgba(0,0,0,0.28), ' +
          'inset 0 ' + (size * 0.07) + 'px ' + (size * 0.10) + 'px rgba(255,255,255,0.42), ' +
          '0 ' + (size * 0.10) + 'px ' + (size * 0.16) + 'px rgba(40,16,80,0.35)',
        ...style,
      }}
    >
      <div className="gem-shine" style={{ width: size * 0.30, height: size * 0.16, top: size * 0.07, left: size * 0.12 }}></div>
      <div className="gem-shine-dot" style={{ width: size * 0.08, height: size * 0.08, top: size * 0.26, left: size * 0.08 }}></div>
      {face && <Face eye={eye} mouth={mouth} size={size * 0.86} />}
    </div>
  );
}

function Cloud({ w = 130, style = {} }) {
  return (
    <svg viewBox="0 0 130 58" width={w} style={style}>
      <g fill="#FFFFFF">
        <ellipse cx="34" cy="40" rx="28" ry="17"></ellipse>
        <ellipse cx="65" cy="28" rx="27" ry="21"></ellipse>
        <ellipse cx="96" cy="40" rx="26" ry="16"></ellipse>
      </g>
      <g fill="#E2F1FD">
        <ellipse cx="34" cy="49" rx="25" ry="8"></ellipse>
        <ellipse cx="94" cy="49" rx="23" ry="7"></ellipse>
      </g>
    </svg>
  );
}

function Sparkle({ size = 16, style = {}, delay = 0 }) {
  return (
    <svg viewBox="0 0 20 20" width={size} style={{ position: 'absolute', animation: 'twinkle 2.6s ease-in-out ' + delay + 's infinite', ...style }}>
      <path d="M10 0 L12.4 7.6 L20 10 L12.4 12.4 L10 20 L7.6 12.4 L0 10 L7.6 7.6 Z" fill="#FFFFFF"></path>
    </svg>
  );
}

function Hills({ height = 200 }) {
  const flowers = [
    { x: 108, y: 176, c: '#FF7DAE', d: 0 },
    { x: 152, y: 188, c: '#FFD24A', d: 0.8, s: 0.8 },
    { x: 232, y: 180, c: '#FFFFFF', d: 1.5 },
    { x: 296, y: 192, c: '#FF7DAE', d: 0.4, s: 0.85 },
    { x: 342, y: 184, c: '#FFD24A', d: 2.1 },
  ];
  return (
    <svg viewBox="0 0 390 200" width="100%" style={{ position: 'absolute', bottom: height - 200, left: 0, display: 'block' }}>
      <defs>
        <linearGradient id="crystal-pink" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFB9E0"></stop>
          <stop offset="1" stopColor="#E0479A"></stop>
        </linearGradient>
        <linearGradient id="crystal-purple" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D9B8FF"></stop>
          <stop offset="1" stopColor="#8A4DD0"></stop>
        </linearGradient>
      </defs>

      {/* back + mid hills */}
      <path d="M0 86 Q 70 38 150 84 Q 240 128 320 76 Q 360 52 390 72 L390 200 L0 200 Z" fill="#CDB4F2"></path>
      <path d="M0 82 Q 70 34 150 80 Q 240 124 320 72 Q 360 48 390 68 L390 78 Q 360 58 322 80 Q 240 132 148 88 Q 70 44 0 92 Z" fill="#E2D3F8" opacity="0.9"></path>
      <path d="M0 128 Q 90 66 195 118 Q 300 168 390 110 L390 200 L0 200 Z" fill="#A98BE0"></path>

      {/* trees (behind front hills) */}
      <g>
        <rect x="58" y="122" width="9" height="30" rx="4" fill="#8A5536"></rect>
        <circle cx="48" cy="116" r="14" fill="#4CB52E"></circle>
        <circle cx="77" cy="116" r="14" fill="#4CB52E"></circle>
        <circle cx="62" cy="102" r="19" fill="#5FC93E"></circle>
        <circle cx="55" cy="97" r="8" fill="#9BE874" opacity="0.85"></circle>
        <circle cx="50" cy="112" r="3" fill="#FF7DAE"></circle>
        <circle cx="70" cy="107" r="3" fill="#FF7DAE"></circle>
        <circle cx="61" cy="119" r="3" fill="#FF7DAE"></circle>
      </g>
      <g>
        <rect x="322" y="112" width="8" height="26" rx="4" fill="#8A5536"></rect>
        <circle cx="315" cy="106" r="12" fill="#4CB52E"></circle>
        <circle cx="338" cy="106" r="12" fill="#4CB52E"></circle>
        <circle cx="326" cy="94" r="16" fill="#5FC93E"></circle>
        <circle cx="320" cy="90" r="7" fill="#9BE874" opacity="0.85"></circle>
      </g>

      {/* green hills */}
      <path d="M0 150 Q 85 106 195 146 Q 300 184 390 138 L390 200 L0 200 Z" fill="#8FDC69"></path>
      <path d="M0 146 Q 85 102 195 142 Q 300 180 390 134 L390 144 Q 300 188 193 150 Q 85 112 0 156 Z" fill="#B8F08C" opacity="0.9"></path>
      <path d="M0 180 Q 110 140 235 172 Q 330 194 390 166 L390 200 L0 200 Z" fill="#6CC94B"></path>

      {/* bushes */}
      <g fill="#3FA72A">
        <circle cx="258" cy="186" r="11"></circle>
        <circle cx="272" cy="182" r="9"></circle>
        <circle cx="246" cy="182" r="8"></circle>
      </g>
      <circle cx="262" cy="178" r="5" fill="#5FC93E" opacity="0.9"></circle>

      {/* crystals */}
      <g>
        <polygon points="28,196 38,148 48,196" fill="url(#crystal-purple)" stroke="#5A2B8C" strokeWidth="2"></polygon>
        <polygon points="44,196 52,162 62,196" fill="url(#crystal-pink)" stroke="#A8136B" strokeWidth="2"></polygon>
        <polygon points="14,196 21,170 30,196" fill="url(#crystal-pink)" stroke="#A8136B" strokeWidth="1.8"></polygon>
        <line x1="37" y1="158" x2="34" y2="190" stroke="rgba(255,255,255,0.75)" strokeWidth="2.5" strokeLinecap="round"></line>
        <line x1="51" y1="170" x2="49" y2="190" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round"></line>
      </g>

      {/* flowers + grass */}
      {flowers.map((f, i) => {
        const s = f.s || 1;
        return (
          <g key={i} className="sway" style={{ animationDelay: f.d + 's' }} transform={'translate(' + f.x + ' ' + f.y + ') scale(' + s + ')'}>
            <line x1="0" y1="0" x2="0" y2="-13" stroke="#2C7F1D" strokeWidth="2.5" strokeLinecap="round"></line>
            <g transform="translate(0 -17)">
              <circle cx="0" cy="-4.4" r="3.4" fill={f.c}></circle>
              <circle cx="4.2" cy="-1.4" r="3.4" fill={f.c}></circle>
              <circle cx="2.6" cy="3.6" r="3.4" fill={f.c}></circle>
              <circle cx="-2.6" cy="3.6" r="3.4" fill={f.c}></circle>
              <circle cx="-4.2" cy="-1.4" r="3.4" fill={f.c}></circle>
              <circle cx="0" cy="0" r="2.6" fill="#FFC93C" stroke="#E8960C" strokeWidth="1"></circle>
            </g>
          </g>
        );
      })}
      <g stroke="#2C7F1D" strokeWidth="2.5" strokeLinecap="round" fill="none">
        <path d="M126 196 Q 124 188 127 182"></path>
        <path d="M132 196 Q 133 187 130 181"></path>
        <path d="M310 196 Q 308 189 311 184"></path>
        <path d="M316 196 Q 317 188 314 183"></path>
      </g>

      {/* foreground corner leaves */}
      <g className="sway" style={{ animationDuration: '5.2s' }}>
        <path d="M-4 204 Q 2 168 26 158 Q 22 192 2 204 Z" fill="#2F9D4F"></path>
        <path d="M-8 204 Q 6 184 30 184 Q 18 202 -2 206 Z" fill="#3FB55E"></path>
      </g>
      <g className="sway" style={{ animationDuration: '6s', animationDelay: '1s' }}>
        <path d="M394 204 Q 388 164 362 154 Q 366 190 388 204 Z" fill="#2F9D4F"></path>
        <path d="M398 204 Q 384 182 358 182 Q 372 202 392 206 Z" fill="#3FB55E"></path>
      </g>
    </svg>
  );
}

function Sun({ size = 104, style = {} }) {
  return (
    <div style={{ position: 'absolute', width: size, height: size, pointerEvents: 'none', ...style }}>
      <div className="sun-rays"></div>
      <div className="sun-core"></div>
    </div>
  );
}

function Bird({ size = 36, color = '#FF8A4B', dark = '#E06A28', top = 110, dur = 17, delay = 0 }) {
  return (
    <div className="bird-track" style={{ top: top, '--fly-dur': dur + 's', '--fly-delay': delay + 's' }}>
      <div style={{ animation: 'bobble 2.1s ease-in-out infinite' }}>
        <svg viewBox="0 0 44 34" width={size} style={{ overflow: 'visible' }}>
          <polygon points="6,15 15,14 14,21" fill={dark}></polygon>
          <ellipse cx="22" cy="18" rx="12" ry="10.5" fill={color}></ellipse>
          <ellipse cx="24" cy="22.5" rx="7" ry="5" fill="#FFEFDC" opacity="0.95"></ellipse>
          <polygon points="33,15.5 41.5,18 33,20.5" fill="#FFC93C"></polygon>
          <circle cx="28" cy="14" r="2.3" fill="#3E1F66"></circle>
          <circle cx="28.9" cy="13.3" r="0.9" fill="#FFFFFF"></circle>
          <ellipse className="bird-wing" cx="19" cy="13" rx="9" ry="5.5" fill={dark} transform="rotate(-14 19 13)"></ellipse>
        </svg>
      </div>
    </div>
  );
}

function Balloon({ width = 56, style = {} }) {
  return (
    <div style={{ position: 'absolute', pointerEvents: 'none', animation: 'bobble 4.8s ease-in-out infinite', ...style }}>
      <svg viewBox="0 0 60 84" width={width}>
        <line x1="15" y1="50" x2="23" y2="66" stroke="#8A5536" strokeWidth="1.6"></line>
        <line x1="45" y1="50" x2="37" y2="66" stroke="#8A5536" strokeWidth="1.6"></line>
        <path d="M30 2 C 13 2 4 17 4 30 C 4 44 18 52 30 57 C 42 52 56 44 56 30 C 56 17 47 2 30 2 Z" fill="#F23E7C" stroke="#B81E55" strokeWidth="2"></path>
        <path d="M30 2 C 24 14 24 45 30 57 C 36 45 36 14 30 2 Z" fill="#FFD24A"></path>
        <path d="M14 8 C 8 16 6 24 6.5 31 C 8 40 14 46 20 50 C 14 38 13 18 14 8 Z" fill="#FF7DAE" opacity="0.85"></path>
        <path d="M46 8 C 52 16 54 24 53.5 31 C 52 40 46 46 40 50 C 46 38 47 18 46 8 Z" fill="#FF7DAE" opacity="0.85"></path>
        <ellipse cx="21" cy="15" rx="5" ry="9" fill="rgba(255,255,255,0.4)" transform="rotate(18 21 15)"></ellipse>
        <rect x="22" y="64" width="16" height="13" rx="3.5" fill="#C98A4B" stroke="#8A5536" strokeWidth="1.8"></rect>
        <line x1="22" y1="69" x2="38" y2="69" stroke="#8A5536" strokeWidth="1.2"></line>
        <line x1="27" y1="64" x2="27" y2="77" stroke="#8A5536" strokeWidth="1"></line>
        <line x1="33" y1="64" x2="33" y2="77" stroke="#8A5536" strokeWidth="1"></line>
      </svg>
    </div>
  );
}

function Rainbow({ width = 300, style = {} }) {
  const colors = ['#FF6253', '#FF9A3C', '#FFD24A', '#7ED957', '#4F9CF7', '#A86CE8'];
  return (
    <svg viewBox="0 0 200 100" width={width} style={{ position: 'absolute', pointerEvents: 'none', ...style }}>
      {colors.map((c, i) => {
        const r = 92 - i * 7;
        return <path key={c} d={'M ' + (100 - r) + ' 100 A ' + r + ' ' + r + ' 0 0 1 ' + (100 + r) + ' 100'} fill="none" stroke={c} strokeWidth="7.2" opacity="0.55"></path>;
      })}
    </svg>
  );
}

function SkyScene({ children, dim = false, hills = true, hillsHeight = 200, balloon = true }) {
  return (
    <div className="sky">
      <Sun size={108} style={{ top: -32, left: -28 }} />
      <Cloud w={118} style={{ position: 'absolute', top: 66, left: 64, opacity: 0.95, animation: 'cloudDrift 16s ease-in-out infinite alternate' }} />
      <Cloud w={88} style={{ position: 'absolute', top: 142, right: -14, opacity: 0.85, animation: 'cloudDrift 21s ease-in-out infinite alternate-reverse' }} />
      <Cloud w={62} style={{ position: 'absolute', top: 256, left: 22, opacity: 0.55, animation: 'cloudDrift 26s ease-in-out infinite alternate' }} />
      <Rainbow width={330} style={{ bottom: hillsHeight - 112, right: -70 }} />
      {balloon && <Balloon width={54} style={{ top: 168, right: 20 }} />}
      <Bird size={34} top={96} dur={17} delay={0} />
      <Bird size={24} color="#FF7DAE" dark="#E0479A" top={212} dur={24} delay={7} />
      <Bird size={20} color="#6FD3F2" dark="#2391C9" top={58} dur={21} delay={12} />
      <Sparkle size={16} style={{ top: 92, right: 64 }} delay={0} />
      <Sparkle size={11} style={{ top: 200, left: 46 }} delay={0.9} />
      <Sparkle size={13} style={{ top: 320, right: 38 }} delay={1.7} />
      <Sparkle size={9} style={{ top: 152, left: 128 }} delay={2.2} />
      {hills && <Hills height={hillsHeight} />}
      {dim && <div className="sky-dim"></div>}
      <div className="sky-content">{children}</div>
    </div>
  );
}

function JuicyButton({ color = 'green', label, sub, style = {} }) {
  return (
    <button className={'jbtn jbtn-' + color} style={style}>
      <span className="jbtn-label">{label}</span>
      {sub && <span className="jbtn-sub">{sub}</span>}
    </button>
  );
}

function Coin({ size = 18 }) {
  return <div className="coin" style={{ width: size, height: size, fontSize: size * 0.6 }}>★</div>;
}

function CoinChip({ amount, style = {} }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(74,44,110,0.55)', border: '2px solid rgba(255,255,255,0.45)', borderRadius: 999, padding: '4px 12px 4px 5px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.25)', ...style }}>
      <Coin size={20} />
      <span style={{ fontFamily: "'Lilita One','Baloo 2',sans-serif", fontSize: 15, color: '#FFE08A', textShadow: '0 1.5px 0 rgba(0,0,0,0.35)' }}>{amount}</span>
    </div>
  );
}

function SlotRow({ theme = 'red', filled = 0, total = 5, expiringFirst = false }) {
  const t = GEM_THEMES[theme];
  const dots = [];
  for (let i = 0; i < total; i++) {
    const isFilled = i < filled;
    const isExp = expiringFirst && i === 0;
    dots.push(
      <div
        key={i}
        className="slot"
        style={isFilled ? {
          background: 'radial-gradient(circle at 35% 30%, ' + t.light + ', ' + t.mid + ' 55%, ' + t.deep + ')',
          border: '1.5px solid ' + t.outline,
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.5)',
          animation: isExp ? 'blinkRing 0.9s ease-in-out infinite' : 'none',
        } : {}}
      ></div>
    );
  }
  return <div className="slot-row">{dots}</div>;
}

function VsBadge({ size = 54 }) {
  const pts = [];
  const n = 12;
  for (let i = 0; i < n * 2; i++) {
    const ang = (Math.PI * i) / n - Math.PI / 2;
    const r = i % 2 === 0 ? 27 : 20;
    pts.push((30 + r * Math.cos(ang)).toFixed(1) + ',' + (30 + r * Math.sin(ang)).toFixed(1));
  }
  return (
    <div style={{ position: 'relative', width: size, height: size, flex: 'none', animation: 'pulseSoft 2.2s ease-in-out infinite' }}>
      <svg viewBox="0 0 60 60" width={size} style={{ filter: 'drop-shadow(0 4px 6px rgba(58,28,99,0.35))' }}>
        <polygon points={pts.join(' ')} fill="#FFC93C" stroke="#E8960C" strokeWidth="2.5"></polygon>
        <polygon points={pts.join(' ')} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1" transform="translate(0,-1) scale(0.93) translate(2.1,2.1)"></polygon>
      </svg>
      <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Lilita One','Baloo 2',sans-serif", fontSize: size * 0.33, color: '#8A4D00', textShadow: '0 1px 0 rgba(255,255,255,0.5)' }}>VS</span>
    </div>
  );
}

function Logo({ width = 310 }) {
  return (
    <div style={{ position: 'relative', animation: 'bobbleTilt 3.4s ease-in-out infinite', width: width }}>
      <svg viewBox="0 0 310 112" width={width} style={{ overflow: 'visible', display: 'block' }}>
        <defs>
          <linearGradient id="drift-logo-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFEF8"></stop>
            <stop offset="0.55" stopColor="#FFE9F6"></stop>
            <stop offset="1" stopColor="#FFB9E0"></stop>
          </linearGradient>
        </defs>
        <text x="155" y="84" textAnchor="middle" fontFamily="'Lilita One'" fontSize="86" letterSpacing="3" fill="#3E1F66" stroke="#3E1F66" strokeWidth="16" paintOrder="stroke" transform="translate(0,8)">DRIFT</text>
        <text x="155" y="84" textAnchor="middle" fontFamily="'Lilita One'" fontSize="86" letterSpacing="3" fill="url(#drift-logo-grad)" stroke="#7A3DB8" strokeWidth="9" paintOrder="stroke">DRIFT</text>
      </svg>
      <Sparkle size={22} style={{ top: -6, right: 6 }} delay={0.4} />
      <Sparkle size={14} style={{ bottom: 18, left: -4 }} delay={1.4} />
    </div>
  );
}

function StarTrio({ size = 56 }) {
  const star = (rot, s, delay, lift) => (
    <svg viewBox="0 0 24 24" width={s} style={{ '--star-rot': rot + 'deg', transform: 'rotate(' + rot + 'deg)', marginBottom: lift, animation: 'starPop 0.6s cubic-bezier(.5,1.8,.6,1) ' + delay + 's both', filter: 'drop-shadow(0 3px 4px rgba(58,28,99,0.4))' }}>
      <path d="M12 1.5 L14.9 8.4 L22.4 9 L16.7 13.9 L18.4 21.2 L12 17.3 L5.6 21.2 L7.3 13.9 L1.6 9 L9.1 8.4 Z" fill="#FFC93C" stroke="#C26E05" strokeWidth="1.6"></path>
      <path d="M12 4.5 L13.8 8.9 L18.6 9.3 L15 12.4 L16.1 17 L12 14.6 Z" fill="#FFE99C" opacity="0.85"></path>
    </svg>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 2 }}>
      {star(-18, size * 0.72, 0.15, 6)}
      {star(0, size, 0.35, 14)}
      {star(18, size * 0.72, 0.55, 6)}
    </div>
  );
}

const CONFETTI_COLORS = ['#FF6253', '#4F9CF7', '#7ED957', '#FFC93C', '#A86CE8', '#FF7DAE', '#6FD3F2'];
function Confetti({ count = 18 }) {
  const pieces = [];
  for (let i = 0; i < count; i++) {
    const left = (i * 53.7) % 100;
    const c = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    const w = 7 + (i % 3) * 3;
    const h = 10 + (i % 4) * 3;
    const dur = 2.8 + (i % 5) * 0.5;
    const delay = (i * 0.37) % 3;
    const round = i % 3 === 0;
    pieces.push(
      <div
        key={i}
        className="confetti-piece"
        style={{
          left: left + '%',
          width: round ? w + 2 : w,
          height: round ? w + 2 : h,
          background: c,
          borderRadius: round ? '50%' : 2.5,
          '--cf-dur': dur + 's',
          '--cf-delay': delay + 's',
        }}
      ></div>
    );
  }
  return <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>{pieces}</div>;
}

Object.assign(window, {
  GEM_THEMES, Face, Gem, Cloud, Sparkle, Hills, SkyScene, Sun, Bird, Balloon, Rainbow,
  JuicyButton, Coin, CoinChip, SlotRow, VsBadge, Logo, StarTrio, Confetti,
});
