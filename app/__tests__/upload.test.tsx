import { defaultConfig } from '@tamagui/config/v4'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { TamaguiProvider, createTamagui } from 'tamagui'

import { themes } from '../../themes/themes'
import { uploadItem, pickItemImage } from '../../utils/galleryUtils'
import Page from '../upload'

// galleryUtilsをモック化
jest.mock('../../utils/galleryUtils', () => ({
  uploadItem: jest.fn(),
  pickItemImage: jest.fn(),
}))

const mockedUploadItem = uploadItem as jest.MockedFunction<typeof uploadItem>
const mockedPickItemImage = pickItemImage as jest.MockedFunction<typeof pickItemImage>

const config = createTamagui({
  ...defaultConfig,
  themes,
})

function renderWithProvider(ui: React.ReactElement) {
  return render(<TamaguiProvider config={config}>{ui}</TamaguiProvider>)
}

describe('Upload Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('uploadページの表示', () => {
    const { getByTestId } = renderWithProvider(<Page />)

    expect(getByTestId('upload-title-input-label')).toHaveTextContent('さくひんめい')
    expect(getByTestId('upload-title-input')).toBeTruthy()

    expect(getByTestId('upload-artist-input-label')).toHaveTextContent('さくしゃ')
    expect(getByTestId('upload-artist-input')).toBeTruthy()

    expect(getByTestId('upload-detail-input-label')).toHaveTextContent('かいせつ')
    expect(getByTestId('upload-detail-input')).toBeTruthy()

    expect(getByTestId('upload-image-select-button-label')).toHaveTextContent('さくひんをえらぶ')
    expect(getByTestId('upload-upload-button')).toHaveTextContent('とうこう')
    expect(getByTestId('upload-reset-button')).toHaveTextContent('りせっと')
  })

  it('uploadページのフォームの入力', () => {
    const { getByTestId } = renderWithProvider(<Page />)

    const titleInput = getByTestId('upload-title-input')
    const artistInput = getByTestId('upload-artist-input')
    const detailInput = getByTestId('upload-detail-input')

    fireEvent.changeText(titleInput, 'テストタイトル')
    fireEvent.changeText(artistInput, 'テストアーティスト')
    fireEvent.changeText(detailInput, 'テスト詳細')

    expect(titleInput.props.value).toBe('テストタイトル')
    expect(artistInput.props.value).toBe('テストアーティスト')
    expect(detailInput.props.value).toBe('テスト詳細')
  })

  it('uploadページのフォームリセット', () => {
    const { getByTestId } = renderWithProvider(<Page />)

    const titleInput = getByTestId('upload-title-input')
    const artistInput = getByTestId('upload-artist-input')
    const detailInput = getByTestId('upload-detail-input')
    const resetButton = getByTestId('upload-reset-button')

    fireEvent.changeText(titleInput, 'テストタイトル')
    fireEvent.changeText(artistInput, 'テストアーティスト')
    fireEvent.changeText(detailInput, 'テスト詳細')

    fireEvent.press(resetButton)

    expect(titleInput.props.value).toBe('')
    expect(artistInput.props.value).toBe('')
    expect(detailInput.props.value).toBe('')
  })

  it('uploadページ 画像選択モーダルの表示', () => {
    const { getByTestId } = renderWithProvider(<Page />)

    const imageSelectButton = getByTestId('upload-image-select-button')
    fireEvent.press(imageSelectButton)

    // SakuhinImagePickModalが表示されることを確認
    expect(getByTestId('sakuhin-image-pick-modal-title')).toHaveTextContent('がくぶちをせんたくしてください')
  })

  it('uploadページ 画像選択モーダルの正常性確認', async () => {
    // sakuhinImagePickHandler内で呼ばれるpickItemImageをモック化
    mockedPickItemImage.mockResolvedValue('test-image-uri')

    const { getByTestId, queryByText } = renderWithProvider(<Page />)

    const imageSelectButton = getByTestId('upload-image-select-button')
    fireEvent.press(imageSelectButton)

    const squareButton = getByTestId('sakuhin-image-pick-modal-square-button')
    fireEvent.press(squareButton)

    // モーダルが閉じることを確認
    await waitFor(() => {
      expect(queryByText('がくぶちをせんたくしてください')).toBeNull()
    })

    // pickItemImageが呼ばれることを確認
    expect(mockedPickItemImage).toHaveBeenCalled()
  })

  it('uploadページ 画像選択モーダルのエラーハンドリング', async () => {
    const errorMessage = 'テストエラー'
    mockedPickItemImage.mockRejectedValue(new Error(errorMessage))

    const { getByTestId } = renderWithProvider(<Page />)

    const imageSelectButton = getByTestId('upload-image-select-button')
    fireEvent.press(imageSelectButton)

    const squareButton = getByTestId('sakuhin-image-pick-modal-square-button')
    fireEvent.press(squareButton)

    // エラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(getByTestId('message-modal-message')).toHaveTextContent(errorMessage)
    })
  })

  it('uploadページ 画像選択後のSakuhinImageの表示', async () => {
    mockedPickItemImage.mockResolvedValue('test-image-uri')

    const { getByTestId, queryByTestId } = renderWithProvider(<Page />)

    // 初期状態では画像選択ボタンが表示される
    expect(getByTestId('upload-image-select-button')).toBeTruthy()

    // 画像選択モーダルを開く
    fireEvent.press(getByTestId('upload-image-select-button'))

    // 正方形を選択
    const squareButton = getByTestId('sakuhin-image-pick-modal-square-button')
    fireEvent.press(squareButton)

    // 画像が選択された後、SakuhinImageが表示される
    await waitFor(() => {
      expect(getByTestId('sakuhin-image-image')).toBeTruthy()
      expect(queryByTestId('upload-image-select-button')).toBeNull()
    })
  })

  it('uploadページ 作品投稿', async () => {
    // 画像選択とアップロード両方をモック化
    mockedPickItemImage.mockResolvedValue('test-image-uri')
    mockedUploadItem.mockResolvedValue(undefined)

    const { getByTestId } = renderWithProvider(<Page />)

    const imageSelectButton = getByTestId('upload-image-select-button')
    fireEvent.press(imageSelectButton)
    const squareButton = getByTestId('sakuhin-image-pick-modal-square-button')
    fireEvent.press(squareButton)
    await waitFor(() => {
      expect(getByTestId('sakuhin-image-image')).toBeTruthy()
    })

    const titleInput = getByTestId('upload-title-input')
    const artistInput = getByTestId('upload-artist-input')
    const detailInput = getByTestId('upload-detail-input')
    fireEvent.changeText(titleInput, 'テストタイトル')
    fireEvent.changeText(artistInput, 'テストアーティスト')
    fireEvent.changeText(detailInput, 'テスト詳細')

    const uploadButton = getByTestId('upload-upload-button')
    fireEvent.press(uploadButton)

    await waitFor(() => {
      expect(getByTestId('message-modal-message')).toHaveTextContent('ぎゃらりーにとうこうしました')
    })

    expect(mockedUploadItem).toHaveBeenCalledWith(
      'test-image-uri',
      'テストタイトル',
      'テストアーティスト',
      'テスト詳細',
      'square',
    )
  })

  it('uploadページ 作品投稿エラーハンドリング', async () => {
    // uploadItemは実際にはエラーを投げるが、モックなので明示的にエラーを設定
    mockedUploadItem.mockRejectedValue(new Error('すべてのこうもくをにゅうりょくしてください'))

    const { getByTestId } = renderWithProvider(<Page />)

    // 画像選択せずにフォームに入力
    const titleInput = getByTestId('upload-title-input')
    const artistInput = getByTestId('upload-artist-input')
    const detailInput = getByTestId('upload-detail-input')
    fireEvent.changeText(titleInput, 'テストタイトル')
    fireEvent.changeText(artistInput, 'テストアーティスト')
    fireEvent.changeText(detailInput, 'テスト詳細')
    const uploadButton = getByTestId('upload-upload-button')
    fireEvent.press(uploadButton)

    // エラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(getByTestId('message-modal-message')).toHaveTextContent('すべてのこうもくをにゅうりょくしてください')
    })

    // uploadItemが空の画像URIで呼ばれることを確認
    expect(mockedUploadItem).toHaveBeenCalledWith('', 'テストタイトル', 'テストアーティスト', 'テスト詳細', null)
  })

  it('uploadページ メッセージモーダルを閉じる', async () => {
    mockedUploadItem.mockResolvedValue(undefined)

    const { getByTestId, queryByTestId } = renderWithProvider(<Page />)

    // アップロードを実行して成功メッセージを表示
    const uploadButton = getByTestId('upload-upload-button')
    fireEvent.press(uploadButton)

    await waitFor(() => {
      expect(getByTestId('message-modal-message')).toHaveTextContent('ぎゃらりーにとうこうしました')
    })

    // メッセージモーダルの閉じるボタンを押下
    const closeButton = getByTestId('message-modal-close-button')
    fireEvent.press(closeButton)

    // モーダルが閉じることを確認
    await waitFor(() => {
      expect(queryByTestId('message-modal-message')).toBeNull()
    })
  })
})
