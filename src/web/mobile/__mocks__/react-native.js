/* istanbul ignore file */
/**
 * Comprehensive react-native mock for Jest.
 *
 * The real react-native/index.js uses Flow type annotations that cannot be
 * parsed by esbuild or Node.js. Instead of stripping Flow from every internal
 * file, we provide a mock that exports the most commonly used RN primitives.
 *
 * Components are thin wrappers around 'react' elements so that
 * @testing-library/react-native render() works correctly.
 */
'use strict';

const React = require('react');

// Helper: create a simple functional component mock
const mockComponent = (name) => {
    const Component = React.forwardRef(({ children, testID, ...props }, ref) =>
        React.createElement(name, { ...props, testID, ref }, children)
    );
    Component.displayName = name;
    return Component;
};

// Core Components
const View = mockComponent('View');
const Text = mockComponent('Text');
const Image = mockComponent('Image');
const ScrollView = mockComponent('ScrollView');
const FlatList = mockComponent('FlatList');
const SectionList = mockComponent('SectionList');
const TextInput = mockComponent('TextInput');
const TouchableOpacity = mockComponent('TouchableOpacity');
const TouchableHighlight = mockComponent('TouchableHighlight');
const TouchableWithoutFeedback = mockComponent('TouchableWithoutFeedback');
const TouchableNativeFeedback = mockComponent('TouchableNativeFeedback');
const Pressable = mockComponent('Pressable');
const Button = mockComponent('Button');
const Switch = mockComponent('Switch');
const ActivityIndicator = mockComponent('ActivityIndicator');
const Modal = mockComponent('Modal');
const StatusBar = mockComponent('StatusBar');
const SafeAreaView = mockComponent('SafeAreaView');
const KeyboardAvoidingView = mockComponent('KeyboardAvoidingView');
const ImageBackground = mockComponent('ImageBackground');
const RefreshControl = mockComponent('RefreshControl');
const VirtualizedList = mockComponent('VirtualizedList');
const DrawerLayoutAndroid = mockComponent('DrawerLayoutAndroid');
const InputAccessoryView = mockComponent('InputAccessoryView');
const ProgressBarAndroid = mockComponent('ProgressBarAndroid');

// StyleSheet
const StyleSheet = {
    create: (styles) => styles,
    compose: (a, b) => [a, b],
    flatten: (styles) => {
        if (Array.isArray(styles)) {
            return Object.assign({}, ...styles.filter(Boolean));
        }
        return styles || {};
    },
    absoluteFill: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
    absoluteFillObject: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
    hairlineWidth: 1,
};

// Animated
const AnimatedValue = jest.fn(function (value) {
    this._value = value;
    this.setValue = jest.fn((v) => {
        this._value = v;
    });
    this.interpolate = jest.fn(() => new AnimatedValue(0));
    this.addListener = jest.fn(() => '');
    this.removeListener = jest.fn();
    this.removeAllListeners = jest.fn();
    this.stopAnimation = jest.fn((cb) => cb && cb(this._value));
    this.resetAnimation = jest.fn((cb) => cb && cb(this._value));
});

const AnimatedValueXY = jest.fn(function (value) {
    this.x = new AnimatedValue(value?.x ?? 0);
    this.y = new AnimatedValue(value?.y ?? 0);
    this.setValue = jest.fn();
    this.setOffset = jest.fn();
    this.flattenOffset = jest.fn();
    this.stopAnimation = jest.fn();
    this.addListener = jest.fn();
    this.removeListener = jest.fn();
    this.getLayout = jest.fn(() => ({ left: this.x, top: this.y }));
    this.getTranslateTransform = jest.fn(() => [{ translateX: this.x }, { translateY: this.y }]);
});

