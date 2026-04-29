import React from 'react';

// ── helpers ────────────────────────────────────────────────────────────────────
const p = (arr) => arr.map(([x, y]) => `${x},${y}`).join(' ');

// ── Isometric house geometry — ViewBox 0 0 200 150 ───────────────────────────
// Front wall faces viewer (bottom-left). Depth vector: (+55, −14).
const FLT = [25, 93],  FRT = [115, 93];
const FLB = [25, 120], FRB = [115, 120];
const BLT = [80, 79],  BRT = [170, 79];
//                     BLB = [80,106],  BRB = [170,106]  (used for right wall)

const RL_X = 52.5;  // gable ridge left  X  (avg of FLT[0] and BLT[0])
const RR_X = 142.5; // gable ridge right X  (avg of FRT[0] and BRT[0])
const MID_Y = 86;   // avg wall-top Y

// colours
const WF = '#e8eaed';   // front wall
const WR = '#d1d5db';   // right wall (shadowed)
const SF = '#374151';   // roof front slope  (faces viewer)
const SB = '#1f2937';   // roof back slope   (faces away)
const SS = '#4b5563';   // roof side / gable face

// ── Shared house walls + windows ─────────────────────────────────────────────
function Walls({ children, bg = '#f1f5f9' }) {
  return (
    <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="200" height="150" fill={bg} />
      {/* right wall */}
      <polygon points={p([FRT, BRT, [170, 106], FRB])} fill={WR} />
      {/* front wall */}
      <polygon points={p([FLT, FRT, FRB, FLB])} fill={WF} />
      {/* windows */}
      <rect x="38" y="100" width="19" height="13" rx="1.5" fill="#bfdbfe" opacity="0.75" />
      <rect x="70" y="100" width="19" height="13" rx="1.5" fill="#bfdbfe" opacity="0.75" />
      {/* door */}
      <rect x="54" y="108" width="13" height="12" rx="1" fill="#93c5fd" opacity="0.45" />
      {children}
    </svg>
  );
}

// ── Gable roof (ridge runs left-right) ───────────────────────────────────────
function GableRoof({ ry }) {
  const rL = [RL_X, ry], rR = [RR_X, ry];
  return (
    <>
      {/* back slope */}
      <polygon points={p([rL, rR, BRT, BLT])} fill={SB} />
      {/* front slope */}
      <polygon points={p([FLT, FRT, rR, rL])} fill={SF} />
      {/* right gable end */}
      <polygon points={p([FRT, BRT, rR])} fill={SS} />
      {/* ridge highlight */}
      <line x1={RL_X} y1={ry} x2={RR_X} y2={ry}
        stroke="white" strokeWidth="0.7" opacity="0.25" />
    </>
  );
}

