import { useEffect, useMemo, useRef, useState } from 'react';
import Pawn from './Pawn';
import {
  GRID_SIZE,
  TRACK_COORDINATES,
  SAFE_POSITIONS,
  getPawnCell,
  baseCell
} from '../../utils/boardLayout';

const QUADRANT_BG = {
  RED: 'bg-red-950/40',
  GREEN: 'bg-green-950/40',
  YELLOW: 'bg-yellow-950/30',
  BLUE: 'bg-blue-950/40'
};

function TrackCells() {
  return TRACK_COORDINATES.map(([row, col], idx) => {
    const isSafe = SAFE_POSITIONS.has(idx);
    const pct = 100 / GRID_SIZE;
    return (
      <div
        key={`cell_${idx}`}
        className={`absolute border border-gray-800/60 ${isSafe ? 'bg-gray-200' : 'bg-white'}`}
        style={{
          left: `${col * pct}%`,
          top: `${row * pct}%`,
          width: `${pct}%`,
          height: `${pct}%`
        }}
      >
        {isSafe && <span className="flex items-center justify-center h-full text-[10px]">★</span>}
      </div>
    );
  });
}

export default function LudoBoard({ players, pawns, validMoves, myColor, onPawnTap }) {
  const containerRef = useRef(null);
  const [cellSizePx, setCellSizePx] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      setCellSizePx(width / GRID_SIZE);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const selectableIds = useMemo(() => new Set(validMoves.map((m) => m.pawnId)), [validMoves]);

  const cellGroups = useMemo(() => {
    const groups = new Map();
    const activeColors = players.map((p) => p.color);

    activeColors.forEach((color) => {
      (pawns[color] || []).forEach((pawn) => {
        const cell =
          pawn.steps === -1 ? baseCell(color, Number(pawn.id.split('_')[1])) : getPawnCell(color, pawn.steps);
        if (!cell) return;
        const key = `${cell[0].toFixed(2)}_${cell[1].toFixed(2)}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push({ pawn, color, cell });
      });
    });
    return groups;
  }, [pawns, players]);

  return (
    <div
      ref={containerRef}
      className="relative w-[95vw] h-[95vw] max-w-[420px] max-h-[420px] bg-white rounded-xl shadow-2xl border-4 border-gray-800 overflow-hidden"
    >
      <div className={`absolute left-0 top-0 w-[40%] h-[40%] ${QUADRANT_BG.RED} rounded-br-3xl`} />
      <div className={`absolute right-0 top-0 w-[40%] h-[40%] ${QUADRANT_BG.GREEN} rounded-bl-3xl`} />
      <div className={`absolute right-0 bottom-0 w-[40%] h-[40%] ${QUADRANT_BG.YELLOW} rounded-tl-3xl`} />
      <div className={`absolute left-0 bottom-0 w-[40%] h-[40%] ${QUADRANT_BG.BLUE} rounded-tr-3xl`} />

      <div
        className="absolute bg-gray-900 border-2 border-yellow-500 flex items-center justify-center font-bold text-[9px] text-yellow-400"
        style={{ left: '40%', top: '40%', width: '20%', height: '20%' }}
      >
        HOME
      </div>

      <TrackCells />

      {cellSizePx > 0 &&
        Array.from(cellGroups.entries()).map(([key, group]) =>
          group.map(({ pawn, color, cell }, idx) => {
            const pct = 100 / GRID_SIZE;
            const translateX = cell[1] * pct * (cellSizePx * GRID_SIZE) / 100;
            const translateY = cell[0] * pct * (cellSizePx * GRID_SIZE) / 100;
            const isSelectable = color === myColor && selectableIds.has(pawn.id);
            return (
              <Pawn
                key={pawn.id}
                color={color}
                translateX={translateX}
                translateY={translateY}
                cellSizePx={cellSizePx}
                isSelectable={isSelectable}
                isMyTurn={color === myColor}
                stackOffset={idx}
                onTap={() => onPawnTap(pawn.id)}
              />
            );
          })
        )}
    </div>
  );
}\n