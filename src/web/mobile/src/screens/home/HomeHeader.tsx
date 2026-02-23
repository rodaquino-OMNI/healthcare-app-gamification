import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import type { Theme } from '../../../../design-system/src/themes/base.theme';
import type { HomeTabScreenNavigationProp } from '../../navigation/types';

import { useAuth } from '../../context/AuthContext';
import { colors } from '../../../../design-system/src/tokens/colors';
import { spacingValues } from '../../../../design-system/src/tokens/spacing';
import { fontSizeValues } from '../../../../design-system/src/tokens/typography';
import { borderRadiusValues } from '../../../../design-system/src/tokens/borderRadius';
import { sizingValues } from '../../../../design-system/src/tokens/sizing';

/**
 * Returns an appropriate greeting based on the current hour of the day.
 */
const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'home.header.goodMorning';
  if (hour < 18) return 'home.header.goodAfternoon';
  return 'home.header.goodEvening';
};

/**
 * Extracts user initials from a full name string.
 * Returns at most two characters (first letter of first and last name).
 */
const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Compact header component for the Home screen.
 * Displays user avatar with initials, time-of-day greeting, and a notification bell.
 */
export const HomeHeader: React.FC = () => {
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<HomeTabScreenNavigationProp>();
  const { session, getUserFromToken } = useAuth();

  const user = session?.accessToken
    ? getUserFromToken(session.accessToken)
    : null;

  const userName = user?.name || t('homeWidgets.defaultUser');
  const greeting = useMemo(() => getGreeting(), []);
  const initials = useMemo(() => getInitials(userName), [userName]);

  // Mock unread notification count; in production this would come from a context or API
  const unreadCount = 3;

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      {/* Greeting */}
      <View style={styles.greetingColumn}>
        <Text style={styles.greetingLabel}>{t(greeting)}</Text>
        <Text style={styles.userName} numberOfLines={1}>
          {userName}
        </Text>
      </View>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Notification Bell */}
      <TouchableOpacity
        style={styles.bellButton}
        onPress={() => navigation.navigate('Notifications')}
        accessibilityRole="button"
        accessibilityLabel={t('home.header.viewNotifications')}
      >
        <Text style={styles.bellIcon}>{'🔔'}</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 9 ? '9+' : String(unreadCount)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const AVATAR_SIZE = sizingValues.component.md; // 40

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.sm,
    backgroundColor: theme.colors.background.default,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: borderRadiusValues.full,
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: fontSizeValues.md,
    fontWeight: '700',
    color: theme.colors.text.onBrand,
  },
  greetingColumn: {
    marginLeft: spacingValues.sm,
    flexShrink: 1,
  },
  greetingLabel: {
    fontSize: fontSizeValues.sm,
    color: theme.colors.text.muted,
  },
  userName: {
    fontSize: fontSizeValues.lg,
    fontWeight: '700',
    color: theme.colors.text.default,
  },
  spacer: {
    flex: 1,
  },
  bellButton: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellIcon: {
    fontSize: fontSizeValues.xl,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.semantic.error,
    borderRadius: borderRadiusValues.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacingValues['3xs'],
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.text.onBrand,
  },
});

export default HomeHeader;