// ── Hip roof (all four sides slope; ridge is shorter) ────────────────────────
function HipRoof({ ry, lx = 75, rx = 125 }) {
  const rL = [lx, ry], rR = [rx, ry];
  return (
    <>
      {/* back slope */}
      <polygon points={p([rL, rR, BRT, BLT])} fill={SB} />
      {/* front slope */}
      <polygon points={p([FLT, FRT, rR, rL])} fill={SF} />
      {/* right hip */}
      <polygon points={p([FRT, BRT, rR])} fill={SS} />
      {/* left hip (partially visible, lighter) */}
      <polygon points={p([FLT, BLT, rL])} fill={SS} opacity="0.45" />
      {/* ridge highlight */}
      <line x1={lx} y1={ry} x2={rx} y2={ry}
        stroke="white" strokeWidth="0.7" opacity="0.25" />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PITCH ILLUSTRATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function IllustPitchLow() {
  return <Walls><GableRoof ry={MID_Y - 7} /></Walls>;
}

export function IllustPitchMedium() {
  return <Walls><GableRoof ry={MID_Y - 23} /></Walls>;
}

export function IllustPitchSteep() {
  return <Walls><GableRoof ry={MID_Y - 44} /></Walls>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPLEXITY / SHAPE ILLUSTRATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function IllustShapeSimple() {
  // Plain gable — lowest cost
  return <Walls><GableRoof ry={MID_Y - 23} /></Walls>;
}

export function IllustShapeModerate() {
  // Hip roof — slopes on all four sides
  return <Walls><HipRoof ry={MID_Y - 22} lx={75} rx={125} /></Walls>;
}

export function IllustShapeComplex() {
  // Hip roof + dormer protruding from front slope
  const ry = MID_Y - 22;
  return (
    <Walls>
      <HipRoof ry={ry} lx={75} rx={125} />
      {/* dormer box — front face */}
      <polygon points={p([[52,84],[82,84],[82,73],[52,73]])} fill={WF} />
      {/* dormer mini-roof (shed/gable peak) */}
      <polygon points={p([[52,73],[82,73],[82,67],[52,67]])} fill={SF} />
      <polygon points={p([[52,73],[52,67],[67,63]])} fill={SS} opacity="0.7" />
      {/* dormer window */}
      <rect x="59" y="75" width="16" height="11" rx="1" fill="#bfdbfe" opacity="0.8" />
      {/* dormer outline */}
      <polyline points={p([[52,84],[52,67],[67,63],[82,67],[82,84]])}
        fill="none" stroke="#6b7280" strokeWidth="0.6" opacity="0.5" />
    </Walls>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// METAL ROOF TYPE ILLUSTRATIONS  (ViewBox 0 0 200 120 — panel profile view)
// ═══════════════════════════════════════════════════════════════════════════════

export function IllustMetalStandingSeam() {
  // 3D perspective of standing-seam panels on a roof surface
  const bg = '#94a3b8';
  const seam = '#334155';
  const highlight = '#cbd5e1';
  // Draw a flat roof surface with raised seam lines
  const panelW = 34;
  const seams = [20, 54, 88, 122, 156];
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="200" height="120" fill="#f1f5f9" />
      {/* panel base */}
      <rect x="10" y="25" width="180" height="70" rx="3" fill={bg} />
      {/* panel highlights between seams */}
      {seams.slice(0, -1).map((sx, i) => (
        <rect key={i} x={sx + 6} y="25" width={panelW - 12} height="70"
          fill={highlight} opacity="0.18" />
      ))}
      {/* raised seam lines */}
      {seams.map((sx, i) => (
        <g key={i}>
          <rect x={sx} y="20" width="6" height="80" rx="2" fill={seam} />
          {/* seam top highlight */}
          <rect x={sx + 1} y="20" width="2" height="80" rx="1"
            fill="white" opacity="0.2" />
        </g>
      ))}
      {/* bottom shadow */}
      <rect x="10" y="90" width="180" height="5" rx="0" fill="#1e293b" opacity="0.15" />
      {/* label */}
      <text x="100" y="112" textAnchor="middle" fontSize="9" fill="#64748b"
        fontFamily="sans-serif">Raised seam every ~24″</text>
    </svg>
  );
}

export function IllustMetalCorrugated() {
  // Corrugated wave cross-section
  const numWaves = 6;
  const waveW = 30;
  const startX = 10;
  const baseY = 75;
  const amplitude = 16;
  // Build a smooth sine wave path
  const points = [];
  for (let i = 0; i <= 180; i += 2) {
    const x = startX + i;
    const y = baseY - amplitude * Math.sin((i / (numWaves * waveW)) * 2 * Math.PI * numWaves);
    points.push([x, y]);
  }
  const wavePath = 'M ' + points.map(([x, y]) => `${x},${y.toFixed(1)}`).join(' L ');
  // fill path (close down to bottom)
  const fillPath = wavePath + ` L 190,105 L 10,105 Z`;
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="200" height="120" fill="#f1f5f9" />
      {/* shadow fill under wave */}
      <path d={fillPath} fill="#64748b" opacity="0.15" />
      {/* main corrugated surface */}
      <path d={wavePath} fill="none" stroke="#94a3b8" strokeWidth="14"
        strokeLinecap="round" />
      {/* highlight on wave tops */}
      <path d={wavePath} fill="none" stroke="#e2e8f0" strokeWidth="3"
        strokeLinecap="round" opacity="0.6" />
      {/* dark shadow in troughs */}
      <path d={wavePath} fill="none" stroke="#475569" strokeWidth="14"
        strokeLinecap="round" opacity="0.12" />
      <text x="100" y="112" textAnchor="middle" fontSize="9" fill="#64748b"
        fontFamily="sans-serif">Classic wave profile</text>
    </svg>
  );
}

export function IllustMetalRibbed() {
  // R-Panel: flat surface with narrow raised ribs
  const ribPositions = [22, 62, 102, 142, 162];
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="200" height="120" fill="#f1f5f9" />
      {/* base panel */}
      <rect x="10" y="28" width="180" height="62" rx="3" fill="#94a3b8" />
      {/* flat panel highlight zones */}
      <rect x="10" y="28" width="180" height="62" rx="3"
        fill="url(#ribGrad)" />
      <defs>
        <linearGradient id="ribGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.12" />
          <stop offset="100%" stopColor="black" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      {/* raised ribs */}
      {ribPositions.map((rx, i) => (
        <g key={i}>
          {/* rib body */}
          <rect x={rx} y="24" width="9" height="70" rx="1.5" fill="#334155" />
          {/* rib highlight */}
          <rect x={rx + 1} y="24" width="3" height="70" rx="1"
            fill="white" opacity="0.18" />
        </g>
      ))}
      {/* bottom edge shadow */}
      <rect x="10" y="88" width="180" height="4" rx="0" fill="#1e293b" opacity="0.12" />
      <text x="100" y="112" textAnchor="middle" fontSize="9" fill="#64748b"
        fontFamily="sans-serif">Flat panels with raised ribs</text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHINGLE GRADE ILLUSTRATIONS
// ═══════════════════════════════════════════════════════════════════════════════


export function IllustShingleStandard() {
  // 3-tab: uniform tabs with visible cutouts
  const tabW = 33, rowH = 20;
  const color = '#9ca3af', shadow = '#6b7280';
  const rows = 5, cols = 8;
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="200" height="120" fill="#e5e7eb" />
      {Array.from({ length: rows }).map((_, r) => {
        const y = 8 + r * rowH;
        const offset = r % 2 === 0 ? 0 : tabW / 2;
        return Array.from({ length: cols }).map((_, c) => {
          const x = -offset + c * tabW - 4;
          return (
            <g key={`${r}-${c}`}>
              <rect x={x + 1} y={y} width={tabW - 2} height={rowH}
                rx="0.5" fill={color} />
              {/* tab notch lines (3-tab characteristic) */}
              <rect x={x + Math.floor(tabW / 3)} y={y + rowH - 8} width="1.5" height="8"
                fill="#d1d5db" />
              <rect x={x + Math.floor(tabW * 2 / 3)} y={y + rowH - 8} width="1.5" height="8"
                fill="#d1d5db" />
              {/* bottom shadow */}
              <rect x={x + 1} y={y + rowH - 5} width={tabW - 2} height="5"
                fill={shadow} opacity="0.35" />
            </g>
          );
        });
      })}
    </svg>
  );
}

export function IllustShingleArchitectural() {
  // Dimensional/architectural: staggered, varied depth, shadow band
  const tabW = 38, rowH = 22;
  const color = '#78716c', shadow = '#44403c';
  const rows = 5, cols = 7;
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="200" height="120" fill="#d6d3d1" />
      {Array.from({ length: rows }).map((_, r) => {
        const y = 5 + r * rowH;
        const offset = r % 2 === 0 ? 0 : tabW * 0.6;
        return Array.from({ length: cols }).map((_, c) => {
          const x = -offset + c * tabW - 4;
          const h = r % 2 === 0 ? rowH : rowH - 3;
          return (
            <g key={`${r}-${c}`}>
              {/* main shingle */}
              <rect x={x + 1} y={y} width={tabW - 2} height={h}
                rx="1" fill={color} />
              {/* thick dimensional shadow at bottom */}
              <rect x={x + 1} y={y + h - 8} width={tabW - 2} height="8"
                rx="0.5" fill={shadow} opacity="0.55" />
              {/* top highlight */}
              <rect x={x + 1} y={y} width={tabW - 2} height="3"
                fill="white" opacity="0.08" />
            </g>
          );
        });
      })}
    </svg>
  );
}

export function IllustShingleDesigner() {
  // Premium/designer: large irregular shapes, deep shadows, rich color
  const tabW = 44, rowH = 26;
  const color = '#3f3f46', shadow = '#18181b', accent = '#52525b';
  const rows = 4, cols = 6;
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="200" height="120" fill="#27272a" />
      {Array.from({ length: rows }).map((_, r) => {
        const y = 4 + r * rowH;
        const offset = r % 2 === 0 ? 0 : tabW * 0.55;
        return Array.from({ length: cols }).map((_, c) => {
          const x = -offset + c * tabW - 4;
          const w = tabW - 3 + (c % 3 === 0 ? 4 : 0);
          return (
            <g key={`${r}-${c}`}>
              <rect x={x + 1} y={y} width={w} height={rowH}
                rx="1.5" fill={color} />
              {/* deep shadow */}
              <rect x={x + 1} y={y + rowH - 9} width={w} height="9"
                fill={shadow} opacity="0.65" />
              {/* accent band */}
              <rect x={x + 1} y={y + rowH - 14} width={w} height="4"
                fill={accent} opacity="0.4" />
              {/* surface highlight */}
              <rect x={x + 1} y={y} width={w} height="3"
                fill="white" opacity="0.07" />
            </g>
          );
        });
      })}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TILE TYPE ILLUSTRATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function IllustTileClay() {
  // Barrel/S-curve clay tiles — warm terra-cotta
  const tileW = 32, rowH = 24;
  const rows = 5, cols = 7;
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="200" height="120" fill="#fed7aa" />
      {Array.from({ length: rows }).map((_, r) => {
        const y = 4 + r * rowH;
        const offset = r % 2 === 0 ? 0 : tileW / 2;
        return Array.from({ length: cols }).map((_, c) => {
          const x = -offset + c * tileW - 4;
          return (
            <g key={`${r}-${c}`}>
              {/* tile body */}
              <rect x={x} y={y} width={tileW - 1} height={rowH}
                rx="8" fill="#c2410c" />
              {/* curved top highlight (barrel effect) */}
              <ellipse cx={x + tileW / 2 - 0.5} cy={y + 5} rx={(tileW - 8) / 2} ry="4"
                fill="#ea580c" opacity="0.5" />
              {/* bottom shadow */}
              <rect x={x} y={y + rowH - 6} width={tileW - 1} height="6"
                rx="0" fill="#7c2d12" opacity="0.35" />
            </g>
          );
        });
      })}
    </svg>
  );
}

export function IllustTileConcrete() {
  // Flat concrete interlocking tiles — gray
  const tileW = 38, tileH = 22;
  const rows = 5, cols = 6;
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="200" height="120" fill="#d1d5db" />
      {Array.from({ length: rows }).map((_, r) => {
        const y = 4 + r * tileH;
        const offset = r % 2 === 0 ? 0 : tileW / 2;
        return Array.from({ length: cols }).map((_, c) => {
          const x = -offset + c * tileW - 4;
          return (
            <g key={`${r}-${c}`}>
              <rect x={x + 1} y={y + 1} width={tileW - 2} height={tileH - 1}
                rx="1" fill="#9ca3af" />
              {/* interlocking lip */}
              <rect x={x + 1} y={y + tileH - 4} width={tileW - 2} height="4"
                fill="#6b7280" opacity="0.4" />
              {/* highlight */}
              <rect x={x + 1} y={y + 1} width={tileW - 2} height="3"
                fill="white" opacity="0.15" />
            </g>
          );
        });
      })}
    </svg>
  );
}

export function IllustTileSlate() {
  // Irregular natural slate — dark gray/blue
  const cols = 6, rows = 5;
  // Slightly varied widths to look natural
  const widths = [33, 30, 36, 28, 34, 31];
  const rowH = 22;
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="200" height="120" fill="#1e293b" />
      {Array.from({ length: rows }).map((_, r) => {
        const y = 3 + r * rowH;
        let xCursor = -4 + (r % 2 === 0 ? 0 : 15);
        return Array.from({ length: cols }).map((_, c) => {
          const w = widths[c % widths.length];
          const x = xCursor;
          xCursor += w + 1;
          // Vary height slightly per row
          const h = rowH - 1 + (c % 2 === 0 ? 2 : 0);
          return (
            <g key={`${r}-${c}`}>
              <rect x={x} y={y} width={w} height={h}
                rx="0.5" fill="#334155" />
              {/* natural grain line */}
              <line x1={x + 4} y1={y + 6} x2={x + w - 4} y2={y + 8}
                stroke="#475569" strokeWidth="0.8" opacity="0.6" />
              {/* edge highlight */}
              <rect x={x} y={y} width={w} height="2"
                fill="white" opacity="0.08" />
            </g>
          );
        });
      })}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FLAT ROOF SYSTEM ILLUSTRATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function IllustFlatTPO() {
  // TPO: white reflective membrane with heat-welded lap seams
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="200" height="120" fill="#f8fafc" />
      {/* membrane surface */}
      <rect x="8" y="18" width="184" height="84" rx="3" fill="#f1f5f9" />
      {/* reflection gradient */}
      <rect x="8" y="18" width="184" height="84" rx="3"
        fill="url(#tpoGrad)" />
      <defs>
        <linearGradient id="tpoGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.6" />
          <stop offset="60%" stopColor="white" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {/* lap seam lines (horizontal) */}
      {[38, 60, 82].map((y, i) => (
        <g key={i}>
          <rect x="8" y={y} width="184" height="4" rx="0" fill="#cbd5e1" opacity="0.6" />
          <line x1="8" y1={y + 2} x2="192" y2={y + 2}
            stroke="white" strokeWidth="1" opacity="0.5" />
        </g>
      ))}
      {/* edge flashing */}
      <rect x="8" y="18" width="184" height="5" rx="0" fill="#94a3b8" opacity="0.25" />
      <rect x="8" y="97" width="184" height="5" rx="0" fill="#94a3b8" opacity="0.25" />
      <text x="100" y="114" textAnchor="middle" fontSize="9" fill="#64748b"
        fontFamily="sans-serif">White reflective membrane</text>
    </svg>
  );
}

export function IllustFlatEPDM() {
  // EPDM: dark black rubber membrane with seam lines
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="200" height="120" fill="#1e293b" />
      {/* membrane */}
      <rect x="8" y="18" width="184" height="84" rx="3" fill="#111827" />
      {/* subtle texture */}
      <rect x="8" y="18" width="184" height="84" rx="3"
        fill="url(#epdmGrad)" />
      <defs>
        <linearGradient id="epdmGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.06" />
          <stop offset="100%" stopColor="black" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {/* seam lines */}
      {[45, 72, 95].map((y, i) => (
        <g key={i}>
          <rect x="8" y={y} width="184" height="3" rx="0" fill="#374151" opacity="0.8" />
          <line x1="8" y1={y + 1} x2="192" y2={y + 1}
            stroke="#4b5563" strokeWidth="0.8" opacity="0.5" />
        </g>
      ))}
      {/* edge flashing (aluminum)  */}
      <rect x="8" y="18" width="184" height="4" rx="0" fill="#475569" opacity="0.6" />
      <rect x="8" y="98" width="184" height="4" rx="0" fill="#475569" opacity="0.6" />
      <text x="100" y="114" textAnchor="middle" fontSize="9" fill="#94a3b8"
        fontFamily="sans-serif">Rubber membrane, 20–25 yr</text>
    </svg>
  );
}

