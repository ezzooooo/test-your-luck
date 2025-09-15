import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CoinSide, GameRecord, GameState } from '@/types/game'
import {
  flipCoin,
  calculateMmrChange,
  determineGameResult,
  calculateNewMmr,
  generateGameId
} from '@/utils/gameLogic'
import { useUserStore } from './user'

export const useGameStore = defineStore('game', () => {
  const gameState = ref<GameState>({
    isPlaying: false,
    isAnimating: false,
    currentPrediction: null,
    lastResult: null,
    lastOutcome: null,
    lastMmrChange: 0
  })

  async function playGame(prediction: CoinSide): Promise<void> {
    const userStore = useUserStore()

    if (!userStore.currentUser || gameState.value.isAnimating) {
      return
    }

    gameState.value.isPlaying = true
    gameState.value.isAnimating = true
    gameState.value.currentPrediction = prediction

    const result = flipCoin()
    const outcome = determineGameResult(prediction, result)
    const mmrChange = calculateMmrChange()
    const newMmr = calculateNewMmr(userStore.mmr, outcome, mmrChange)

    gameState.value.lastResult = result
    gameState.value.lastOutcome = outcome
    gameState.value.lastMmrChange = mmrChange

    await simulateCoinAnimation()

    const gameRecord: GameRecord = {
      id: generateGameId(),
      prediction,
      result,
      outcome,
      mmrChange,
      timestamp: new Date()
    }

    userStore.updateMmr(newMmr)
    userStore.addGameRecord(gameRecord)

    try {
      await userStore.addGameRecordToFirestore(gameRecord)
      await userStore.updateUserInFirestore({ mmr: newMmr })
    } catch (error) {
      console.error('Failed to save game data to Firestore:', error)
    }

    gameState.value.isAnimating = false
  }

  function simulateCoinAnimation(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, 2500)
    })
  }

  function resetGameState(): void {
    gameState.value.isPlaying = false
    gameState.value.currentPrediction = null
    gameState.value.lastResult = null
    gameState.value.lastOutcome = null
    gameState.value.lastMmrChange = 0
  }

  function startNewGame(): void {
    resetGameState()
    gameState.value.isPlaying = true
  }

  return {
    gameState,
    playGame,
    resetGameState,
    startNewGame
  }
})