import React from 'react'
import { Image, Pressable } from 'react-native'

type Props = {
  imageUri?: string
  width?: number
  height?: number
  onPressFunc?: () => void
  onLongPressFunc?: () => void
}

export default function SakuhinImage({ imageUri, width, height, onPressFunc, onLongPressFunc }: Props) {
  return (
    <Pressable onPress={onPressFunc} onLongPress={onLongPressFunc}>
      {imageUri ? (
        <Image
          testID="sakuhin-image-image"
          source={imageUri ? { uri: imageUri } : require('../assets/images/no_image.png')}
          resizeMode="cover"
          width={width}
          height={height}
        />
      ) : null}
    </Pressable>
  )
}
