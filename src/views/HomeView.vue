<template>
  <div class="home-view">
    <!-- 크롬 브라우저 안내 모달 -->
    <div v-if="showChromeModal" class="chrome-modal-overlay" @click="closeChromeModal">
      <div class="chrome-modal" @click.stop>
        <div class="chrome-modal-header">
          <h3>🌐 최적의 게임 경험을 위해</h3>
          <button @click="closeChromeModal" class="close-btn">×</button>
        </div>
        <div class="chrome-modal-content">
          <div class="chrome-icon">🟢</div>
          <p>이 게임은 <strong>Google Chrome</strong>에서 최적화되어 있습니다.</p>
          <p>더 나은 성능과 안정성을 위해 Chrome을 사용해주세요!</p>
          <div class="chrome-actions">
            <a href="https://www.google.com/chrome/" target="_blank" class="chrome-download-btn">
              Chrome 다운로드
            </a>
            <button @click="closeChromeModal" class="continue-btn">현재 브라우저로 계속</button>
          </div>
        </div>
      </div>
    </div>

    <div class="home-container">
      <div class="home-header">
        <div class="nav-spacer"></div>
        <h1>🎲 Test Your Luck</h1>
        <div v-if="authStore.isAuthenticated" class="header-actions">
          <router-link to="/ranking" class="ranking-btn">🏆 랭킹</router-link>
          <button @click="handleLogout" class="logout-btn">🚪 로그아웃</button>
        </div>
        <div v-else class="nav-spacer"></div>
      </div>

      <!-- 1. 사용자 대시보드 섹션 (상단 전체 너비) -->
      <div v-if="authStore.isAuthenticated && userStore.currentUser" class="user-dashboard-section">
        <div class="user-dashboard">
          <div class="welcome-back">
            <h2>반갑습니다, {{ userStore.currentUser?.nickname }}님!</h2>
            <div class="user-summary">
              <div class="summary-stat">
                <div class="stat-label">현재 MMR</div>
                <div class="stat-value mmr">{{ userStore.mmr.toLocaleString() }}</div>
              </div>
              <div class="summary-stat">
                <div class="stat-label">플레이 게임</div>
                <div class="stat-value">{{ userStore.gamesPlayed }}게임</div>
              </div>
              <div class="summary-stat">
                <div class="stat-label">승률</div>
                <div class="stat-value">{{ userStore.winRate }}%</div>
              </div>
            </div>
          </div>

          <div class="action-buttons">
            <router-link to="/game" class="action-btn primary"> 🎲 게임 플레이 </router-link>
            <router-link to="/ranking" class="action-btn secondary"> 🏆 랭킹 보기 </router-link>
            <button @click="handleLogout" class="action-btn danger">🚪 로그아웃</button>
          </div>
        </div>
      </div>

      <!-- 2. 게임 소개 섹션 (전체 너비) -->
      <div class="hero-section">
        <div class="hero-content">
          <p class="game-subtitle">동전 던지기로 운을 시험해보세요!</p>
          <div class="game-rules">
            <div class="rule-card">
              <div class="rule-icon">🪙</div>
              <div class="rule-text">동전의 앞면/뒷면 예측</div>
            </div>
            <div class="rule-card">
              <div class="rule-icon">🎯</div>
              <div class="rule-text">시작 MMR 10,000점</div>
            </div>
            <div class="rule-card">
              <div class="rule-icon">⚡</div>
              <div class="rule-text">승패 시 15~25점 변동</div>
            </div>
            <div class="rule-card">
              <div class="rule-icon">🏆</div>
              <div class="rule-text">랭킹 시스템</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. 로그인 섹션 (로그인 안된 경우만) -->
      <div v-if="!authStore.isAuthenticated" class="login-section">
        <div class="login-card">
          <h2>게임 시작하기</h2>
          <p class="login-description">
            Google 계정으로 로그인하여 게임을 시작하세요!<br />
            MMR과 게임 기록이 안전하게 저장됩니다.
          </p>
          <GoogleLogin @login-success="handleLoginSuccess" />
        </div>
      </div>

      <!-- 4. 주요 기능 섹션 (전체 너비) -->
      <div class="features-section">
        <div class="features-content">
          <h3>주요 기능</h3>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🎮</div>
              <h4>간단한 게임플레이</h4>
              <p>동전의 앞면/뒷면을 예측하고 결과를 확인하세요</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📊</div>
              <h4>MMR 시스템</h4>
              <p>승패에 따라 점수가 변동되는 레이팅 시스템</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🏅</div>
              <h4>랭킹 시스템</h4>
              <p>다른 플레이어들과 순위를 비교해보세요</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h4>반응형 디자인</h4>
              <p>모바일과 데스크톱에서 모두 완벽하게 작동</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'
import GoogleLogin from '@/components/GoogleLogin.vue'

const userStore = useUserStore()
const authStore = useAuthStore()
const showChromeModal = ref(false)

// 브라우저 감지 함수
function detectBrowser(): string {
  const userAgent = navigator.userAgent.toLowerCase()

  if (userAgent.includes('chrome') && !userAgent.includes('edg') && !userAgent.includes('opr')) {
    return 'chrome'
  } else if (userAgent.includes('firefox')) {
    return 'firefox'
  } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    return 'safari'
  } else if (userAgent.includes('edg')) {
    return 'edge'
  } else if (userAgent.includes('opr')) {
    return 'opera'
  } else {
    return 'other'
  }
}

