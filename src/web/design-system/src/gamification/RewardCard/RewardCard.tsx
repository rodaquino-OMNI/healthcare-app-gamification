import React from 'react';

import {
    RewardCardContainer,
    RewardIcon,
    RewardContent,
    RewardTitle,
    RewardDescription,
    XPBadge,
    useJourneyColor,
} from './RewardCard.styles';
import { colors } from '../../tokens/colors';

/**
 * Interface for reward data
 */
interface Reward {
    /** Unique identifier for the reward */
    id: string;
    /** Title of the reward */
    title: string;
    /** Description of the reward */
    description: string;
    /** Icon name for the reward */
    icon: string;
    /** XP value of the reward */
    xp: number;
    /** Journey associated with the reward */
    journey: 'health' | 'care' | 'plan';
}

/**
 * Props for the RewardCard component
 */
export interface RewardCardProps {
    /** The reward object containing title, description, icon, xp, and journey */
    reward: Reward;
    /** Callback function when the card is pressed */
    onPress?: () => void;
    /** Test ID for testing purposes */
    testID?: string;
    /** Accessibility label for screen readers */
    accessibilityLabel?: string;
}

/**
 * A component that displays reward information with journey-specific styling,
 * showing the reward title, description, icon, and XP value. Applies journey-specific
 * colors based on the reward's journey property.
 *
 * @example
 * ```tsx
 * <RewardCard
 *   reward={{
 *     id: 'reward-1',
 *     title: 'Weekly Goal Achieved',
 *     description: 'You completed your weekly step goal!',
 *     icon: 'trophy',
 *     xp: 100,
 *     journey: 'health'
 *   }}
 *   onPress={() => console.log('Reward card pressed')}
 * />
 * ```
 */
export const RewardCard: React.FC<RewardCardProps> = ({ reward, onPress, testID, accessibilityLabel }) => {
    const { title, description, icon, xp, journey } = reward;
    const journeyColor = useJourneyColor(journey);

    // Create a descriptive accessibility label if none provided
    const defaultAccessibilityLabel = `${title} reward. ${description}. Worth ${xp} XP.`;

    return (
        <RewardCardContainer
            journey={journey}
            onPress={onPress}
            testID={testID}
            accessibilityLabel={accessibilityLabel || defaultAccessibilityLabel}
            interactive={!!onPress}
        >
            <RewardIcon name={icon} color={journeyColor.primary} aria-hidden={true} />
            <RewardContent>
                <RewardTitle>{title}</RewardTitle>
                <RewardDescription>{description}</RewardDescription>
                <XPBadge color={journeyColor.primary} textColor={colors.neutral.white}>
                    +{xp} XP
                </XPBadge>
            </RewardContent>
        </RewardCardContainer>
    );
};

export default RewardCard;
