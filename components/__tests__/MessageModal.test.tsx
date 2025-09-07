import { defaultConfig } from '@tamagui/config/v4'
import { render, fireEvent } from '@testing-library/react-native'
import { TamaguiProvider, createTamagui } from 'tamagui'

import { themes } from '../../themes/themes'
import MessageModal from '../MessageModal'

const config = createTamagui({
  ...defaultConfig,
  themes,
})

function renderWithProvider(ui: React.ReactElement) {
  return render(<TamaguiProvider config={config}>{ui}</TamaguiProvider>)
}

describe('MessageModal', () => {
  it('MessageModalの表示', () => {
    const onClose = jest.fn()
    const { getByTestId } = renderWithProvider(
      <MessageModal visible={true} message="テストメッセージ" onClose={onClose} />,
    )

    expect(getByTestId('message-modal-message')).toHaveTextContent('テストメッセージ')
    expect(getByTestId('message-modal-close-button')).toHaveTextContent('とじる')
  })

  it('MessageModalの非表示', () => {
    const onClose = jest.fn()
    const { queryByTestId } = renderWithProvider(
      <MessageModal visible={false} message="テストメッセージ" onClose={onClose} />,
    )
    expect(queryByTestId('message-modal-message')).toBeNull()
    expect(queryByTestId('message-modal-close-button')).toBeNull()
  })

  it('MessageModalのonClose処理', () => {
    const onClose = jest.fn()
    const { getByTestId } = renderWithProvider(
      <MessageModal visible={true} message="テストメッセージ" onClose={onClose} />,
    )
    fireEvent.press(getByTestId('message-modal-close-button'))
    expect(onClose).toHaveBeenCalled()
  })
})
