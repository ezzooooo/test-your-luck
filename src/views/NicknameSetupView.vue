<template>
  <div class="nickname-setup-view">
    <div class="nickname-setup-container">
      <div class="setup-card">
        <div class="setup-header">
          <div v-if="authStore.currentUser?.photoURL" class="user-avatar">
            <img
              :src="authStore.currentUser.photoURL"
              :alt="authStore.currentUser.displayName || 'User'"
            />
          </div>
          <div v-else class="user-avatar">
            <div class="avatar-placeholder">👤</div>
          </div>
          <h1>닉네임 설정</h1>
          <p class="welcome-text">
            안녕하세요, {{ authStore.currentUser?.displayName || 'User' }}님!<br />
            게임에서 사용할 닉네임을 설정해주세요.
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="setup-form">
          <div class="form-group">
            <label for="nickname">닉네임</label>
            <input
              id="nickname"
              v-model="nickname"
              type="text"
              placeholder="2-10자의 닉네임을 입력하세요"
              maxlength="10"
              :class="{ error: nicknameError }"
              @input="validateNickname"
              @blur="validateNickname"
            />
            <div v-if="nicknameError" class="error-message">
              {{ nicknameError }}
            </div>
          </div>

          <div class="form-actions">
            <button
              type="submit"
              class="submit-btn"
              :class="{ disabled: !isValidNickname || loading }"
              :disabled="!isValidNickname || loading"
            >
              <div v-if="loading" class="loading-spinner"></div>
              <span v-else>게임 시작하기 🎲</span>
            </button>
          </div>
        </form>

        <div v-if="error" class="error-alert">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()

const nickname = ref('')
const nicknameError = ref('')
const loading = ref(false)
const error = ref('')

const isValidNickname = computed(() => {
  return (
    nickname.value.trim().length >= 2 && nickname.value.trim().length <= 10 && !nicknameError.value
  )
})

function validateNickname(): void {
  const trimmed = nickname.value.trim()

  if (trimmed.length === 0) {
    nicknameError.value = '닉네임을 입력해주세요.'
  } else if (trimmed.length < 2) {
    nicknameError.value = '닉네임은 2자 이상이어야 합니다.'
  } else if (trimmed.length > 10) {
    nicknameError.value = '닉네임은 10자 이하여야 합니다.'
  } else if (!/^[a-zA-Z0-9가-힣_-]+$/.test(trimmed)) {
    nicknameError.value = '닉네임은 한글, 영문, 숫자, -, _만 사용 가능합니다.'
  } else {
    nicknameError.value = ''
  }
}

async function handleSubmit(): Promise<void> {
  if (!isValidNickname.value || !authStore.currentUser) {
    return
  }

  try {
    loading.value = true
    error.value = ''

    const trimmedNickname = nickname.value.trim()

    if (userStore.currentUser) {
      await userStore.updateUserInFirestore({
        nickname: trimmedNickname,
        isNicknameSet: true,
      })
    }

    router.push('/game')
  } catch (err: any) {
    console.error('Nickname setup error:', err)
    error.value = '닉네임 설정 중 오류가 발생했습니다. 다시 시도해주세요.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/')
    return
  }

  if (authStore.currentUser?.displayName) {
    nickname.value = authStore.currentUser.displayName
    validateNickname()
  }

  if (userStore.currentUser?.isNicknameSet) {
    router.push('/game')
  }
})
</script>

<style scoped>
.nickname-setup-view {
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nickname-setup-container {
  width: 100%;
  max-width: 500px;
}

.setup-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.setup-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.user-avatar {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
}

.setup-header h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 2rem;
  font-weight: bold;
}

.welcome-text {
  color: #7f8c8d;
  line-height: 1.6;
  margin: 0;
}

.setup-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: bold;
  color: #2c3e50;
  font-size: 1.1rem;
}

.form-group input {
  padding: 1rem 1.5rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-group input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-group input.error {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-actions {
  margin-top: 1rem;
}

.submit-btn {
  width: 100%;
  padding: 1.25rem 2rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
}

.submit-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(52, 152, 219, 0.4);
}

.submit-btn.disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-alert {
  margin-top: 1rem;
  padding: 1rem;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 8px;
  text-align: center;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .nickname-setup-view {
    padding: 1rem;
  }

  .setup-card {
    padding: 2rem;
  }

  .setup-header h1 {
    font-size: 1.75rem;
  }

  .user-avatar {
    width: 60px;
    height: 60px;
  }

  .avatar-placeholder {
    font-size: 1.5rem;
  }
}
</style>
