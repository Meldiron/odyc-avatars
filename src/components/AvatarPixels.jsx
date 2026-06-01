import { SIZE } from '../lib/avatar.js';

const WHITE_HEX = '#f8f9fa';

// Renders a model's hex grid as crisp SVG rects. Empty pixels are white.
export default function AvatarPixels({ model, className }) {
  const rects = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const hex = model.grid[y][x] || WHITE_HEX;
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={hex} />);
    }
  }
  return (
    <svg
      className={className}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      shapeRendering="crispEdges"
      aria-label={model.name}
      role="img"
    >
      {rects}
    </svg>
  );
}
