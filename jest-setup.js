// Jest setup file
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock'

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage)

// Mock uuid
jest.mock('uuid', () => ({ v4: () => 'test-uuid' }))

// Mock expo-file-system
jest.mock('expo-file-system', () => ({
  readAsStringAsync: jest.fn(),
  writeAsStringAsync: jest.fn(),
  makeDirectoryAsync: jest.fn(),
  deleteAsync: jest.fn(),
  getInfoAsync: jest.fn(),
  documentDirectory: 'file:///mock/',
  downloadAsync: jest.fn(),
  copyAsync: jest.fn(),
  moveAsync: jest.fn(),
}))

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  requestMediaLibraryPermissionsAsync: jest.fn(),
  requestCameraPermissionsAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'Images',
  },
}))

// Mock expo router navigation
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  useFocusEffect: jest.fn(),
}))

// Suppress console warnings in tests
const originalWarn = console.warn
const originalError = console.error

beforeAll(() => {
  console.warn = (...args) => {
    const message = args.join(' ')
    if (message.includes('An update to') && message.includes('was not wrapped in act(...)')) {
      return
    }
    if (message.includes('An error occurred in the')) {
      return
    }
    originalWarn(...args)
  }

  console.error = (...args) => {
    const message = args.join(' ')
    if (message.includes('An update to') && message.includes('was not wrapped in act(...)')) {
      return
    }
    originalError(...args)
  }
})

afterAll(() => {
  console.warn = originalWarn
  console.error = originalError
})
