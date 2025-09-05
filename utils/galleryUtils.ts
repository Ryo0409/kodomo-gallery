import AsyncStorage from '@react-native-async-storage/async-storage'
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import { v4 as uuidv4 } from 'uuid'

export type SakuhinInfo = {
  key: string
  uri: string
  frameType: 'square' | 'rectangle' | null
  title: string
  artist: string
  detail: string
}

export const getItems = async (): Promise<SakuhinInfo[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys()
    const items = await AsyncStorage.multiGet(keys)

    if (!items) {
      return []
    }

    const sakuhinInfo: SakuhinInfo[] = items
      .map(([key, value]) => {
        try {
          const parsed = value ? JSON.parse(value) : null

          if (!parsed) return null

          return { ...parsed, key }
        } catch {
          return null
        }
      })
      .filter((item): item is SakuhinInfo => item !== null)

    return sakuhinInfo
  } catch (error) {
    console.error('AsyncStorage error:', error)
    return []
  }
}

export const deleteItem = async (sakuhin: SakuhinInfo | null): Promise<void> => {
  if (!sakuhin) {
    console.error('deleteItem: sakuhin is null')
    return
  }
  try {
    await FileSystem.deleteAsync(sakuhin.uri, { idempotent: true })
    await AsyncStorage.removeItem(sakuhin.key)
  } catch (error) {
    console.error('Error deleting item:', error)
  }
}

export const uploadItem = async (
  uri: string,
  title: string,
  artist: string,
  detail: string,
  frameType: 'square' | 'rectangle' | null,
): Promise<void> => {
  if (!uri || !title || !artist || !detail || !frameType) {
    throw new Error('すべてのこうもくをにゅうりょくしてください')
  }

  const filename = uri.split('/').pop()
  const IMAGES_DIR = FileSystem.documentDirectory || ''
  const destinationUri = IMAGES_DIR + filename

  try {
    await FileSystem.copyAsync({ from: uri, to: destinationUri })
  } catch (e) {
    throw new Error('さくひんのほぞんにしっぱいしました')
  }

  const imageData = {
    title,
    artist,
    detail,
    frameType,
    uri: destinationUri,
  }

  try {
    await AsyncStorage.setItem(uuidv4(), JSON.stringify(imageData))
  } catch (e) {
    throw new Error('ぎゃらりーへのとうこうにしっぱいしました')
  }
}

export const pickItemImage = async (): Promise<string | null> => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
  if (!permission.granted) {
    throw new Error('しゃしんらいぶらりにあくせすできません')
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'images',
    quality: 1,
  })

  if (result.canceled) return null

  return result.assets[0].uri
}
