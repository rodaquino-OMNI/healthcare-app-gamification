import React from 'react';
import { Modal, ModalProps } from 'src/web/design-system/src/components/Modal/Modal.tsx'; // version: Not specified
import { Button, ButtonProps } from 'src/web/design-system/src/components/Button/Button.tsx'; // version: Not specified
import { Text, TextProps } from 'src/web/design-system/src/primitives/Text/Text.tsx'; // version: Not specified
import { Badge, BadgeProps } from 'src/web/design-system/src/components/Badge/Badge.tsx'; // version: Not specified
import { useJourney } from 'src/web/mobile/src/context/JourneyContext.tsx'; // version: Not specified
import { Achievement } from 'src/web/shared/types/gamification.types.ts'; // version: Not specified

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
export const AchievementModal: React.FC<AchievementModalProps> = ({
  visible,
  onClose,
  achievement,
}) => {
  // LD1: Destructure props to get visible, onClose, achievement.
  const { title, description, icon } = achievement;

  // LD1: Use the useJourney hook to get journey-specific theming.
  const { journey } = useJourney();

  // LD1: Render a Modal component with the achievement title.
  return (
    <Modal visible={visible} onClose={onClose} title={title} journey={journey}>
      {/* LD1: Render the achievement badge with the achievement details. */}
      <Badge
        size="lg"
        unlocked={achievement.unlocked}
        journey={journey}
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