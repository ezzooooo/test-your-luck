<template>
  <div class="ranking-view">
    <div class="ranking-container">
      <div class="ranking-header">
        <router-link to="/game" class="back-btn">← 게임으로</router-link>
        <h1>🏆 전체 랭킹</h1>
        <router-link to="/" class="home-btn">🏠 홈으로</router-link>
      </div>

      <div class="ranking-content">
        <div class="left-panel">
          <div class="ranking-stats">
            <div class="stat-card">
              <div class="stat-value">{{ totalPlayers }}</div>
              <div class="stat-label">총 플레이어</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ qualifiedPlayers }}</div>
              <div class="stat-label">랭킹 참여</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ averageMmr }}</div>
              <div class="stat-label">평균 MMR</div>
            </div>
          </div>
        </div>

        <div class="center-panel">
          <PlayerRanking
            :top-players="rankingStore.topPlayers"
            :current-user-rank="currentUserRank"
            :current-user-id="userStore.currentUser?.id || null"
          />
        </div>

        <div class="right-panel">
          <div v-if="userStore.currentUser && userStore.gamesPlayed < MIN_GAMES_FOR_RANKING"
               class="ranking-qualification">
            <div class="qualification-card">
              <h3>🎮 랭킹 참여 안내</h3>
              <p>
                랭킹에 참여하려면 최소 <strong>{{ MIN_GAMES_FOR_RANKING }}게임</strong>을 플레이해야 합니다.
              </p>
              <div class="progress-info">
                <div class="progress-text">
                  현재 {{ userStore.gamesPlayed }}게임 / {{ MIN_GAMES_FOR_RANKING }}게임 필요
                </div>
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: `${Math.min((userStore.gamesPlayed / MIN_GAMES_FOR_RANKING) * 100, 100)}%` }"
                  ></div>
                </div>
                <div class="remaining-games">
                  {{ Math.max(MIN_GAMES_FOR_RANKING - userStore.gamesPlayed, 0) }}게임 남음
                </div>
              </div>
              <router-link to="/game" class="play-more-btn">
                더 플레이하기 🎲
              </router-link>
            </div>
          </div>

          <div v-else class="ranking-tips">
            <div class="tips-card">
              <h3>🎯 랭킹 팁</h3>
              <div class="tip-item">
                <div class="tip-icon">🏆</div>
                <div class="tip-text">상위 랭킹을 위해 꾸준히 게임을 플레이하세요</div>
              </div>
              <div class="tip-item">
                <div class="tip-icon">📊</div>
                <div class="tip-text">승률과 게임 수 모두 중요합니다</div>
              </div>
              <div class="tip-item">
                <div class="tip-icon">⭐</div>
                <div class="tip-text">최소 10게임 이상 플레이해야 랭킹에 등록됩니다</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRankingStore } from '@/stores/ranking'
import PlayerRanking from '@/components/PlayerRanking.vue'
import { MIN_GAMES_FOR_RANKING } from '@/utils/gameLogic'

const userStore = useUserStore()
const rankingStore = useRankingStore()

const totalPlayers = computed(() => {
  return rankingStore.allUsers.length
})

const qualifiedPlayers = computed(() => {
  return rankingStore.rankedUsers.length
})

const averageMmr = computed(() => {
  if (rankingStore.rankedUsers.length === 0) return 0

  const total = rankingStore.rankedUsers.reduce((sum, player) => sum + player.mmr, 0)
  return Math.round(total / rankingStore.rankedUsers.length).toLocaleString()
})

const currentUserRank = computed(() => {
  if (userStore.currentUser) {
    return rankingStore.getUserRank(userStore.currentUser.id)
  }
  return null
})

onMounted(async () => {
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
.ranking-view {
  min-height: 100vh;
  padding: 2rem;
}

.ranking-container {
  max-width: 1400px;
  min-width: 1200px;
  margin: 0 auto;
}

.ranking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.ranking-header h1 {
  color: white;
  margin: 0;
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.back-btn,
.home-btn {
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
.home-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.ranking-content {
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  gap: 2rem;
  align-items: start;
}

.left-panel .ranking-stats {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #7f8c8d;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.center-panel {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.right-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.ranking-qualification,
.ranking-tips {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
}

.qualification-card h3,
.tips-card h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  text-align: center;
}

.qualification-card p {
  color: #7f8c8d;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  text-align: center;
}

.progress-info {
  margin-bottom: 2rem;
}

.progress-text {
  color: #2c3e50;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(45deg, #3498db, #2980b9);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.remaining-games {
  color: #7f8c8d;
  font-size: 0.9rem;
  text-align: center;
}

.play-more-btn {
  display: block;
  text-align: center;
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.play-more-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(52, 152, 219, 0.4);
}

.tips-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
}

.tip-icon {
  font-size: 1.5rem;
}

.tip-text {
  color: #2c3e50;
  font-size: 0.9rem;
  line-height: 1.4;
}

@media (max-width: 1200px) {
  .ranking-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .left-panel .ranking-stats {
    grid-template-columns: repeat(3, 1fr);
    max-width: 600px;
    margin: 0 auto;
  }

  .right-panel {
    order: -1;
  }
}

@media (max-width: 768px) {
  .ranking-view {
    padding: 0.5rem;
  }

  .ranking-container {
    min-width: auto;
  }

  .ranking-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    margin-bottom: 1rem;
    padding: 0 0.5rem;
  }

  .ranking-header h1 {
    font-size: 1.8rem;
  }

  .back-btn,
  .home-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .ranking-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* 모바일에서 섹션 순서 변경 - 랭킹을 맨 위로 */
  .center-panel {
    order: 1; /* 랭킹 섹션을 맨 위로 */
  }

  .left-panel {
    order: 2; /* 통계 섹션을 그 아래로 */
  }

  .right-panel {
    order: 3; /* 안내/팁 섹션을 맨 아래로 */
  }

  .left-panel .ranking-stats {
    grid-template-columns: 1fr;
    max-width: none;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .qualification-card,
  .tips-card {
    padding: 1.5rem;
  }

  .tip-item {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
}
</style>