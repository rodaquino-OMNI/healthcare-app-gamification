/**
 * This barrel file exports all primitives, components, gamification components,
 * health components, care components and plan components from the design system.
 */

// IE3: Import all primitives
// IE3: Import all components
import * as care from './care';
import * as components from './components';
// IE3: Import all gamification components
import * as gamification from './gamification';
// IE3: Import all health components
import * as health from './health';
// IE3: Import all care components
// IE3: Import all plan components
import * as plan from './plan';
import * as primitives from './primitives';

// O2: Export all primitives
export { primitives };
// O2: Export all components
export { components };
// O2: Export all gamification components
export { gamification };
// O2: Export all health components
export { health };
// O2: Export all care components
export { care };
// O2: Export all plan components
export { plan };

// Individual primitive re-exports for direct named imports
export { Text } from './primitives/Text';
export type { TextProps } from './primitives/Text';
export { Stack } from './primitives/Stack';
export { Icon } from './primitives/Icon';
export type { IconProps } from './primitives/Icon';

// Individual component re-exports for direct named imports
export { Button } from './components/Button';
export type { ButtonProps } from './components/Button';
export { Card } from './components/Card';
export type { CardProps } from './components/Card';
export { Input } from './components/Input';
export type { InputProps } from './components/Input';
export { Modal } from './components/Modal';
export type { ModalProps } from './components/Modal';
export { Select } from './components/Select';
export type { SelectProps } from './components/Select';
export { ProgressBar } from './components/ProgressBar';
export type { ProgressBarProps } from './components/ProgressBar';
export { ProgressCircle } from './components/ProgressCircle';
export type { ProgressCircleProps } from './components/ProgressCircle';
export { Checkbox } from './components/Checkbox';
export type { CheckboxProps } from './components/Checkbox';
export { Tabs } from './components/Tabs';
export type { TabsProps } from './components/Tabs';
export { Avatar } from './components/Avatar';
export type { AvatarProps } from './components/Avatar';

// FormContainer and FormField placeholder exports for form components
export { Input as FormField } from './components/Input';
export { Stack as FormContainer } from './primitives/Stack';
