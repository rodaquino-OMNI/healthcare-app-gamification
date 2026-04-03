import { Modal } from 'design-system/components/Modal/Modal';
import { AchievementBadge } from 'design-system/gamification/AchievementBadge/AchievementBadge';
import React from 'react';
import { JOURNEY_COLORS } from 'shared/constants/index';
import { formatJourneyValue } from 'shared/utils/format';
import styled from 'styled-components';

import { useGamification } from '@/context/GamificationContext';

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
 * Styled container for the achievement content
 */
const AchievementContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px;
    text-align: center;
`;

/**
 * Styled badge wrapper to add spacing
 */
const BadgeWrapper = styled.div`
    margin: 16px 0;
    transform: scale(1.5);
`;

/**
 * Styled heading for achievement title
 */
const AchievementTitle = styled.h2`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 8px;
`;

/**
 * Styled text for achievement description
 */
const AchievementDescription = styled.p`
    font-size: 16px;
    margin-bottom: 16px;
    color: #616161;
`;

/**
 * Styled text for XP reward
 */
const XPReward = styled.div<{ journey: string }>`
    font-size: 18px;
    font-weight: bold;
    color: ${(props) => {
        const journeyKey = props.journey.toUpperCase() as keyof typeof JOURNEY_COLORS;
        return JOURNEY_COLORS[journeyKey] || '#0ACF83';
    }};
    margin-bottom: 16px;
`;

/**
 * A component that displays a gamification popup with an achievement badge.
 *
 * @param visible - A boolean indicating whether the popup is visible.
 * @param onClose - A function to call when the popup is closed.
 * @param achievementId - The ID of the achievement to display.
 * @returns The rendered GamificationPopup component.
 */
export const GamificationPopup: React.FC<GamificationPopupProps> = ({ visible, onClose, achievementId }) => {
    // Access the gamification context to get user's achievements
    const { gameProfile, isLoading } = useGamification();

    // If the game profile is loading or doesn't exist, or if we don't have an achievement ID, return null
    if (isLoading || !gameProfile || !achievementId) {
        return null;
    }

    // Find the achievement with the matching ID
    const achievement = gameProfile.achievements.find((a) => a.id === achievementId);

    // If no matching achievement is found, don't render anything
    if (!achievement) {
        return null;
    }

    const journeyKey: 'health' | 'care' | 'plan' =
        achievement.journey === 'care' ? 'care' : achievement.journey === 'plan' ? 'plan' : 'health';

    return (
        <Modal visible={visible} onClose={onClose} title="Conquista Desbloqueada!" journey={journeyKey}>
            <AchievementContainer>
                <BadgeWrapper>
                    <AchievementBadge achievement={achievement} size="lg" />
                </BadgeWrapper>

                <AchievementTitle>{achievement.title}</AchievementTitle>
                <AchievementDescription>{achievement.description}</AchievementDescription>

                <XPReward journey={achievement.journey}>
                    +
                    {formatJourneyValue(
                        achievement.unlocked ? achievement.total : achievement.progress,
                        achievement.journey,
                        'number'
                    )}{' '}
                    XP
                </XPReward>
            </AchievementContainer>
        </Modal>
    );
};
