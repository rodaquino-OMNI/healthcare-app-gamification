import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// useTranslation available; labels provided via props from parent
import { useTranslation } from 'react-i18next';
import { colors } from '../../../../design-system/src/tokens/colors';
import { spacingValues } from '../../../../design-system/src/tokens/spacing';
import { fontSizeValues } from '../../../../design-system/src/tokens/typography';
import { borderRadiusValues } from '../../../../design-system/src/tokens/borderRadius';

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
  navigation: any;
  actions: QuickAction[];
}

/**
 * Quick action buttons for navigating to common destinations.
 */
export const QuickActions: React.FC<QuickActionsProps> = ({ navigation, actions }) => (
  <View style={styles.quickActionsRow}>
    {actions.map((action) => (
      <TouchableOpacity
        key={action.id}
        style={styles.quickActionButton}
        onPress={() => navigation.navigate(action.route as never)}
        accessibilityRole="button"
        accessibilityLabel={action.label}
      >
        <Text style={styles.quickActionText}>{action.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

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