const Animated = {
    Value: AnimatedValue,
    ValueXY: AnimatedValueXY,
    createAnimatedComponent: (component) => component,
    timing: jest.fn(() => ({
        start: jest.fn((cb) => cb && cb({ finished: true })),
        stop: jest.fn(),
        reset: jest.fn(),
    })),
    spring: jest.fn(() => ({
        start: jest.fn((cb) => cb && cb({ finished: true })),
        stop: jest.fn(),
        reset: jest.fn(),
    })),
    decay: jest.fn(() => ({ start: jest.fn((cb) => cb && cb({ finished: true })), stop: jest.fn(), reset: jest.fn() })),
    parallel: jest.fn(() => ({ start: jest.fn((cb) => cb && cb({ finished: true })), stop: jest.fn() })),
    sequence: jest.fn(() => ({ start: jest.fn((cb) => cb && cb({ finished: true })), stop: jest.fn() })),
    stagger: jest.fn(() => ({ start: jest.fn((cb) => cb && cb({ finished: true })), stop: jest.fn() })),
    loop: jest.fn(() => ({ start: jest.fn(), stop: jest.fn() })),
    event: jest.fn(() => jest.fn()),
    add: jest.fn(),
    subtract: jest.fn(),
    multiply: jest.fn(),
    divide: jest.fn(),
    modulo: jest.fn(),
    diffClamp: jest.fn(),
    delay: jest.fn(() => ({ start: jest.fn((cb) => cb && cb({ finished: true })), stop: jest.fn() })),
    View,
    Text,
    Image,
    ScrollView,
    FlatList,
};

// Platform
const Platform = {
    OS: 'ios',
    Version: '17.0',
    isPad: false,
    isTV: false,
    isTesting: true,
    select: jest.fn((obj) => obj.ios ?? obj.default),
    constants: { reactNativeVersion: { major: 0, minor: 73, patch: 0 } },
};

// Dimensions
const Dimensions = {
    get: jest.fn((dim) => {
        if (dim === 'window') return { width: 375, height: 812, scale: 2, fontScale: 1 };
        if (dim === 'screen') return { width: 375, height: 812, scale: 2, fontScale: 1 };
        return { width: 0, height: 0, scale: 1, fontScale: 1 };
    }),
    set: jest.fn(),
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    removeEventListener: jest.fn(),
};

// Alert
const Alert = {
    alert: jest.fn(),
    prompt: jest.fn(),
};

// Linking
const Linking = {
    openURL: jest.fn(() => Promise.resolve()),
    canOpenURL: jest.fn(() => Promise.resolve(true)),
    getInitialURL: jest.fn(() => Promise.resolve(null)),
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    removeEventListener: jest.fn(),
    openSettings: jest.fn(() => Promise.resolve()),
    sendIntent: jest.fn(() => Promise.resolve()),
};

// Share
const Share = {
    share: jest.fn(() => Promise.resolve({ action: 'sharedAction' })),
    sharedAction: 'sharedAction',
    dismissedAction: 'dismissedAction',
};

// AppState
const AppState = {
    currentState: 'active',
    isAvailable: true,
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    removeEventListener: jest.fn(),
};

// Keyboard
const Keyboard = {
    addListener: jest.fn(() => ({ remove: jest.fn() })),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
    dismiss: jest.fn(),
    isVisible: jest.fn(() => false),
    metrics: jest.fn(() => undefined),
    scheduleLayoutAnimation: jest.fn(),
};

// LayoutAnimation
const LayoutAnimation = {
    configureNext: jest.fn(),
    create: jest.fn(),
    Presets: {
        easeInEaseOut: {},
        linear: {},
        spring: {},
    },
    Types: {
        spring: 'spring',
        linear: 'linear',
        easeInEaseOut: 'easeInEaseOut',
        easeIn: 'easeIn',
        easeOut: 'easeOut',
    },
    Properties: {
        opacity: 'opacity',
        scaleXY: 'scaleXY',
    },
};

// Easing
const Easing = {
    step0: jest.fn(),
    step1: jest.fn(),
    linear: jest.fn(),
    ease: jest.fn(),
    quad: jest.fn(),
    cubic: jest.fn(),
    poly: jest.fn(),
    sin: jest.fn(),
    circle: jest.fn(),
    exp: jest.fn(),
    elastic: jest.fn(),
    back: jest.fn(),
    bounce: jest.fn(),
    bezier: jest.fn(),
    in: jest.fn(),
    out: jest.fn(),
    inOut: jest.fn(),
};

