// Pixel-art brand mark — a little blue mascot face. The grid below is the single
// source of truth; the favicon (public/favicon.svg) is generated to match it.
export const LOGO_GRID = [
  '.BBBBBB.',
  'BBBBBBBB',
  'BEBBBBEB',
  'BBBBBBBB',
  'BBBMMBBB',
  'BBBBBBBB',
  '.SSSSSS.',
  '..SSSS..',
];
export const LOGO_COLORS = { B: '#3b82f6', S: '#2f6fe0', E: '#0b1020', M: '#0b1020' };

export default function Logo({ size = 30, radius = 8 }) {
  const rects = [];
  LOGO_GRID.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      const c = LOGO_COLORS[ch];
      if (c) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={c} />);
    })
  );
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 8 8"
      shapeRendering="crispEdges"
      style={{ borderRadius: radius, display: 'block' }}
      role="img"
      aria-label="odyc logo"
    >
      {rects}
    </svg>
  );
}
