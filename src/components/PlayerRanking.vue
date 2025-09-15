<template>
  <div class="player-ranking-container">
    <div class="ranking-header">
      <h2>🏆 랭킹</h2>
      <p class="ranking-subtitle">최소 {{ MIN_GAMES_FOR_RANKING }}게임 이상 플레이한 플레이어들</p>
    </div>

    <div v-if="topPlayers.length === 0" class="no-rankings">
      <div class="no-rankings-icon">🎮</div>
      <h3>아직 랭킹 데이터가 없습니다</h3>
      <p>게임을 더 플레이해서 랭킹에 올라보세요!</p>
    </div>

    <div v-else class="ranking-list">
      <div
        v-for="player in topPlayers"
        :key="player.userId"
        class="ranking-item"
        :class="{
          'current-user': player.userId === currentUserId,
          'top-3': player.rank <= 3
        }"
      >
        <div class="rank-badge" :class="`rank-${player.rank}`">
          <span v-if="player.rank <= 3" class="rank-medal">
            {{ getRankMedal(player.rank) }}
          </span>
          <span v-else class="rank-number">{{ player.rank }}</span>
        </div>

        <div class="player-info">
          <div class="player-name">{{ player.nickname }}</div>
          <div class="player-stats">
            <span class="games">{{ player.gamesPlayed }}게임</span>
            <span class="winrate">승률 {{ player.winRate }}%</span>
          </div>
        </div>

        <div class="player-mmr">
          <div class="mmr-value">{{ player.mmr.toLocaleString() }}</div>
          <div class="percentile">상위 {{ 100 - player.percentile }}%</div>
        </div>
      </div>
    </div>

    <div v-if="currentUserRank && !isCurrentUserInTop10" class="current-user-rank">
      <div class="section-title">내 랭킹</div>
      <div class="ranking-item current-user">
        <div class="rank-badge">
          <span class="rank-number">{{ currentUserRank.rank }}</span>
        </div>

        <div class="player-info">
          <div class="player-name">{{ currentUserRank.nickname }}</div>
          <div class="player-stats">
            <span class="games">{{ currentUserRank.gamesPlayed }}게임</span>
            <span class="winrate">승률 {{ currentUserRank.winRate }}%</span>
          </div>
        </div>

        <div class="player-mmr">
          <div class="mmr-value">{{ currentUserRank.mmr.toLocaleString() }}</div>
          <div class="percentile">상위 {{ 100 - currentUserRank.percentile }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RankingData } from '@/types/game'
import { MIN_GAMES_FOR_RANKING } from '@/utils/gameLogic'

interface Props {
  topPlayers: RankingData[]
  currentUserRank: RankingData | null
  currentUserId: string | null
}

const props = defineProps<Props>()

const isCurrentUserInTop10 = computed(() => {
  return props.topPlayers.some(player => player.userId === props.currentUserId)
})

function getRankMedal(rank: number): string {
  switch (rank) {
    case 1: return '🥇'
    case 2: return '🥈'
    case 3: return '🥉'
    default: return ''
  }
}
</script>

<style scoped>
.player-ranking-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.ranking-header {
  text-align: center;
}

.ranking-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 2rem;
}

.ranking-subtitle {
  margin: 0.5rem 0 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.no-rankings {
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.no-rankings-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-rankings h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.no-rankings p {
  color: #7f8c8d;
  margin: 0;
}

.ranking-list {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f2f6;
  transition: all 0.3s ease;
}

.ranking-item:last-child {
  border-bottom: none;
}

.ranking-item.current-user {
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  border-left: 4px solid #2196f3;
}

.ranking-item.top-3 {
  background: linear-gradient(135deg, #fff8e1, #ffecb3);
}

.rank-badge {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  background: #f8f9fa;
  color: #2c3e50;
}

.rank-badge.rank-1 {
  background: linear-gradient(45deg, #ffd700, #ffed4a);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
}

.rank-badge.rank-2 {
  background: linear-gradient(45deg, #c0c0c0, #e8e8e8);
  color: white;
  box-shadow: 0 4px 12px rgba(192, 192, 192, 0.4);
}

.rank-badge.rank-3 {
  background: linear-gradient(45deg, #cd7f32, #daa520);
  color: white;
  box-shadow: 0 4px 12px rgba(205, 127, 50, 0.4);
}

.rank-medal {
  font-size: 1.5rem;
}

.player-info {
  flex: 1;
}

.player-name {
  font-weight: bold;
  color: #2c3e50;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.player-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.player-mmr {
  text-align: right;
}

.mmr-value {
  font-weight: bold;
  color: #2c3e50;
  font-size: 1.1rem;
}

.percentile {
  font-size: 0.85rem;
  color: #7f8c8d;
  margin-top: 0.125rem;
}

.current-user-rank {
  margin-top: 1rem;
}

.section-title {
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.current-user-rank .ranking-item {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: none;
}

@media (max-width: 768px) {
  .ranking-item {
    padding: 1rem;
    gap: 0.75rem;
  }

  .rank-badge {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .rank-medal {
    font-size: 1.2rem;
  }

  .player-stats {
    flex-direction: column;
    gap: 0.25rem;
  }

  .player-name {
    font-size: 1rem;
  }

  .mmr-value {
    font-size: 1rem;
  }
}
</style>