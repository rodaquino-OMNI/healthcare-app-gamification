import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

import { useCoverage } from 'src/web/mobile/src/hooks/useCoverage';
import { JOURNEY_IDS } from 'src/web/shared/constants/journeys';
import { JourneyContext } from 'src/web/mobile/src/context/JourneyContext';
import { Coverage as CoverageType } from 'src/web/shared/types/plan.types';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  sizing,
} from '@web/design-system/src/tokens';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import type { Theme } from '@web/design-system/src/themes/base.theme';

const { plan } = colors.journeys;
const sp = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
};

/**
 * Coverage component displays insurance coverage information for a user's plan
 * within the 'My Plan & Benefits' journey.
 *
 * Addresses requirement F-103-RQ-001: Display detailed insurance coverage information.
 */
const Coverage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);
  const { setJourney } = useContext(JourneyContext);

  useEffect(() => {
    setJourney(JOURNEY_IDS.PLAN);
  }, [setJourney]);

  const route = useRoute<any>();
  const planId = route.params?.planId || '';

  const { coverage, isLoading, error } = useCoverage(planId);

  // Track expanded sections by coverage type
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (type: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={plan.primary} />
        <Text style={styles.loadingText}>
          {t('journeys.plan.coverage.loading')}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {t('journeys.plan.coverage.error')}
        </Text>
        <Text style={styles.errorSubText}>
          {t('common.errors.network')}
        </Text>
      </View>
    );
  }

  if (!coverage || coverage.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {t('journeys.plan.coverage.empty')}
        </Text>
      </View>
    );
  }

  // Group coverage items by type
  const grouped = coverage.reduce<Record<string, CoverageType[]>>((acc, item) => {
    const key = item.type || 'other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const typeLabels: Record<string, string> = {
    medical_visit: 'Consultas Medicas',
    specialist_visit: 'Consultas com Especialistas',
    emergency_care: 'Atendimento de Emergencia',
    preventive_care: 'Cuidados Preventivos',
    prescription_drugs: 'Medicamentos',
    mental_health: 'Saude Mental',
    rehabilitation: 'Reabilitacao',
    durable_medical_equipment: 'Equipamentos Medicos',
    lab_tests: 'Exames Laboratoriais',
    imaging: 'Exames de Imagem',
    other: 'Outros',
  };

  return (
    <ScrollView testID="plan-coverage-back" style={styles.container}>
      <Text testID="plan-coverage-title" style={styles.title}>{t('journeys.plan.coverage.title')}</Text>
      <Text testID="plan-coverage-details" style={styles.subtitle}>
        {t('journeys.plan.coverage.details')}
      </Text>

      {Object.entries(grouped).map(([type, items]) => {
        const isExpanded = expandedSections[type] ?? true;
        return (
          <View key={type} style={styles.sectionCard}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection(type)}
              accessibilityRole="button"
              accessibilityLabel={`${isExpanded ? 'Recolher' : 'Expandir'} ${typeLabels[type] || type}`}
            >
              <View style={styles.sectionHeaderAccent} />
              <Text style={styles.sectionHeaderText}>
                {typeLabels[type] || type}
              </Text>
              <Text style={styles.chevron}>
                {isExpanded ? '\u25B2' : '\u25BC'}
              </Text>
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.sectionContent}>
                {items.map((item) => (
                  <View key={item.id} style={styles.coverageItem}>
                    <Text style={styles.coverageDetails}>{item.details}</Text>
                    {item.limitations && (
                      <View style={styles.limitationRow}>
                        <Text style={styles.limitationLabel}>{t('journeys.plan.coverage.limitations')}:</Text>
                        <Text style={styles.limitationValue}>{item.limitations}</Text>
                      </View>
                    )}
                    {item.coPayment !== undefined && item.coPayment !== null && (
                      <View style={styles.copayRow}>
                        <Text style={styles.copayLabel}>{t('journeys.plan.coverage.copayment')}:</Text>
                        <Text style={styles.copayValue}>
                          R$ {item.coPayment.toFixed(2)}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: sp.md,
    backgroundColor: plan.background,
  },
  title: {
    fontSize: 24,
    fontWeight: typography.fontWeight.bold as any,
    fontFamily: typography.fontFamily.heading,
    color: plan.primary,
    marginBottom: sp.xs,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: typography.fontWeight.regular as any,
    fontFamily: typography.fontFamily.body,
    color: colors.neutral.gray700,
    marginBottom: sp.xl,
    lineHeight: 22,
  },
  sectionCard: {
    backgroundColor: theme.colors.background.default,
    borderRadius: 8,
    marginBottom: sp.md,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: sp.sm,
    paddingHorizontal: sp.md,
  },
  sectionHeaderAccent: {
    width: 4,
    height: 24,
    backgroundColor: plan.primary,
    borderRadius: 2,
    marginRight: sp.sm,
  },
  sectionHeaderText: {
    flex: 1,
    fontSize: 18,
    fontWeight: typography.fontWeight.semiBold as any,
    fontFamily: typography.fontFamily.heading,
    color: plan.text,
  },
  chevron: {
    fontSize: 12,
    color: colors.gray[50],
    marginLeft: sp.xs,
  },
  sectionContent: {
    paddingHorizontal: sp.md,
    paddingBottom: sp.md,
  },
  coverageItem: {
    paddingVertical: sp.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
  },
  coverageDetails: {
    fontSize: 14,
    fontWeight: typography.fontWeight.regular as any,
    fontFamily: typography.fontFamily.body,
    color: plan.text,
    lineHeight: 20,
    marginBottom: sp.xs,
  },
  limitationRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  limitationLabel: {
    fontSize: 12,
    fontWeight: typography.fontWeight.medium as any,
    color: colors.gray[50],
    marginRight: 4,
  },
  limitationValue: {
    fontSize: 12,
    fontWeight: typography.fontWeight.regular as any,
    color: colors.gray[50],
    flex: 1,
  },
  copayRow: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
  },
  copayLabel: {
    fontSize: 12,
    fontWeight: typography.fontWeight.medium as any,
    color: colors.gray[50],
    marginRight: 4,
  },
  copayValue: {
    fontSize: 14,
    fontWeight: typography.fontWeight.semiBold as any,
    color: plan.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
    backgroundColor: plan.background,
  },
  loadingText: {
    marginTop: sp.md,
    fontSize: 16,
    fontFamily: typography.fontFamily.body,
    color: colors.gray[50],
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
    padding: sp.xl,
    backgroundColor: plan.background,
  },
  errorText: {
    fontSize: 18,
    fontWeight: typography.fontWeight.bold as any,
    fontFamily: typography.fontFamily.heading,
    color: colors.semantic.error,
    textAlign: 'center',
    marginBottom: sp.xs,
  },
  errorSubText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.body,
    color: colors.gray[50],
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
    padding: sp.xl,
    backgroundColor: plan.background,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.body,
    color: colors.gray[50],
    textAlign: 'center',
  },
  bottomSpacer: {
    height: sp['2xl'],
  },
});

export default Coverage;
