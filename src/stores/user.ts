import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserData, GameRecord } from '@/types/game'
import { STARTING_MMR, calculateWinRate } from '@/utils/gameLogic'
import { firestoreService } from '@/services/firestore'

export const useUserStore = defineStore('user', () => {
  const userData = ref<UserData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const userSubscription = ref<(() => void) | null>(null)

  const isLoggedIn = computed(() => userData.value !== null)
  const currentUser = computed(() => userData.value)
  const mmr = computed(() => userData.value?.mmr ?? 0)
  const gamesPlayed = computed(() => userData.value?.gamesPlayed ?? 0)
  const wins = computed(() => userData.value?.wins ?? 0)
  const losses = computed(() => userData.value?.losses ?? 0)
  const winRate = computed(() => calculateWinRate(wins.value, gamesPlayed.value))

  function createUser(nickname: string): void {
    const newUser: UserData = {
      id: generateUserId(),
      nickname: nickname.trim(),
      mmr: STARTING_MMR,
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      gameHistory: [],
      createdAt: new Date(),
      isNicknameSet: true
    }

    userData.value = newUser
    saveUserToStorage(newUser)
  }

  function setUserData(user: UserData): void {
    userData.value = user
    saveUserToStorage(user)
  }

  function updateMmr(newMmr: number): void {
    if (userData.value) {
      userData.value.mmr = newMmr
      saveUserToStorage(userData.value)
    }
  }

  function addGameRecord(gameRecord: GameRecord): void {
    if (userData.value) {
      userData.value.gameHistory.unshift(gameRecord)
      userData.value.gamesPlayed++

      if (gameRecord.outcome === 'win') {
        userData.value.wins++
      } else {
        userData.value.losses++
      }

      saveUserToStorage(userData.value)
    }
  }

  function loadUserFromStorage(): void {
    const stored = localStorage.getItem('test-your-luck-user')
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as UserData
        parsed.createdAt = new Date(parsed.createdAt)
        parsed.gameHistory = parsed.gameHistory.map((record: GameRecord) => ({
          ...record,
          timestamp: new Date(record.timestamp)
        }))
        userData.value = parsed
      } catch (error) {
        console.error('Failed to load user data:', error)
        localStorage.removeItem('test-your-luck-user')
      }
    }
  }

  function saveUserToStorage(user: UserData): void {
    localStorage.setItem('test-your-luck-user', JSON.stringify(user))
  }

  function hasNicknameSet(): boolean {
    return userData.value?.isNicknameSet === true
  }

  async function createFirebaseUser(firebaseUser: any, nickname?: string): Promise<void> {
    try {
      loading.value = true
      error.value = null

      const existingUser = await firestoreService.getUser(firebaseUser.uid)

      if (existingUser) {
        userData.value = existingUser
        saveUserToStorage(existingUser)
      } else {
        const displayName = firebaseUser.displayName || ''
        const finalNickname = nickname || displayName || 'User'

        const newUser: UserData = {
          id: `firebase_${firebaseUser.uid}`,
          uid: firebaseUser.uid,
          nickname: finalNickname,
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || '',
          mmr: STARTING_MMR,
          gamesPlayed: 0,
          wins: 0,
          losses: 0,
          gameHistory: [],
          createdAt: new Date(),
          isNicknameSet: !!nickname || !!displayName
        }

        await firestoreService.createUser(firebaseUser.uid, newUser)
        userData.value = newUser
        saveUserToStorage(newUser)
      }

      subscribeToUserUpdates(firebaseUser.uid)
    } catch (err: any) {
      console.error('Error creating Firebase user:', err)
      error.value = err.message || 'Failed to create user'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateUserInFirestore(updates: Partial<UserData>): Promise<void> {
    if (!userData.value?.uid) {
      throw new Error('No authenticated user')
    }

    try {
      loading.value = true
      error.value = null

      await firestoreService.updateUser(userData.value.uid, updates)

      if (userData.value) {
        userData.value = { ...userData.value, ...updates }
        saveUserToStorage(userData.value)
      }
    } catch (err: any) {
      console.error('Error updating user in Firestore:', err)
      error.value = err.message || 'Failed to update user'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function addGameRecordToFirestore(gameRecord: GameRecord): Promise<void> {
    console.log('addGameRecordToFirestore called')
    console.log('userData.value:', userData.value)
    console.log('userData.value?.uid:', userData.value?.uid)

    if (!userData.value?.uid) {
      console.error('No authenticated user - userData.value:', userData.value)
      throw new Error('No authenticated user')
    }

    try {
      console.log('Calling firestoreService.addGameRecord with UID:', userData.value.uid)
      await firestoreService.addGameRecord(userData.value.uid, gameRecord)
    } catch (err: any) {
      console.error('Error adding game record to Firestore:', err)
      error.value = err.message || 'Failed to save game record'
      throw err
    }
  }

  function subscribeToUserUpdates(uid: string): void {
    if (userSubscription.value) {
      userSubscription.value()
    }

    userSubscription.value = firestoreService.subscribeToUserUpdates(uid, (user) => {
      if (user) {
        userData.value = user
        saveUserToStorage(user)
      }
    })
  }

  function unsubscribeFromUpdates(): void {
    if (userSubscription.value) {
      userSubscription.value()
      userSubscription.value = null
    }
  }

  function logout(): void {
    unsubscribeFromUpdates()
    userData.value = null
    localStorage.removeItem('test-your-luck-user')
  }

  function generateUserId(): string {
    return 'user_' + Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  return {
    userData,
    loading,
    error,
    isLoggedIn,
    currentUser,
    mmr,
    gamesPlayed,
    wins,
    losses,
    winRate,
    createUser,
    setUserData,
    updateMmr,
    addGameRecord,
    loadUserFromStorage,
    saveUserToStorage,
    hasNicknameSet,
    createFirebaseUser,
    updateUserInFirestore,
    addGameRecordToFirestore,
    subscribeToUserUpdates,
    unsubscribeFromUpdates,
    logout
  }
})
