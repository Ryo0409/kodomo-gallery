import { Dimensions } from 'react-native'
import { Dialog, DialogClose, YStack, Button, Paragraph } from 'tamagui'

import RandomPaperBackground from '@/components/RandomPaperBackground'
import SakuhinImage from '@/components/SakuhinImage'
import { SakuhinInfo } from '@/utils/galleryUtils'

type Props = {
  visible: boolean
  sakuhin: SakuhinInfo | null
  onClose: () => void
  deleteFunc: () => void
}

export default function SakuhinDeleteModal({ visible, sakuhin, onClose, deleteFunc }: Props) {
  const windowWidth = Dimensions.get('window').width
  return (
    <Dialog
      modal
      open={visible}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          backgroundColor="$shadow6"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content bordered elevate key="content">
          <YStack mx="$4" mt="$2">
            <YStack my="$3" alignItems="center">
              <Paragraph testID="sakuhin-delete-modal-title" fontWeight="800" fontSize={20}>
                このさくひんをさくじょしますか？
              </Paragraph>
            </YStack>
            <YStack my="$3" alignItems="center">
              <RandomPaperBackground
                randomSeed={sakuhin?.frameSeed}
                paddingVertical={70}
                paddingHorizontal={70}
                marginVertical={0}
                marginHorizontal={0}
              >
                <SakuhinImage
                  imageUri={sakuhin?.uri}
                  width={windowWidth * 0.6}
                  height={sakuhin?.frameType === 'square' ? windowWidth * 0.6 : windowWidth * 0.42}
                />
              </RandomPaperBackground>
            </YStack>
            <DialogClose asChild>
              <YStack my="$2">
                <Button
                  testID="sakuhin-delete-modal-delete-button"
                  theme="accent"
                  fontWeight="800"
                  onPress={deleteFunc}
                >
                  さくじょ
                </Button>
              </YStack>
            </DialogClose>
            <DialogClose asChild>
              <YStack my="$2">
                <Button testID="sakuhin-delete-modal-cancel-button" themeInverse fontWeight="800" onPress={onClose}>
                  きゃんせる
                </Button>
              </YStack>
            </DialogClose>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
