import React from 'react';
import { Modal, ModalProps } from 'design-system/components/Modal/Modal'; // v6.0+
import { Button, ButtonProps } from 'design-system/components/Button/Button'; // v6.0+
import { AustaConfirmationModalProps } from 'shared/types/index';
import { useI18n } from '@/i18n/index';
import { JOURNEY_COLORS } from 'shared/constants/index';
import { useJourney } from '@/context/JourneyContext';

/**
 * ConfirmationModal component for the AUSTA SuperApp.
 *
 * This component provides a reusable modal for displaying confirmation messages and actions.
 * It uses the design system's Modal and Button components for styling and adheres to accessibility guidelines.
 *
 * @param {AustaConfirmationModalProps} props - The props for the ConfirmationModal component.
 * @returns {React.ReactNode} The JSX code for the confirmation modal.
 *
 * @example
 * ```tsx
 * <ConfirmationModal
 *   visible={isModalVisible}
 *   onConfirm={() => {
 *     handleConfirm();
 *     setIsModalVisible(false);
 *   }}
 *   onCancel={() => setIsModalVisible(false)}
 *   title="Confirm Deletion"
 *   message="Are you sure you want to delete this item?"
 *   confirmText="Delete"
 *   cancelText="Cancel"
 *   journey="health"
 * />
 * ```
 */
export const ConfirmationModal: React.FC<AustaConfirmationModalProps> = ({
    visible,
    onConfirm,
    onCancel,
    title,
    message,
    confirmText,
    cancelText,
    journey,
}) => {
    // LD1: Retrieves the translation function using the useI18n hook.
    const { t } = useI18n();

    // LD1: Retrieves the current journey from the JourneyContext
    const { journeyData } = useJourney();

    // LD1: Renders a Modal component with the visible prop controlling its visibility.
    // LD1: Sets the title of the modal using the title prop.
    // LD1: Renders the message content using the message prop.
    // LD1: Renders two Button components for the confirm and cancel actions.
    // LD1: Applies journey-specific styling to the buttons using the journey prop.
    return (
        <Modal visible={visible} onClose={onCancel} title={title} journey={journey}>
            <p>{message}</p>
            <Button onPress={onConfirm} variant="primary" journey={journey} accessibilityLabel={confirmText}>
                {confirmText}
            </Button>
            <Button onPress={onCancel} variant="secondary" journey={journey} accessibilityLabel={cancelText}>
                {cancelText}
            </Button>
        </Modal>
    );
};
