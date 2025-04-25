import React from 'react';
import { Modal } from 'src/web/design-system/src/components/Modal/Modal';
import { AchievementBadge } from 'src/web/design-system/src/gamification/AchievementBadge/AchievementBadge';
import { useGamification } from 'src/web/mobile/src/context/GamificationContext';
import { formatJourneyValue } from 'src/web/shared/utils/format';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';

/**
 * Props for the GamificationPopup component
 */
interface GamificationPopupProps {
  /**
   * A boolean indicating whether the popup is visible.
   */
  visible: boolean;
  /**
   * A function to call when the popup is closed.
   */
  onClose: () => void;
  /**
   * The ID of the achievement to display.
   */
  achievementId: string;
}

/**
 * A component that displays a gamification popup with an achievement badge
 * when the user unlocks an achievement or receives a reward.
 */
export const GamificationPopup: React.FC<GamificationPopupProps> = ({ 
  visible, 
  onClose, 
  achievementId 
}) => {
  const { gameProfile, isLoading } = useGamification();
  
  // Check if game profile is loaded and has achievements
  if (isLoading || !gameProfile || !gameProfile.achievements) {
    return null;
  }
  
  // Find the achievement with the matching achievementId
  const achievement = gameProfile.achievements.find(a => a.id === achievementId);
  
  // If achievement is not found, don't display anything
  if (!achievement) {
    return null;
  }
  
  // Determine XP reward - for demonstration, we're using a fixed value
  // In a real implementation, this would come from the game rules or backend
  const xpReward = 100;
  
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Conquista Desbloqueada!"
      journey={achievement.journey}
    >
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        padding="lg"
      >
        <AchievementBadge 
          achievement={achievement} 
          size="lg" 
        />
        
        <Box marginTop="md">
          <Text fontSize="xl" fontWeight="bold" textAlign="center">
            {achievement.title}
          </Text>
        </Box>
        
        <Box marginTop="sm">
          <Text textAlign="center">
            {achievement.description}
          </Text>
        </Box>
        
        <Box 
          marginTop="md" 
          padding="sm" 
          backgroundColor="gray100" 
          borderRadius="md"
        >
          <Text fontWeight="bold" textAlign="center">
            +{formatJourneyValue(xpReward, achievement.journey)} XP
          </Text>
        </Box>
      </Box>
    </Modal>
  );
};