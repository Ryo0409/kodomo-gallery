import React from 'react'
import { Dialog, DialogClose, YStack, Button, Paragraph } from 'tamagui'

type Props = {
  visible: boolean
  message: string | null
  onClose: () => void
}

export default function UploadModal({ visible, message, onClose }: Props) {
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
            <YStack my="$3">
              <Paragraph testID="message-modal-message" fontSize={15}>
                {message}
              </Paragraph>
            </YStack>
            <DialogClose asChild>
              <YStack my="$2">
                <Button testID="message-modal-close-button" theme="accent" fontWeight="800" onPress={onClose}>
                  とじる
                </Button>
              </YStack>
            </DialogClose>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
