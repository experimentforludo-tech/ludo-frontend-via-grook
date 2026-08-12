import { memo } from 'react';

function Dice({ value, isRolling, canRoll, onRoll, colorClass }) {
  return (
    <div className="flex items-center gap-6 bg-gray-900 p-4 rounded-3xl border border-gray-800 w-[95vw] max-w-[400px] justify-between">
      <div className="text-center w-16">
        <p className="text-xs text-gray-400">Dice</p>
        <p className={`text-4xl font-black ${isRolling ? 'dice-rolling' : ''} text-ludoYellow`}>
          {isRolling ? '🎲' : value ?? '-'}
        </p>
      </div>
      <button
        onClick={onRoll}
        disabled={!canRoll}
        className={`flex-1 font-extrabold text-lg py-4 rounded-2xl shadow-lg active:scale-90 transition ${
          canRoll
            ? `bg-gradient-to-r from-ludoRed to-ludoYellow text-black`
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
        }`}
      >
        {canRoll ? 'ROLL 🎲' : colorClass}
      </button>
    </div>
  );
}

export default memo(Dice);\n