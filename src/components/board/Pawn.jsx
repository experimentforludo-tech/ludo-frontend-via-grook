import { memo } from 'react';

const COLOR_CLASSES = {
  RED: 'bg-ludoRed',
  GREEN: 'bg-ludoGreen',
  YELLOW: 'bg-ludoYellow',
  BLUE: 'bg-ludoBlue'
};

function Pawn({ color, translateX, translateY, cellSizePx, isSelectable, isMyTurn, onTap, stackOffset }) {
  const offsetPx = stackOffset * 6;

  return (
    <button
      type="button"
      onClick={isSelectable ? onTap : undefined}
      className={`pawn-token absolute rounded-full border-2 border-black/40 shadow-lg ${COLOR_CLASSES[color]} ${
        isSelectable ? 'ring-4 ring-white/80 scale-110 animate-pulse' : ''
      } ${isMyTurn && !isSelectable ? 'opacity-90' : ''}`}
      style={{
        width: `${cellSizePx * 0.6}px`,
        height: `${cellSizePx * 0.6}px`,
        left: 0,
        top: 0,
        transform: `translate(${translateX + offsetPx}px, ${translateY + offsetPx}px)`,
        pointerEvents: isSelectable ? 'auto' : 'none',
        zIndex: isSelectable ? 20 : 10
      }}
      aria-label={`${color} pawn`}
    />
  );
}

function areEqual(prev, next) {
  return (
    prev.translateX === next.translateX &&
    prev.translateY === next.translateY &&
    prev.isSelectable === next.isSelectable &&
    prev.isMyTurn === next.isMyTurn &&
    prev.cellSizePx === next.cellSizePx &&
    prev.stackOffset === next.stackOffset
  );
}

export default memo(Pawn, areEqual);\n