import { defaultConfig } from '@tamagui/config/v4'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'
import { TamaguiProvider, createTamagui } from 'tamagui'

import { themes } from '../../themes/themes'
import { getItems, deleteItem, SakuhinInfo } from '../../utils/galleryUtils'
import Page from '../index'

// React Navigationのモック
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn((callback: () => void) => {
    // テスト用に即座に実行
    callback()
  }),
}))

// galleryUtilsをモック化
jest.mock('../../utils/galleryUtils', () => ({
  getItems: jest.fn(),
  deleteItem: jest.fn(),
  getFrameSeed: jest.fn(() => [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]),
}))

const mockedGetItems = getItems as jest.MockedFunction<typeof getItems>
const mockedDeleteItem = deleteItem as jest.MockedFunction<typeof deleteItem>

const config = createTamagui({
  ...defaultConfig,
  themes,
})

function renderWithProvider(ui: React.ReactElement) {
  return render(<TamaguiProvider config={config}>{ui}</TamaguiProvider>)
}

const mockSakuhinData: SakuhinInfo[] = [
  {
    key: '1',
    uri: 'test-image-1.jpg',
    frameType: 'square',
    frameSeed: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
    title: 'テスト作品1',
    artist: 'テスト作者1',
    detail: 'テスト詳細1',
    createdAt: 1000,
  },
  {
    key: '2',
    uri: 'test-image-2.jpg',
    frameType: 'rectangle',
    frameSeed: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
    title: 'テスト作品2',
    artist: 'テスト作者2',
    detail: 'テスト詳細2',
    createdAt: 2000,
  },
]

