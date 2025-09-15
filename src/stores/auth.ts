import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => user.value !== null)
  const currentUser = computed(() => user.value)

  function initAuth(): Promise<void> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        user.value = firebaseUser
        loading.value = false
        resolve()
        unsubscribe()
      })
    })
  }

  async function loginWithGoogle(): Promise<User | null> {
    try {
      loading.value = true
      error.value = null

      const result = await signInWithPopup(auth, googleProvider)
      user.value = result.user

      return result.user
    } catch (err: any) {
      console.error('Google login error:', err)
      error.value = err.message || 'Google 로그인에 실패했습니다.'
      return null
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    try {
      loading.value = true
      error.value = null

      await signOut(auth)
      user.value = null
    } catch (err: any) {
      console.error('Logout error:', err)
      error.value = err.message || '로그아웃에 실패했습니다.'
    } finally {
      loading.value = false
    }
  }

  function clearError(): void {
    error.value = null
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    currentUser,
    initAuth,
    loginWithGoogle,
    logout,
    clearError
  }
})