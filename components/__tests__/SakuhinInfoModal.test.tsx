import { defaultConfig } from '@tamagui/config/v4'
import { render, fireEvent } from '@testing-library/react-native'
import { TamaguiProvider, createTamagui } from 'tamagui'

import { themes } from '../../themes/themes'
import SakuhinInfoModal from '../SakuhinInfoModal'

import type { SakuhinInfo } from '@/utils/galleryUtils'

// galleryUtilsのgetFrameSeedをモック化
jest.mock('../../utils/galleryUtils', () => ({
  getFrameSeed: jest.fn(() => [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]),
}))

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
      frameSeed: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
      title: 't1',
      artist: 'a1',
      detail: 'd1',
      createdAt: 1000,
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

    expect(getByTestId('sakuhin-info-modal-title')).toHaveTextContent('このさくひんについて')
    expect(getByTestId('sakuhin-info-modal-sakuhin-title-label')).toHaveTextContent('さくひんめい')
    expect(getByTestId('sakuhin-info-modal-sakuhin-title')).toHaveTextContent('t1')
    expect(getByTestId('sakuhin-info-modal-sakuhin-artist-label')).toHaveTextContent('さくしゃ')
    expect(getByTestId('sakuhin-info-modal-sakuhin-artist')).toHaveTextContent('a1')
    expect(getByTestId('sakuhin-info-modal-sakuhin-detail-label')).toHaveTextContent('かいせつ')
    expect(getByTestId('sakuhin-info-modal-sakuhin-detail')).toHaveTextContent('d1')
    expect(getByTestId('sakuhin-info-modal-close-button')).toHaveTextContent('とじる')
  })

  it('SakuhinInfoModalの表示 (frameType: rectangle)', () => {
    const sakuhin: SakuhinInfo = {
      key: '1',
      uri: 'https://example.com/image.jpg',
      frameType: 'rectangle',
      frameSeed: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
      title: 't1',
      artist: 'a1',
      detail: 'd1',
      createdAt: 1000,
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

    expect(getByTestId('sakuhin-info-modal-title')).toHaveTextContent('このさくひんについて')
    expect(getByTestId('sakuhin-info-modal-sakuhin-title-label')).toHaveTextContent('さくひんめい')
    expect(getByTestId('sakuhin-info-modal-sakuhin-title')).toHaveTextContent('t1')
    expect(getByTestId('sakuhin-info-modal-sakuhin-artist-label')).toHaveTextContent('さくしゃ')
    expect(getByTestId('sakuhin-info-modal-sakuhin-artist')).toHaveTextContent('a1')
    expect(getByTestId('sakuhin-info-modal-sakuhin-detail-label')).toHaveTextContent('かいせつ')
    expect(getByTestId('sakuhin-info-modal-sakuhin-detail')).toHaveTextContent('d1')
    expect(getByTestId('sakuhin-info-modal-close-button')).toHaveTextContent('とじる')
  })

  it('SakuhinInfoModalの非表示', () => {
    const sakuhin: SakuhinInfo = {
      key: '1',
      uri: 'https://example.com/image.jpg',
      frameType: 'square',
      frameSeed: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
      title: 't1',
      artist: 'a1',
      detail: 'd1',
      createdAt: 1000,
    }
    const onClose = jest.fn()

    const { queryByTestId } = renderWithProvider(
      <SakuhinInfoModal visible={false} sakuhin={sakuhin} onClose={onClose} />,
    )

    expect(queryByTestId('sakuhin-image-image')).toBeNull()
    expect(queryByTestId('sakuhin-info-modal-title')).toBeNull()
    expect(queryByTestId('sakuhin-info-modal-sakuhin-title-label')).toBeNull()
    expect(queryByTestId('sakuhin-info-modal-sakuhin-title')).toBeNull()
    expect(queryByTestId('sakuhin-info-modal-sakuhin-artist-label')).toBeNull()
    expect(queryByTestId('sakuhin-info-modal-sakuhin-artist')).toBeNull()
    expect(queryByTestId('sakuhin-info-modal-sakuhin-detail-label')).toBeNull()
    expect(queryByTestId('sakuhin-info-modal-sakuhin-detail')).toBeNull()
    expect(queryByTestId('sakuhin-info-modal-close-button')).toBeNull()
  })

  it('SakuhinInfoModalのonClose処理', () => {
    const sakuhin: SakuhinInfo = {
      key: '1',
      uri: 'https://example.com/image.jpg',
      frameType: 'square',
      frameSeed: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
      title: 't1',
      artist: 'a1',
      detail: 'd1',
      createdAt: 1000,
    }
    const onClose = jest.fn()

    const { getByTestId } = renderWithProvider(<SakuhinInfoModal visible={true} sakuhin={sakuhin} onClose={onClose} />)
    fireEvent.press(getByTestId('sakuhin-info-modal-close-button'))
    expect(onClose).toHaveBeenCalled()
  })
})
