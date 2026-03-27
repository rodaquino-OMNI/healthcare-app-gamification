/**
 * Native barrel for @austa/design-system.
 *
 * React Native bundlers resolve index.native.ts before index.ts,
 * so this file provides RN-compatible exports for every symbol that
 * mobile code imports from '@austa/design-system'.
 *
 * - Primitives with .native.tsx implementations get real re-exports.
 * - Components without a native implementation get lightweight View/Text
 *   stubs so the app does not crash at runtime.
 * - Tokens and themes are cross-platform and re-exported as-is.
 */

import React from 'react';
import { View, type ViewProps } from 'react-native';

// ---------------------------------------------------------------------------
// 1. Native primitives (real implementations)
// ---------------------------------------------------------------------------

export { Box } from './primitives/Box/Box.native';
export type { BoxProps } from './primitives/Box/Box';

export { Text } from './primitives/Text/Text.native';
export type { TextProps } from './primitives/Text/Text';

export { Icon, FigmaIconContainer } from './primitives/Icon/Icon.native';
export type { IconProps } from './primitives/Icon/Icon.native';

export { Touchable } from './primitives/Touchable/Touchable.native';
export type { TouchableProps } from './primitives/Touchable/Touchable';

// ---------------------------------------------------------------------------
// 2. Tokens (cross-platform pass-through)
// ---------------------------------------------------------------------------

export * from './tokens/colors';
export * from './tokens/spacing';
export * from './tokens/typography';
export * from './tokens/borderRadius';
export * from './tokens/sizing';
export * from './tokens/shadows';

// ---------------------------------------------------------------------------
// 3. Themes (cross-platform pass-through)
// ---------------------------------------------------------------------------

export * from './themes';

// ---------------------------------------------------------------------------
// 4. Component stubs for symbols mobile actually imports
//    (Avatar, Button, Card, Checkbox, Input, Modal, ProgressBar,
//     ProgressCircle, Select, Stack, Tabs, FormContainer, FormField)
//
//    Each stub renders its children inside a View so it is non-destructive
//    at runtime. Props are typed as `any` to avoid pulling in web-only deps.
// ---------------------------------------------------------------------------

/** Minimal passthrough stub -- renders children in a View. */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const createStub = (displayName: string) => {
    const Stub = React.forwardRef<View, ViewProps & { children?: React.ReactNode }>(({ children, ...rest }, ref) =>
        React.createElement(View, { ...rest, ref } as ViewProps, children)
    );
    Stub.displayName = displayName;
    return Stub;
};

// ---------------------------------------------------------------------------
// 4a. Native component implementations (real .native.tsx)
// ---------------------------------------------------------------------------

export { Modal } from './components/Modal/Modal.native';
export type { ModalProps } from './components/Modal/Modal.native';

export { Checkbox } from './components/Checkbox/Checkbox.native';
export type { CheckboxProps } from './components/Checkbox/Checkbox.native';

export { ProgressBar } from './components/ProgressBar/ProgressBar.native';
export type { ProgressBarProps } from './components/ProgressBar/ProgressBar.native';

export { Avatar } from './components/Avatar/Avatar.native';
export type { AvatarProps } from './components/Avatar/Avatar.native';

export { Select } from './components/Select/Select.native';
export type { SelectProps } from './components/Select/Select.native';

// ---------------------------------------------------------------------------
// 4b. Native component implementations (high-use components)
// ---------------------------------------------------------------------------

export { Button } from './components/Button/Button.native';
export type { ButtonProps } from './components/Button/Button.native';

export { Card } from './components/Card/Card.native';
export type { CardProps } from './components/Card/Card.native';

export { Input } from './components/Input/Input.native';
export type { InputNativeProps as InputProps } from './components/Input/Input.native';

export { Badge } from './components/Badge/Badge.native';
export type { BadgeProps } from './components/Badge/Badge.native';

// ---------------------------------------------------------------------------
// 4d. Native implementations (low-use / domain components)
// ---------------------------------------------------------------------------

export { DatePicker } from './components/DatePicker/DatePicker.native';
export type { DatePickerProps } from './components/DatePicker/DatePicker';

export { LineChart } from './charts/LineChart/LineChart.native';
export type { LineChartProps } from './charts/LineChart/LineChart';

export { MetricCard } from './health/MetricCard/MetricCard.native';
export type { MetricCardProps } from './health/MetricCard/MetricCard';

export { DeviceCard } from './health/DeviceCard/DeviceCard.native';
export type { DeviceCardProps } from './health/DeviceCard/DeviceCard.native';

// ---------------------------------------------------------------------------
// 4c. Remaining stubs (no native implementation yet)
// ---------------------------------------------------------------------------

export const ProgressCircle = createStub('ProgressCircle');
export const Stack = createStub('Stack');
export const Tabs = createStub('Tabs');

// FormContainer and FormField aliases (mirrors web barrel)
export const FormContainer = Stack;
export const FormField = Input;

// ---------------------------------------------------------------------------
// 5. Namespace re-exports (match web barrel shape)
// ---------------------------------------------------------------------------

export * as primitives from './primitives';
export * as components from './components';
export * as gamification from './gamification';
export * as health from './health';
export * as care from './care';
export * as plan from './plan';
