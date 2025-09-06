import { defaultConfig } from '@tamagui/config/v4'
import { render, fireEvent } from '@testing-library/react-native'
import { TamaguiProvider, createTamagui } from 'tamagui'

import { themes } from '../../themes/themes'
import SakuhinInfoModal from '../SakuhinInfoModal'

import type { SakuhinInfo } from '@/utils/galleryUtils'

const config = createTamagui({
  ...defaultConfig,
  themes,
})

function renderWithProvider(ui: React.ReactElement) {
  return render(<TamaguiProvider config={config}>{ui}</TamaguiProvider>)
}

describe('SakuhinInfoModal', () => {
  it('SakuhinInfoModalの表示 (frameType: square)', () => {
    const sakuhin: SakuhinInfo = {
      key: '1',
      uri: 'https://example.com/image.jpg',
      frameType: 'square',
      title: 't1',
      artist: 'a1',
      detail: 'd1',
    }
    const onClose = jest.fn()

    const { getByTestId } = renderWithProvider(<SakuhinInfoModal visible={true} sakuhin={sakuhin} onClose={onClose} />)

    const imageElement = getByTestId('sakuhin-image-image')
    expect(imageElement.props.source).toEqual({ uri: 'https://example.com/image.jpg' })
    expect(imageElement.props.resizeMode).toBe('cover')
    expect(imageElement.props.style).toEqual({
      width: 250,
      height: 250,
    })

    expect(getByTestId('sakuhin-info-modal-title').children[0]).toBe('t1')
    expect(getByTestId('sakuhin-info-modal-artist').children[0]).toBe('a1')
    expect(getByTestId('sakuhin-info-modal-detail').children[0]).toBe('d1')
    expect(getByTestId('sakuhin-info-modal-close-button')).toBeTruthy()
  })

  it('SakuhinInfoModalの表示 (frameType: rectangle)', () => {
    const sakuhin: SakuhinInfo = {
      key: '1',
      uri: 'https://example.com/image.jpg',
      frameType: 'rectangle',
      title: 't1',
      artist: 'a1',
      detail: 'd1',
    }
    const onClose = jest.fn()

    const { getByTestId } = renderWithProvider(<SakuhinInfoModal visible={true} sakuhin={sakuhin} onClose={onClose} />)

    const imageElement = getByTestId('sakuhin-image-image')
    expect(imageElement.props.source).toEqual({ uri: 'https://example.com/image.jpg' })
    expect(imageElement.props.resizeMode).toBe('cover')
    expect(imageElement.props.style).toEqual({
      width: 250,
      height: 177,
    })

    expect(getByTestId('sakuhin-info-modal-title').children[0]).toBe('t1')
    expect(getByTestId('sakuhin-info-modal-artist').children[0]).toBe('a1')
    expect(getByTestId('sakuhin-info-modal-detail').children[0]).toBe('d1')
    expect(getByTestId('sakuhin-info-modal-close-button')).toBeTruthy()
  })

  it('SakuhinInfoModalの非表示', () => {
    const sakuhin: SakuhinInfo = {
      key: '1',
      uri: 'https://example.com/image.jpg',
      frameType: 'square',
      title: 't1',
      artist: 'a1',
      detail: 'd1',
    }
    const onClose = jest.fn()

    const { queryByTestId } = renderWithProvider(
      <SakuhinInfoModal visible={false} sakuhin={sakuhin} onClose={onClose} />,
    )

    expect(queryByTestId('sakuhin-image-image')).toBeNull()
    expect(queryByTestId('sakuhin-info-modal-title')).toBeNull()
    expect(queryByTestId('sakuhin-info-modal-artist')).toBeNull()
    expect(queryByTestId('sakuhin-info-modal-detail')).toBeNull()
    expect(queryByTestId('sakuhin-info-modal-close-button')).toBeNull()
  })

  it('SakuhinInfoModalのonClose処理', () => {
    const sakuhin: SakuhinInfo = {
      key: '1',
      uri: 'https://example.com/image.jpg',
      frameType: 'square',
      title: 't1',
      artist: 'a1',
      detail: 'd1',
    }
    const onClose = jest.fn()

    const { getByTestId } = renderWithProvider(<SakuhinInfoModal visible={true} sakuhin={sakuhin} onClose={onClose} />)
    fireEvent.press(getByTestId('sakuhin-info-modal-close-button'))
    expect(onClose).toHaveBeenCalled()
  })
})
