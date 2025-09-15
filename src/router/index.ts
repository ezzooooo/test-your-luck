import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Test Your Luck - 동전 던지기 게임'
      }
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('../views/GameView.vue'),
      meta: {
        title: '게임 플레이 - Test Your Luck',
        requiresAuth: true
      }
    },
    {
      path: '/ranking',
      name: 'ranking',
      component: () => import('../views/RankingView.vue'),
      meta: {
        title: '랭킹 - Test Your Luck'
      }
    },
    {
      path: '/nickname-setup',
      name: 'nickname-setup',
      component: () => import('../views/NicknameSetupView.vue'),
      meta: {
        title: '닉네임 설정 - Test Your Luck',
        requiresAuth: true
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/'
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const userStore = useUserStore()

  if (typeof window !== 'undefined') {
    await authStore.initAuth()
    userStore.loadUserFromStorage()
  }

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      next({ name: 'home' })
      return
    }

    if (to.name === 'game' && userStore.currentUser && !userStore.hasNicknameSet()) {
      next({ name: 'nickname-setup' })
      return
    }
  }

  if (to.name === 'nickname-setup' && (!authStore.isAuthenticated || userStore.hasNicknameSet())) {
    next({ name: 'home' })
    return
  }

  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  next()
})

export default router
