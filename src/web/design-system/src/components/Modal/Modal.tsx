import React, { useEffect } from 'react';
import styled from 'styled-components';
import { tokens } from '../../tokens';
import { borderRadius } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { shadows } from '../../tokens/shadows';
import { Box } from '../../primitives/Box/Box';
import { Text } from '../../primitives/Text/Text';
import { Touchable } from '../../primitives/Touchable/Touchable';
import { Button } from '../../components/Button/Button';

/**
 * Props interface for the Modal component
 */
export interface ModalProps {
  /**
   * Controls whether the modal is visible
   */
  visible: boolean;

  /**
   * Function called when the modal is closed
   */
  onClose: () => void;

  /**
   * Title to display in the modal header
   */
  title?: string;

  /**
   * Modal content
   */
  children: React.ReactNode;

  /**
   * Journey identifier for journey-specific theming
   * @default 'health'
   */
  journey?: 'health' | 'care' | 'plan';

  /**
   * Modal display variant
   * 'center' renders a centered modal dialog, 'bottomSheet' renders a bottom-aligned sheet
   * @default 'center'
   */
  variant?: 'center' | 'bottomSheet';
}

/**
 * Styled container for the modal overlay
 */
const ModalContainer = styled.div<{ variant?: 'center' | 'bottomSheet' }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: ${({ variant }) => variant === 'bottomSheet' ? 'flex-end' : 'center'};
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

/**
 * Styled container for the centered modal content
 */
const ModalContent = styled.div`
  width: 80%;
  background-color: ${colors.neutral.white};
  border-radius: ${borderRadius['2xl']};
  padding: ${tokens.spacing.md};
  box-shadow: ${shadows.xl};
`;

/**
 * Styled container for bottom sheet modal content
 */
const BottomSheetContent = styled.div`
  width: 100%;
  background-color: ${colors.neutral.white};
  border-top-left-radius: ${borderRadius.xl};
  border-top-right-radius: ${borderRadius.xl};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  padding: ${tokens.spacing.md};
  box-shadow: ${shadows.xl};
  max-height: 80%;
  overflow-y: auto;
`;

/**
 * Styled container for the modal header
 */
const ModalHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${tokens.spacing.md};
`;

/**
 * Modal component for the AUSTA SuperApp design system.
 *
 * This component provides a consistent modal experience across the application
 * with journey-specific theming and proper accessibility support.
 *
 * @example
 * ```tsx
 * <Modal
 *   visible={isModalVisible}
 *   onClose={() => setIsModalVisible(false)}
 *   title="Confirmation"
 *   journey="health"
 * >
 *   <Text>Are you sure you want to proceed?</Text>
 *   <Button onPress={handleConfirm}>Confirm</Button>
 * </Modal>
 * ```
 */
export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  journey = 'health',
  variant = 'center',
}) => {
  // Handle escape key for accessibility
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && visible) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [visible, onClose]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <ModalContainer
      variant={variant}
      onClick={(e) => {
        // Close modal when clicking outside content
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {variant === 'bottomSheet' ? (
        <BottomSheetContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            {title && (
              <Text
                fontSize="lg"
                fontWeight="medium"
                id="modal-title"
                journey={journey}
              >
                {title}
              </Text>
            )}
            <Touchable
              onPress={onClose}
              accessibilityLabel="Close modal"
              accessibilityRole="button"
              journey={journey}
            >
              <Box padding="xs">
                <Text fontSize="xl">x</Text>
              </Box>
            </Touchable>
          </ModalHeader>

          <Box>
            {children}
          </Box>
        </BottomSheetContent>
      ) : (
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            {title && (
              <Text
                fontSize="lg"
                fontWeight="medium"
                id="modal-title"
                journey={journey}
              >
                {title}
              </Text>
            )}
            <Touchable
              onPress={onClose}
              accessibilityLabel="Close modal"
              accessibilityRole="button"
              journey={journey}
            >
              <Box padding="xs">
                <Text fontSize="xl">x</Text>
              </Box>
            </Touchable>
          </ModalHeader>

          <Box>
            {children}
          </Box>
        </ModalContent>
      )}
    </ModalContainer>
  );
};
