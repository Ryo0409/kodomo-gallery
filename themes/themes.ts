import * as Colors from '@tamagui/colors'
import { createThemes, defaultComponentThemes } from '@tamagui/theme-builder'

const darkPalette = [
  'hsla(30, 100%, 1%, 1)',
  'hsla(30, 100%, 6%, 1)',
  'hsla(30, 100%, 12%, 1)',
  'hsla(30, 100%, 17%, 1)',
  'hsla(30, 100%, 23%, 1)',
  'hsla(30, 100%, 28%, 1)',
  'hsla(30, 100%, 34%, 1)',
  'hsla(30, 100%, 39%, 1)',
  'hsla(30, 100%, 45%, 1)',
  'hsla(30, 100%, 50%, 1)',
  'hsla(0, 15%, 93%, 1)',
  'hsla(0, 15%, 99%, 1)',
]
const lightPalette = [
  'hsla(30, 100%, 99%, 1)',
  'hsla(30, 100%, 93%, 1)',
  'hsla(30, 100%, 88%, 1)',
  'hsla(30, 100%, 83%, 1)',
  'hsla(30, 100%, 77%, 1)',
  'hsla(30, 100%, 72%, 1)',
  'hsla(30, 100%, 66%, 1)',
  'hsla(30, 100%, 61%, 1)',
  'hsla(30, 100%, 55%, 1)',
  'hsla(30, 100%, 50%, 1)',
  'hsla(0, 15%, 15%, 1)',
  'hsla(0, 15%, 1%, 1)',
]

const lightShadows = {
  shadow1: 'rgba(0,0,0,0.04)',
  shadow2: 'rgba(0,0,0,0.08)',
  shadow3: 'rgba(0,0,0,0.16)',
  shadow4: 'rgba(0,0,0,0.24)',
  shadow5: 'rgba(0,0,0,0.32)',
  shadow6: 'rgba(0,0,0,0.4)',
}

const darkShadows = {
  shadow1: 'rgba(0,0,0,0.2)',
  shadow2: 'rgba(0,0,0,0.3)',
  shadow3: 'rgba(0,0,0,0.4)',
  shadow4: 'rgba(0,0,0,0.5)',
  shadow5: 'rgba(0,0,0,0.6)',
  shadow6: 'rgba(0,0,0,0.7)',
}

// we're adding some example sub-themes for you to show how they are done, "success" "warning", "error":

const builtThemes = createThemes({
  componentThemes: defaultComponentThemes,

  base: {
    palette: {
      dark: darkPalette,
      light: lightPalette,
    },

    extra: {
      light: {
        ...Colors.green,
        ...Colors.red,
        ...Colors.yellow,
        ...lightShadows,
        shadowColor: lightShadows.shadow1,
      },
      dark: {
        ...Colors.greenDark,
        ...Colors.redDark,
        ...Colors.yellowDark,
        ...darkShadows,
        shadowColor: darkShadows.shadow1,
      },
    },
  },

  accent: {
    palette: {
      dark: [
        'hsla(29, 81%, 35%, 1)',
        'hsla(29, 81%, 38%, 1)',
        'hsla(29, 81%, 41%, 1)',
        'hsla(29, 81%, 43%, 1)',
        'hsla(29, 81%, 46%, 1)',
        'hsla(29, 81%, 49%, 1)',
        'hsla(29, 81%, 52%, 1)',
        'hsla(29, 81%, 54%, 1)',
        'hsla(29, 81%, 57%, 1)',
        'hsla(29, 81%, 60%, 1)',
        'hsla(250, 50%, 90%, 1)',
        'hsla(250, 50%, 95%, 1)',
      ],
      light: [
        'hsla(29, 81%, 52%, 1)',
        'hsla(29, 81%, 53%, 1)',
        'hsla(29, 81%, 55%, 1)',
        'hsla(29, 81%, 56%, 1)',
        'hsla(29, 81%, 58%, 1)',
        'hsla(29, 81%, 59%, 1)',
        'hsla(29, 81%, 61%, 1)',
        'hsla(29, 81%, 62%, 1)',
        'hsla(29, 81%, 64%, 1)',
        'hsla(29, 81%, 65%, 1)',
        'hsla(250, 50%, 95%, 1)',
        'hsla(250, 50%, 95%, 1)',
      ],
    },
  },

  childrenThemes: {
    warning: {
      palette: {
        dark: Object.values(Colors.yellowDark),
        light: Object.values(Colors.yellow),
      },
    },

    error: {
      palette: {
        dark: Object.values(Colors.redDark),
        light: Object.values(Colors.red),
      },
    },

    success: {
      palette: {
        dark: Object.values(Colors.greenDark),
        light: Object.values(Colors.green),
      },
    },
  },

  // optionally add more, can pass palette or template

  // grandChildrenThemes: {
  //   alt1: {
  //     template: 'alt1',
  //   },
  //   alt2: {
  //     template: 'alt2',
  //   },
  //   surface1: {
  //     template: 'surface1',
  //   },
  //   surface2: {
  //     template: 'surface2',
  //   },
  //   surface3: {
  //     template: 'surface3',
  //   },
  // },
})

export type Themes = typeof builtThemes

// the process.env conditional here is optional but saves web client-side bundle
// size by leaving out themes JS. tamagui automatically hydrates themes from CSS
// back into JS for you, and the bundler plugins set TAMAGUI_ENVIRONMENT. so
// long as you are using the Vite, Next, Webpack plugins this should just work,
// but if not you can just export builtThemes directly as themes:
export const themes: Themes =
  process.env.TAMAGUI_ENVIRONMENT === 'client' && process.env.NODE_ENV === 'production'
    ? ({} as any)
    : (builtThemes as any)
