import { Badge } from '@design-system/components/Badge/Badge'; // version: Not specified
import { Button } from '@design-system/components/Button/Button'; // version: Not specified
import { Modal } from '@design-system/components/Modal/Modal'; // version: Not specified
import { Text } from '@design-system/primitives/Text/Text'; // version: Not specified
import { Achievement } from '@shared/types/gamification.types'; // version: Not specified
import React from 'react';

import { useJourney } from '@context/JourneyContext'; // version: Not specified

/**
 * Props interface for the AchievementModal component
 */
interface AchievementModalProps {
    /**
     * Controls the visibility of the modal.
     */
    visible: boolean;
    /**
     * Function called when the modal is closed.
     */
    onClose: () => void;
    /**
     * The achievement data to display.
     */
    achievement: Achievement;
}

/**
 * A modal component that displays details about an achievement.
 *
 * @param props - The props for the component, including the achievement details and a close handler.
 * @returns A modal displaying the achievement details.
 */
export const AchievementModal: React.FC<AchievementModalProps> = ({ visible, onClose, achievement }) => {
    // LD1: Destructure props to get visible, onClose, achievement.
    const { title, description, icon } = achievement;

    // LD1: Use the useJourney hook to get journey-specific theming.
    const { journey } = useJourney();

    // LD1: Render a Modal component with the achievement title.
    return (
        <Modal visible={visible} onClose={onClose} title={title} journey={journey as 'health' | 'care' | 'plan'}>
            {/* LD1: Render the achievement badge with the achievement details. */}
            <Badge
                size="lg"
                unlocked={achievement.unlocked}
                journey={journey as 'health' | 'care' | 'plan'}
                accessibilityLabel={`${title} Achievement`}
            >
                {icon}
            </Badge>
            {/* LD1: Render the achievement description using the Text component. */}
            <Text>{description}</Text>
            {/* LD1: Render a button to close the modal. */}
            <Button onPress={onClose}>
                {/* LD1: Apply journey-specific styling to the button. */}
                {/* LD1: Provide appropriate accessibility attributes. */}
                Close
            </Button>
        </Modal>
    );
};
