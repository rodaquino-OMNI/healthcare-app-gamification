import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../../../design-system/src/tokens/colors';
import { spacingValues } from '../../../../design-system/src/tokens/spacing';
import { fontSizeValues } from '../../../../design-system/src/tokens/typography';
import { borderRadiusValues } from '../../../../design-system/src/tokens/borderRadius';

/**
 * Error404Screen - Displayed when a page/route is not found.
 * Centered layout with 404 text, subtitle, and a button to navigate home.
 */
export const Error404Screen: React.FC = () => {
  const navigation = useNavigation();

  const handleGoHome = () => {
    // @ts-ignore - navigation.navigate expects specific route names
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.errorCode}>404</Text>
      <Text style={styles.title}>Pagina nao encontrada</Text>
      <Text style={styles.message}>
        A pagina que voce esta procurando nao existe ou foi movida.
      </Text>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleGoHome}
        accessibilityRole="button"
        accessibilityLabel="Voltar ao inicio"
      >
        <Text style={styles.primaryButtonText}>Voltar ao inicio</Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * ErrorTimeoutScreen - Displayed when a network timeout occurs.
 * Shows a timeout icon, descriptive message, and a retry button.
 */
export const ErrorTimeoutScreen: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{'⏱️'}</Text>
      <Text style={styles.title}>Tempo esgotado</Text>
      <Text style={styles.message}>
        Nao foi possivel conectar. Verifique sua conexao e tente novamente.
      </Text>
      {onRetry && (
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Tentar novamente"
        >
          <Text style={styles.primaryButtonText}>Tentar novamente</Text>
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
  title = 'Nada por aqui',
  message = 'Nenhum conteudo disponivel no momento.',
  onRetry,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{'📭'}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Tentar novamente"
        >
          <Text style={styles.secondaryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacingValues.xl,
    backgroundColor: colors.neutral.white,
  },
  icon: {
    fontSize: 56,
    marginBottom: spacingValues.lg,
  },
  errorCode: {
    fontSize: fontSizeValues['2xl'],
    fontWeight: 'bold',
    color: colors.neutral.gray900,
    marginBottom: spacingValues.xs,
  },
  title: {
    fontSize: fontSizeValues.lg,
    fontWeight: '600',
    color: colors.neutral.gray900,
    marginBottom: spacingValues.xs,
    textAlign: 'center',
  },
  message: {
    fontSize: fontSizeValues.sm,
    color: colors.neutral.gray600,
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
    color: colors.neutral.white,
    fontSize: fontSizeValues.md,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: colors.neutral.gray200,
    paddingHorizontal: spacingValues.xl,
    paddingVertical: spacingValues.sm,
    borderRadius: borderRadiusValues.md,
    minWidth: 200,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.neutral.gray900,
    fontSize: fontSizeValues.md,
    fontWeight: '600',
  },
});
