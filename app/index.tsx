import { useFocusEffect } from '@react-navigation/native'
import React, { useState, useCallback } from 'react'
import { StyleSheet, FlatList } from 'react-native'
import { YStack, Paragraph } from 'tamagui'

import { SakuhinInfo, getItems, deleteItem } from '../utils/galleryUtils'

import RandomPaperBackground from '@/components/RandomPaperBackground'
import SakuhinDeleteModal from '@/components/SakuhinDeleteModal'
import SakuhinImage from '@/components/SakuhinImage'
import SakuhinInfoModal from '@/components/SakuhinInfoModal'

export default function Page() {
  const [myItems, setMyItems] = useState<SakuhinInfo[]>([])
  const [sakuhinInfoModalVisible, setSakuhinInfoModalVisible] = useState(false)
  const [sakuhinDeleteModalVisible, setSakuhinDeleteModalVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SakuhinInfo | null>(null)

  useFocusEffect(
    useCallback(() => {
      getItems().then((items) => setMyItems(items))
      return () => {}
    }, []),
  )

  const showInfo = (sakuhin: SakuhinInfo) => {
    setSelectedItem(sakuhin)
    setSakuhinInfoModalVisible(true)
  }

  const showDeleteModal = (sakuhin: SakuhinInfo) => {
    setSelectedItem(sakuhin)
    setSakuhinDeleteModalVisible(true)
  }

  return (
    <YStack backgroundColor={'$background'} flex={1} justifyContent="center" alignItems="center" paddingTop={30}>
      {myItems.length === 0 ? (
        <Paragraph fontWeight="800">さくひんがありません</Paragraph>
      ) : (
        <>
          <FlatList
            data={myItems}
            keyExtractor={(item) => item.key}
            numColumns={1}
            contentContainerStyle={styles.flatList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <RandomPaperBackground
                paddingVertical={70}
                paddingHorizontal={70}
                marginVertical={0}
                marginHorizontal={0}
              >
                <SakuhinImage
                  imageUri={item.uri}
                  frameType={item.frameType}
                  onPressFunc={() => showInfo(item)}
                  onLongPressFunc={() => showDeleteModal(item)}
                />
              </RandomPaperBackground>
            )}
          />
        </>
      )}
      <SakuhinInfoModal
        visible={sakuhinInfoModalVisible}
        sakuhin={selectedItem}
        onClose={() => setSakuhinInfoModalVisible(false)}
      />
      <SakuhinDeleteModal
        visible={sakuhinDeleteModalVisible}
        sakuhin={selectedItem}
        onClose={() => setSakuhinDeleteModalVisible(false)}
        deleteFunc={() =>
          deleteItem(selectedItem).then(() => {
            getItems().then((items) => setMyItems(items))
          })
        }
      />
    </YStack>
  )
}

const styles = StyleSheet.create({
  flatList: {
    alignItems: 'center',
  },
})