// InteractionManager
const InteractionManager = {
    runAfterInteractions: jest.fn((cb) => {
        if (typeof cb === 'function') cb();
        return { then: jest.fn(), done: jest.fn(), cancel: jest.fn() };
    }),
    createInteractionHandle: jest.fn(),
    clearInteractionHandle: jest.fn(),
    setDeadline: jest.fn(),
};

// PanResponder
const PanResponder = {
    create: jest.fn(() => ({ panHandlers: {} })),
};

// PixelRatio
const PixelRatio = {
    get: jest.fn(() => 2),
    getFontScale: jest.fn(() => 1),
    getPixelSizeForLayoutSize: jest.fn((size) => size * 2),
    roundToNearestPixel: jest.fn((size) => Math.round(size * 2) / 2),
};

// Appearance
const Appearance = {
    getColorScheme: jest.fn(() => 'light'),
    addChangeListener: jest.fn(() => ({ remove: jest.fn() })),
    removeChangeListener: jest.fn(),
    setColorScheme: jest.fn(),
};

// AccessibilityInfo
const AccessibilityInfo = {
    isBoldTextEnabled: jest.fn(() => Promise.resolve(false)),
    isGrayscaleEnabled: jest.fn(() => Promise.resolve(false)),
    isInvertColorsEnabled: jest.fn(() => Promise.resolve(false)),
    isReduceMotionEnabled: jest.fn(() => Promise.resolve(false)),
    isReduceTransparencyEnabled: jest.fn(() => Promise.resolve(false)),
    isScreenReaderEnabled: jest.fn(() => Promise.resolve(false)),
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    announceForAccessibility: jest.fn(),
    announceForAccessibilityWithOptions: jest.fn(),
    setAccessibilityFocus: jest.fn(),
    getRecommendedTimeoutMillis: jest.fn(() => Promise.resolve(0)),
};

// NativeModules
const NativeModules = {};

// NativeEventEmitter
const NativeEventEmitter = jest.fn().mockImplementation(() => ({
    addListener: jest.fn(() => ({ remove: jest.fn() })),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
    listenerCount: jest.fn(() => 0),
    emit: jest.fn(),
}));

// DeviceEventEmitter
const DeviceEventEmitter = {
    addListener: jest.fn(() => ({ remove: jest.fn() })),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
    emit: jest.fn(),
};

// AppRegistry
const AppRegistry = {
    registerComponent: jest.fn(),
    registerRunnable: jest.fn(),
    registerConfig: jest.fn(),
    getAppKeys: jest.fn(() => []),
    runApplication: jest.fn(),
    unmountApplicationComponentAtRootTag: jest.fn(),
};

// I18nManager
const I18nManager = {
    isRTL: false,
    allowRTL: jest.fn(),
    forceRTL: jest.fn(),
    swapLeftAndRightInRTL: jest.fn(),
};

// Vibration
const Vibration = {
    vibrate: jest.fn(),
    cancel: jest.fn(),
};

// LogBox
const LogBox = {
    ignoreLogs: jest.fn(),
    ignoreAllLogs: jest.fn(),
    install: jest.fn(),
    uninstall: jest.fn(),
};

// BackHandler
const BackHandler = {
    exitApp: jest.fn(),
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    removeEventListener: jest.fn(),
};

// PermissionsAndroid
const PermissionsAndroid = {
    PERMISSIONS: {},
    RESULTS: { GRANTED: 'granted', DENIED: 'denied', NEVER_ASK_AGAIN: 'never_ask_again' },
    check: jest.fn(() => Promise.resolve(true)),
    request: jest.fn(() => Promise.resolve('granted')),
    requestMultiple: jest.fn(() => Promise.resolve({})),
};

// Hooks
const useColorScheme = jest.fn(() => 'light');
const useWindowDimensions = jest.fn(() => ({ width: 375, height: 812, scale: 2, fontScale: 1 }));

