import { create } from 'zustand';

export const useGameStore = create((set) => ({
  connectionStatus: 'idle',
  roomId: null,
  players: [],
  gameState: null,
  currentTurnColor: null,
  validMoves: [],
  isRolling: false,
  lastMovedPawnId: null,
  errorMessage: null,
  winner: null,

  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setError: (message) => set({ errorMessage: message }),
  clearError: () => set({ errorMessage: null }),

  applyRoomState: ({ roomId, players, gameState }) =>
    set((s) => ({
      roomId: roomId ?? s.roomId,
      players: players ?? s.players,
      gameState: gameState ?? s.gameState,
      currentTurnColor: gameState ? gameState.turnOrder[gameState.currentTurnIndex] : s.currentTurnColor,
      winner: gameState?.winner ?? s.winner,
      validMoves: gameState?.diceValue == null ? [] : s.validMoves
    })),

  setRolling: (isRolling) => set({ isRolling }),
  setValidMoves: (moves) => set({ validMoves: moves }),
  clearValidMoves: () => set({ validMoves: [] }),
  setLastMovedPawn: (pawnId) => set({ lastMovedPawnId: pawnId }),
  setWinner: (winner) => set({ winner }),

  reset: () =>
    set({
      roomId: null,
      players: [],
      gameState: null,
      currentTurnColor: null,
      validMoves: [],
      isRolling: false,
      lastMovedPawnId: null,
      errorMessage: null,
      winner: null
    })
}));