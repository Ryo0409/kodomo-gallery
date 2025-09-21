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
  it('SakuhinImageの表示', () => {
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
        width={250}
        height={250}
        onPressFunc={onPress}
        onLongPressFunc={onLongPress}
      />,
    )

    const imageElement = getByTestId('sakuhin-image-image')
    expect(imageElement.props.source).toEqual({ uri: 'https://example.com/image.jpg' })
    expect(imageElement.props.resizeMode).toBe('cover')
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
        width={250}
        height={250}
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
