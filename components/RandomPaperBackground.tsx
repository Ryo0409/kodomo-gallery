import React, { useState, useEffect } from 'react'
import { View, LayoutChangeEvent } from 'react-native'
import Svg, { Path } from 'react-native-svg'

import { getFrameSeed, FrameSeed } from '../utils/galleryUtils'

const paperColors = ['#d95f26', '#e3be4f', '#5ba45d', '#2b4a3f', '#48626a', '#27568b', '#41acd2', '#7d4a63', '#e7c0d4']

function jitter(value: number, randomSeed: number, range: number = 10) {
  return value + (randomSeed - 0.5) * range
}

function generateRoundedRect(width: number, height: number, randomSeed: FrameSeed, radius: number = 30) {
  const topLeftX = jitter(5, randomSeed[0])
  const topLeftY = jitter(5, randomSeed[1])
  const topRightX = jitter(width, randomSeed[2])
  const topRightY = jitter(5, randomSeed[3])
  const bottomRightX = jitter(width, randomSeed[4])
  const bottomRightY = jitter(height, randomSeed[5])
  const bottomLeftX = jitter(5, randomSeed[6])
  const bottomLeftY = jitter(height, randomSeed[7])

  return `
    M${topLeftX + radius},${topLeftY}
    L${topRightX - radius},${topRightY}
    Q${topRightX},${topRightY} ${topRightX},${topRightY + radius}
    L${bottomRightX},${bottomRightY - radius}
    Q${bottomRightX},${bottomRightY} ${bottomRightX - radius},${bottomRightY}
    L${bottomLeftX + radius},${bottomLeftY}
    Q${bottomLeftX},${bottomLeftY} ${bottomLeftX},${bottomLeftY - radius}
    L${topLeftX},${topLeftY + radius}
    Q${topLeftX},${topLeftY} ${topLeftX + radius},${topLeftY}
    Z
  `
}

type Props = {
  children: React.ReactNode
  fixColor?: string
  randomSeed?: FrameSeed
  paddingVertical?: number
  paddingHorizontal?: number
  marginVertical?: number
  marginHorizontal?: number
}

export default function RandomPaperBackground({
  children,
  randomSeed = getFrameSeed(),
  paddingVertical = 0,
  paddingHorizontal = 0,
  marginVertical = 0,
  marginHorizontal = 0,
}: Props) {
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [path, setPath] = useState('')
  const [color, setColor] = useState(paperColors[Math.floor(randomSeed[0] * paperColors.length)])

  // randomSeedが変わった時に色とパスを更新
  useEffect(() => {
    setColor(paperColors[Math.floor(randomSeed[0] * paperColors.length)])
    if (size.width > 0 && size.height > 0) {
      setPath(generateRoundedRect(size.width, size.height, randomSeed, 50))
    }
  }, [randomSeed, size.width, size.height])

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout
    const newSize = { width: width + paddingHorizontal, height: height + paddingVertical }
    setSize(newSize)
    setPath(generateRoundedRect(newSize.width, newSize.height, randomSeed, 50))
  }

  return (
    <View
      testID="random-paper-background"
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingVertical: paddingVertical,
        paddingHorizontal: paddingHorizontal,
        marginVertical: marginVertical,
        marginHorizontal: marginHorizontal,
      }}
    >
      {size.width > 0 && size.height > 0 && (
        <Svg width={size.width} height={size.height} style={{ position: 'absolute' }}>
          <Path d={path} fill={color} />
        </Svg>
      )}
      <View testID="random-paper-background-content" onLayout={handleLayout} style={{ zIndex: 1 }}>
        {children}
      </View>
    </View>
  )
}
