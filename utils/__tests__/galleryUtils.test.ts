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
            createdAt: 1000,
            frameSeed: [0, 0, 0, 0, 0, 0, 0, 0],
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
            createdAt: 2000,
            frameSeed: [0, 0, 0, 0, 0, 0, 0, 0],
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
        createdAt: 1000,
        frameSeed: [0, 0, 0, 0, 0, 0, 0, 0],
      })

      expect(items[1]).toMatchObject({
        key: '2',
        uri: 'uri2',
        frameType: 'square',
        title: 't2',
        artist: 'a2',
        detail: 'd2',
        createdAt: 2000,
        frameSeed: [0, 0, 0, 0, 0, 0, 0, 0],
      })
    })

    it('作品取得 AsyncStorageのエラーハンドリング', async () => {
      mockedAsyncStorage.getAllKeys.mockRejectedValue(new Error('fail'))
      await expect(galleryUtils.getItems()).rejects.toThrow('さくひんのしゅとくにしっぱいしました')
    })

    it('作品取得 作成時刻順でソート', async () => {
      mockedAsyncStorage.getAllKeys.mockResolvedValue(['1', '2', '3'])
      mockedAsyncStorage.multiGet.mockResolvedValue([
        [
          '1',
          JSON.stringify({
            uri: 'uri1',
            frameType: 'square',
            title: 't1',
            artist: 'a1',
            detail: 'd1',
            createdAt: 3000, // 3番目
            frameSeed: [0, 0, 0, 0, 0, 0, 0, 0],
          }),
        ],
        [
          '2',
          JSON.stringify({
            uri: 'uri2',
            frameType: 'rectangle',
            title: 't2',
            artist: 'a2',
            detail: 'd2',
            createdAt: 1000, // 1番目
            frameSeed: [0, 0, 0, 0, 0, 0, 0, 0],
          }),
        ],
        [
          '3',
          JSON.stringify({
            uri: 'uri3',
            frameType: 'square',
            title: 't3',
            artist: 'a3',
            detail: 'd3',
            createdAt: 2000, // 2番目
            frameSeed: [0, 0, 0, 0, 0, 0, 0, 0],
          }),
        ],
      ])
      const result = await galleryUtils.getItems()

      expect(result).toHaveLength(3)
      // 作成時刻順（昇順）でソートされていることを確認
      expect(result[0].createdAt).toBe(1000)
      expect(result[0].title).toBe('t2')
      expect(result[1].createdAt).toBe(2000)
      expect(result[1].title).toBe('t3')
      expect(result[2].createdAt).toBe(3000)
      expect(result[2].title).toBe('t1')
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
        createdAt: 1000,
        frameSeed: [0, 0, 0, 0, 0, 0, 0, 0],
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
        createdAt: 1000,
        frameSeed: [0, 0, 0, 0, 0, 0, 0, 0],
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
      const currentTime = Date.now()
      jest.spyOn(Date, 'now').mockReturnValue(currentTime)

      await galleryUtils.uploadItem('file:///test.png', 't1', 'a1', 'd1', 'square')

      expect(mockedFileSystem.copyAsync).toHaveBeenCalled()
      expect(mockedAsyncStorage.setItem).toHaveBeenCalled()

      // AsyncStorage.setItemの呼び出し引数を確認
      const setItemCall = mockedAsyncStorage.setItem.mock.calls[0]
      const savedData = JSON.parse(setItemCall[1])
      expect(savedData.createdAt).toBe(currentTime)
      expect(savedData.title).toBe('t1')
      expect(savedData.artist).toBe('a1')
      expect(savedData.detail).toBe('d1')
      expect(savedData.frameType).toBe('square')

      jest.restoreAllMocks()
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
