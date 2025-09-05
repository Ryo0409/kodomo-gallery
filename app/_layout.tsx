import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { defaultConfig } from '@tamagui/config/v4'
import { Tabs } from 'expo-router'
import { createTamagui, TamaguiProvider } from 'tamagui'

import { themes } from '../themes/themes'

const config = createTamagui({
  ...defaultConfig,
  themes,
})

export default function Layout() {
  return (
    <TamaguiProvider config={config}>
      <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#e88121', tabBarInactiveTintColor: '#555' }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'ぎゃらりー',
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="landmark" color={color} size={size} style={{ marginTop: 5 }} />
            ),
          }}
        />
        <Tabs.Screen
          name="upload"
          options={{
            title: 'とうこう',
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="plus-square" color={color} size={size} style={{ marginTop: 5 }} />
            ),
          }}
        />
      </Tabs>
    </TamaguiProvider>
  )
}
