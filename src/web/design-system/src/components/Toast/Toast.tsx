import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Box } from '../../primitives/Box/Box';
import { Text } from '../../primitives/Text/Text';
import { Touchable } from '../../primitives/Touchable/Touchable';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { baseTheme } from '../../themes';

/**
 * Props for the Toast component
 */
export interface ToastProps {
  /**
   * Type of toast message (success, error, warning, info)
   */
  type: 'success' | 'error' | 'warning' | 'info';
  
  /**
   * The message to display in the toast
   */
  message: string;
  
  /**
   * Whether the toast is visible
   */
  visible: boolean;
  
  /**
   * Function called when the toast is dismissed
   */
  onDismiss?: () => void;
}

const ToastContainer = styled(Box)<{ toastType: string }>`
  border-left-width: 4px;
  border-left-style: solid;
  border-left-color: ${props => {
    switch (props.toastType) {
      case 'success':
        return colors.semantic.success;
      case 'error':
        return colors.semantic.error;
      case 'warning':
        return colors.semantic.warning;
      case 'info':
      default:
        return colors.semantic.info;
    }
  }};
`;

const IconContainer = styled(Box)`
  margin-right: ${spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MessageContainer = styled(Box)`
  flex: 1;
`;

const CloseButton = styled(Touchable)`
  padding: ${spacing.sm};
`;

/**
 * Toast component for displaying brief, auto-dismissing messages to the user.
 * It supports different types (success, error, warning, info) and integrates
 * with the design system for consistent styling and theming.
 * 
 * @example
 * ```jsx
 * <Toast 
 *   type="success"
 *   message="Operation completed successfully"
 *   visible={isVisible}
 *   onDismiss={() => setIsVisible(false)}
 * />
 * ```
 */
export const Toast: React.FC<ToastProps> = ({
  type = 'info',
  message,
  visible,
  onDismiss,
}) => {
  // Auto-dismiss after 3 seconds if onDismiss is provided
  useEffect(() => {
    if (visible && onDismiss) {
      const timer = setTimeout(onDismiss, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onDismiss]);
  
  if (!visible) return null;
  
  // Get color and icon based on toast type
  const getToastProperties = () => {
    switch (type) {
      case 'success':
        return {
          color: colors.semantic.success,
          icon: '✓',
        };
      case 'error':
        return {
          color: colors.semantic.error,
          icon: '✗',
        };
      case 'warning':
        return {
          color: colors.semantic.warning,
          icon: '⚠',
        };
      case 'info':
      default:
        return {
          color: colors.semantic.info,
          icon: 'ℹ',
        };
    }
  };
  
  const { color, icon } = getToastProperties();
  
  return (
    <ToastContainer
      toastType={type}
      padding={spacing.md}
      backgroundColor={colors.neutral.white}
      borderRadius="md"
      boxShadow="sm"
      display="flex"
      flexDirection="row"
      alignItems="center"
      data-testid="toast"
      role="alert"
    >
      <IconContainer>
        <Text color={color} aria-hidden="true" fontSize="md">
          {icon}
        </Text>
      </IconContainer>
      <MessageContainer>
        <Text color={colors.neutral.gray900}>
          {message}
        </Text>
      </MessageContainer>
      {onDismiss && (
        <CloseButton
          onPress={onDismiss}
          accessibilityLabel="Close notification"
          testID="toast-close-button"
        >
          <Text color={colors.neutral.gray600} aria-hidden="true" fontSize="lg">
            ×
          </Text>
        </CloseButton>
      )}
    </ToastContainer>
  );
};