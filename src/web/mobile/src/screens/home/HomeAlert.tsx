import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../../../../design-system/src/tokens/colors';
import { spacingValues } from '../../../../design-system/src/tokens/spacing';
import { fontSizeValues } from '../../../../design-system/src/tokens/typography';
import { borderRadiusValues } from '../../../../design-system/src/tokens/borderRadius';

/**
 * Severity level for health alerts.
 */
type AlertSeverity = 'critical' | 'warning' | 'info';

/**
 * Shape of a single health alert item.
 */
interface HealthAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  action: string;
}

/**
 * Mock alert data representing health warnings and notifications.
 */
const MOCK_ALERTS: HealthAlert[] = [
  {
    id: '1',
    severity: 'warning',
    title: 'Pressao arterial elevada',
    description:
      'Sua pressao arterial esta acima do normal nas ultimas 3 medicoes.',
    action: 'HEALTH_METRIC_DETAIL',
  },
  {
    id: '2',
    severity: 'info',
    title: 'Meta diaria de passos',
    description:
      'Voce esta a 1.568 passos de completar sua meta diaria.',
    action: 'HEALTH_DASHBOARD',
  },
  {
    id: '3',
    severity: 'critical',
    title: 'Medicamento pendente',
    description:
      'Voce nao registrou a tomada do medicamento de hoje.',
    action: 'CARE_MEDICATION_TRACKING',
  },
];

/**
 * Returns the background color for a given alert severity level.
 */
const getSeverityColor = (severity: AlertSeverity): string => {
  switch (severity) {
    case 'critical':
      return colors.semantic.error;
    case 'warning':
      return colors.semantic.warning;
    case 'info':
      return colors.semantic.info;
    default:
      return colors.semantic.info;
  }
};

/**
 * Returns a human-readable label for a given severity level.
 */
const getSeverityLabel = (severity: AlertSeverity): string => {
  switch (severity) {
    case 'critical':
      return 'Critico';
    case 'warning':
      return 'Atencao';
    case 'info':
      return 'Info';
    default:
      return 'Info';
  }
};

/**
 * Screen component that displays a list of health alerts.
 * Users can dismiss individual alerts and navigate to related screens.
 */
export const HomeAlertScreen: React.FC = () => {
  const navigation = useNavigation();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const handleDismiss = useCallback((id: string) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const handleAction = useCallback(
    (action: string) => {
      navigation.navigate(action as never);
    },
    [navigation],
  );

  const visibleAlerts = MOCK_ALERTS.filter(
    (alert) => !dismissed.has(alert.id),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          style={styles.backButton}
        >
          <Text style={styles.backText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alertas de Saude</Text>
        <View style={styles.headerSpacer} />
      </View>

      {visibleAlerts.length === 0 ? (
        /* Empty state */
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum alerta ativo</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {visibleAlerts.map((alert) => (
            <View key={alert.id} style={styles.alertCard}>
              {/* Severity badge + dismiss button row */}
              <View style={styles.alertTopRow}>
                <View
                  style={[
                    styles.severityBadge,
                    { backgroundColor: getSeverityColor(alert.severity) },
                  ]}
                >
                  <Text style={styles.severityText}>
                    {getSeverityLabel(alert.severity)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDismiss(alert.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Dispensar alerta: ${alert.title}`}
                  style={styles.dismissButton}
                >
                  <Text style={styles.dismissText}>X</Text>
                </TouchableOpacity>
              </View>

              {/* Title and description */}
              <Text style={styles.alertTitle}>{alert.title}</Text>
              <Text style={styles.alertDescription}>{alert.description}</Text>

              {/* Action button */}
              <TouchableOpacity
                onPress={() => handleAction(alert.action)}
                accessibilityRole="button"
                accessibilityLabel={`Ver detalhes de ${alert.title}`}
                style={styles.actionButton}
              >
                <Text style={styles.actionText}>Ver detalhes</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[20],
  },
  backButton: {
    width: spacingValues['2xl'],
    height: spacingValues['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: fontSizeValues.xl,
    fontWeight: '600',
    color: colors.neutral.gray900,
  },
  headerTitle: {
    flex: 1,
    fontSize: fontSizeValues.lg,
    fontWeight: '700',
    color: colors.neutral.gray900,
    textAlign: 'center',
  },
  headerSpacer: {
    width: spacingValues['2xl'],
  },
  scrollContent: {
    padding: spacingValues.md,
    paddingBottom: spacingValues['3xl'],
  },
  alertCard: {
    backgroundColor: colors.gray[5],
    borderRadius: borderRadiusValues.md,
    padding: spacingValues.md,
    marginBottom: spacingValues.sm,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  alertTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingValues.xs,
  },
  severityBadge: {
    paddingHorizontal: spacingValues.xs,
    paddingVertical: spacingValues['3xs'],
    borderRadius: borderRadiusValues.xs,
  },
  severityText: {
    fontSize: fontSizeValues.xs,
    fontWeight: '700',
    color: colors.neutral.white,
  },
  dismissButton: {
    width: spacingValues.xl,
    height: spacingValues.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadiusValues.full,
    backgroundColor: colors.gray[20],
  },
  dismissText: {
    fontSize: fontSizeValues.xs,
    fontWeight: '700',
    color: colors.gray[50],
  },
  alertTitle: {
    fontSize: fontSizeValues.md,
    fontWeight: '600',
    color: colors.neutral.gray900,
    marginBottom: spacingValues['3xs'],
  },
  alertDescription: {
    fontSize: fontSizeValues.sm,
    color: colors.gray[50],
    lineHeight: fontSizeValues.sm * 1.5,
    marginBottom: spacingValues.sm,
  },
  actionButton: {
    alignSelf: 'flex-start',
  },
  actionText: {
    fontSize: fontSizeValues.sm,
    fontWeight: '600',
    color: colors.journeys.health.primary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacingValues['4xl'],
  },
  emptyText: {
    fontSize: fontSizeValues.md,
    color: colors.gray[50],
  },
});

export default HomeAlertScreen;
