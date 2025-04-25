import React from 'react';
import { Modal } from '../../../../design-system/src/components/Modal/Modal';
import { Button } from '../../../../design-system/src/components/Button/Button';
import { useJourney } from '../../context/JourneyContext';
import { Text } from '../../../../design-system/src/primitives/Text/Text';
import { Box } from '../../../../design-system/src/primitives/Box/Box';

/**
 * Defines the props for the ConfirmationModal component.
 */
export interface ConfirmationModalProps {
  /**
   * Controls whether the modal is visible
   */
  visible: boolean;
  
  /**
   * Function called when the modal is closed or canceled
   */
  onClose: () => void;
  
  /**
   * Function called when the user confirms the action
   */
  onConfirm: () => void;
  
  /**
   * Title of the confirmation modal
   */
  title: string;
  
  /**
   * Message/content of the confirmation modal
   */
  message: string;
  
  /**
   * Text for the confirm button
   */
  confirmText: string;
  
  /**
   * Text for the cancel button
   */
  cancelText: string;
}

/**
 * A reusable modal component for displaying confirmation messages and actions.
 * It leverages the design system's Modal component and provides options for confirming or canceling an action.
 * 
 * @example
 * ```tsx
 * <ConfirmationModal
 *   visible={isModalVisible}
 *   onClose={() => setModalVisible(false)}
 *   onConfirm={handleConfirmAction}
 *   title="Delete Item"
 *   message="Are you sure you want to delete this item? This action cannot be undone."
 *   confirmText="Delete"
 *   cancelText="Cancel"
 * />
 * ```
 */
export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
}) => {
  // Get current journey context for theming
  const { journey } = useJourney();
  
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={title}
      journey={journey}
    >
      <Box marginBottom="lg">
        <Text 
          journey={journey}
          fontSize="md"
          lineHeight="relaxed"
        >
          {message}
        </Text>
      </Box>
      
      <Box 
        display="flex" 
        flexDirection="row" 
        justifyContent="flex-end" 
        gap="sm"
      >
        <Button
          variant="secondary"
          onPress={onClose}
          journey={journey}
          accessibilityLabel={cancelText}
        >
          {cancelText}
        </Button>
        
        <Button
          variant="primary"
          onPress={onConfirm}
          journey={journey}
          accessibilityLabel={confirmText}
        >
          {confirmText}
        </Button>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;