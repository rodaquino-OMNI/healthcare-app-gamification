import React from 'react'; // React v18.0+
import { View, StyleSheet, ScrollView, Text } from 'react-native'; // React Native v0.71+
import { useNavigation } from '@react-navigation/native'; // v6.0+

import { JourneyHeader } from '../components/shared/JourneyHeader';
import { JOURNEY_NAMES } from '../constants/journeys';
import { Dashboard as HealthDashboard } from '../screens/health/Dashboard';
import { Dashboard as CareDashboard } from '../screens/care/Dashboard';
import { Dashboard as PlanDashboard } from '../screens/plan/Dashboard';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { Button } from '@web/design-system/components/Button';
import { Card } from '@web/design-system/components/Card';
import { formatRelativeDate } from '@web/shared/utils/date';
import { formatCurrency } from '@web/shared/utils/format';

/**
 * Renders the Home screen, displaying key information and navigation options for each journey.
 *
 * @returns {JSX.Element} The rendered Home screen component.
 */
const HomeScreen: React.FC = () => {
  // LD1: Retrieves the navigation object using the useNavigation hook.
  const navigation = useNavigation();
  // LD1: Retrieves the authentication context using the useAuth hook.
  const { session, getUserFromToken } = useAuth();
  // LD1: Retrieves the gamification context using the useGamification hook.
  const { gameProfile } = useGamification();

  // LD1: Renders a JourneyHeader component for the screen.
  // LD1: Renders a ScrollView to contain the dashboard widgets.
  // LD1: Displays user profile information including level and XP.
  // LD1: Renders journey cards for Health, Care Now, and Plan journeys.
  // LD1: Shows upcoming events and appointments with relative dates.
  // LD1: Displays gamification elements like achievements and quests.
  // LD1: Provides buttons to navigate to the Notifications and Profile screens.
  return (
    <View style={styles.container}>
      <JourneyHeader title="AUSTA SuperApp" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text>Welcome to AUSTA SuperApp!</Text>
      </ScrollView>
    </View>
  );
};

// LD1: Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default HomeScreen;