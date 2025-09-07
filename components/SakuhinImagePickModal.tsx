import { Dialog, Button, Paragraph, XStack, YStack } from 'tamagui'

type Props = {
  visible: boolean
  onSelect: (type: 'square' | 'rectangle') => void
  onClose: () => void
}

export default function SakuhinImagePickModal({ visible, onSelect, onClose }: Props) {
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
          <YStack gap="$3" alignItems="center">
            <Paragraph testID="sakuhin-image-pick-modal-title" fontWeight="800" fontSize={18}>
              がくぶちをせんたくしてください
            </Paragraph>
            <XStack mx="$4" mt="$4" justifyContent="space-around" alignItems="center">
              <Button
                testID="sakuhin-image-pick-modal-square-button"
                mx="$2"
                size="$4"
                fontWeight="800"
                onPress={() => {
                  onSelect('square')
                }}
              >
                せいほう
              </Button>
              <Button
                testID="sakuhin-image-pick-modal-rectangle-button"
                mx="$2"
                size="$4"
                fontWeight="800"
                onPress={() => {
                  onSelect('rectangle')
                }}
              >
                よこなが
              </Button>
              <Button
                testID="sakuhin-image-pick-modal-cancel-button"
                mx="$2"
                themeInverse
                size="$4"
                fontWeight="800"
                onPress={() => onClose()}
              >
                きゃんせる
              </Button>
            </XStack>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
