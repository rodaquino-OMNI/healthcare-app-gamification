import React from 'react'; // Version 18.2.0
import { View, StyleSheet } from 'react-native'; // Version 0.71.14

import AchievementList from 'src/web/mobile/src/components/lists/AchievementList.tsx';
import { useGamification } from 'src/web/mobile/src/hooks/useGamification.ts';
import { JOURNEY_NAMES } from 'src/web/shared/constants/journeys.ts';

// Define the style for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

/**
 * Renders the Achievements screen, displaying a list of achievements.
 * @returns {JSX.Element} A View component containing the AchievementList component.
 */
const Achievements: React.FC = () => {
  return (
    <View style={styles.container} accessible={true} accessibilityLabel="Achievements Screen">
      <AchievementList />
    </View>
  );
};

export default Achievements;