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
    const { getByText } = renderWithProvider(
      <MessageModal visible={true} message="テストメッセージ" onClose={onClose} />,
    )
    expect(getByText('テストメッセージ')).toBeTruthy()
    expect(getByText('とじる')).toBeTruthy()
  })

  it('MessageModalの非表示', () => {
    const onClose = jest.fn()
    const { queryByText } = renderWithProvider(
      <MessageModal visible={false} message="テストメッセージ" onClose={onClose} />,
    )
    expect(queryByText('テストメッセージ')).toBeNull()
    expect(queryByText('とじる')).toBeNull()
  })

  it('MessageModalのonClose処理', () => {
    const onClose = jest.fn()
    const { getByText } = renderWithProvider(
      <MessageModal visible={true} message="テストメッセージ" onClose={onClose} />,
    )
    fireEvent.press(getByText('とじる'))
    expect(onClose).toHaveBeenCalled()
  })
})
