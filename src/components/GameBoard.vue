<template>
  <div class="game-board">
    <div class="prediction-section">
      <h3>동전의 결과를 예측하세요!</h3>
      <div class="prediction-buttons">
        <button
          class="prediction-btn heads"
          :class="{ active: selectedPrediction === 'heads', disabled: isAnimating }"
          :disabled="isAnimating"
          @click="selectPrediction('heads')"
        >
          <span class="btn-icon">🪙</span>
          <span class="btn-text">앞면</span>
        </button>
        <button
          class="prediction-btn tails"
          :class="{ active: selectedPrediction === 'tails', disabled: isAnimating }"
          :disabled="isAnimating"
          @click="selectPrediction('tails')"
        >
          <span class="btn-icon">🪙</span>
          <span class="btn-text">뒷면</span>
        </button>
      </div>
    </div>

    <div class="action-section">
      <button
        class="play-btn"
        :class="{ disabled: !selectedPrediction || isAnimating }"
        :disabled="!selectedPrediction || isAnimating"
        @click="playGame"
      >
        <span v-if="isAnimating">동전 던지는 중...</span>
        <span v-else>🎲 동전 던지기</span>
      </button>
    </div>

    <div v-if="lastResult && !isAnimating" class="result-section">
      <div class="result-display">
        <h4>게임 결과</h4>
        <div class="result-details">
          <div class="result-item">
            <span class="label">예측:</span>
            <span class="value">{{ getCoinDisplayText(currentPrediction!) }}</span>
          </div>
          <div class="result-item">
            <span class="label">결과:</span>
            <span class="value">{{ getCoinDisplayText(lastResult) }}</span>
          </div>
          <div class="result-item">
            <span class="label">결과:</span>
            <span class="value" :class="lastOutcome">
              {{ getResultDisplayText(lastOutcome!) }}
            </span>
          </div>
          <div class="result-item">
            <span class="label">MMR 변화:</span>
            <span class="value" :class="lastOutcome">
              {{ getMmrChangeDisplayText(lastOutcome!, lastMmrChange) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CoinSide } from '@/types/game'
import { getCoinDisplayText, getResultDisplayText, getMmrChangeDisplayText } from '@/utils/gameLogic'

interface Props {
  isAnimating: boolean
  currentPrediction: CoinSide | null
  lastResult: CoinSide | null
  lastOutcome: 'win' | 'lose' | null
  lastMmrChange: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  playGame: [prediction: CoinSide]
}>()

const selectedPrediction = ref<CoinSide | null>(null)

function selectPrediction(prediction: CoinSide): void {
  if (!props.isAnimating) {
    selectedPrediction.value = prediction
  }
}

function playGame(): void {
  if (selectedPrediction.value && !props.isAnimating) {
    emit('playGame', selectedPrediction.value)
  }
}
</script>

<style scoped>
.game-board {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.prediction-section h3 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.prediction-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.prediction-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 2rem;
  border: 2px solid transparent;
  border-radius: 12px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.prediction-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.prediction-btn.heads.active {
  background: linear-gradient(45deg, #ffd700, #ffed4a);
  border-color: #f39c12;
  color: white;
}

.prediction-btn.tails.active {
  background: linear-gradient(45deg, #e74c3c, #ff6b6b);
  border-color: #c0392b;
  color: white;
}

.prediction-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-icon {
  font-size: 2rem;
}

.btn-text {
  font-weight: bold;
  font-size: 1.1rem;
}

.action-section {
  text-align: center;
}

.play-btn {
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.play-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(52, 152, 219, 0.4);
}

.play-btn.disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.result-section {
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
}

.result-display h4 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.result-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.result-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.result-item .label {
  font-weight: bold;
  color: #7f8c8d;
}

.result-item .value {
  font-weight: bold;
}

.result-item .value.win {
  color: #27ae60;
}

.result-item .value.lose {
  color: #e74c3c;
}

@media (max-width: 768px) {
  .game-board {
    padding: 1.5rem;
  }

  .prediction-buttons {
    flex-direction: column;
    align-items: center;
  }

  .prediction-btn {
    width: 100%;
    max-width: 200px;
  }

  .play-btn {
    width: 100%;
    max-width: 250px;
  }
}
</style>