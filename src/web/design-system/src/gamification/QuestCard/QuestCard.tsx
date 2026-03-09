import React from 'react';

import { Card } from '../../components/Card/Card';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import { Icon } from '../../primitives/Icon/Icon';
import { Text } from '../../primitives/Text/Text';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { AchievementBadge } from '../AchievementBadge/AchievementBadge';
// Local type stub for Quest (shared package not available at build time)
interface Quest {
    id: string;
    title: string;
    description: string;
    icon: string;
    progress: number;
    total: number;
    completed: boolean;
    journey: 'health' | 'care' | 'plan';
}

// Local utility replacing shared theme import
const useJourneyTheme = (journey?: string): (typeof colors.journeys)[keyof typeof colors.journeys] => {
    const key =
        journey && ['health', 'care', 'plan'].includes(journey) ? (journey as 'health' | 'care' | 'plan') : 'health';
    return colors.journeys[key];
};

/**
 * Props for the QuestCard component
 */
export interface QuestCardProps {
    /**
     * The quest object containing details like id, title, description, icon, progress, total, and completed status.
     */
    quest: Quest;

    /**
     * Callback function to execute when the card is pressed.
     */
    onPress?: () => void;
}

/**
 * A component that displays a quest card with appropriate styling based on its state and journey.
 * Shows quest details, progress, and applies journey-specific styling.
 * Displays an achievement badge when the quest is completed.
 */
export const QuestCard: React.FC<QuestCardProps> = ({ quest, onPress }) => {
    const { id, title, description, icon, progress, total, journey } = quest;

    // Get journey-specific colors for styling
    const journeyTheme = useJourneyTheme(journey);

    // Calculate progress percentage for the progress bar
    const progressPercentage = Math.min(Math.round((progress / total) * 100), 100);

    // Check if quest is completed
    const isCompleted = progress >= total;

    return (
        <Card
            journey={journey}
            onPress={onPress}
            elevation="sm"
            padding="md"
            accessibilityLabel={`${title} quest. ${description}. Progress: ${progress} of ${total}.`}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <Icon name={icon} size="24px" color={journeyTheme.primary} aria-hidden="true" />

                <div style={{ marginLeft: spacing.md, flexGrow: 1 }}>
                    <Text fontWeight="medium" fontSize="lg" journey={journey}>
                        {title}
                    </Text>

                    <Text
                        fontSize="md"
                        color="neutral.gray700"
                        style={{ marginTop: spacing.xs, marginBottom: spacing.sm }}
                    >
                        {description}
                    </Text>

                    <ProgressBar
                        current={progress}
                        total={total}
                        journey={journey}
                        size="md"
                        ariaLabel={`Quest progress: ${progressPercentage}%`}
                    />

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: spacing.xs,
                        }}
                    >
                        <Text fontSize="sm" color="neutral.gray600">
                            {progress} of {total} completed
                        </Text>

                        {isCompleted && (
                            <AchievementBadge
                                achievement={{
                                    id,
                                    title,
                                    description,
                                    icon,
                                    progress,
                                    total,
                                    unlocked: true,
                                    journey,
                                }}
                                size="sm"
                            />
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default QuestCard;
