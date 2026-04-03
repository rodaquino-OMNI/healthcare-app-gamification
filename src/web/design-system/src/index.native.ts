/**
 * Native barrel — resolved by Metro for iOS/Android bundles.
 *
 * Re-exports every public symbol from the design system.
 * Components that have `.native.tsx` variants are imported from
 * their native files; everything else (tokens, themes, types)
 * passes through from the web barrel since they are already
 * cross-platform plain JS objects.
 */

// ── Tokens (cross-platform — no native variant needed) ──────────
export { colors } from './tokens/colors';
export { spacing, spacingValues, spacingCompat, componentGap } from './tokens/spacing';
export { borderRadius, borderRadiusValues } from './tokens/borderRadius';
export { typography, fontSizeValues } from './tokens/typography';
export { shadows } from './tokens/shadows';
export { sizing, sizingValues } from './tokens/sizing';
export { tokens } from './tokens';

// ── Themes (cross-platform) ─────────────────────────────────────
export { baseTheme } from './themes/base.theme';
export { darkTheme } from './themes/dark.theme';

// ── Primitives (native variants) ────────────────────────────────
export { Box } from './primitives/Box/Box';
export type { BoxProps } from './primitives/Box/Box';
export { Text } from './primitives/Text/Text';
export type { TextProps } from './primitives/Text/Text';
export { Icon, FigmaIconContainer } from './primitives/Icon/Icon';
export type { IconProps, FigmaIconContainerProps } from './primitives/Icon/Icon';
export { Touchable } from './primitives/Touchable/Touchable';
export type { TouchableProps } from './primitives/Touchable/Touchable';
export { Stack } from './primitives/Stack';

// ── Components (native variants) ────────────────────────────────
export { Button } from './components/Button/Button';
export type { ButtonProps } from './components/Button/Button';
export { Card } from './components/Card/Card';
export type { CardProps } from './components/Card/Card';
export { Input } from './components/Input/Input';
export type { InputProps } from './components/Input/Input';
export { Badge } from './components/Badge/Badge';
export type { BadgeProps } from './components/Badge/Badge';
export { Modal } from './components/Modal/Modal';
export type { ModalProps } from './components/Modal/Modal';
export { Checkbox } from './components/Checkbox/Checkbox';
export type { CheckboxProps } from './components/Checkbox/Checkbox';
export { ProgressBar } from './components/ProgressBar/ProgressBar';
export type { ProgressBarProps } from './components/ProgressBar/ProgressBar';
export { Avatar } from './components/Avatar/Avatar';
export type { AvatarProps } from './components/Avatar/Avatar';
export { Select } from './components/Select/Select';
export type { SelectProps } from './components/Select/Select';
export { ProgressCircle } from './components/ProgressCircle';
export type { ProgressCircleProps } from './components/ProgressCircle';
export { Tabs } from './components/Tabs';
export type { TabsProps } from './components/Tabs';

// ── FormContainer / FormField aliases ───────────────────────────
export { Input as FormField } from './components/Input/Input';
export { Stack as FormContainer } from './primitives/Stack';

// ── Health (native variants) ────────────────────────────────────
export { MetricCard } from './health/MetricCard/MetricCard';
export type { MetricCardProps } from './health/MetricCard/MetricCard';
export { DeviceCard } from './health/DeviceCard/DeviceCard';

// ── Namespace re-exports (for `import { health } from '@austa/design-system'`) ─
export * as primitives from './primitives';
export * as components from './components';
export * as gamification from './gamification';
export * as health from './health';
export * as care from './care';
export * as plan from './plan';
