import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// useTranslation available; labels provided via props from parent
import { useTranslation } from 'react-i18next';
import type { HomeTabScreenNavigationProp, HomeStackParamList, MainTabParamList } from '../../navigation/types';
import { colors } from '@design-system/tokens/colors';
import { spacingValues } from '@design-system/tokens/spacing';
import { fontSizeValues } from '@design-system/tokens/typography';
import { borderRadiusValues } from '@design-system/tokens/borderRadius';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface QuickAction {
  id: string;
  label: string;
  route: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface QuickActionsProps {
  navigation: HomeTabScreenNavigationProp;
  actions: QuickAction[];
}

/**
 * Quick action buttons for navigating to common destinations.
 * Routes can be Home stack screens (HomeAlert, HomeMetrics) or tab names (Profile).
 */
export const QuickActions: React.FC<QuickActionsProps> = ({ navigation, actions }) => {
  const handlePress = useCallback(
    (route: string) => {
      // Check if the route is a Home stack screen
      const homeScreens: Array<keyof HomeStackParamList> = [
        'HomeAlert', 'HomeMetrics', 'HomeMain', 'Search', 'SearchResults',
        'HomeWeeklySummary', 'HomeBottomSheet', 'HomeMedicationReminders',
        'HomeAppointmentWidget', 'HomeHealthTips', 'HomeEmpty',
        'NotificationDetail', 'NotificationUnread', 'NotificationCategoryFilter',
        'NotificationEmpty', 'NotificationSettings',
      ];
      if (homeScreens.includes(route as keyof HomeStackParamList)) {
        (navigation as any).navigate(route);
      } else {
        // Tab-level navigation (Profile, Notifications, etc.)
        (navigation as any).navigate(route);
      }
    },
    [navigation],
  );

  return (
    <View style={styles.quickActionsRow}>
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={styles.quickActionButton}
          onPress={() => handlePress(action.route)}
          accessibilityRole="button"
          accessibilityLabel={action.label}
        >
          <Text style={styles.quickActionText}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: colors.gray[5],
    borderRadius: borderRadiusValues.md,
    paddingVertical: spacingValues.sm,
    alignItems: 'center',
    marginHorizontal: spacingValues['3xs'],
  },
  quickActionText: {
    fontSize: fontSizeValues.sm,
    fontWeight: '600',
    color: colors.neutral.gray900,
  },
});
