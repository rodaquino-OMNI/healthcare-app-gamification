import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { ClaimStatus } from '@shared/types/plan.types';
import {
  colors,
  typography,
} from '@design-system/tokens';
import type { Theme } from '@design-system/themes/base.theme';

const { plan } = colors.journeys;
const sp = { xs: 8, sm: 12, md: 16, lg: 20, xl: 24, '2xl': 32 };

/** Timeline step definition */
interface TimelineStep {
  key: string;
  label: string;
}

export interface ClaimStatusTimelineProps {
  /** Current claim status */
  status: ClaimStatus;
  /** Section title text */
  sectionTitle: string;
  /** Formatted date string for completed steps */
  formattedDate: string;
  /** Theme instance for dynamic styles */
  theme: Theme;
}

const TIMELINE_STEPS: TimelineStep[] = [
  { key: 'submitted', label: 'Enviado' },
  { key: 'under_review', label: 'Em Analise' },
  { key: 'approved', label: 'Aprovado' },
  { key: 'paid', label: 'Pago' },
];

function getTimelineProgress(status: ClaimStatus): number {
  switch (status) {
    case 'pending':
      return 1;
    case 'additional_info_required':
      return 1;
    case 'approved':
      return 3;
    case 'denied':
      return 2;
    default:
      return 0;
  }
}

/**
 * Renders a vertical progress timeline showing the current status
 * of a claim through its lifecycle stages.
 */
export const ClaimStatusTimeline: React.FC<ClaimStatusTimelineProps> = ({
  status,
  sectionTitle,
  formattedDate,
  theme,
}) => {
  const styles = createStyles(theme);
  const timelineProgress = getTimelineProgress(status);
  const isDenied = status === 'denied';

  return (
    <View style={styles.timelineCard}>
      <Text style={styles.sectionTitle}>{sectionTitle}</Text>
      {TIMELINE_STEPS.map((step, index) => {
        const isCompleted = index < timelineProgress;
        const isCurrent = index === timelineProgress - 1;
        const isDeniedStep = isDenied && index === 1;
        const isLast = index === TIMELINE_STEPS.length - 1;

        let circleColor: string = colors.gray[30];
        if (isCompleted) circleColor = plan.primary;
        if (isDeniedStep) circleColor = colors.semantic.error;

        return (
          <View key={step.key} style={styles.timelineStep}>
            <View style={styles.timelineLeft}>
              <View
                style={[
                  styles.timelineCircle,
                  { backgroundColor: circleColor },
                  isCurrent && styles.timelineCircleCurrent,
                ]}
              >
                {isCompleted && (
                  <Text style={styles.timelineCheck}>{'\u2713'}</Text>
                )}
              </View>
              {!isLast && (
                <View
                  style={[
                    styles.timelineLine,
                    {
                      backgroundColor:
                        isCompleted && index < timelineProgress - 1
                          ? plan.primary
                          : colors.gray[20],
                    },
                  ]}
                />
              )}
            </View>
            <View style={styles.timelineContent}>
              <Text
                style={[
                  styles.timelineLabel,
                  isCompleted && styles.timelineLabelCompleted,
                  isDeniedStep && styles.timelineLabelDenied,
                ]}
              >
                {isDeniedStep ? 'Negado' : step.label}
              </Text>
              {isCompleted && (
                <Text style={styles.timelineDate}>{formattedDate}</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    timelineCard: {
      backgroundColor: theme.colors.background.default,
      marginHorizontal: sp.md,
      marginBottom: sp.md,
      borderRadius: 8,
      padding: sp.lg,
      shadowColor: colors.neutral.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 1,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      fontFamily: typography.fontFamily.heading,
      color: plan.text,
      marginBottom: sp.md,
    },
    timelineStep: {
      flexDirection: 'row',
      minHeight: 56,
    },
    timelineLeft: {
      alignItems: 'center',
      width: 32,
      marginRight: sp.sm,
    },
    timelineCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    timelineCircleCurrent: {
      borderWidth: 3,
      borderColor: plan.secondary,
    },
    timelineCheck: {
      fontSize: 12,
      color: colors.neutral.white,
      fontWeight: '700' as const,
    },
    timelineLine: {
      width: 2,
      flex: 1,
      marginVertical: 4,
    },
    timelineContent: {
      flex: 1,
      paddingBottom: sp.md,
    },
    timelineLabel: {
      fontSize: 14,
      fontWeight: '500' as const,
      fontFamily: typography.fontFamily.body,
      color: colors.gray[40],
    },
    timelineLabelCompleted: {
      color: plan.text,
      fontWeight: '600' as const,
    },
    timelineLabelDenied: {
      color: colors.semantic.error,
    },
    timelineDate: {
      fontSize: 12,
      fontFamily: typography.fontFamily.body,
      color: colors.gray[40],
      marginTop: 2,
    },
  });
