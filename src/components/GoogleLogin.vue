<template>
  <div class="google-login">
    <button
      class="google-login-btn"
      :class="{ disabled: authStore.loading }"
      :disabled="authStore.loading"
      @click="handleGoogleLogin"
    >
      <div v-if="authStore.loading" class="loading-spinner"></div>
      <div v-else class="btn-content">
        <svg class="google-icon" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span>Google로 로그인</span>
      </div>
    </button>

    <div v-if="authStore.error" class="error-message">
      {{ authStore.error }}
      <button class="error-close" @click="authStore.clearError">×</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const userStore = useUserStore()
const router = useRouter()

const emit = defineEmits<{
  loginSuccess: []
}>()

async function handleGoogleLogin(): Promise<void> {
  const firebaseUser = await authStore.loginWithGoogle()
  console.log('Firebase user:', firebaseUser)

  if (firebaseUser) {
    const userData = await checkOrCreateUser(firebaseUser)
    console.log('User data after creation:', userData)
    console.log('isNicknameSet:', userData?.isNicknameSet)

    emit('loginSuccess')

    if (!userData?.isNicknameSet) {
      console.log('Redirecting to nickname setup')
      router.push('/nickname-setup')
    } else {
      console.log('Redirecting to game')
      router.push('/game')
    }
  }
}

async function checkOrCreateUser(firebaseUser: any): Promise<any> {
  try {
    await userStore.createFirebaseUser(firebaseUser)
    return userStore.currentUser
  } catch (error) {
    console.error('Failed to create Firebase user, falling back to local storage:', error)

    // Firestore 실패 시 로컬 스토리지 사용
    const displayName = firebaseUser.displayName || ''
    const userData = {
      id: `firebase_${firebaseUser.uid}`,
      uid: firebaseUser.uid,
      nickname: displayName || 'User',
      email: firebaseUser.email || '',
      photoURL: firebaseUser.photoURL || '',
      mmr: 10000,
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      gameHistory: [],
      createdAt: new Date(),
      isNicknameSet: !!displayName
    }

    userStore.setUserData(userData)
    return userData
  }
}
</script>

<style scoped>
.google-login {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.google-login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem 2rem;
  border: 2px solid #dadce0;
  border-radius: 8px;
  background: white;
  color: #3c4043;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 60px;
}

.google-login-btn:hover:not(.disabled) {
  background: #f8f9fa;
  border-color: #c1c7cd;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.google-login-btn.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.google-icon {
  width: 24px;
  height: 24px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4285f4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 8px;
  font-size: 0.9rem;
}

.error-close {
  background: none;
  border: none;
  color: #dc2626;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  margin-left: 1rem;
}

.error-close:hover {
  opacity: 0.7;
}

@media (max-width: 768px) {
  .google-login-btn {
    padding: 0.875rem 1.5rem;
    font-size: 0.9rem;
  }

  .google-icon {
    width: 20px;
    height: 20px;
  }
}
</style>