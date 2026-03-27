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
import { View, TextInput, Pressable, type ViewProps } from 'react-native';

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

/** Stub that renders pressable children. */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any
const createPressableStub = (displayName: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Stub = React.forwardRef<View, any>(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ({ children, onPress, disabled, testID, style, ...rest }, ref) =>
            React.createElement(
                Pressable,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                { onPress, disabled, testID, style, ref, ...rest },
                children
            )
    );
    Stub.displayName = displayName;
    return Stub;
};

/** Stub that renders a TextInput. */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any
const createInputStub = (displayName: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Stub = React.forwardRef<TextInput, any>(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ({ value, onChangeText, placeholder, testID, style, ...rest }, ref) =>
            React.createElement(TextInput, {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                value,
                onChangeText,
                placeholder,
                testID,
                style,
                ref,
                ...rest,
            })
    );
    Stub.displayName = displayName;
    return Stub;
};

// Interactive components
export const Button = createPressableStub('Button');
export const Avatar = createStub('Avatar');
export const Card = createStub('Card');
export const Checkbox = createPressableStub('Checkbox');
export const Input = createInputStub('Input');
export const Modal = createStub('Modal');
export const ProgressBar = createStub('ProgressBar');
export const ProgressCircle = createStub('ProgressCircle');
export const Select = createStub('Select');
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
