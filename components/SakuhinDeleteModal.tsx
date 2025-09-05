import React, { useState } from 'react'
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
  const [deleteResult, setDeleteResult] = useState<'success' | 'error' | null>(null)

  const wrapedDeleteFunc = async () => {
    try {
      await deleteFunc()
      setDeleteResult('success')
    } catch {
      setDeleteResult('error')
    }
  }

  const resetAndClose = () => {
    setDeleteResult(null)
    onClose()
  }

  return (
    <Dialog
      modal
      open={visible}
      onOpenChange={(open) => {
        if (!open) resetAndClose()
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
          {deleteResult ? (
            <YStack mx="$4" mt="$2">
              {deleteResult === 'success' ? (
                <YStack my="$3">
                  <Paragraph fontSize={15}>さくじょにせいこうしました</Paragraph>
                </YStack>
              ) : (
                <YStack my="$3">
                  <Paragraph fontSize={15}>さくじょにしっぱいしました</Paragraph>
                </YStack>
              )}
              <DialogClose asChild>
                <YStack my="$2">
                  <Button themeInverse fontWeight="800" onPress={resetAndClose}>
                    とじる
                  </Button>
                </YStack>
              </DialogClose>
            </YStack>
          ) : (
            <YStack mx="$4" mt="$2">
              <YStack my="$3" alignItems="center">
                <Paragraph fontWeight="800" fontSize={20}>
                  このさくひんをさくじょしますか？
                </Paragraph>
              </YStack>
              <YStack my="$3" alignItems="center">
                <RandomPaperBackground
                  paddingVertical={70}
                  paddingHorizontal={70}
                  marginVertical={0}
                  marginHorizontal={0}
                >
                  <SakuhinImage imageUri={sakuhin?.uri} frameType={sakuhin?.frameType} />
                </RandomPaperBackground>
              </YStack>
              <DialogClose asChild>
                <YStack my="$2">
                  <Button theme="accent" fontWeight="800" onPress={wrapedDeleteFunc}>
                    さくじょ
                  </Button>
                </YStack>
              </DialogClose>
              <DialogClose asChild>
                <YStack my="$2">
                  <Button themeInverse fontWeight="800" onPress={resetAndClose}>
                    きゃんせる
                  </Button>
                </YStack>
              </DialogClose>
            </YStack>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
