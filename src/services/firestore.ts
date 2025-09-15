import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
  type DocumentData,
  type QuerySnapshot,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { UserData, GameRecord } from '@/types/game'

export class FirestoreService {
  private readonly USERS_COLLECTION = 'users'
  private readonly GAMES_COLLECTION = 'games'

  async createUser(uid: string, userData: Omit<UserData, 'createdAt'>): Promise<void> {
    try {
      const userRef = doc(db, this.USERS_COLLECTION, uid)

      const userDataWithTimestamp = {
        ...userData,
        createdAt: serverTimestamp()
      }

      await setDoc(userRef, userDataWithTimestamp)
      console.log('User created successfully in Firestore')
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  async getUser(uid: string): Promise<UserData | null> {
    try {
      const userRef = doc(db, this.USERS_COLLECTION, uid)
      const userDoc = await getDoc(userRef)

      if (userDoc.exists()) {
        const data = userDoc.data()
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          gameHistory: data.gameHistory?.map((game: any) => ({
            ...game,
            timestamp: game.timestamp?.toDate() || new Date()
          })) || []
        } as UserData
      }

      return null
    } catch (error) {
      console.error('Error getting user:', error)
      throw error
    }
  }

  async updateUser(uid: string, updates: Partial<UserData>): Promise<void> {
    try {
      const userRef = doc(db, this.USERS_COLLECTION, uid)

      const updatesWithoutTimestamp = { ...updates }
      delete updatesWithoutTimestamp.createdAt

      await updateDoc(userRef, updatesWithoutTimestamp)
      console.log('User updated successfully in Firestore')
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  async deleteUser(uid: string): Promise<void> {
    try {
      const userRef = doc(db, this.USERS_COLLECTION, uid)
      await deleteDoc(userRef)
      console.log('User deleted successfully from Firestore')
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }

  async addGameRecord(uid: string, gameRecord: GameRecord): Promise<void> {
    try {
      console.log('Adding game record for UID:', uid)
      console.log('Game record:', gameRecord)

      const batch = writeBatch(db)

      const userRef = doc(db, this.USERS_COLLECTION, uid)
      const gameRef = doc(collection(db, this.GAMES_COLLECTION))

      const gameWithTimestamp = {
        ...gameRecord,
        timestamp: serverTimestamp(),
        userId: uid
      }

      console.log('Game with timestamp:', gameWithTimestamp)
      batch.set(gameRef, gameWithTimestamp)

      const userDoc = await getDoc(userRef)
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData
        const updatedGameHistory = [gameRecord, ...(userData.gameHistory || [])].slice(0, 100) // Keep last 100 games

        batch.update(userRef, {
          gameHistory: updatedGameHistory,
          gamesPlayed: userData.gamesPlayed + 1,
          wins: gameRecord.outcome === 'win' ? userData.wins + 1 : userData.wins,
          losses: gameRecord.outcome === 'lose' ? userData.losses + 1 : userData.losses
        })
      }

      await batch.commit()
      console.log('Game record added successfully')
    } catch (error) {
      console.error('Error adding game record:', error)
      throw error
    }
  }

  async getAllUsers(): Promise<UserData[]> {
    try {
      const usersRef = collection(db, this.USERS_COLLECTION)
      const usersSnapshot = await getDocs(usersRef)

      return usersSnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          gameHistory: data.gameHistory?.map((game: any) => ({
            ...game,
            timestamp: game.timestamp?.toDate() || new Date()
          })) || []
        } as UserData
      })
    } catch (error) {
      console.error('Error getting all users:', error)
      throw error
    }
  }

  async getRankedUsers(minGames: number): Promise<UserData[]> {
    try {
      const usersRef = collection(db, this.USERS_COLLECTION)
      const rankedQuery = query(
        usersRef,
        where('gamesPlayed', '>=', minGames),
        orderBy('mmr', 'desc'),
        limit(100)
      )

      const snapshot = await getDocs(rankedQuery)

      return snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          gameHistory: data.gameHistory?.map((game: any) => ({
            ...game,
            timestamp: game.timestamp?.toDate() || new Date()
          })) || []
        } as UserData
      })
    } catch (error) {
      console.error('Error getting ranked users:', error)
      throw error
    }
  }

  subscribeToRankingUpdates(
    minGames: number,
    callback: (users: UserData[]) => void
  ): () => void {
    const usersRef = collection(db, this.USERS_COLLECTION)
    const rankedQuery = query(
      usersRef,
      where('gamesPlayed', '>=', minGames),
      orderBy('mmr', 'desc'),
      limit(100)
    )

    const unsubscribe = onSnapshot(rankedQuery, (snapshot: QuerySnapshot<DocumentData>) => {
      const users = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          gameHistory: data.gameHistory?.map((game: any) => ({
            ...game,
            timestamp: game.timestamp?.toDate() || new Date()
          })) || []
        } as UserData
      })

      callback(users)
    }, (error) => {
      console.error('Error in ranking subscription:', error)
    })

    return unsubscribe
  }

  subscribeToUserUpdates(uid: string, callback: (user: UserData | null) => void): () => void {
    const userRef = doc(db, this.USERS_COLLECTION, uid)

    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data()
        const userData = {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          gameHistory: data.gameHistory?.map((game: any) => ({
            ...game,
            timestamp: game.timestamp?.toDate() || new Date()
          })) || []
        } as UserData

        callback(userData)
      } else {
        callback(null)
      }
    }, (error) => {
      console.error('Error in user subscription:', error)
      callback(null)
    })

    return unsubscribe
  }
}

export const firestoreService = new FirestoreService()
