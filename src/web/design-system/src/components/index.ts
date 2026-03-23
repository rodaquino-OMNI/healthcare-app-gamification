/**
 * Components barrel file
 *
 * Re-exports all design system components as flat named exports
 * for convenient importing throughout the application.
 *
 * @example
 * import { Button, Card, Input, Modal } from 'design-system/components';
 */

// Alert
export { Alert } from './Alert';
export type { AlertProps } from './Alert';

// Accordion
export { default as Accordion } from './Accordion';
export type { AccordionProps } from './Accordion';

// Avatar
export { Avatar } from './Avatar';
export type { AvatarProps } from './Avatar';

// Badge
export { default as Badge } from './Badge';
export type { BadgeProps } from './Badge';

// Button
export { Button } from './Button';
export type { ButtonProps } from './Button';

// Card
export { Card } from './Card';
export type { CardProps } from './Card';

// Checkbox
export { Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';

// DatePicker
export { default as DatePicker } from './DatePicker';
export type { DatePickerProps } from './DatePicker';

// Input
export { Input } from './Input';
export type { InputProps } from './Input';
export { PasscodeInput } from './Input';
export type { PasscodeInputProps } from './Input';

// Modal
export { Modal } from './Modal';
export type { ModalProps } from './Modal';

// ProgressBar
export { ProgressBar } from './ProgressBar';
export type { ProgressBarProps } from './ProgressBar';

// ProgressCircle
export { ProgressCircle } from './ProgressCircle';
export type { ProgressCircleProps } from './ProgressCircle';

// RadioButton
export { RadioButton } from './RadioButton';
export type { RadioButtonProps } from './RadioButton';

// Select
export { Select } from './Select';
export type { SelectProps } from './Select';

// Tabs
export { Tabs } from './Tabs';
export type { TabsProps } from './Tabs';

// Toast
export { default as Toast } from './Toast';
export type { ToastProps } from './Toast';

// Toggle
export { Toggle } from './Toggle';
export type { ToggleProps } from './Toggle';

// Breadcrumb
export { Breadcrumb } from './Breadcrumb';
export type { BreadcrumbProps, BreadcrumbItem } from './Breadcrumb';

// ChatMessage
export { ChatMessage, TypingIndicator, AIImmersiveInput } from './ChatMessage';
export type { ChatMessageProps, TypingIndicatorProps, AIImmersiveInputProps, ChatMessageVariant } from './ChatMessage';

// Dropdown
export { Dropdown } from './Dropdown';
export type { DropdownProps, DropdownOption } from './Dropdown';

// FileUpload
export { FileUpload, UploadProgress } from './FileUpload';
export type { FileUploadProps, UploadProgressProps } from './FileUpload';

// Loader
export { Loader } from './Loader';
export type { LoaderProps } from './Loader';

// Navigation
export { Header, TabBar, BottomNav } from './Navigation';
export type { HeaderProps, TabBarProps, TabItem, BottomNavProps, BottomNavItem } from './Navigation';

// Pagination
export { Pagination } from './Pagination';
export type { PaginationProps } from './Pagination';

// Slider
export { Slider } from './Slider';
export type { SliderProps } from './Slider';

// Stepper
export { Stepper } from './Stepper';
export type { StepperProps, StepItem } from './Stepper';

// Table
export { Table } from './Table';
export type { TableProps, TableColumn } from './Table';

// Tooltip
export { Tooltip } from './Tooltip';
export type { TooltipProps } from './Tooltip';

// Re-export primitives for convenience (some consumers import from components)
export { Text } from '../primitives/Text';
export type { TextProps } from '../primitives/Text';
export { Icon } from '../primitives/Icon';
export type { IconProps } from '../primitives/Icon';
export { Stack } from '../primitives/Stack';

// Re-export health components for consumers that import from components/index
export { DeviceCard } from '../health/DeviceCard';
export { HealthChart } from '../health/HealthChart';