// 크롬이 아닌 브라우저인지 확인
function shouldShowChromeModal(): boolean {
  const browser = detectBrowser()
  const hasSeenModal = localStorage.getItem('chrome-modal-seen')

  // 크롬이 아니고, 아직 모달을 본 적이 없으면 표시
  return browser !== 'chrome' && !hasSeenModal
}

function closeChromeModal(): void {
  showChromeModal.value = false
  localStorage.setItem('chrome-modal-seen', 'true')
}

function handleLoginSuccess(): void {
  console.log('Login successful!')
}

async function handleLogout(): Promise<void> {
  await authStore.logout()
  userStore.logout()
}

onMounted(async () => {
  await authStore.initAuth()
  userStore.loadUserFromStorage()

  // 크롬 모달 표시 여부 확인
  if (shouldShowChromeModal()) {
    showChromeModal.value = true
  }
})
</script>

<style scoped>
/* 크롬 모달 스타일 */
.chrome-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.chrome-modal {
  background: white;
  border-radius: 20px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.chrome-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e0e0e0;
  background: linear-gradient(135deg, #4285f4, #34a853);
  color: white;
  border-radius: 20px 20px 0 0;
}

.chrome-modal-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: white;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.chrome-modal-content {
  padding: 2rem;
  text-align: center;
}

.chrome-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.chrome-modal-content p {
  margin: 1rem 0;
  color: #333;
  line-height: 1.6;
}

.chrome-modal-content p strong {
  color: #4285f4;
  font-weight: 600;
}

.chrome-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.chrome-download-btn {
  background: linear-gradient(135deg, #4285f4, #34a853);
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(66, 133, 244, 0.3);
}

.chrome-download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 133, 244, 0.4);
  color: white;
  text-decoration: none;
}

.continue-btn {
  background: #f8f9fa;
  color: #666;
  border: 2px solid #e0e0e0;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.continue-btn:hover {
  background: #e9ecef;
  border-color: #d0d0d0;
  transform: translateY(-1px);
}

.home-view {
  min-height: 100vh;
  padding: 2rem;
}

.home-container {
  max-width: 1400px;
  min-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0 1rem;
}

.home-header h1 {
  color: white;
  margin: 0;
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.nav-spacer {
  width: 120px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

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

.logout-btn {
  padding: 0.75rem 1.5rem;
  background: rgba(231, 76, 60, 0.8);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.ranking-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.logout-btn:hover {
  background: rgba(231, 76, 60, 1);
  transform: translateY(-2px);
}

/* 1. 사용자 대시보드 섹션 */
.user-dashboard-section {
  width: 100%;
}

.user-dashboard {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
}

.welcome-back h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.user-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-stat {
  text-align: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.stat-label {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: bold;
}

.stat-value.mmr {
  background: linear-gradient(45deg, #3498db, #2980b9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.action-btn.primary {
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.action-btn.secondary {
  background: linear-gradient(45deg, #f39c12, #e67e22);
  color: white;
  box-shadow: 0 4px 15px rgba(243, 156, 18, 0.3);
}

.action-btn.danger {
  background: linear-gradient(45deg, #e74c3c, #c0392b);
  color: white;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

/* 2. 게임 소개 섹션 */
.hero-section {
  width: 100%;
}

.hero-content {
  text-align: center;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 3rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.game-subtitle {
  font-size: 1.5rem;
  margin: 0 0 3rem;
  opacity: 0.9;
}

.game-rules {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.rule-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.rule-card:hover {
  transform: translateY(-5px);
}

.rule-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.rule-text {
  font-weight: bold;
  color: white;
  font-size: 1rem;
}

/* 3. 로그인 섹션 */
.login-section {
  display: flex;
  justify-content: center;
  width: 100%;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 3rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
}

.login-card h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.8rem;
}

.login-description {
  text-align: center;
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-weight: bold;
  color: #2c3e50;
}

.input-group input {
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  background: white;
}

.input-group input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.input-helper {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.start-btn {
  padding: 1.2rem 2rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.3);
}

.start-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(52, 152, 219, 0.4);
}

.start-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 4. 주요 기능 섹션 */
.features-section {
  width: 100%;
}

.features-content {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 3rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.features-section h3 {
  font-size: 2rem;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h4 {
  color: white;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.feature-card p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .game-rules {
    grid-template-columns: repeat(2, 1fr);
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .home-view {
    padding: 0.5rem;
  }

  .home-container {
    gap: 2rem;
    min-width: auto;
  }

  .home-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
    margin-bottom: 0;
  }

  .home-header h1 {
    font-size: 1.5rem;
    flex: 1;
    margin: 0;
  }

  .nav-spacer {
    display: none;
  }

  .header-actions {
    flex-direction: row;
    gap: 0.5rem;
  }

  .ranking-btn,
  .logout-btn {
    padding: 0.5rem 0.8rem;
    font-size: 0.8rem;
    white-space: nowrap;
  }

  .hero-content {
    padding: 2rem;
  }

  .game-subtitle {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }

  .game-rules {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .rule-card {
    padding: 1.5rem;
  }

  .rule-icon {
    font-size: 2rem;
  }

  .login-card,
  .user-dashboard {
    padding: 2rem;
  }

  .user-summary {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    grid-template-columns: 1fr;
  }

  .features-content {
    padding: 2rem;
  }

  .features-section h3 {
    font-size: 1.5rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .feature-card {
    padding: 1.5rem;
  }
}
</style>
