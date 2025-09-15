import type { CoinSide, GameResult } from '@/types/game'

export const STARTING_MMR = 10000
export const MIN_MMR_CHANGE = 15
export const MAX_MMR_CHANGE = 25
export const MIN_GAMES_FOR_RANKING = 10

export function flipCoin(): CoinSide {
  return Math.random() < 0.5 ? 'heads' : 'tails'
}

export function calculateMmrChange(): number {
  return Math.floor(Math.random() * (MAX_MMR_CHANGE - MIN_MMR_CHANGE + 1)) + MIN_MMR_CHANGE
}

export function determineGameResult(prediction: CoinSide, actual: CoinSide): GameResult {
  return prediction === actual ? 'win' : 'lose'
}

export function calculateNewMmr(currentMmr: number, result: GameResult, mmrChange: number): number {
  const newMmr = result === 'win' ? currentMmr + mmrChange : currentMmr - mmrChange
  return Math.max(0, newMmr)
}

export function calculateWinRate(wins: number, totalGames: number): number {
  return totalGames === 0 ? 0 : Math.round((wins / totalGames) * 100)
}

export function calculatePercentile(userMmr: number, allMmrs: number[]): number {
  if (allMmrs.length === 0) return 100

  const sortedMmrs = [...allMmrs].sort((a, b) => a - b)
  const lowerCount = sortedMmrs.filter(mmr => mmr < userMmr).length

  return Math.round((lowerCount / sortedMmrs.length) * 100)
}

export function generateGameId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

export function getCoinDisplayText(side: CoinSide): string {
  return side === 'heads' ? '앞면' : '뒷면'
}

export function getResultDisplayText(result: GameResult): string {
  return result === 'win' ? '승리!' : '패배!'
}

export function getMmrChangeDisplayText(result: GameResult, change: number): string {
  const sign = result === 'win' ? '+' : '-'
  return `${sign}${change} MMR`
}