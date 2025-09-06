import React from 'react'
import { Image, ImageStyle, Pressable, StyleSheet } from 'react-native'

type Props = {
  imageUri?: string
  frameType?: 'square' | 'rectangle' | null
  onPressFunc?: () => void
  onLongPressFunc?: () => void
}

type SakuhinImageStyle = {
  squareImage: ImageStyle
  rectangleImage: ImageStyle
}

export default function SakuhinImage({ imageUri, frameType, onPressFunc, onLongPressFunc }: Props) {
  return (
    <Pressable onPress={onPressFunc} onLongPress={onLongPressFunc}>
      {imageUri ? (
        <Image
          testID="sakuhin-image-image"
          source={imageUri ? { uri: imageUri } : require('../assets/images/no_image.png')}
          style={frameType === 'square' ? styles.squareImage : styles.rectangleImage}
          resizeMode="cover"
        />
      ) : null}
    </Pressable>
  )
}

const styles = StyleSheet.create<SakuhinImageStyle>({
  squareImage: {
    width: 250,
    height: 250,
  },
  rectangleImage: {
    width: 250,
    height: 177,
  },
})
