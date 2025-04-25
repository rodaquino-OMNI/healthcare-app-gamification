import React, { useState, useEffect } from 'react'; // react v18.0.0
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // version 6.1.7

import {
  Card,
  Button,
  ProgressBar,
} from 'src/web/design-system/src/components';
import {
  LoadingIndicator,
  ErrorState,
  JourneyHeader,
} from 'src/web/mobile/src/components/shared';
import { HealthGoalForm } from 'src/web/mobile/src/components/forms';
import { useJourney } from 'src/web/mobile/src/context/JourneyContext';
import { useAuth } from 'src/web/mobile/src/hooks/useAuth';
import { useHealthMetrics } from 'src/web/mobile/src/hooks/useHealthMetrics';
import { useGamification } from 'src/web/mobile/src/hooks/useGamification';
import { HealthGoal } from 'src/web/shared/types/health.types';
import { MOBILE_HEALTH_ROUTES } from 'src/web/shared/constants/routes';

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
  // Get the current user's ID from the authentication context
  const { userId } = useAuth();

  // Fetch available health metric types using the useHealthMetrics hook
  const { data: healthMetricTypes, loading, error } = useHealthMetrics(userId, null, null, []);

  // Access gamification data and functions using the useGamification hook
  const gamification = useGamification();

  // Get the current journey from the JourneyContext
  const { journey } = useJourney();

  // Access the navigation object for screen navigation
  const navigation = useNavigation();

  // State to manage the visibility of the HealthGoalForm modal
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Function to handle the addition of a new health goal
  const handleAddGoal = () => {
    setIsFormVisible(true);
  };

  // Function to close the HealthGoalForm modal
  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  // Render loading indicator while health metric types are being fetched
  if (loading) {
    return <LoadingIndicator />;
  }

  // Render error state if there is an error fetching health metric types
  if (error) {
    return <ErrorState message="Failed to load health goals." />;
  }

  // Render the main component
  return (
    <View style={styles.container}>
      {/* Render the JourneyHeader component with the screen title and a button to add a new goal */}
      <JourneyHeader
        title="Health Goals"
        rightActions={(
          <View style={styles.addButtonContainer}>
            <Button
              variant="secondary"
              size="sm"
              onPress={handleAddGoal}
              journey={journey}
              accessibilityLabel="Add new health goal"
            >
              Add Goal
            </Button>
          </View>
        )}
      />

      {/* Render a list of existing health goals, displaying their progress using the ProgressBar component */}
      <FlatList
        data={gamification?.quests}
        keyExtractor={(item) => item.id}
        style={styles.goalItem}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card journey={journey}>
            <TouchableOpacity onPress={() => navigation.navigate(MOBILE_HEALTH_ROUTES.METRIC_DETAIL)}>
              <View>
                {/* Display the goal title */}
                <Text fontWeight="medium">{item.title}</Text>
                {/* Display the progress of the goal using the ProgressBar component */}
                <ProgressBar current={item.progress} total={100} journey={journey} />
              </View>
            </TouchableOpacity>
          </Card>
        )}
      />

      {/* Render the HealthGoalForm modal when the add goal button is pressed */}
      <HealthGoalForm isVisible={isFormVisible} onClose={handleCloseForm} />
    </View>
  );
};

export default HealthGoals;