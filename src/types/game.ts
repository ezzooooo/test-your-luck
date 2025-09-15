export type CoinSide = 'heads' | 'tails'

export type GameResult = 'win' | 'lose'

export interface GameRecord {
  id: string
  prediction: CoinSide
  result: CoinSide
  outcome: GameResult
  mmrChange: number
  timestamp: Date
}

export interface UserData {
  id: string
  uid?: string
  nickname: string
  email?: string
  photoURL?: string
  mmr: number
  gamesPlayed: number
  wins: number
  losses: number
  gameHistory: GameRecord[]
  createdAt: Date
  isNicknameSet?: boolean
}

export interface RankingData {
  userId: string
  nickname: string
  mmr: number
  gamesPlayed: number
  winRate: number
  rank: number
  percentile: number
}

export interface GameState {
  isPlaying: boolean
  isAnimating: boolean
  currentPrediction: CoinSide | null
  lastResult: CoinSide | null
  lastOutcome: GameResult | null
  lastMmrChange: number
}