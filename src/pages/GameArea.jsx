import { useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useGameStore } from '../store/useGameStore';
import {
  connectSocket,
  disconnectSocket,
  emitJoinRoom,
  emitQuickMatch,
  emitRollDice,
  emitMovePawn
} from '../socket/socketClient';
import { triggerVibration } from '../utils/haptics';
import LudoBoard from '../components/board/LudoBoard';
import Dice from '../components/board/Dice';
import TurnIndicator from '../components/board/TurnIndicator';
import GameOverModal from '../components/board/GameOverModal';

export default function GameArea() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const isQuickMatch = searchParams.get('mode') === 'match' || roomId === 'quick';
  const { user } = useAuthStore();
  const startedRef = useRef(false);

  const connectionStatus = useGameStore((s) => s.connectionStatus);
  const players = useGameStore((s) => s.players);
  const gameState = useGameStore((s) => s.gameState);
  const currentTurnColor = useGameStore((s) => s.currentTurnColor);
  const validMoves = useGameStore((s) => s.validMoves);
  const isRolling = useGameStore((s) => s.isRolling);
  const errorMessage = useGameStore((s) => s.errorMessage);
  const winner = useGameStore((s) => s.winner);
  const reset = useGameStore((s) => s.reset);
  const storeRoomId = useGameStore((s) => s.roomId);

  const myPlayer = players.find((p) => p.userId === user?.id);
  const myColor = myPlayer?.color || null;
  const isMyTurn = myColor && myColor === currentTurnColor;
  const canRoll = isMyTurn && !isRolling && gameState?.status === 'IN_PROGRESS' && gameState?.diceValue == null;

  useEffect(() => {
    const socket = connectSocket();
    if (!socket) return;

    if (isQuickMatch && !startedRef.current) {
      startedRef.current = true;
      emitQuickMatch();
    } else if (!isQuickMatch && roomId) {
      emitJoinRoom(roomId);
    }

    return () => {
      disconnectSocket();
      reset();
    };
  }, [roomId, isQuickMatch]);

  const handleRoll = () => {
    triggerVibration('light');
    const rid = storeRoomId || roomId;
    if (rid && rid !== 'quick') emitRollDice(rid);
  };

  const handlePawnTap = (pawnId) => {
    if (!isMyTurn) return;
    const rid = storeRoomId || roomId;
    if (rid && rid !== 'quick') emitMovePawn(rid, pawnId);
  };

  if (connectionStatus === 'connecting' || connectionStatus === 'idle') {
    return <div className="text-gray-400 text-sm">Connecting...</div>;
  }

  if (connectionStatus === 'error') {
    return (
      <div className="text-center px-6">
        <p className="text-red-400 text-sm mb-2">Couldn&apos;t connect: {errorMessage}</p>
        <p className="text-gray-500 text-xs">Check your connection and try again.</p>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="text-center px-6 space-y-3">
        <p className="text-gray-300 text-sm">Finding players...</p>
        <p className="text-gray-500 text-xs">
          {players.length > 0
            ? `${players.length} at the table. Game starts shortly.`
            : 'Looking for others online...'}
        </p>
        {players.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {players.map((p) => (
              <span key={p.userId} className="text-xs bg-gray-800 px-2 py-1 rounded-full text-gray-300">
                {p.username}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  const displayRoom = storeRoomId || roomId;

  return (
    <div className="flex flex-col items-center justify-center p-2 w-full h-full">
      <div className="mb-2">
        <span className="bg-gray-800 text-[10px] px-3 py-1 rounded-full text-gray-400 border border-gray-700 tracking-widest uppercase">
          Table: {displayRoom?.slice(-8) || '—'}
        </span>
      </div>

      <TurnIndicator players={players} currentTurnColor={currentTurnColor} />

      {errorMessage && (
        <div className="text-[11px] text-red-400 bg-red-950/50 border border-red-800 rounded-lg px-3 py-1 mb-2">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col items-center gap-4 w-full">
        <LudoBoard
          players={players}
          pawns={gameState.pawns}
          validMoves={validMoves}
          myColor={myColor}
          onPawnTap={handlePawnTap}
        />

        <Dice
          value={gameState.diceValue}
          isRolling={isRolling}
          canRoll={canRoll}
          onRoll={handleRoll}
          colorClass={isMyTurn ? 'Move a pawn' : `${currentTurnColor}'s turn`}
        />
      </div>

      {winner && <GameOverModal winner={winner} myColor={myColor} />}
    </div>
  );
}
