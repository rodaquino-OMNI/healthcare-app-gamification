/**
 * Jest setup for AUSTA SuperApp mobile application
 * Configures mocks for React Native core modules, navigation, i18n,
 * and third-party libraries used across all three user journeys.
 */

// Extend expect with jest-native matchers
require('@testing-library/jest-native/extend-expect');

//@react-native-async-storage/async-storage

jest.mock('@react-native-async-storage/async-storage', () => {
  const store = {};
  return {
    getItem: jest.fn((key) => Promise.resolve(store[key] || null)),
    setItem: jest.fn((key, value) => {
      store[key] = value;
      return Promise.resolve();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
      return Promise.resolve();
    }),
    getAllKeys: jest.fn(() => Promise.resolve(Object.keys(store))),
    multiGet: jest.fn((keys) =>
      Promise.resolve(keys.map((key) => [key, store[key] || null])),
    ),
    multiSet: jest.fn((pairs) => {
      pairs.forEach(([key, value]) => {
        store[key] = value;
      });
      return Promise.resolve();
    }),
    multiRemove: jest.fn((keys) => {
      keys.forEach((key) => delete store[key]);
      return Promise.resolve();
    }),
  };
});

//react-native-mmkv

jest.mock('react-native-mmkv', () => {
  const storage = {};
  class MMKV {
    constructor() {
      this._store = { ...storage };
    }
    set(key, value) {
      this._store[key] = value;
    }
    getString(key) {
      const val = this._store[key];
      return typeof val === 'string' ? val : undefined;
    }
    getNumber(key) {
      const val = this._store[key];
      return typeof val === 'number' ? val : undefined;
    }
    getBoolean(key) {
      const val = this._store[key];
      return typeof val === 'boolean' ? val : undefined;
    }
    contains(key) {
      return key in this._store;
    }
    delete(key) {
      delete this._store[key];
    }
    clearAll() {
      this._store = {};
    }
    getAllKeys() {
      return Object.keys(this._store);
    }
  }
  return { MMKV };
});

//@react-navigation/native

jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      reset: jest.fn(),
      setOptions: jest.fn(),
      dispatch: jest.fn(),
      canGoBack: jest.fn(() => true),
      addListener: jest.fn(() => jest.fn()),
    }),
    useRoute: () => ({
      params: {},
      name: 'MockRoute',
      key: 'mock-route-key',
    }),
    useFocusEffect: jest.fn((callback) => {
      // Execute the callback immediately for testing
      if (typeof callback === 'function') {
        callback();
      }
    }),
    useIsFocused: jest.fn(() => true),
    NavigationContainer: ({ children }) =>
      React.createElement(React.Fragment, null, children),
    CommonActions: {
      navigate: jest.fn(),
      reset: jest.fn(),
      goBack: jest.fn(),
    },
    StackActions: {
      push: jest.fn(),
      pop: jest.fn(),
      popToTop: jest.fn(),
      replace: jest.fn(),
    },
    createNavigationContainerRef: jest.fn(() => ({
      current: null,
      isReady: jest.fn(() => false),
    })),
  };
});

//@react-navigation/native-stack

jest.mock('@react-navigation/native-stack', () => {
  const React = require('react');
  return {
    createNativeStackNavigator: () => ({
      Navigator: ({ children }) =>
        React.createElement(React.Fragment, null, children),
      Screen: () => null,
      Group: ({ children }) =>
        React.createElement(React.Fragment, null, children),
    }),
  };
});

//@react-navigation/bottom-tabs

jest.mock('@react-navigation/bottom-tabs', () => {
  const React = require('react');
  return {
    createBottomTabNavigator: () => ({
      Navigator: ({ children }) =>
        React.createElement(React.Fragment, null, children),
      Screen: () => null,
    }),
  };
});

//@react-navigation/stack

jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }) =>
        React.createElement(React.Fragment, null, children),
      Screen: () => null,
    }),
    CardStyleInterpolators: {
      forHorizontalIOS: jest.fn(),
      forVerticalIOS: jest.fn(),
      forFadeFromBottomAndroid: jest.fn(),
    },
    TransitionPresets: {
      SlideFromRightIOS: {},
      ModalSlideFromBottomIOS: {},
    },
  };
});

