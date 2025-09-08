import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { defaultConfig } from '@tamagui/config/v4'
import { Tabs } from 'expo-router'
import { createTamagui, TamaguiProvider } from 'tamagui'

import { themes } from '../themes/themes'

const config = createTamagui({
  ...defaultConfig,
  themes,
})

const paperColors = ['#d95f26', '#e3be4f', '#27568b', '#41acd2', '#e7c0d4']

const getRandomColor = () => {
  return paperColors[Math.floor(Math.random() * paperColors.length)]
}

export default function Layout() {
  return (
    <TamaguiProvider config={config}>
      <Tabs
        screenOptions={{ headerShown: false, tabBarActiveTintColor: getRandomColor(), tabBarInactiveTintColor: '#555' }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'ぎゃらりー',
            tabBarShowLabel: false,
            tabBarIcon: ({ focused, size }) => (
              <MaterialCommunityIcons
                name="square"
                size={25}
                color={focused ? getRandomColor() : '#555'}
                style={{ marginTop: 5 }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="upload"
          options={{
            title: 'とうこう',
            tabBarShowLabel: false,
            tabBarIcon: ({ focused, size }) => (
              <MaterialCommunityIcons
                name="triangle"
                size={size}
                color={focused ? getRandomColor() : '#555'}
                style={{ marginTop: 5 }}
              />
            ),
          }}
        />
      </Tabs>
    </TamaguiProvider>
  )
}
