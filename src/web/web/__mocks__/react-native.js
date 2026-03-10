/**
 * Mock for react-native in web Jest tests.
 * Design-system components import react-native primitives (ActivityIndicator,
 * View, Text, etc.) which are not available in jsdom. This stub provides the
 * minimum surface so that tests can render pages that transitively depend on
 * design-system components.
 */
const React = require('react');

const createMockComponent = (name) => {
  const Component = ({ children, ...props }) =>
    React.createElement('div', { 'data-testid': `rn-${name.toLowerCase()}`, ...props }, children);
  Component.displayName = name;
  return Component;
};

module.exports = {
  ActivityIndicator: createMockComponent('ActivityIndicator'),
  Animated: {
    View: createMockComponent('AnimatedView'),
    Text: createMockComponent('AnimatedText'),
    Image: createMockComponent('AnimatedImage'),
    ScrollView: createMockComponent('AnimatedScrollView'),
    FlatList: createMockComponent('AnimatedFlatList'),
    createAnimatedComponent: (comp) => comp,
    timing: () => ({ start: jest.fn() }),
    spring: () => ({ start: jest.fn() }),
    decay: () => ({ start: jest.fn() }),
    sequence: () => ({ start: jest.fn() }),
    parallel: () => ({ start: jest.fn() }),
    Value: jest.fn().mockImplementation(() => ({
      setValue: jest.fn(),
      interpolate: jest.fn().mockReturnValue(0),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })),
    event: jest.fn(),
  },
  Dimensions: {
    get: jest.fn().mockReturnValue({ width: 375, height: 812 }),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
  Easing: {
    linear: jest.fn(),
    ease: jest.fn(),
    bezier: jest.fn(),
    in: jest.fn(),
    out: jest.fn(),
    inOut: jest.fn(),
  },
  FlatList: createMockComponent('FlatList'),
  Image: createMockComponent('Image'),
  KeyboardAvoidingView: createMockComponent('KeyboardAvoidingView'),
  Modal: createMockComponent('Modal'),
  Platform: {
    OS: 'web',
    select: (obj) => obj.web || obj.default,
    Version: 0,
  },
  Pressable: createMockComponent('Pressable'),
  SafeAreaView: createMockComponent('SafeAreaView'),
  ScrollView: createMockComponent('ScrollView'),
  StatusBar: createMockComponent('StatusBar'),
  StyleSheet: {
    create: (styles) => styles,
    flatten: (style) => (Array.isArray(style) ? Object.assign({}, ...style) : style || {}),
    hairlineWidth: 1,
    absoluteFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    absoluteFillObject: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  },
  Switch: createMockComponent('Switch'),
  Text: createMockComponent('Text'),
  TextInput: createMockComponent('TextInput'),
  TouchableHighlight: createMockComponent('TouchableHighlight'),
  TouchableOpacity: createMockComponent('TouchableOpacity'),
  TouchableWithoutFeedback: createMockComponent('TouchableWithoutFeedback'),
  View: createMockComponent('View'),
  useColorScheme: jest.fn().mockReturnValue('light'),
  useWindowDimensions: jest.fn().mockReturnValue({ width: 375, height: 812 }),
  PixelRatio: {
    get: jest.fn().mockReturnValue(2),
    getFontScale: jest.fn().mockReturnValue(1),
    getPixelSizeForLayoutSize: jest.fn((size) => size * 2),
    roundToNearestPixel: jest.fn((size) => size),
  },
  NativeModules: {},
  requireNativeComponent: jest.fn(),
  findNodeHandle: jest.fn(),
  UIManager: {
    measure: jest.fn(),
    measureInWindow: jest.fn(),
    measureLayout: jest.fn(),
  },
  Linking: {
    openURL: jest.fn(),
    canOpenURL: jest.fn().mockResolvedValue(true),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    getInitialURL: jest.fn().mockResolvedValue(null),
  },
  Alert: {
    alert: jest.fn(),
  },
  Appearance: {
    getColorScheme: jest.fn().mockReturnValue('light'),
    addChangeListener: jest.fn(),
  },
  AppState: {
    currentState: 'active',
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
  I18nManager: {
    isRTL: false,
    allowRTL: jest.fn(),
    forceRTL: jest.fn(),
  },
};