export function IllustFlatModBitumen() {
  // Modified Bitumen: dark torch-down with mineral granule texture
  const granuleCount = 120;
  // deterministic positions using a simple LCG so no randomness between renders
  const granules = Array.from({ length: granuleCount }, (_, i) => {
    const x = ((i * 73 + 17) % 180) + 12;
    const y = ((i * 59 + 31) % 76) + 22;
    return { x, y };
  });
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="200" height="120" fill="#1c1917" />
      {/* membrane base */}
      <rect x="8" y="18" width="184" height="84" rx="3" fill="#292524" />
      {/* mineral granules */}
      {granules.map(({ x, y }, i) => (
        <circle key={i} cx={x} cy={y} r="1.5"
          fill={i % 4 === 0 ? '#78716c' : i % 4 === 1 ? '#57534e' : '#44403c'}
          opacity="0.8" />
      ))}
      {/* overlap seam */}
      <rect x="8" y="62" width="184" height="5" rx="0" fill="#1c1917" opacity="0.5" />
      {/* edge */}
      <rect x="8" y="18" width="184" height="4" rx="0" fill="#44403c" />
      <rect x="8" y="98" width="184" height="4" rx="0" fill="#44403c" />
      <text x="100" y="114" textAnchor="middle" fontSize="9" fill="#78716c"
        fontFamily="sans-serif">Torch-down, mineral surface</text>
    </svg>
  );
}
