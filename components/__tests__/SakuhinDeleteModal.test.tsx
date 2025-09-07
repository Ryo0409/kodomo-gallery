import { defaultConfig } from '@tamagui/config/v4'
import { render, fireEvent } from '@testing-library/react-native'
import { TamaguiProvider, createTamagui } from 'tamagui'

import { themes } from '../../themes/themes'
import SakuhinDeleteModal from '../SakuhinDeleteModal'

import type { SakuhinInfo } from '@/utils/galleryUtils'

const config = createTamagui({
  ...defaultConfig,
  themes,
})

function renderWithProvider(ui: React.ReactElement) {
  return render(<TamaguiProvider config={config}>{ui}</TamaguiProvider>)
}

describe('SakuhinDeleteModal', () => {
  it('SakuhinDeleteModalの表示 (frameType: square)', () => {
    const sakuhin: SakuhinInfo = {
      key: '1',
      uri: 'https://example.com/image.jpg',
      frameType: 'square',
      title: 't1',
      artist: 'a1',
      detail: 'd1',
    }
    const onClose = jest.fn()
    const deleteFunc = jest.fn()

    const { getByTestId } = renderWithProvider(
      <SakuhinDeleteModal visible={true} sakuhin={sakuhin} onClose={onClose} deleteFunc={deleteFunc} />,
    )

    const imageElement = getByTestId('sakuhin-image-image')
    expect(imageElement.props.source).toEqual({ uri: 'https://example.com/image.jpg' })
    expect(imageElement.props.resizeMode).toBe('cover')
    expect(imageElement.props.style).toEqual({
      width: 250,
      height: 250,
    })

    expect(getByTestId('sakuhin-delete-modal-title')).toHaveTextContent('このさくひんをさくじょしますか？')
    expect(getByTestId('sakuhin-delete-modal-cancel-button')).toHaveTextContent('きゃんせる')
    expect(getByTestId('sakuhin-delete-modal-delete-button')).toHaveTextContent('さくじょ')
  })

  it('SakuhinDeleteModalの表示 (frameType: rectangle)', () => {
    const sakuhin: SakuhinInfo = {
      key: '1',
      uri: 'https://example.com/image.jpg',
      frameType: 'rectangle',
      title: 't1',
      artist: 'a1',
      detail: 'd1',
    }
    const onClose = jest.fn()
    const deleteFunc = jest.fn()

    const { getByTestId } = renderWithProvider(
      <SakuhinDeleteModal visible={true} sakuhin={sakuhin} onClose={onClose} deleteFunc={deleteFunc} />,
    )

    const imageElement = getByTestId('sakuhin-image-image')
    expect(imageElement.props.source).toEqual({ uri: 'https://example.com/image.jpg' })
    expect(imageElement.props.resizeMode).toBe('cover')
    expect(imageElement.props.style).toEqual({
      width: 250,
      height: 177,
    })

    expect(getByTestId('sakuhin-delete-modal-title')).toHaveTextContent('このさくひんをさくじょしますか？')
    expect(getByTestId('sakuhin-delete-modal-cancel-button')).toHaveTextContent('きゃんせる')
    expect(getByTestId('sakuhin-delete-modal-delete-button')).toHaveTextContent('さくじょ')
  })

  it('SakuhinDeleteModalの非表示', () => {
    const sakuhin: SakuhinInfo = {
      key: '1',
      uri: 'https://example.com/image.jpg',
      frameType: 'square',
      title: 't1',
      artist: 'a1',
      detail: 'd1',
    }
    const onClose = jest.fn()
    const deleteFunc = jest.fn()

    const { queryByTestId } = renderWithProvider(
      <SakuhinDeleteModal visible={false} sakuhin={sakuhin} onClose={onClose} deleteFunc={deleteFunc} />,
    )

    expect(queryByTestId('sakuhin-image-image')).toBeNull()
    expect(queryByTestId('sakuhin-delete-modal-title')).toBeNull()
    expect(queryByTestId('sakuhin-delete-modal-delete-button')).toBeNull()
    expect(queryByTestId('sakuhin-delete-modal-cancel-button')).toBeNull()
  })

  it('SakuhinDeleteModalのonClose処理', () => {
    const sakuhin: SakuhinInfo = {
      key: '1',
      uri: 'https://example.com/image.jpg',
      frameType: 'square',
      title: 't1',
      artist: 'a1',
      detail: 'd1',
    }
    const onClose = jest.fn()
    const deleteFunc = jest.fn()

    const { getByTestId } = renderWithProvider(
      <SakuhinDeleteModal visible={true} sakuhin={sakuhin} onClose={onClose} deleteFunc={deleteFunc} />,
    )
    fireEvent.press(getByTestId('sakuhin-delete-modal-cancel-button'))
    expect(onClose).toHaveBeenCalled()

    fireEvent.press(getByTestId('sakuhin-delete-modal-delete-button'))
    expect(deleteFunc).toHaveBeenCalled()
  })
})
