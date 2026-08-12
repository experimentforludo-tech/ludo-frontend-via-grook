import { io } from 'socket.io-client';
import { useAuthStore } from '../store/useAuthStore';
import { useGameStore } from '../store/useGameStore';
import { triggerVibration } from '../utils/haptics';

let socket = null;

export function connectSocket() {
  if (socket?.connected) return socket;

  const token = useAuthStore.getState().token;
  if (!token) return null;

  useGameStore.getState().setConnectionStatus('connecting');

  socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000
  });

  socket.on('connect', () => {
    useGameStore.getState().setConnectionStatus('connected');
    useGameStore.getState().clearError();
  });

  socket.on('disconnect', () => {
    useGameStore.getState().setConnectionStatus('disconnected');
  });

  socket.on('connect_error', (err) => {
    useGameStore.getState().setConnectionStatus('error');
    useGameStore.getState().setError(err.message || 'Connection failed');
  });

  socket.on('error_message', ({ message }) => {
    useGameStore.getState().setError(message);
  });

  socket.on('game_state_updated', (payload) => {
    useGameStore.getState().applyRoomState(payload);
  });

  socket.on('dice_rolled', () => {
    useGameStore.getState().setRolling(false);
    triggerVibration('light');
  });

  socket.on('valid_moves', ({ moves }) => {
    useGameStore.getState().setValidMoves(moves);
  });

  socket.on('no_valid_moves_reroll', () => {
    useGameStore.getState().clearValidMoves();
  });

  socket.on('turn_passed', () => {
    useGameStore.getState().clearValidMoves();
  });

  socket.on('turn_forfeited', () => {
    useGameStore.getState().clearValidMoves();
  });

  socket.on('move_made', ({ move, result }) => {
    useGameStore.getState().setLastMovedPawn(move.pawnId);
    useGameStore.getState().clearValidMoves();
    if (result.captured) triggerVibration('heavy');
  });

  socket.on('game_over', ({ winner }) => {
    useGameStore.getState().setWinner(winner);
    triggerVibration('win');
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  useGameStore.getState().setConnectionStatus('idle');
}

export function getSocket() {
  return socket;
}

export function emitJoinRoom(roomId) {
  socket?.emit('join_room', { roomId });
}

export function emitQuickMatch() {
  socket?.emit('quick_match');
}

export function emitStartVsBot(roomId) {
  socket?.emit('start_vs_bot', { roomId });
}

export function emitRollDice(roomId) {
  useGameStore.getState().setRolling(true);
  socket?.emit('roll_dice', { roomId });
}

export function emitMovePawn(roomId, pawnId) {
  socket?.emit('move_pawn', { roomId, move: { pawnId } });
}