//react-i18next

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      language: 'pt-BR',
      changeLanguage: jest.fn(() => Promise.resolve()),
      exists: jest.fn(() => true),
    },
  }),
  Trans: ({ children }) => children,
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
  I18nextProvider: ({ children }) => children,
}));

//react-native-safe-area-context

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) =>
      React.createElement(View, { testID: 'safe-area-provider' }, children),
    SafeAreaView: ({ children, style, ...props }) =>
      React.createElement(View, { style, ...props }, children),
    useSafeAreaInsets: () => ({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }),
    useSafeAreaFrame: () => ({
      x: 0,
      y: 0,
      width: 375,
      height: 812,
    }),
    SafeAreaInsetsContext: {
      Consumer: ({ children }) =>
        children({ top: 0, bottom: 0, left: 0, right: 0 }),
    },
    initialWindowMetrics: {
      frame: { x: 0, y: 0, width: 375, height: 812 },
      insets: { top: 0, bottom: 0, left: 0, right: 0 },
    },
  };
});

//react-native-gesture-handler

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View, TouchableOpacity } = require('react-native');
  return {
    GestureHandlerRootView: ({ children, ...props }) =>
      React.createElement(View, props, children),
    Swipeable: ({ children, ...props }) =>
      React.createElement(View, props, children),
    DrawerLayout: ({ children, ...props }) =>
      React.createElement(View, props, children),
    PanGestureHandler: ({ children }) =>
      React.createElement(View, null, children),
    TapGestureHandler: ({ children }) =>
      React.createElement(View, null, children),
    FlingGestureHandler: ({ children }) =>
      React.createElement(View, null, children),
    LongPressGestureHandler: ({ children }) =>
      React.createElement(View, null, children),
    ScrollView: ({ children, ...props }) =>
      React.createElement(View, props, children),
    FlatList: ({ children, ...props }) =>
      React.createElement(View, props, children),
    TouchableOpacity: ({ children, ...props }) =>
      React.createElement(TouchableOpacity, props, children),
    State: {
      UNDETERMINED: 0,
      FAILED: 1,
      BEGAN: 2,
      CANCELLED: 3,
      ACTIVE: 4,
      END: 5,
    },
    Directions: {
      RIGHT: 1,
      LEFT: 2,
      UP: 4,
      DOWN: 8,
    },
    gestureHandlerRootHOC: (component) => component,
  };
});

// react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const { View, Text, Image, ScrollView } = require('react-native');
  const animFn = jest.fn(() => ({ delay: jest.fn(), duration: jest.fn() }));
  return {
    __esModule: true,
    default: {
      addWhitelistedNativeProps: jest.fn(),
      addWhitelistedUIProps: jest.fn(),
      Value: jest.fn(),
      event: jest.fn(),
      createAnimatedComponent: (c) => c,
      timing: jest.fn(() => ({ start: jest.fn() })),
      spring: jest.fn(() => ({ start: jest.fn() })),
      decay: jest.fn(() => ({ start: jest.fn() })),
    },
    useSharedValue: jest.fn((v) => ({ value: v })),
    useAnimatedStyle: jest.fn((fn) => { try { return fn(); } catch { return {}; } }),
    useAnimatedScrollHandler: jest.fn(() => jest.fn()),
    useDerivedValue: jest.fn((fn) => ({ value: fn() })),
    useAnimatedRef: jest.fn(() => ({ current: null })),
    withTiming: jest.fn((v) => v),
    withSpring: jest.fn((v) => v),
    withDelay: jest.fn((_, a) => a),
    withSequence: jest.fn((...a) => a[a.length - 1]),
    withRepeat: jest.fn((a) => a),
    cancelAnimation: jest.fn(),
    Easing: { linear: jest.fn(), ease: jest.fn(), bezier: jest.fn(() => jest.fn()), in: jest.fn(), out: jest.fn(), inOut: jest.fn() },
    FadeIn: { duration: animFn }, FadeOut: { duration: animFn },
    SlideInRight: { duration: jest.fn() }, SlideOutLeft: { duration: jest.fn() },
    Layout: { duration: jest.fn() }, ZoomIn: { duration: jest.fn() }, ZoomOut: { duration: jest.fn() },
    createAnimatedComponent: (c) => c,
    View, Text, Image, ScrollView,
    Animated: { View, Text, Image, ScrollView },
    runOnJS: jest.fn((fn) => fn),
    runOnUI: jest.fn((fn) => fn),
    interpolate: jest.fn((v) => v),
    Extrapolation: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
  };
});

