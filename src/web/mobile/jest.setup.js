/**
 * Jest setup for AUSTA SuperApp mobile application
 * Configures mocks for React Native core modules, navigation, i18n,
 * and third-party libraries used across all three user journeys.
 */

// NOTE: @testing-library/jest-native/extend-expect removed because it requires
// the real react-native module which uses Flow syntax incompatible with esbuild.
// No test files in this project use jest-native matchers (toBeVisible, toHaveProp, etc.).

// Define React Native globals
global.__DEV__ = true;

// Mock react-native — the real module uses Flow type annotations that can't be parsed.
jest.mock('react-native', () => {
    const React = require('react');
    const mc = (name) => {
        const C = React.forwardRef(({ children, testID, ...props }, ref) =>
            React.createElement(name, { ...props, testID, ref }, children)
        );
        C.displayName = name;
        return C;
    };
    return {
        View: mc('View'),
        Text: mc('Text'),
        Image: mc('Image'),
        ScrollView: mc('ScrollView'),
        FlatList: mc('FlatList'),
        SectionList: mc('SectionList'),
        TextInput: mc('TextInput'),
        TouchableOpacity: mc('TouchableOpacity'),
        TouchableHighlight: mc('TouchableHighlight'),
        TouchableWithoutFeedback: mc('TouchableWithoutFeedback'),
        Pressable: mc('Pressable'),
        Button: mc('Button'),
        Switch: mc('Switch'),
        ActivityIndicator: mc('ActivityIndicator'),
        Modal: mc('Modal'),
        StatusBar: mc('StatusBar'),
        SafeAreaView: mc('SafeAreaView'),
        KeyboardAvoidingView: mc('KeyboardAvoidingView'),
        ImageBackground: mc('ImageBackground'),
        RefreshControl: mc('RefreshControl'),
        VirtualizedList: mc('VirtualizedList'),
        StyleSheet: {
            create: (styles) => styles,
            compose: (a, b) => [a, b],
            flatten: (s) => (Array.isArray(s) ? Object.assign({}, ...s.filter(Boolean)) : s || {}),
            absoluteFill: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
            absoluteFillObject: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
            hairlineWidth: 1,
        },
        Platform: {
            OS: 'ios',
            Version: '17.0',
            isPad: false,
            isTV: false,
            isTesting: true,
            select: jest.fn((obj) => obj.ios ?? obj.default),
            constants: { reactNativeVersion: { major: 0, minor: 73, patch: 0 } },
        },
        Dimensions: {
            get: jest.fn((dim) => ({ width: 375, height: 812, scale: 2, fontScale: 1 })),
            set: jest.fn(),
            addEventListener: jest.fn(() => ({ remove: jest.fn() })),
        },
        Animated: {
            Value: jest.fn(function (v) {
                this._value = v;
                this.setValue = jest.fn();
                this.interpolate = jest.fn(() => 0);
                this.addListener = jest.fn();
                this.removeListener = jest.fn();
                this.stopAnimation = jest.fn();
            }),
            ValueXY: jest.fn(function () {
                this.x = { _value: 0 };
                this.y = { _value: 0 };
            }),
            createAnimatedComponent: (c) => c,
            timing: jest.fn(() => ({ start: jest.fn((cb) => cb && cb({ finished: true })), stop: jest.fn() })),
            spring: jest.fn(() => ({ start: jest.fn((cb) => cb && cb({ finished: true })), stop: jest.fn() })),
            decay: jest.fn(() => ({ start: jest.fn((cb) => cb && cb({ finished: true })), stop: jest.fn() })),
            parallel: jest.fn(() => ({ start: jest.fn((cb) => cb && cb({ finished: true })), stop: jest.fn() })),
            sequence: jest.fn(() => ({ start: jest.fn((cb) => cb && cb({ finished: true })), stop: jest.fn() })),
            event: jest.fn(() => jest.fn()),
            View: mc('Animated.View'),
            Text: mc('Animated.Text'),
            Image: mc('Animated.Image'),
            ScrollView: mc('Animated.ScrollView'),
        },
        Alert: { alert: jest.fn(), prompt: jest.fn() },
        Linking: {
            openURL: jest.fn(() => Promise.resolve()),
            canOpenURL: jest.fn(() => Promise.resolve(true)),
            getInitialURL: jest.fn(() => Promise.resolve(null)),
            addEventListener: jest.fn(() => ({ remove: jest.fn() })),
            openSettings: jest.fn(() => Promise.resolve()),
        },
        Share: {
            share: jest.fn(() => Promise.resolve({ action: 'sharedAction' })),
            sharedAction: 'sharedAction',
            dismissedAction: 'dismissedAction',
        },
        AppState: { currentState: 'active', addEventListener: jest.fn(() => ({ remove: jest.fn() })) },
        Keyboard: { addListener: jest.fn(() => ({ remove: jest.fn() })), dismiss: jest.fn() },
        LayoutAnimation: {
            configureNext: jest.fn(),
            create: jest.fn(),
            Presets: { easeInEaseOut: {}, linear: {}, spring: {} },
        },
        Easing: {
            linear: jest.fn(),
            ease: jest.fn(),
            bezier: jest.fn(),
            in: jest.fn(),
            out: jest.fn(),
            inOut: jest.fn(),
        },
        InteractionManager: {
            runAfterInteractions: jest.fn((cb) => {
                if (typeof cb === 'function') cb();
                return { then: jest.fn(), done: jest.fn(), cancel: jest.fn() };
            }),
        },
        PanResponder: { create: jest.fn(() => ({ panHandlers: {} })) },
        PixelRatio: {
            get: jest.fn(() => 2),
            getFontScale: jest.fn(() => 1),
            getPixelSizeForLayoutSize: jest.fn((s) => s * 2),
            roundToNearestPixel: jest.fn((s) => Math.round(s * 2) / 2),
        },
        Appearance: {
            getColorScheme: jest.fn(() => 'light'),
            addChangeListener: jest.fn(() => ({ remove: jest.fn() })),
        },
        AccessibilityInfo: {
            isScreenReaderEnabled: jest.fn(() => Promise.resolve(false)),
            addEventListener: jest.fn(() => ({ remove: jest.fn() })),
            announceForAccessibility: jest.fn(),
        },
        NativeModules: {},
        NativeEventEmitter: jest
            .fn()
            .mockImplementation(() => ({
                addListener: jest.fn(() => ({ remove: jest.fn() })),
                removeAllListeners: jest.fn(),
            })),
        DeviceEventEmitter: { addListener: jest.fn(() => ({ remove: jest.fn() })), emit: jest.fn() },
        AppRegistry: { registerComponent: jest.fn() },
        I18nManager: { isRTL: false, allowRTL: jest.fn(), forceRTL: jest.fn() },
        Vibration: { vibrate: jest.fn(), cancel: jest.fn() },
        LogBox: { ignoreLogs: jest.fn(), ignoreAllLogs: jest.fn() },
        BackHandler: { exitApp: jest.fn(), addEventListener: jest.fn(() => ({ remove: jest.fn() })) },
        PermissionsAndroid: {
            PERMISSIONS: {},
            RESULTS: { GRANTED: 'granted', DENIED: 'denied' },
            check: jest.fn(() => Promise.resolve(true)),
            request: jest.fn(() => Promise.resolve('granted')),
        },
        UIManager: { getViewManagerConfig: jest.fn(() => ({})), setLayoutAnimationEnabledExperimental: jest.fn() },
        useColorScheme: jest.fn(() => 'light'),
        useWindowDimensions: jest.fn(() => ({ width: 375, height: 812, scale: 2, fontScale: 1 })),
        processColor: jest.fn((c) => c),
        requireNativeComponent: jest.fn((n) => mc(n)),
        findNodeHandle: jest.fn(() => 1),
        unstable_batchedUpdates: jest.fn((fn) => fn()),
    };
});

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
        multiGet: jest.fn((keys) => Promise.resolve(keys.map((key) => [key, store[key] || null]))),
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
        NavigationContainer: ({ children }) => React.createElement(React.Fragment, null, children),
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
            Navigator: ({ children }) => React.createElement(React.Fragment, null, children),
            Screen: () => null,
            Group: ({ children }) => React.createElement(React.Fragment, null, children),
        }),
    };
});

