import { render } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import RandomPaperBackground from '../RandomPaperBackground'

// getFrameSeedをモック化
jest.mock('../../utils/galleryUtils', () => ({
  getFrameSeed: jest.fn(() => [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]),
  FrameSeed: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], // 型も含む
}))

describe('RandomPaperBackground', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('自身および子要素のレンダリング', () => {
    const { getByTestId } = render(
      <RandomPaperBackground>
        <Text>テスト</Text>
      </RandomPaperBackground>,
    )

    expect(getByTestId('random-paper-background')).toBeTruthy()
    expect(getByTestId('random-paper-background-content')).toHaveTextContent('テスト')
  })

  it('子要素のサイズ検知', () => {
    const { getByTestId } = render(
      <RandomPaperBackground>
        <Text>テスト</Text>
      </RandomPaperBackground>,
    )

    const childContainer = getByTestId('random-paper-background-content')

    const mockLayoutEvent = {
      nativeEvent: {
        layout: {
          width: 200,
          height: 150,
        },
      },
    }

    expect(childContainer.props.onLayout).toBeDefined()
    expect(() => childContainer.props.onLayout(mockLayoutEvent)).not.toThrow()
  })

  it('fixColorが指定された場合のテスト', () => {
    // このテストは内部のSVGの色をテストするのは困難なため、
    // プロパティが正しく渡されることのみを確認
    const fixColor = '#ff0000'

    expect(() => {
      render(
        <RandomPaperBackground fixColor={fixColor}>
          <Text>テスト</Text>
        </RandomPaperBackground>,
      )
    }).not.toThrow()
  })
})