describe('Gallery Index Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('indexページ 作品がない場合のメッセージ表示', async () => {
    mockedGetItems.mockResolvedValue([])

    const { getByTestId } = renderWithProvider(<Page />)

    await waitFor(() => {
      expect(getByTestId('index-no-items-message')).toBeTruthy()
      expect(getByTestId('index-no-items-message')).toHaveTextContent('さくひんがありません')
    })
  })

  it('indexページ 作品一覧の表示', async () => {
    mockedGetItems.mockResolvedValue(mockSakuhinData)

    const { getByTestId, queryByTestId } = renderWithProvider(<Page />)

    await waitFor(() => {
      expect(getByTestId('index-gallery-flatlist')).toBeTruthy()
      expect(queryByTestId('index-no-items-message')).toBeNull()
    })

    const flatList = getByTestId('index-gallery-flatlist')
    expect(flatList.props.data).toEqual(mockSakuhinData)
  })

  it('indexページ 作品詳細モーダルの表示', async () => {
    mockedGetItems.mockResolvedValue(mockSakuhinData)

    const { getByTestId, getAllByTestId } = renderWithProvider(<Page />)

    await waitFor(() => {
      expect(getByTestId('index-gallery-flatlist')).toBeTruthy()
    })

    // 最初の画像をタップ
    const images = getAllByTestId('sakuhin-image-image')
    fireEvent.press(images[0])

    // SakuhinInfoModalが表示されることを確認
    expect(getByTestId('sakuhin-info-modal-sakuhin-title')).toHaveTextContent('テスト作品1')
  })

  it('indexページ 作品削除', async () => {
    mockedGetItems.mockResolvedValue(mockSakuhinData)
    mockedDeleteItem.mockResolvedValue(undefined)
    // 削除後のgetItems呼び出し時は1つ減った配列を返す
    mockedGetItems.mockResolvedValueOnce(mockSakuhinData).mockResolvedValueOnce([mockSakuhinData[1]])

    const { getByTestId, getAllByTestId } = renderWithProvider(<Page />)

    await waitFor(() => {
      expect(getByTestId('index-gallery-flatlist')).toBeTruthy()
    })

    // 最初の画像を長押しして削除
    const images = getAllByTestId('sakuhin-image-image')
    fireEvent(images[0], 'longPress')
    const deleteButton = getByTestId('sakuhin-delete-modal-delete-button')
    fireEvent.press(deleteButton)

    // 成功メッセージが表示されることを確認
    await waitFor(() => {
      expect(getByTestId('message-modal-message')).toHaveTextContent('さくじょにせいこうしました')
    })

    // deleteItemが呼ばれることを確認
    expect(mockedDeleteItem).toHaveBeenCalledWith(mockSakuhinData[0])
  })

  it('indexページ 作品削除エラーハンドリング', async () => {
    const errorMessage = '削除エラー'
    mockedGetItems.mockResolvedValue(mockSakuhinData)
    mockedDeleteItem.mockRejectedValue(new Error(errorMessage))

    const { getByTestId, getAllByTestId, queryByTestId } = renderWithProvider(<Page />)

    await waitFor(() => {
      expect(getByTestId('index-gallery-flatlist')).toBeTruthy()
    })

    const images = getAllByTestId('sakuhin-image-image')
    fireEvent(images[0], 'longPress')
    const deleteButton = getByTestId('sakuhin-delete-modal-delete-button')
    fireEvent.press(deleteButton)

    // エラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(getByTestId('message-modal-message')).toHaveTextContent(errorMessage)
    })

    // メッセージモーダルの閉じるボタンを押下
    const messageCloseButton = getByTestId('message-modal-close-button')
    fireEvent.press(messageCloseButton)

    // モーダルが閉じることを確認
    await waitFor(() => {
      expect(queryByTestId('message-modal-message')).toBeNull()
    })
  })

  it('indexページ 作品取得エラーハンドリング', async () => {
    const errorMessage = 'さくひんのしゅとくにしっぱいしました'
    mockedGetItems.mockRejectedValue(new Error(errorMessage))

    const { getByTestId } = renderWithProvider(<Page />)

    await waitFor(() => {
      expect(getByTestId('message-modal-message')).toHaveTextContent(errorMessage)
    })

    // 作品がない状態のメッセージも表示されることを確認
    expect(getByTestId('index-no-items-message')).toBeTruthy()
  })

  it('indexページ 詳細モーダルが正しく閉じる', async () => {
    mockedGetItems.mockResolvedValue(mockSakuhinData)

    const { getByTestId, getAllByTestId, queryByTestId } = renderWithProvider(<Page />)

    await waitFor(() => {
      expect(getByTestId('index-gallery-flatlist')).toBeTruthy()
    })

    const images = getAllByTestId('sakuhin-image-image')
    fireEvent.press(images[0])

    expect(getByTestId('sakuhin-info-modal-title')).toBeTruthy()

    const closeButton = getByTestId('sakuhin-info-modal-close-button')
    fireEvent.press(closeButton)

    await waitFor(() => {
      expect(queryByTestId('sakuhin-info-modal-title')).toBeNull()
    })
  })

  it('indexページ 削除モーダルがキャンセルで正しく閉じる', async () => {
    mockedGetItems.mockResolvedValue(mockSakuhinData)

    const { getByTestId, getAllByTestId, queryByTestId } = renderWithProvider(<Page />)

    await waitFor(() => {
      expect(getByTestId('index-gallery-flatlist')).toBeTruthy()
    })

    const images = getAllByTestId('sakuhin-image-image')
    fireEvent(images[0], 'longPress')
    expect(getByTestId('sakuhin-delete-modal-title')).toBeTruthy()
    const cancelButton = getByTestId('sakuhin-delete-modal-cancel-button')
    fireEvent.press(cancelButton)

    // モーダルが閉じることを確認
    await waitFor(() => {
      expect(queryByTestId('sakuhin-delete-modal-title')).toBeNull()
    })

    // deleteItemが呼ばれないことを確認
    expect(mockedDeleteItem).not.toHaveBeenCalled()
  })

  it('indexページ useFocusEffectによるgetItemsの呼び出し', async () => {
    mockedGetItems.mockResolvedValue(mockSakuhinData)

    renderWithProvider(<Page />)

    // useFocusEffectによってgetItemsが呼ばれることを確認
    expect(mockedGetItems).toHaveBeenCalledTimes(1)
  })
})