// Utilities
const processColor = jest.fn((color) => color);
const requireNativeComponent = jest.fn((name) => mockComponent(name));
const findNodeHandle = jest.fn(() => 1);
const UIManager = {
    getViewManagerConfig: jest.fn(() => ({})),
    hasViewManagerConfig: jest.fn(() => false),
    measure: jest.fn(),
    measureInWindow: jest.fn(),
    measureLayout: jest.fn(),
    dispatchViewManagerCommand: jest.fn(),
    setChildren: jest.fn(),
    manageChildren: jest.fn(),
    updateView: jest.fn(),
    removeSubviewsFromContainerWithID: jest.fn(),
    replaceExistingNonRootView: jest.fn(),
    setLayoutAnimationEnabledExperimental: jest.fn(),
    configureNextLayoutAnimation: jest.fn(),
};

const Touchable = mockComponent('Touchable');
const Settings = { get: jest.fn(), set: jest.fn(), watchKeys: jest.fn() };
const Clipboard = { getString: jest.fn(() => Promise.resolve('')), setString: jest.fn() };
const ToastAndroid = {
    show: jest.fn(),
    showWithGravity: jest.fn(),
    showWithGravityAndOffset: jest.fn(),
    SHORT: 0,
    LONG: 1,
    TOP: 0,
    BOTTOM: 1,
    CENTER: 2,
};
const ActionSheetIOS = { showActionSheetWithOptions: jest.fn(), showShareActionSheetWithOptions: jest.fn() };
const PushNotificationIOS = {
    addEventListener: jest.fn(),
    requestPermissions: jest.fn(() => Promise.resolve()),
    getInitialNotification: jest.fn(() => Promise.resolve(null)),
};
const Systrace = {
    beginEvent: jest.fn(),
    endEvent: jest.fn(),
    beginAsyncEvent: jest.fn(),
    endAsyncEvent: jest.fn(),
    counterEvent: jest.fn(),
};
const TurboModuleRegistry = { getEnforcing: jest.fn(), get: jest.fn() };
const DevSettings = { addMenuItem: jest.fn(), reload: jest.fn() };
const DeviceInfo = {};
const Networking = {};
const YellowBox = { ignoreWarnings: jest.fn() };
const DynamicColorIOS = jest.fn((config) => config.light);
const PlatformColor = jest.fn((...args) => args[0]);
const RootTagContext = React.createContext(null);
const ColorPropType = {};
const EdgeInsetsPropType = {};
const PointPropType = {};
const ViewPropTypes = {};
const useAnimatedValue = jest.fn((value) => new AnimatedValue(value));

module.exports = {
    // Components
    View,
    Text,
    Image,
    ScrollView,
    FlatList,
    SectionList,
    TextInput,
    TouchableOpacity,
    TouchableHighlight,
    TouchableWithoutFeedback,
    TouchableNativeFeedback,
    Pressable,
    Button,
    Switch,
    ActivityIndicator,
    Modal,
    StatusBar,
    SafeAreaView,
    KeyboardAvoidingView,
    ImageBackground,
    RefreshControl,
    VirtualizedList,
    DrawerLayoutAndroid,
    InputAccessoryView,
    ProgressBarAndroid,
    Touchable,

    // APIs
    StyleSheet,
    Animated,
    Platform,
    Dimensions,
    Alert,
    Linking,
    Share,
    AppState,
    Keyboard,
    LayoutAnimation,
    Easing,
    InteractionManager,
    PanResponder,
    PixelRatio,
    Appearance,
    AccessibilityInfo,
    NativeModules,
    NativeEventEmitter,
    DeviceEventEmitter,
    AppRegistry,
    I18nManager,
    Vibration,
    LogBox,
    BackHandler,
    PermissionsAndroid,
    UIManager,
    Settings,
    Clipboard,
    ToastAndroid,
    ActionSheetIOS,
    PushNotificationIOS,
    Systrace,
    TurboModuleRegistry,
    DevSettings,
    DeviceInfo,
    Networking,
    YellowBox,
    DynamicColorIOS,
    PlatformColor,
    RootTagContext,
    ColorPropType,
    EdgeInsetsPropType,
    PointPropType,
    ViewPropTypes,

    // Hooks
    useColorScheme,
    useWindowDimensions,
    useAnimatedValue,

    // Utilities
    processColor,
    requireNativeComponent,
    findNodeHandle,
    unstable_batchedUpdates: jest.fn((fn) => fn()),
    unstable_enableLogBox: jest.fn(),
};