//@react-navigation/bottom-tabs

jest.mock('@react-navigation/bottom-tabs', () => {
    const React = require('react');
    return {
        createBottomTabNavigator: () => ({
            Navigator: ({ children }) => React.createElement(React.Fragment, null, children),
            Screen: () => null,
        }),
    };
});

//@react-navigation/stack

jest.mock('@react-navigation/stack', () => {
    const React = require('react');
    return {
        createStackNavigator: () => ({
            Navigator: ({ children }) => React.createElement(React.Fragment, null, children),
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
        SafeAreaProvider: ({ children }) => React.createElement(View, { testID: 'safe-area-provider' }, children),
        SafeAreaView: ({ children, style, ...props }) => React.createElement(View, { style, ...props }, children),
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
            Consumer: ({ children }) => children({ top: 0, bottom: 0, left: 0, right: 0 }),
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
        GestureHandlerRootView: ({ children, ...props }) => React.createElement(View, props, children),
        Swipeable: ({ children, ...props }) => React.createElement(View, props, children),
        DrawerLayout: ({ children, ...props }) => React.createElement(View, props, children),
        PanGestureHandler: ({ children }) => React.createElement(View, null, children),
        TapGestureHandler: ({ children }) => React.createElement(View, null, children),
        FlingGestureHandler: ({ children }) => React.createElement(View, null, children),
        LongPressGestureHandler: ({ children }) => React.createElement(View, null, children),
        ScrollView: ({ children, ...props }) => React.createElement(View, props, children),
        FlatList: ({ children, ...props }) => React.createElement(View, props, children),
        TouchableOpacity: ({ children, ...props }) => React.createElement(TouchableOpacity, props, children),
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
        useAnimatedStyle: jest.fn((fn) => {
            try {
                return fn();
            } catch {
                return {};
            }
        }),
        useAnimatedScrollHandler: jest.fn(() => jest.fn()),
        useDerivedValue: jest.fn((fn) => ({ value: fn() })),
        useAnimatedRef: jest.fn(() => ({ current: null })),
        withTiming: jest.fn((v) => v),
        withSpring: jest.fn((v) => v),
        withDelay: jest.fn((_, a) => a),
        withSequence: jest.fn((...a) => a[a.length - 1]),
        withRepeat: jest.fn((a) => a),
        cancelAnimation: jest.fn(),
        Easing: {
            linear: jest.fn(),
            ease: jest.fn(),
            bezier: jest.fn(() => jest.fn()),
            in: jest.fn(),
            out: jest.fn(),
            inOut: jest.fn(),
        },
        FadeIn: { duration: animFn },
        FadeOut: { duration: animFn },
        SlideInRight: { duration: jest.fn() },
        SlideOutLeft: { duration: jest.fn() },
        Layout: { duration: jest.fn() },
        ZoomIn: { duration: jest.fn() },
        ZoomOut: { duration: jest.fn() },
        createAnimatedComponent: (c) => c,
        View,
        Text,
        Image,
        ScrollView,
        Animated: { View, Text, Image, ScrollView },
        runOnJS: jest.fn((fn) => fn),
        runOnUI: jest.fn((fn) => fn),
        interpolate: jest.fn((v) => v),
        Extrapolation: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
    };
});

// NOTE: react-native/Libraries/* subpath mocks removed — covered by jest.mock('react-native') above.

// react-native-screens
jest.mock('react-native-screens', () => {
    const React = require('react');
    const { View } = require('react-native');
    const wrap = ({ children, ...props }) => React.createElement(View, props, children);
    return {
        enableScreens: jest.fn(),
        Screen: wrap,
        ScreenContainer: wrap,
        NativeScreen: wrap,
        NativeScreenContainer: wrap,
        ScreenStack: wrap,
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
        })
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

//react-native-biometrics

jest.mock('react-native-biometrics', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
        isSensorAvailable: jest.fn(() => Promise.resolve({ available: true, biometryType: 'FaceID' })),
        simplePrompt: jest.fn(() => Promise.resolve({ success: true })),
        createKeys: jest.fn(() => Promise.resolve({ publicKey: 'mock-public-key' })),
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
        if (typeof args[0] === 'string' && args[0].includes('Warning: An update to')) {
            return;
        }
        originalError.call(console, ...args);
    };
});

afterAll(() => {
    console.warn = originalWarn;
    console.error = originalError;
});
