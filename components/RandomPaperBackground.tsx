import React, { useState } from 'react'
import { View, LayoutChangeEvent } from 'react-native'
import Svg, { Path } from 'react-native-svg'

const paperColors = ['#d95f26', '#e3be4f', '#5ba45d', '#2b4a3f', '#48626a', '#27568b', '#41acd2', '#7d4a63', '#e7c0d4']

function jitter(value: number, range: number = 10) {
  return value + (Math.random() - 0.5) * range
}

function generateRoundedRect(width: number, height: number, radius: number = 30) {
  const topLeftX = jitter(5)
  const topLeftY = jitter(5)
  const topRightX = jitter(width)
  const topRightY = jitter(5)
  const bottomRightX = jitter(width)
  const bottomRightY = jitter(height)
  const bottomLeftX = jitter(5)
  const bottomLeftY = jitter(height)

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
  paddingVertical?: number
  paddingHorizontal?: number
  marginVertical?: number
  marginHorizontal?: number
}

export default function RandomPaperBackground({
  children,
  fixColor,
  paddingVertical = 0,
  paddingHorizontal = 0,
  marginVertical = 0,
  marginHorizontal = 0,
}: Props) {
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [path, setPath] = useState(generateRoundedRect(300, 300, 50))
  const color = fixColor ? fixColor : paperColors[Math.floor(Math.random() * paperColors.length)]

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout
    setSize({ width: width + paddingHorizontal, height: height + paddingVertical })
    setPath(generateRoundedRect(width + paddingHorizontal, height + paddingVertical, 50))
  }

  return (
    <View
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
      <View onLayout={handleLayout} style={{ zIndex: 1 }}>
        {children}
      </View>
    </View>
  )
}
