import { AchievementBadge } from '@design-system/gamification/AchievementBadge/AchievementBadge'; // src/web/design-system/src/gamification/AchievementBadge/AchievementBadge.tsx
import { useNavigation } from '@react-navigation/native'; // Version 6.0.0
import React from 'react'; // Version 18.2.0
import { FlatList, StyleSheet, View } from 'react-native'; // Version 0.71.14

import EmptyState from '@components/shared/EmptyState'; // src/web/mobile/src/components/shared/EmptyState.tsx
import { useAchievements } from '@hooks/useGamification'; // src/web/mobile/src/hooks/useGamification.ts

// Define the style for the component
const styles = StyleSheet.create({
    listContent: {
        paddingBottom: 20,
    },
});

/**
 * Renders a list of achievements.
 * This component displays a scrollable list of achievements fetched from the `useAchievements` hook.
 * If no achievements are available, it renders an `EmptyState` component to inform the user.
 *
 * @returns A FlatList component displaying the achievements or an EmptyState component if there are no achievements.
 */
const AchievementList: React.FC = () => {
    // Fetch the achievements using the useAchievements hook
    const achievements = useAchievements();

    // Get the navigation object
    const navigation = useNavigation();

    // Render the list of achievements or the EmptyState component
    return (
        <View>
            {achievements && achievements.length > 0 ? (
                <FlatList
                    data={achievements}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <AchievementBadge
                            achievement={item}
                            onPress={() => {
                                // Navigate to the achievement details screen when an achievement is pressed
                                (navigation as any).navigate('AchievementDetails', { achievementId: item.id });
                            }}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    numColumns={2}
                    accessibilityLabel="List of achievements"
                />
            ) : (
                <EmptyState
                    icon="trophy"
                    title="No achievements yet"
                    description="Complete tasks and reach goals to unlock achievements."
                    journey="gamification"
                    testID="empty-state"
                />
            )}
        </View>
    );
};

// Export the AchievementList component
export default AchievementList;
