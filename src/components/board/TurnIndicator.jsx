import { memo } from 'react';

const DOT_CLASSES = {
  RED: 'bg-ludoRed',
  GREEN: 'bg-ludoGreen',
  YELLOW: 'bg-ludoYellow',
  BLUE: 'bg-ludoBlue'
};

function TurnIndicator({ players, currentTurnColor }) {
  return (
    <div className="flex gap-2 flex-wrap justify-center mb-2">
      {players.map((p) => (
        <div
          key={p.color || p.userId}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] border ${
            p.color === currentTurnColor
              ? 'border-white bg-gray-800 scale-105'
              : 'border-gray-800 bg-gray-900 opacity-60'
          } transition`}
        >
          <span className={`w-2 h-2 rounded-full ${DOT_CLASSES[p.color] || 'bg-gray-500'}`} />
          <span className="text-gray-300">{p.username}</span>
          {p.color === currentTurnColor && <span className="text-white">●</span>}
        </div>
      ))}
    </div>
  );
}

export default memo(TurnIndicator);
