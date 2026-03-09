import { Button } from 'design-system/components/Button/Button';
import { Modal } from 'design-system/components/Modal/Modal';
import React from 'react';
import { AustaConfirmationModalProps } from 'shared/types/index';

import { useJourney } from '@/context/JourneyContext';
import { useI18n } from '@/i18n/index';

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
    useI18n();

    // LD1: Retrieves the current journey from the JourneyContext
    useJourney();

    // Narrow journey string to the union type accepted by DS components
    const journeyId = journey === 'health' || journey === 'care' || journey === 'plan' ? journey : undefined;

    return (
        <Modal visible={visible ?? false} onClose={onCancel} title={title} journey={journeyId}>
            <p>{message}</p>
            <Button onPress={onConfirm} variant="primary" journey={journeyId} accessibilityLabel={confirmText}>
                {confirmText}
            </Button>
            <Button onPress={onCancel} variant="secondary" journey={journeyId} accessibilityLabel={cancelText}>
                {cancelText}
            </Button>
        </Modal>
    );
};
