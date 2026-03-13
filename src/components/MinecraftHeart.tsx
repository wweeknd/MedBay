import React from 'react';

interface Props {
  size?: number;
  className?: string;
}

/* Classic Minecraft heart: red fill, black outline, white shine, dark-red shadow */
const MinecraftHeart: React.FC<Props> = ({ size = 28, className = '' }) => {
  const B = '#111111'; // black outline
  const R = '#FF0000'; // red
  const L = '#FF3333'; // lighter red  
  const D = '#CC0000'; // darker red shadow
  const W = '#FFFFFF'; // white highlight
  const _ = 'transparent';

  // 10 cols × 9 rows
  const grid: (string)[][] = [
    [ _, _, B, B, _, _, B, B, _, _ ],
    [ _, B, R, L, B, B, R, R, B, _ ],
    [ B, R, W, L, R, R, R, D, R, B ],
    [ B, R, L, R, R, R, R, D, R, B ],
    [ B, R, R, R, R, R, R, R, R, B ],
    [ _, B, R, R, R, R, R, R, B, _ ],
    [ _, _, B, R, R, R, R, B, _, _ ],
    [ _, _, _, B, R, R, B, _, _, _ ],
    [ _, _, _, _, B, B, _, _, _, _ ],
  ];

  const cols = grid[0].length;
  const rows = grid.length;

  return (
    <svg
      width={size}
      height={size * (rows / cols)}
      viewBox={`0 0 ${cols} ${rows}`}
      className={className}
      style={{ imageRendering: 'pixelated' }}
    >
      {grid.map((row, y) =>
        row.map((color, x) =>
          color !== _ ? (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} />
          ) : null
        )
      )}
    </svg>
  );
};

export default MinecraftHeart;
