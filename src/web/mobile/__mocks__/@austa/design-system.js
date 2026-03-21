/**
 * Mock for @austa/design-system.
 * The real dist files import react-native components (StyleSheet, View, etc.)
 * which causes cascading Flow/ESM issues in Jest. This mock provides
 * lightweight stubs for all exported components and utilities.
 */
'use strict';

const React = require('react');

// Helper to create a mock component
const mc = (name) => {
    const C = React.forwardRef(({ children, testID, ...props }, ref) =>
        React.createElement(name, { ...props, testID, ref }, children)
    );
    C.displayName = name;
    return C;
};

// Primitives
const Text = mc('Text');
const Box = mc('Box');

// Components
const Button = mc('Button');
const Card = mc('Card');
const Icon = mc('Icon');
const Input = mc('Input');
const Select = mc('Select');
const Checkbox = mc('Checkbox');
const Radio = mc('Radio');
const Switch = mc('Switch');
const Badge = mc('Badge');
const Avatar = mc('Avatar');
const Modal = mc('Modal');
const Toast = mc('Toast');
const Spinner = mc('Spinner');
const ProgressBar = mc('ProgressBar');
const Divider = mc('Divider');
const Chip = mc('Chip');
const Tag = mc('Tag');
const Alert = mc('Alert');
const Tooltip = mc('Tooltip');
const Accordion = mc('Accordion');
const Tabs = mc('Tabs');
const TabBar = mc('TabBar');
const BottomSheet = mc('BottomSheet');
const DatePicker = mc('DatePicker');
const TimePicker = mc('TimePicker');
const Slider = mc('Slider');
const SearchBar = mc('SearchBar');
const EmptyState = mc('EmptyState');
const ListItem = mc('ListItem');
const Header = mc('Header');
const Footer = mc('Footer');
const Skeleton = mc('Skeleton');
const SkeletonLoader = mc('SkeletonLoader');
const LoadingIndicator = mc('LoadingIndicator');
const ErrorBoundary = mc('ErrorBoundary');
const StatusIndicator = mc('StatusIndicator');

// Tokens
const colors = {
    primary: { 50: '#f0f9ff', 100: '#e0f2fe', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1' },
    secondary: { 50: '#faf5ff', 100: '#f3e8ff', 500: '#a855f7', 600: '#9333ea' },
    neutral: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
    },
    success: { 500: '#22c55e' },
    warning: { 500: '#f59e0b' },
    error: { 500: '#ef4444' },
    info: { 500: '#3b82f6' },
    white: '#ffffff',
    black: '#000000',
};

const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
const borderRadius = { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 };
const typography = {
    fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, xxl: 24, xxxl: 32 },
    fontWeight: { regular: '400', medium: '500', semibold: '600', bold: '700' },
    lineHeight: { tight: 1.2, normal: 1.5, relaxed: 1.75 },
};

// Theme
const useTheme = jest.fn(() => ({
    colors: {
        primary: colors.primary[500],
        secondary: colors.secondary[500],
        background: { default: '#ffffff', paper: '#f8fafc' },
        text: { primary: '#0f172a', secondary: '#475569', disabled: '#94a3b8' },
        border: { default: '#e2e8f0' },
        error: { main: '#ef4444' },
        success: { main: '#22c55e' },
        warning: { main: '#f59e0b' },
    },
    spacing,
    borderRadius,
    typography,
}));

const ThemeProvider = ({ children }) => React.createElement(React.Fragment, null, children);

module.exports = {
    // Primitives
    Text,
    Box,
    // Components
    Button,
    Card,
    Icon,
    Input,
    Select,
    Checkbox,
    Radio,
    Switch,
    Badge,
    Avatar,
    Modal,
    Toast,
    Spinner,
    ProgressBar,
    Divider,
    Chip,
    Tag,
    Alert,
    Tooltip,
    Accordion,
    Tabs,
    TabBar,
    BottomSheet,
    DatePicker,
    TimePicker,
    Slider,
    SearchBar,
    EmptyState,
    ListItem,
    Header,
    Footer,
    Skeleton,
    SkeletonLoader,
    LoadingIndicator,
    ErrorBoundary,
    StatusIndicator,
    // Tokens
    colors,
    spacing,
    borderRadius,
    typography,
    // Theme
    useTheme,
    ThemeProvider,
};
