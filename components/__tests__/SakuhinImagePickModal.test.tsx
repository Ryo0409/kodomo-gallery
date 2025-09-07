import { defaultConfig } from '@tamagui/config/v4'
import { render, fireEvent } from '@testing-library/react-native'
import { TamaguiProvider, createTamagui } from 'tamagui'

import { themes } from '../../themes/themes'
import SakuhinImagePickModal from '../SakuhinImagePickModal'

const config = createTamagui({
  ...defaultConfig,
  themes,
})

function renderWithProvider(ui: React.ReactElement) {
  return render(<TamaguiProvider config={config}>{ui}</TamaguiProvider>)
}

describe('SakuhinImagePickModal', () => {
  it('SakuhinImagePickModalの表示', () => {
    const onSelect = jest.fn()
    const onClose = jest.fn()

    const { getByTestId } = renderWithProvider(
      <SakuhinImagePickModal visible={true} onSelect={onSelect} onClose={onClose} />,
    )

    expect(getByTestId('sakuhin-image-pick-modal-title')).toHaveTextContent('がくぶちをせんたくしてください')
    expect(getByTestId('sakuhin-image-pick-modal-square-button')).toHaveTextContent('せいほう')
    expect(getByTestId('sakuhin-image-pick-modal-rectangle-button')).toHaveTextContent('よこなが')
    expect(getByTestId('sakuhin-image-pick-modal-cancel-button')).toHaveTextContent('きゃんせる')
  })

  it('SakuhinImagePickModalの非表示', () => {
    const onSelect = jest.fn()
    const onClose = jest.fn()

    const { queryByTestId } = renderWithProvider(
      <SakuhinImagePickModal visible={false} onSelect={onSelect} onClose={onClose} />,
    )

    expect(queryByTestId('sakuhin-image-pick-modal-title')).toBeNull()
    expect(queryByTestId('sakuhin-image-pick-modal-square-button')).toBeNull()
    expect(queryByTestId('sakuhin-image-pick-modal-rectangle-button')).toBeNull()
    expect(queryByTestId('sakuhin-image-pick-modal-cancel-button')).toBeNull()
  })

  it('SakuhinImagePickModalのonSelect処理 (せいほう)', () => {
    const onSelect = jest.fn()
    const onClose = jest.fn()

    const { getByTestId } = renderWithProvider(
      <SakuhinImagePickModal visible={true} onSelect={onSelect} onClose={onClose} />,
    )

    fireEvent.press(getByTestId('sakuhin-image-pick-modal-square-button'))
    expect(onSelect).toHaveBeenCalledWith('square')
  })

  it('SakuhinImagePickModalのonSelect処理 (よこなが)', () => {
    const onSelect = jest.fn()
    const onClose = jest.fn()

    const { getByTestId } = renderWithProvider(
      <SakuhinImagePickModal visible={true} onSelect={onSelect} onClose={onClose} />,
    )

    fireEvent.press(getByTestId('sakuhin-image-pick-modal-rectangle-button'))
    expect(onSelect).toHaveBeenCalledWith('rectangle')
  })

  it('SakuhinImagePickModalのonClose処理', () => {
    const onSelect = jest.fn()
    const onClose = jest.fn()

    const { getByTestId } = renderWithProvider(
      <SakuhinImagePickModal visible={true} onSelect={onSelect} onClose={onClose} />,
    )

    fireEvent.press(getByTestId('sakuhin-image-pick-modal-cancel-button'))
    expect(onSelect).not.toHaveBeenCalled()
  })
})
