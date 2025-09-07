import { useState } from 'react'
import 'react-native-get-random-values'
import { XStack, YStack, Input, Paragraph, Button } from 'tamagui'

import { uploadItem, pickItemImage } from '../utils/galleryUtils'

import MessageModal from '@/components/MessageModal'
import RandomPaperBackground from '@/components/RandomPaperBackground'
import SakuhinImage from '@/components/SakuhinImage'
import SakuhinImagePickModal from '@/components/SakuhinImagePickModal'

export default function Page() {
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [detail, setDetail] = useState('')
  const [frameType, setFrameType] = useState<'square' | 'rectangle' | null>(null)

  const [uploadResult, setUploadResult] = useState<string | null>(null)
  const [sakuhinUploadResultModalVisible, setSakuhinUploadResultModalVisible] = useState(false)
  const [sakuhinImagePickModalVisible, setSakuhinImagePickModalVisible] = useState(false)

  const resetForm = () => {
    setImageUri(null)
    setTitle('')
    setArtist('')
    setDetail('')
    setFrameType(null)
  }

  const sakuhinImagePickHandler = async (frameType: 'square' | 'rectangle' | null) => {
    setFrameType(frameType)

    pickItemImage()
      .then((uri) => {
        setImageUri(uri || null)
      })
      .catch((e) => {
        setUploadResult(e.message)
        setSakuhinUploadResultModalVisible(true)
      })
  }

  const sakuhinUploadHandler = async () => {
    uploadItem(imageUri || '', title, artist, detail, frameType)
      .then(() => {
        setUploadResult('ぎゃらりーにとうこうしました')
        setSakuhinUploadResultModalVisible(true)
        resetForm()
      })
      .catch((e) => {
        setUploadResult(e.message)
        setSakuhinUploadResultModalVisible(true)
      })
  }

  return (
    <YStack $maxMd={{ width: '100%' }} backgroundColor={'$background'} flex={1} paddingTop={50}>
      <YStack mx="$4" my="$4" alignItems="center">
        <RandomPaperBackground
          fixColor="#e88121"
          paddingVertical={70}
          paddingHorizontal={70}
          marginVertical={0}
          marginHorizontal={0}
        >
          {imageUri ? (
            <SakuhinImage
              imageUri={imageUri}
              frameType={frameType}
              onPressFunc={() => setSakuhinImagePickModalVisible(true)}
            />
          ) : (
            <Button
              testID="upload-image-select-button"
              width={250}
              height={250}
              backgroundColor="#fff"
              borderRadius={16}
              borderWidth={1}
              borderColor="#eee"
              onPress={() => setSakuhinImagePickModalVisible(true)}
            >
              <Paragraph testID="upload-image-select-button-label" fontWeight="800">
                さくひんをえらぶ
              </Paragraph>
            </Button>
          )}
        </RandomPaperBackground>
      </YStack>
      <YStack mx="$4" mt="$2">
        <Paragraph testID="upload-title-input-label" fontWeight="800">
          さくひんめい
        </Paragraph>
        <Input testID="upload-title-input" size="$5" id="title" value={title} onChangeText={setTitle} />
      </YStack>
      <YStack mx="$4" my="$2">
        <Paragraph testID="upload-artist-input-label" fontWeight="800">
          さくしゃ
        </Paragraph>
        <Input testID="upload-artist-input" size="$5" id="artist" value={artist} onChangeText={setArtist} />
      </YStack>
      <YStack mx="$4" mt="$2">
        <Paragraph testID="upload-detail-input-label" fontWeight="800">
          かいせつ
        </Paragraph>
        <Input testID="upload-detail-input" size="$5" id="detail" value={detail} onChangeText={setDetail} />
      </YStack>
      <XStack mx="$4" mt="$4" justifyContent="space-around" alignItems="center">
        <Button testID="upload-upload-button" theme="accent" size="$4" fontWeight="800" onPress={sakuhinUploadHandler}>
          とうこう
        </Button>
        <Button testID="upload-reset-button" themeInverse size="$4" fontWeight="800" onPress={resetForm}>
          りせっと
        </Button>
      </XStack>
      <SakuhinImagePickModal
        visible={sakuhinImagePickModalVisible}
        onSelect={(type) => {
          setSakuhinImagePickModalVisible(false)
          sakuhinImagePickHandler(type)
        }}
        onClose={() => setSakuhinImagePickModalVisible(false)}
      />
      <MessageModal
        visible={sakuhinUploadResultModalVisible}
        message={uploadResult}
        onClose={() => {
          setUploadResult(null)
          setSakuhinUploadResultModalVisible(false)
        }}
      />
    </YStack>
  )
}
