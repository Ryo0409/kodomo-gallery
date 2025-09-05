import AsyncStorage from '@react-native-async-storage/async-storage'
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'

import * as galleryUtils from '../galleryUtils'

const mockedAsyncStorage = jest.mocked(AsyncStorage)
const mockedFileSystem = jest.mocked(FileSystem)
const mockedImagePicker = jest.mocked(ImagePicker)

jest.mock('@react-native-async-storage/async-storage', () => ({
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}))

jest.mock('expo-file-system', () => ({
  deleteAsync: jest.fn(),
  copyAsync: jest.fn(),
}))

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  PermissionStatus: { DENIED: 'denied', GRANTED: 'granted' },
}))
jest.mock('uuid', () => ({ v4: () => 'test-uuid' }))

describe('galleryUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getItems', () => {
    it('作品取得', async () => {
      mockedAsyncStorage.getAllKeys.mockResolvedValue(['1'])
      mockedAsyncStorage.multiGet.mockResolvedValue([
        [
          '1',
          JSON.stringify({
            uri: 'uri1',
            frameType: 'square',
            title: 't1',
            artist: 'a1',
            detail: 'd1',
          }),
        ],
        [
          '2',
          JSON.stringify({
            uri: 'uri2',
            frameType: 'square',
            title: 't2',
            artist: 'a2',
            detail: 'd2',
          }),
        ],
      ])

      const items = await galleryUtils.getItems()

      expect(items[0]).toMatchObject({
        key: '1',
        uri: 'uri1',
        frameType: 'square',
        title: 't1',
        artist: 'a1',
        detail: 'd1',
      })

      expect(items[1]).toMatchObject({
        key: '2',
        uri: 'uri2',
        frameType: 'square',
        title: 't2',
        artist: 'a2',
        detail: 'd2',
      })
    })

    it('作品取得 AsyncStorageのエラーハンドリング', async () => {
      mockedAsyncStorage.getAllKeys.mockRejectedValue(new Error('fail'))
      await expect(galleryUtils.getItems()).rejects.toThrow('さくひんのしゅとくにしっぱいしました')
    })
  })

  describe('deleteItem', () => {
    it('作品削除 (FileSystem.deleteAsyncとAsyncStorage.removeItemの呼び出し確認)', async () => {
      const sakuhin: galleryUtils.SakuhinInfo = {
        key: '1',
        uri: 'uri1',
        frameType: 'square',
        title: 't1',
        artist: 'a1',
        detail: 'd1',
      }
      await galleryUtils.deleteItem(sakuhin)
      expect(mockedFileSystem.deleteAsync).toHaveBeenCalledWith('uri1', { idempotent: true })
      expect(mockedAsyncStorage.removeItem).toHaveBeenCalledWith('1')
    })

    it('作品削除 引数のエラーハンドリング', async () => {
      await expect(galleryUtils.deleteItem(null)).rejects.toThrow('さくひんのさくじょにしっぱいしました')
    })

    it('作品削除 FileSystemのエラーハンドリング', async () => {
      mockedFileSystem.deleteAsync.mockRejectedValue(new Error('fail'))
      const sakuhin: galleryUtils.SakuhinInfo = {
        key: '1',
        uri: 'uri1',
        frameType: 'square',
        title: 't1',
        artist: 'a1',
        detail: 'd1',
      }
      await expect(galleryUtils.deleteItem(sakuhin)).rejects.toThrow('さくひんのさくじょにしっぱいしました')
    })
  })

  describe('uploadItem', () => {
    it('作品投稿 引数エラーハンドリング', async () => {
      await expect(galleryUtils.uploadItem('', '', '', '', null)).rejects.toThrow(
        'すべてのこうもくをにゅうりょくしてください',
      )
    })

    it('作品投稿 (FileSystem.copyAsyncとAsyncStorage.setItemの呼び出し確認)', async () => {
      await galleryUtils.uploadItem('file:///test.png', 't1', 'a1', 'd1', 'square')
      expect(mockedFileSystem.copyAsync).toHaveBeenCalled()
      expect(mockedAsyncStorage.setItem).toHaveBeenCalled()
    })

    it('作品投稿 FileSystem.copyAsyncのエラーハンドリング', async () => {
      mockedFileSystem.copyAsync.mockRejectedValue(new Error('fail'))
      await expect(galleryUtils.uploadItem('file:///test.png', 't1', 'a1', 'd1', 'square')).rejects.toThrow(
        'さくひんのほぞんにしっぱいしました',
      )
    })

    it('作品投稿 AsyncStorage.setItemのエラーハンドリング', async () => {
      mockedFileSystem.copyAsync.mockResolvedValue(undefined)
      mockedAsyncStorage.setItem.mockRejectedValue(new Error('fail'))
      await expect(galleryUtils.uploadItem('file:///test.png', 't1', 'a1', 'd1', 'square')).rejects.toThrow(
        'ぎゃらりーへのとうこうにしっぱいしました',
      )
    })
  })

  describe('pickItemImage', () => {
    it('作品投稿 写真ライブラリへのアクセスエラーハンドリング', async () => {
      mockedImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({
        granted: false,
        status: mockedImagePicker.PermissionStatus.DENIED,
        expires: 'never',
        canAskAgain: false,
      })
      await expect(galleryUtils.pickItemImage()).rejects.toThrow('しゃしんらいぶらりにあくせすできません')
    })

    it('作品投稿 投稿キャンセル', async () => {
      mockedImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({
        granted: true,
        status: mockedImagePicker.PermissionStatus.GRANTED,
        expires: 'never',
        canAskAgain: false,
      })
      mockedImagePicker.launchImageLibraryAsync.mockResolvedValue({ canceled: true, assets: null })
      const result = await galleryUtils.pickItemImage()
      expect(result).toBeNull()
    })

    it('作品投稿', async () => {
      mockedImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({
        granted: true,
        status: mockedImagePicker.PermissionStatus.GRANTED,
        expires: 'never',
        canAskAgain: false,
      })
      mockedImagePicker.launchImageLibraryAsync.mockResolvedValue({
        canceled: false,
        assets: [{ uri: 'file:///test.png', width: 300, height: 300 }],
      })
      const result = await galleryUtils.pickItemImage()
      expect(result).toBe('file:///test.png')
    })
  })
})
