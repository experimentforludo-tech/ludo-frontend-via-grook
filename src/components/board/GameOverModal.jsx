import { useNavigate } from 'react-router-dom';

export default function GameOverModal({ winner, myColor }) {
  const navigate = useNavigate();
  const didWin = winner === myColor;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
      <div className="bg-gray-900 border border-gray-700 rounded-3xl p-8 text-center w-full max-w-sm">
        <p className="text-6xl mb-4">{didWin ? '🏆' : '🎮'}</p>
        <h2 className="text-2xl font-black text-white mb-2">
          {didWin ? 'You Won!' : `${winner} Wins`}
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          {didWin ? 'Great game — the bots didn\u2019t stand a chance.' : 'Better luck next round.'}
        </p>
        <button
          onClick={() => navigate('/')}
          className="w-full bg-gradient-to-r from-ludoGreen to-ludoBlue py-3 rounded-xl font-bold text-white active:scale-95 transition"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}