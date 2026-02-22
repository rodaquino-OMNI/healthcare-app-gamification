import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import type { Theme } from '../../../../design-system/src/themes/base.theme';
import { colors } from '../../../../design-system/src/tokens/colors';
import { spacingValues } from '../../../../design-system/src/tokens/spacing';
import { fontSizeValues } from '../../../../design-system/src/tokens/typography';
import { borderRadiusValues } from '../../../../design-system/src/tokens/borderRadius';

/**
 * Error404Screen - Displayed when a page/route is not found.
 * Centered layout with 404 text, subtitle, and a button to navigate home.
 */
export const Error404Screen: React.FC = () => {
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleGoHome = () => {
    // @ts-ignore - navigation.navigate expects specific route names
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.errorCode}>404</Text>
      <Text style={styles.title}>{t('errorScreens.notFound.title')}</Text>
      <Text style={styles.message}>
        {t('errorScreens.notFound.message')}
      </Text>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleGoHome}
        accessibilityRole="button"
        accessibilityLabel={t('errorScreens.notFound.goHome')}
      >
        <Text style={styles.primaryButtonText}>{t('errorScreens.notFound.goHome')}</Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * ErrorTimeoutScreen - Displayed when a network timeout occurs.
 * Shows a timeout icon, descriptive message, and a retry button.
 */
export const ErrorTimeoutScreen: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => {
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{'⏱️'}</Text>
      <Text style={styles.title}>{t('errorScreens.timeout.title')}</Text>
      <Text style={styles.message}>
        {t('errorScreens.timeout.message')}
      </Text>
      {onRetry && (
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel={t('errorScreens.timeout.retry')}
        >
          <Text style={styles.primaryButtonText}>{t('errorScreens.timeout.retry')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

/**
 * EmptyStateScreen - Generic empty state with configurable title and message.
 * Displays an empty box icon, title, message, and optional retry button.
 */
export const EmptyStateScreen: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({
  title,
  message,
  onRetry,
}) => {
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);
  const { t } = useTranslation();
  const displayTitle = title || t('errorScreens.empty.title');
  const displayMessage = message || t('errorScreens.empty.message');
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{'📭'}</Text>
      <Text style={styles.title}>{displayTitle}</Text>
      <Text style={styles.message}>{displayMessage}</Text>
      {onRetry && (
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel={t('errorScreens.empty.retry')}
        >
          <Text style={styles.secondaryButtonText}>{t('errorScreens.empty.retry')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacingValues.xl,
    backgroundColor: theme.colors.background.default,
  },
  icon: {
    fontSize: 56,
    marginBottom: spacingValues.lg,
  },
  errorCode: {
    fontSize: fontSizeValues['2xl'],
    fontWeight: 'bold',
    color: theme.colors.text.default,
    marginBottom: spacingValues.xs,
  },
  title: {
    fontSize: fontSizeValues.lg,
    fontWeight: '600',
    color: theme.colors.text.default,
    marginBottom: spacingValues.xs,
    textAlign: 'center',
  },
  message: {
    fontSize: fontSizeValues.sm,
    color: theme.colors.text.muted,
    textAlign: 'center',
    marginBottom: spacingValues.xl,
    paddingHorizontal: spacingValues['2xl'],
    lineHeight: fontSizeValues.sm * 1.5,
  },
  primaryButton: {
    backgroundColor: colors.brand.primary,
    paddingHorizontal: spacingValues.xl,
    paddingVertical: spacingValues.sm,
    borderRadius: borderRadiusValues.md,
    minWidth: 200,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: theme.colors.text.onBrand,
    fontSize: fontSizeValues.md,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: theme.colors.background.subtle,
    paddingHorizontal: spacingValues.xl,
    paddingVertical: spacingValues.sm,
    borderRadius: borderRadiusValues.md,
    minWidth: 200,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: theme.colors.text.default,
    fontSize: fontSizeValues.md,
    fontWeight: '600',
  },
});
