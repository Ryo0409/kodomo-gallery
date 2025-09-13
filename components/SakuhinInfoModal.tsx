import React from 'react'
import { Card, Dialog, DialogClose, YStack, Button, Paragraph, Separator, Text } from 'tamagui'

import RandomPaperBackground from '@/components/RandomPaperBackground'
import SakuhinImage from '@/components/SakuhinImage'
import { SakuhinInfo } from '@/utils/galleryUtils'

type Props = {
  visible: boolean
  sakuhin: SakuhinInfo | null
  onClose: () => void
}

export default function SakuhinInfoModal({ visible, sakuhin, onClose }: Props) {
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
              <Paragraph testID="sakuhin-info-modal-title" fontWeight="800" fontSize={25}>
                このさくひんについて
              </Paragraph>
            </YStack>
            <RandomPaperBackground
              randomSeed={sakuhin?.frameSeed}
              paddingVertical={70}
              paddingHorizontal={70}
              marginVertical={0}
              marginHorizontal={0}
            >
              <SakuhinImage imageUri={sakuhin?.uri} frameType={sakuhin?.frameType} />
            </RandomPaperBackground>
            <Card
              mt="$4"
              p="$3"
              borderRadius="$4"
              backgroundColor="#f5f3f2"
              shadowColor="$shadow3"
              shadowRadius="$1"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.3}
            >
              <YStack my="$1">
                <Paragraph testID="sakuhin-info-modal-sakuhin-title-label" fontWeight="800" fontSize={15}>
                  さくひんめい
                </Paragraph>
                <Text testID="sakuhin-info-modal-sakuhin-title">{sakuhin?.title || '（未設定）'}</Text>
              </YStack>
              <YStack my="$1">
                <Paragraph testID="sakuhin-info-modal-sakuhin-artist-label" fontWeight="800" fontSize={15}>
                  さくしゃ
                </Paragraph>
                <Text testID="sakuhin-info-modal-sakuhin-artist">{sakuhin?.artist || '（未設定）'}</Text>
              </YStack>
              <YStack my="$1">
                <Paragraph testID="sakuhin-info-modal-sakuhin-detail-label" fontWeight="800" fontSize={15}>
                  かいせつ
                </Paragraph>
                <Text testID="sakuhin-info-modal-sakuhin-detail">{sakuhin?.detail || '（未設定）'}</Text>
              </YStack>
            </Card>
            <Separator my="$5" />
            <DialogClose asChild>
              <Button testID="sakuhin-info-modal-close-button" theme="accent" fontWeight="800" onPress={onClose}>
                とじる
              </Button>
            </DialogClose>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
