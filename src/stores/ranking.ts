import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RankingData, UserData, GameRecord } from '@/types/game'
import { MIN_GAMES_FOR_RANKING, calculateWinRate, calculatePercentile } from '@/utils/gameLogic'
import { firestoreService } from '@/services/firestore'

export const useRankingStore = defineStore('ranking', () => {
  const allUsers = ref<UserData[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const rankingSubscription = ref<(() => void) | null>(null)

  const rankedUsers = computed(() => {
    return allUsers.value
      .filter(user => user.gamesPlayed >= MIN_GAMES_FOR_RANKING)
      .map((user, index, filteredUsers) => {
        const mmrs = filteredUsers.map(u => u.mmr)
        const percentile = calculatePercentile(user.mmr, mmrs)

        return {
          userId: user.id,
          nickname: user.nickname,
          mmr: user.mmr,
          gamesPlayed: user.gamesPlayed,
          winRate: calculateWinRate(user.wins, user.gamesPlayed),
          rank: 0,
          percentile
        } as RankingData
      })
      .sort((a, b) => b.mmr - a.mmr)
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }))
  })

  const topPlayers = computed(() => rankedUsers.value.slice(0, 10))

  function getUserRank(userId: string): RankingData | null {
    return rankedUsers.value.find(user => user.userId === userId) || null
  }

  function loadRankingData(): void {
    const stored = localStorage.getItem('test-your-luck-all-users')
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as UserData[]
        allUsers.value = parsed.map((user: UserData) => ({
          ...user,
          createdAt: new Date(user.createdAt),
          gameHistory: user.gameHistory.map((record: GameRecord) => ({
            ...record,
            timestamp: new Date(record.timestamp)
          }))
        }))
      } catch (error) {
        console.error('Failed to load ranking data:', error)
        localStorage.removeItem('test-your-luck-all-users')
      }
    }
  }

  async function loadRankingFromFirestore(): Promise<void> {
    try {
      loading.value = true
      error.value = null

      const users = await firestoreService.getRankedUsers(MIN_GAMES_FOR_RANKING)
      allUsers.value = users
      saveRankingData()
    } catch (err: any) {
      console.error('Failed to load ranking from Firestore:', err)
      error.value = err.message || 'Failed to load ranking data'
    } finally {
      loading.value = false
    }
  }

  function subscribeToRankingUpdates(): void {
    if (rankingSubscription.value) {
      rankingSubscription.value()
    }

    rankingSubscription.value = firestoreService.subscribeToRankingUpdates(
      MIN_GAMES_FOR_RANKING,
      (users) => {
        allUsers.value = users
        saveRankingData()
      }
    )
  }

  function unsubscribeFromRankingUpdates(): void {
    if (rankingSubscription.value) {
      rankingSubscription.value()
      rankingSubscription.value = null
    }
  }

  function updateUserInRanking(userData: UserData): void {
    const existingIndex = allUsers.value.findIndex(user => user.id === userData.id)

    if (existingIndex >= 0) {
      allUsers.value[existingIndex] = { ...userData }
    } else {
      allUsers.value.push({ ...userData })
    }

    saveRankingData()
  }

  function saveRankingData(): void {
    localStorage.setItem('test-your-luck-all-users', JSON.stringify(allUsers.value))
  }

  function addDemoUsers(): void {
    if (allUsers.value.length === 0) {
      const demoUsers: UserData[] = [
        {
          id: 'demo1',
          nickname: 'LuckyPlayer',
          mmr: 12500,
          gamesPlayed: 50,
          wins: 32,
          losses: 18,
          gameHistory: [],
          createdAt: new Date(Date.now() - 86400000 * 7)
        },
        {
          id: 'demo2',
          nickname: 'CoinMaster',
          mmr: 11800,
          gamesPlayed: 35,
          wins: 22,
          losses: 13,
          gameHistory: [],
          createdAt: new Date(Date.now() - 86400000 * 5)
        },
        {
          id: 'demo3',
          nickname: 'FlipKing',
          mmr: 9200,
          gamesPlayed: 28,
          wins: 12,
          losses: 16,
          gameHistory: [],
          createdAt: new Date(Date.now() - 86400000 * 3)
        }
      ]

      allUsers.value = demoUsers
      saveRankingData()
    }
  }

  return {
    allUsers,
    loading,
    error,
    rankedUsers,
    topPlayers,
    getUserRank,
    loadRankingData,
    loadRankingFromFirestore,
    subscribeToRankingUpdates,
    unsubscribeFromRankingUpdates,
    updateUserInRanking,
    addDemoUsers
  }
})
