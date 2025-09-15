<template>
  <div class="game-view">
    <div class="game-container">
      <div class="game-header">
        <router-link to="/" class="back-btn">← 홈으로</router-link>
        <h1>🎲 Test Your Luck</h1>
        <router-link to="/ranking" class="ranking-btn">🏆 랭킹</router-link>
      </div>

      <div class="game-content">
        <div class="left-panel">
          <ScoreBoard
            :nickname="userStore.currentUser?.nickname || ''"
            :mmr="userStore.mmr"
            :games-played="userStore.gamesPlayed"
            :wins="userStore.wins"
            :losses="userStore.losses"
            :win-rate="userStore.winRate"
            :current-rank="currentRank"
          />
        </div>

        <div class="center-panel">
          <div class="coin-section">
            <CoinFlip
              :is-animating="gameStore.gameState.isAnimating"
              :result="gameStore.gameState.lastResult"
            />
          </div>

          <GameBoard
            :is-animating="gameStore.gameState.isAnimating"
            :current-prediction="gameStore.gameState.currentPrediction"
            :last-result="gameStore.gameState.lastResult"
            :last-outcome="gameStore.gameState.lastOutcome"
            :last-mmr-change="gameStore.gameState.lastMmrChange"
            @play-game="handlePlayGame"
          />
        </div>

        <div class="right-panel">
          <div class="game-history">
            <h3>최근 게임</h3>
            <div v-if="recentGames.length === 0" class="no-games">
              아직 플레이한 게임이 없습니다.
            </div>
            <div v-else class="history-list">
              <div
                v-for="game in recentGames"
                :key="game.id"
                class="history-item"
                :class="game.outcome"
              >
                <div class="history-prediction">
                  {{ getCoinDisplayText(game.prediction) }} 예측
                </div>
                <div class="history-result">
                  {{ getCoinDisplayText(game.result) }} →
                  <span class="outcome">{{ game.outcome === 'win' ? '승' : '패' }}</span>
                </div>
                <div class="history-mmr" :class="game.outcome">
                  {{ game.outcome === 'win' ? '+' : '-' }}{{ game.mmrChange }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useGameStore } from '@/stores/game'
import { useRankingStore } from '@/stores/ranking'
import CoinFlip from '@/components/CoinFlip.vue'
import GameBoard from '@/components/GameBoard.vue'
import ScoreBoard from '@/components/ScoreBoard.vue'
import type { CoinSide } from '@/types/game'
import { getCoinDisplayText } from '@/utils/gameLogic'

const router = useRouter()
const userStore = useUserStore()
const gameStore = useGameStore()
const rankingStore = useRankingStore()

const recentGames = computed(() => {
  return userStore.currentUser?.gameHistory?.slice(0, 10) || []
})

const currentRank = computed(() => {
  if (userStore.currentUser) {
    return rankingStore.getUserRank(userStore.currentUser.id)
  }
  return null
})

async function handlePlayGame(prediction: CoinSide): Promise<void> {
  await gameStore.playGame(prediction)
}

watch(
  () => userStore.currentUser,
  (newUser) => {
    if (newUser) {
      rankingStore.updateUserInRanking(newUser)
    }
  },
  { deep: true }
)

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    router.push('/')
    return
  }

  gameStore.startNewGame()

  try {
    await rankingStore.loadRankingFromFirestore()
    rankingStore.subscribeToRankingUpdates()
  } catch (error) {
    console.error('Failed to load ranking data:', error)
    rankingStore.loadRankingData()
    rankingStore.addDemoUsers()
  }

  if (userStore.currentUser) {
    rankingStore.updateUserInRanking(userStore.currentUser)
  }
})

onUnmounted(() => {
  rankingStore.unsubscribeFromRankingUpdates()
})
</script>

<style scoped>
.game-view {
  min-height: 100vh;
  padding: 2rem;
}

.game-container {
  max-width: 1400px;
  min-width: 1200px;
  margin: 0 auto;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.game-header h1 {
  color: white;
  margin: 0;
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.back-btn,
.ranking-btn {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.back-btn:hover,
.ranking-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.game-content {
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  gap: 2rem;
  align-items: start;
}

.center-panel {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.coin-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.game-history {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-height: 500px;
  overflow-y: auto;
}

.game-history h3 {
  margin: 0 0 1rem;
  color: #2c3e50;
  text-align: center;
}

.no-games {
  text-align: center;
  color: #7f8c8d;
  padding: 2rem 0;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.history-item {
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.history-item.win {
  background: linear-gradient(135deg, #d4edda, #c3e6cb);
  border-left: 4px solid #28a745;
}

.history-item.lose {
  background: linear-gradient(135deg, #f8d7da, #f1b0b7);
  border-left: 4px solid #dc3545;
}

.history-prediction {
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.history-result {
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.history-result .outcome {
  font-weight: bold;
}

.history-mmr {
  font-weight: bold;
  text-align: right;
}

.history-mmr.win {
  color: #28a745;
}

.history-mmr.lose {
  color: #dc3545;
}

@media (max-width: 1200px) {
  .game-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .right-panel {
    order: -1;
  }

  .game-history {
    max-height: 300px;
  }
}

@media (max-width: 768px) {
  .game-view {
    padding: 1rem;
  }

  .game-container {
    min-width: auto;
  }

  .game-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .game-header h1 {
    font-size: 2rem;
  }

  .back-btn,
  .ranking-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .coin-section {
    padding: 1rem;
  }
}
</style>