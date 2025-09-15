<template>
  <div class="coin-container">
    <div
      class="coin"
      :class="{
        'flipping': isAnimating,
        [`result-${result}`]: result
      }"
    >
      <div class="coin-side heads">
        <div class="coin-face">
          <span class="coin-text">앞</span>
        </div>
      </div>
      <div class="coin-side tails">
        <div class="coin-face">
          <span class="coin-text">뒤</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CoinSide } from '@/types/game'

interface Props {
  isAnimating: boolean
  result: CoinSide | null
}

defineProps<Props>()
</script>

<style scoped>
.coin-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  perspective: 1000px;
}

.coin {
  width: 150px;
  height: 150px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.1s ease-in-out;
}

.coin.flipping.result-heads {
  animation: coinFlipHeads 2.5s ease-in-out;
}

.coin.flipping.result-tails {
  animation: coinFlipTails 2.5s ease-in-out;
}

.coin.result-heads {
  transform: rotateY(0deg);
}

.coin.result-tails {
  transform: rotateY(180deg);
}

.coin-side {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.coin-face {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  border: 4px solid #ffd700;
}

.heads .coin-face {
  background: linear-gradient(45deg, #ffd700, #ffed4a);
}

.tails .coin-face {
  background: linear-gradient(45deg, #c0392b, #e74c3c);
  transform: rotateY(180deg);
}

.tails {
  transform: rotateY(180deg);
}

.coin-text {
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

@keyframes coinFlipHeads {
  0% {
    transform: rotateY(0deg) rotateX(0deg);
  }
  25% {
    transform: rotateY(450deg) rotateX(180deg);
  }
  50% {
    transform: rotateY(900deg) rotateX(360deg);
  }
  75% {
    transform: rotateY(1350deg) rotateX(540deg);
  }
  100% {
    transform: rotateY(1800deg) rotateX(720deg);
  }
}

@keyframes coinFlipTails {
  0% {
    transform: rotateY(0deg) rotateX(0deg);
  }
  25% {
    transform: rotateY(450deg) rotateX(180deg);
  }
  50% {
    transform: rotateY(900deg) rotateX(360deg);
  }
  75% {
    transform: rotateY(1350deg) rotateX(540deg);
  }
  100% {
    transform: rotateY(1980deg) rotateX(720deg);
  }
}

@media (max-width: 768px) {
  .coin {
    width: 120px;
    height: 120px;
  }

  .coin-text {
    font-size: 2rem;
  }
}
</style>