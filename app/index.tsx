import { useFocusEffect } from '@react-navigation/native'
import React, { useState, useCallback } from 'react'
import { StyleSheet, FlatList } from 'react-native'
import { YStack, Paragraph } from 'tamagui'

import { SakuhinInfo, getItems, deleteItem } from '../utils/galleryUtils'

import MessageModal from '@/components/MessageModal'
import RandomPaperBackground from '@/components/RandomPaperBackground'
import SakuhinDeleteModal from '@/components/SakuhinDeleteModal'
import SakuhinImage from '@/components/SakuhinImage'
import SakuhinInfoModal from '@/components/SakuhinInfoModal'

export default function Page() {
  const [myItems, setMyItems] = useState<SakuhinInfo[]>([])
  const [sakuhinInfoModalVisible, setSakuhinInfoModalVisible] = useState(false)
  const [sakuhinDeleteModalVisible, setSakuhinDeleteModalVisible] = useState(false)
  const [actionResultModalVisible, setActionResultModalVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SakuhinInfo | null>(null)
  const [actionResult, setActionResult] = useState<string | null>(null)

  useFocusEffect(
    useCallback(() => {
      getItems()
        .then((items) => setMyItems(items))
        .catch((e) => {
          setMyItems([])
          setActionResult(e.message)
          setActionResultModalVisible(true)
        })
      return () => {}
    }, []),
  )

  return (
    <YStack
      testID="index-gallery-page"
      backgroundColor={'$background'}
      flex={1}
      justifyContent="center"
      alignItems="center"
      paddingTop={30}
    >
      {myItems.length === 0 ? (
        <Paragraph testID="index-no-items-message" fontWeight="800">
          さくひんがありません
        </Paragraph>
      ) : (
        <>
          <FlatList
            testID="index-gallery-flatlist"
            data={myItems}
            keyExtractor={(item) => item.key}
            numColumns={1}
            contentContainerStyle={styles.flatList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <RandomPaperBackground
                randomSeed={item.frameSeed}
                paddingVertical={70}
                paddingHorizontal={70}
                marginVertical={0}
                marginHorizontal={0}
              >
                <SakuhinImage
                  imageUri={item.uri}
                  frameType={item.frameType}
                  onPressFunc={() => {
                    setSelectedItem(item)
                    setSakuhinInfoModalVisible(true)
                  }}
                  onLongPressFunc={() => {
                    setSelectedItem(item)
                    setSakuhinDeleteModalVisible(true)
                  }}
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
          deleteItem(selectedItem)
            .then(() => {
              getItems().then((items) => setMyItems(items))
              setSakuhinDeleteModalVisible(false)
              setActionResult('さくじょにせいこうしました')
              setActionResultModalVisible(true)
            })
            .catch((e) => {
              setSakuhinDeleteModalVisible(false)
              setActionResult(e.message)
              setActionResultModalVisible(true)
            })
        }
      />
      <MessageModal
        visible={actionResultModalVisible}
        message={actionResult}
        onClose={() => {
          setActionResult(null)
          setActionResultModalVisible(false)
        }}
      />
    </YStack>
  )
}

const styles = StyleSheet.create({
  flatList: {
    alignItems: 'center',
  },
})
