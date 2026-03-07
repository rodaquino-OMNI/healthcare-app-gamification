import React from 'react';
import { Modal, ModalProps } from 'design-system/components/Modal/Modal'; // version: that matches the design system
import { AchievementBadge } from 'design-system/gamification/AchievementBadge/AchievementBadge'; // version: that matches the design system
import { Achievement } from 'shared/types/gamification.types';
import { GET_ACHIEVEMENTS } from 'shared/graphql/queries/gamification.queries';
import { useGamification } from '@/hooks/useGamification';
import { format } from 'shared/utils/format'; // Assuming format contains truncateText

/**
 * Props interface for the AchievementModal component
 */
interface AchievementModalProps {
    /**
     * The ID of the achievement to display.
     */
    achievementId: string;
    /**
     * A boolean to control the visibility of the modal.
     */
    visible: boolean;
    /**
     * A function to call when the modal is closed.
     */
    onClose: () => void;
}

/**
 * Displays a modal with details about a specific achievement.
 */
export const AchievementModal: React.FC<AchievementModalProps> = ({ achievementId, visible, onClose }) => {
    // Retrieve the achievement data using the `useGamification` hook.
    const { data, loading, error } = useGamification();

    // Find the achievement by ID
    const achievement: Achievement | undefined = data?.gameProfile?.achievements?.find((a) => a.id === achievementId);

    if (loading) {
        return (
            <Modal visible={visible} onClose={onClose} title="Loading Achievement">
                <p>Loading achievement details...</p>
            </Modal>
        );
    }

    if (error) {
        return (
            <Modal visible={visible} onClose={onClose} title="Error">
                <p>Error loading achievement details.</p>
            </Modal>
        );
    }

    if (!achievement) {
        return (
            <Modal visible={visible} onClose={onClose} title="Achievement Not Found">
                <p>Achievement not found.</p>
            </Modal>
        );
    }

    // Renders a `Modal` component.
    return (
        <Modal visible={visible} onClose={onClose} title="Achievement Details" journey={achievement.journey}>
            {/* Displays the achievement badge using the `AchievementBadge` component. */}
            <AchievementBadge achievement={achievement} size="lg" showProgress={!achievement.unlocked} />
            {/* Displays the achievement title and description. */}
            <h3>{achievement.title}</h3>
            <p>{achievement.description}</p>
            {/* If the achievement is not unlocked, displays the progress towards unlocking it. */}
            {!achievement.unlocked && (
                <p>
                    Progress: {achievement.progress} / {achievement.total}
                </p>
            )}
            {/* Provides a button to close the modal. */}
            <button onClick={onClose}>Close</button>
        </Modal>
    );
};
