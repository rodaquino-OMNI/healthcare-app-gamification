import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
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
  if (hour < 12) return 'Bom dia,';
  if (hour < 18) return 'Boa tarde,';
  return 'Boa noite,';
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
  const navigation = useNavigation();
  const { session, getUserFromToken } = useAuth();

  const user = session?.accessToken
    ? getUserFromToken(session.accessToken)
    : null;

  const userName = user?.name || 'Usuario';
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
        <Text style={styles.greetingLabel}>{greeting}</Text>
        <Text style={styles.userName} numberOfLines={1}>
          {userName}
        </Text>
      </View>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Notification Bell */}
      <TouchableOpacity
        style={styles.bellButton}
        onPress={() => navigation.navigate(ROUTES.NOTIFICATIONS as never)}
        accessibilityRole="button"
        accessibilityLabel="Ver notificacoes"
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.sm,
    backgroundColor: colors.neutral.white,
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
    color: colors.neutral.white,
  },
  greetingColumn: {
    marginLeft: spacingValues.sm,
    flexShrink: 1,
  },
  greetingLabel: {
    fontSize: fontSizeValues.sm,
    color: colors.gray[50],
  },
  userName: {
    fontSize: fontSizeValues.lg,
    fontWeight: '700',
    color: colors.neutral.gray900,
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
    color: colors.neutral.white,
  },
});

export default HomeHeader;