//react-native Linking mock

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(() => Promise.resolve()),
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  getInitialURL: jest.fn(() => Promise.resolve(null)),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  removeEventListener: jest.fn(),
}));

//react-native Alert mock

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
  prompt: jest.fn(),
}));

//react-native Share mock

jest.mock('react-native/Libraries/Share/Share', () => ({
  share: jest.fn(() => Promise.resolve({ action: 'sharedAction' })),
}));

// react-native-screens
jest.mock('react-native-screens', () => {
  const React = require('react');
  const { View } = require('react-native');
  const wrap = ({ children, ...props }) => React.createElement(View, props, children);
  return {
    enableScreens: jest.fn(),
    Screen: wrap, ScreenContainer: wrap, NativeScreen: wrap,
    NativeScreenContainer: wrap, ScreenStack: wrap,
    ScreenStackHeaderConfig: () => null,
  };
});

//@react-native-community/netinfo

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn(() =>
    Promise.resolve({
      isConnected: true,
      isInternetReachable: true,
      type: 'wifi',
    }),
  ),
  useNetInfo: jest.fn(() => ({
    isConnected: true,
    isInternetReachable: true,
    type: 'wifi',
  })),
}));

//react-native-image-picker

jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn(),
  launchImageLibrary: jest.fn(),
}));

//react-native-device-info

jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn(() => '1.0.0'),
  getBuildNumber: jest.fn(() => '1'),
  getUniqueId: jest.fn(() => Promise.resolve('mock-unique-id')),
  getDeviceId: jest.fn(() => 'mock-device-id'),
  getBundleId: jest.fn(() => 'com.austa.superapp'),
  getModel: jest.fn(() => 'Mock Device'),
  getSystemName: jest.fn(() => 'iOS'),
  getSystemVersion: jest.fn(() => '17.0'),
  isEmulator: jest.fn(() => Promise.resolve(true)),
}));

//react-native-config

jest.mock('react-native-config', () => ({
  API_URL: 'http://localhost:3000',
  ENVIRONMENT: 'test',
}));

//react-native-biometrics

jest.mock('react-native-biometrics', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    isSensorAvailable: jest.fn(() =>
      Promise.resolve({ available: true, biometryType: 'FaceID' }),
    ),
    simplePrompt: jest.fn(() => Promise.resolve({ success: true })),
    createKeys: jest.fn(() =>
      Promise.resolve({ publicKey: 'mock-public-key' }),
    ),
  })),
}));

//@tanstack/react-query

jest.mock('@tanstack/react-query', () => {
  const original = jest.requireActual('@tanstack/react-query');
  return {
    ...original,
    useQuery: jest.fn(() => ({
      data: undefined,
      error: null,
      isLoading: false,
      isError: false,
      isSuccess: true,
      refetch: jest.fn(),
    })),
    useMutation: jest.fn(() => ({
      mutate: jest.fn(),
      mutateAsync: jest.fn(() => Promise.resolve()),
      isLoading: false,
      isError: false,
      isSuccess: false,
      reset: jest.fn(),
    })),
  };
});

//Silence console warnings in tests (optional, keeps output clean)

const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = (...args) => {
    // Suppress known noisy warnings
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Animated: `useNativeDriver`') ||
        args[0].includes('componentWillReceiveProps') ||
        args[0].includes('componentWillMount'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };

  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: An update to')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});
