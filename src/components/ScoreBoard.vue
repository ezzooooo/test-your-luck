<template>
  <div class="scoreboard">
    <div class="user-info">
      <div class="avatar">
        {{ userInitial }}
      </div>
      <div class="user-details">
        <h3 class="username">{{ nickname }}</h3>
        <div class="user-stats">
          <span class="games-played">{{ gamesPlayed }}게임</span>
          <span class="win-rate">승률 {{ winRate }}%</span>
        </div>
      </div>
    </div>

    <div class="mmr-section">
      <div class="mmr-display">
        <div class="mmr-label">현재 MMR</div>
        <div class="mmr-value" :class="getMmrTier(mmr).class">
          {{ mmr.toLocaleString() }}
        </div>
        <div class="mmr-tier">{{ getMmrTier(mmr).name }}</div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-item wins">
        <div class="stat-value">{{ wins }}</div>
        <div class="stat-label">승리</div>
      </div>
      <div class="stat-item losses">
        <div class="stat-value">{{ losses }}</div>
        <div class="stat-label">패배</div>
      </div>
    </div>

    <div v-if="currentRank" class="ranking-info">
      <div class="rank-display">
        <div class="rank-number">#{{ currentRank.rank }}</div>
        <div class="percentile">상위 {{ 100 - currentRank.percentile }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RankingData } from '@/types/game'

interface Props {
  nickname: string
  mmr: number
  gamesPlayed: number
  wins: number
  losses: number
  winRate: number
  currentRank: RankingData | null
}

const props = defineProps<Props>()

const userInitial = computed(() => {
  return props.nickname.charAt(0).toUpperCase()
})

interface MmrTier {
  name: string
  class: string
  minMmr: number
}

const mmrTiers: MmrTier[] = [
  { name: '브론즈', class: 'bronze', minMmr: 0 },
  { name: '실버', class: 'silver', minMmr: 8000 },
  { name: '골드', class: 'gold', minMmr: 10000 },
  { name: '플래티넘', class: 'platinum', minMmr: 12000 },
  { name: '다이아몬드', class: 'diamond', minMmr: 15000 },
  { name: '마스터', class: 'master', minMmr: 18000 },
  { name: '그랜드마스터', class: 'grandmaster', minMmr: 22000 }
]

function getMmrTier(mmr: number): MmrTier {
  for (let i = mmrTiers.length - 1; i >= 0; i--) {
    if (mmr >= mmrTiers[i].minMmr) {
      return mmrTiers[i]
    }
  }
  return mmrTiers[0]
}
</script>

<style scoped>
.scoreboard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(45deg, #3498db, #2980b9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.username {
  margin: 0;
  color: #2c3e50;
  font-size: 1.3rem;
}

.user-stats {
  display: flex;
  gap: 1rem;
  margin-top: 0.25rem;
}

.user-stats span {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.mmr-section {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 12px;
}

.mmr-display {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mmr-label {
  font-size: 0.9rem;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.mmr-value {
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1;
}

.mmr-value.bronze { color: #8B4513; }
.mmr-value.silver { color: #C0C0C0; }
.mmr-value.gold { color: #FFD700; }
.mmr-value.platinum { color: #B9F2FF; }
.mmr-value.diamond { color: #B57EDC; }
.mmr-value.master { color: #FF6B6B; }
.mmr-value.grandmaster {
  background: linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.mmr-tier {
  font-size: 1rem;
  font-weight: bold;
  color: #34495e;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  border-radius: 10px;
}

.stat-item.wins {
  background: linear-gradient(135deg, #d4edda, #c3e6cb);
  color: #155724;
}

.stat-item.losses {
  background: linear-gradient(135deg, #f8d7da, #f1b0b7);
  color: #721c24;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  margin-top: 0.25rem;
  opacity: 0.8;
}

.ranking-info {
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.rank-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 10px;
  color: white;
}

.rank-number {
  font-size: 1.5rem;
  font-weight: bold;
}

.percentile {
  font-size: 1rem;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .scoreboard {
    padding: 1.5rem;
  }

  .mmr-value {
    font-size: 2rem;
  }

  .user-stats {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>