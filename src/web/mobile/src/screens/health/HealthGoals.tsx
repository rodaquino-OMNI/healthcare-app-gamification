import { Card, Button, ProgressBar } from '@design-system/components';
import { useNavigation } from '@react-navigation/native'; // version 6.1.7
import React, { useState } from 'react'; // react v18.0.0
import { useTranslation } from 'react-i18next';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { HealthGoalForm } from '@components/forms';
import { LoadingIndicator, ErrorState, JourneyHeader } from '@components/shared';
import { useJourney } from '@context/JourneyContext';
import { useAuth } from '@hooks/useAuth';
import { useGamification } from '@hooks/useGamification';
import { useHealthMetrics } from '@hooks/useHealthMetrics';

import { ROUTES } from '../../constants/routes';
import type { HealthNavigationProp } from '../../navigation/types';

// Define the style for the component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    goalItem: {
        marginBottom: 16,
    },
    addButtonContainer: {
        marginBottom: 24,
    },
    listContent: {
        paddingBottom: 24,
    },
});

/**
 * Displays and manages health goals for the user.
 * Implements the Health Goals screen for the My Health Journey (F-101).
 * Allows users to set and track health-related goals (F-101-RQ-005).
 */
const HealthGoals: React.FC = () => {
    const { t } = useTranslation();
    // Get the current user's ID from the authentication context
    const { session, getUserFromToken } = useAuth();
    const tokenPayload = session?.accessToken
        ? (getUserFromToken(session.accessToken) as { sub?: string } | null)
        : null;
    const userId = tokenPayload?.sub;

    // Fetch available health metric types using the useHealthMetrics hook
    const { data: _healthMetricTypes, isLoading, error } = useHealthMetrics(userId, null, null, []);

    // Access gamification data and functions using the useGamification hook
    const gamification = useGamification();

    // Get the current journey from the JourneyContext
    const { journey } = useJourney();

    // Access the navigation object for screen navigation
    const navigation = useNavigation<HealthNavigationProp>();

    // State to manage the visibility of the HealthGoalForm modal
    const [_isFormVisible, setIsFormVisible] = useState(false);

    // Function to handle the addition of a new health goal
    const handleAddGoal = (): void => {
        setIsFormVisible(true);
    };

    // Function to close the HealthGoalForm modal
    const handleCloseForm = (): void => {
        setIsFormVisible(false);
    };

    // Render loading indicator while health metric types are being fetched
    if (isLoading) {
        return <LoadingIndicator />;
    }

    // Render error state if there is an error fetching health metric types
    if (error) {
        return <ErrorState message={t('common.errors.default')} />;
    }

    // Render the main component
    return (
        <View style={styles.container}>
            {/* Render the JourneyHeader component with the screen title and a button to add a new goal */}
            <JourneyHeader
                title={t('journeys.health.goals.title')}
                rightActions={
                    <View style={styles.addButtonContainer}>
                        <Button
                            variant="secondary"
                            size="sm"
                            onPress={handleAddGoal}
                            journey={journey as 'health' | 'care' | 'plan'}
                            accessibilityLabel="Add new health goal"
                        >
                            {t('journeys.health.goals.setGoal')}
                        </Button>
                    </View>
                }
            />

            {/* Render a list of existing health goals, displaying their progress using the ProgressBar component */}
            <FlatList
                data={gamification?.quests}
                keyExtractor={(item) => item.id}
                style={styles.goalItem}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <Card journey={journey as 'health' | 'care' | 'plan'}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate(ROUTES.HEALTH_METRIC_DETAIL, { metricType: item.id })}
                        >
                            <View>
                                {/* Display the goal title */}
                                <Text style={{ fontWeight: '500' }}>{item.title}</Text>
                                {/* Display the progress of the goal using the ProgressBar component */}
                                <ProgressBar
                                    current={item.progress}
                                    total={100}
                                    journey={journey as 'health' | 'care' | 'plan'}
                                />
                            </View>
                        </TouchableOpacity>
                    </Card>
                )}
            />

            {/* Render the HealthGoalForm modal when the add goal button is pressed */}
            <HealthGoalForm onSubmit={handleCloseForm} onCancel={handleCloseForm} />
        </View>
    );
};

export default HealthGoals;
