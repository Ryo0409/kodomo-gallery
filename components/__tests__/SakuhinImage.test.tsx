import { defaultConfig } from '@tamagui/config/v4'
import { render, fireEvent } from '@testing-library/react-native'
import { TamaguiProvider, createTamagui } from 'tamagui'

import { themes } from '../../themes/themes'
import SakuhinImage from '../SakuhinImage'

import type { SakuhinInfo } from '@/utils/galleryUtils'

const config = createTamagui({
  ...defaultConfig,
  themes,
})

function renderWithProvider(ui: React.ReactElement) {
  return render(<TamaguiProvider config={config}>{ui}</TamaguiProvider>)
}

describe('SakuhinImage', () => {
  it('SakuhinImageの表示 (frameType: square)', () => {
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
    const onPress = jest.fn()
    const onLongPress = jest.fn()

    const { getByTestId } = renderWithProvider(
      <SakuhinImage
        imageUri={sakuhin.uri}
        frameType={sakuhin.frameType}
        onPressFunc={onPress}
        onLongPressFunc={onLongPress}
      />,
    )

    const imageElement = getByTestId('sakuhin-image-image')
    expect(imageElement.props.source).toEqual({ uri: 'https://example.com/image.jpg' })
    expect(imageElement.props.resizeMode).toBe('cover')
    expect(imageElement.props.style).toEqual({
      width: 250,
      height: 250,
    })
  })

  it('SakuhinImageの表示 (frameType: rectangle)', () => {
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

    const { getByTestId } = renderWithProvider(
      <SakuhinImage imageUri={sakuhin.uri} frameType={sakuhin.frameType} onPressFunc={onClose} />,
    )

    const imageElement = getByTestId('sakuhin-image-image')
    expect(imageElement.props.source).toEqual({ uri: 'https://example.com/image.jpg' })
    expect(imageElement.props.resizeMode).toBe('cover')
    expect(imageElement.props.style).toEqual({
      width: 250,
      height: 177,
    })
  })

  it('SakuhinImageのonPress,onLongPress処理', () => {
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
    const onPress = jest.fn()
    const onLongPress = jest.fn()

    const { getByTestId } = renderWithProvider(
      <SakuhinImage
        imageUri={sakuhin.uri}
        frameType={sakuhin.frameType}
        onPressFunc={onPress}
        onLongPressFunc={onLongPress}
      />,
    )

    fireEvent.press(getByTestId('sakuhin-image-image'))
    expect(onPress).toHaveBeenCalled()

    fireEvent(getByTestId('sakuhin-image-image'), 'onLongPress')
    expect(onLongPress).toHaveBeenCalled()
  })
})
