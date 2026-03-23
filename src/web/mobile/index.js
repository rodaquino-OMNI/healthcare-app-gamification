/**
 * Entry point for the AUSTA SuperApp mobile application.
 * This file registers the main App component with React Native's AppRegistry and initializes essential services like internationalization before rendering the app.
 */

import { AppRegistry, LogBox } from 'react-native'; // v0.71+
import App from './App'; // src/web/mobile/App.tsx
import { name as appName } from './app.json'; // 1.0.0
import './src/i18n'; // Initialize i18n (side-effect import)

// LD1: Ignore specific LogBox warnings for development
LogBox.ignoreLogs(['Require cycle:', 'Remote debugger', 'RCTBridge', 'new NativeEventEmitter', '[mobx]']);

// LD1: Register the App component with AppRegistry using the app name from app.json
AppRegistry.registerComponent('main', () => App); // DEMO_MODE — 'main' required by Expo Go
