import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { PlanNavigationProp } from '../../navigation/types';
import { useTranslation } from 'react-i18next';

import { Claim, ClaimStatus } from 'src/web/shared/types/plan.types';
import { useClaims } from 'src/web/mobile/src/hooks/useClaims';

import { formatDate } from 'src/web/shared/utils/format';
import {
  colors,
  typography,
} from '@web/design-system/src/tokens';
import { useTheme } from 'styled-components/native';
import type { Theme } from '@web/design-system/src/themes/base.theme';

import { ClaimStatusTimeline } from './ClaimStatusTimeline';
import { ClaimDocuments } from './ClaimDocuments';

const { plan } = colors.journeys;
const sp = { xs: 8, sm: 12, md: 16, lg: 20, xl: 24, '2xl': 32 };

const STATUS_CONFIG: Record<ClaimStatus, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pendente', bg: colors.semantic.warningBg, text: colors.semantic.warning },
  approved: { label: 'Aprovado', bg: colors.semantic.successBg, text: colors.semantic.success },
  denied: { label: 'Negado', bg: colors.semantic.errorBg, text: colors.semantic.error },
  additional_info_required: { label: 'Info Adicional', bg: colors.semantic.warningBg, text: colors.semantic.warning },
};

const TYPE_LABELS: Record<string, string> = {
  medical: 'Medico',
  dental: 'Odontologico',
  vision: 'Oftalmologico',
  prescription: 'Receita',
  other: 'Outro',
};

/**
 * Renders the Claim Detail screen displaying information about a specific claim.
 */
export const ClaimDetail: React.FC = () => {
  const { t } = useTranslation();
  const route = useRoute<any>();
  const navigation = useNavigation<PlanNavigationProp>();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);

  const claimId = route.params?.claimId;
  const planId = route.params?.planId || '';

  const { claims, isLoading, error } = useClaims(planId);
  const claim = claims?.find((c: Claim) => c.id === claimId);

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={plan.primary} />
        <Text style={styles.loadingText}>{t('journeys.plan.claims.loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{t('journeys.plan.claims.error')}</Text>
      </View>
    );
  }

  if (!claim) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.emptyIcon}>{'\u{1F50D}'}</Text>
        <Text style={styles.errorText}>{t('journeys.plan.claims.notFound')}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('ClaimHistory')}
        >
          <Text style={styles.backButtonText}>{t('journeys.plan.claims.backToHistory')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusConfig = STATUS_CONFIG[claim.status];
  const formattedDate = formatDate(claim.submittedAt, 'dd/MM/yyyy');
  const isDenied = claim.status === 'denied';

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <Text testID="plan-claim-detail-title" style={styles.typeLabel}>{TYPE_LABELS[claim.type] || claim.type}</Text>
          <View testID="plan-claim-detail-status" style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
            <Text style={[styles.statusBadgeText, { color: statusConfig.text }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>
        <Text style={styles.amountValue}>
          R$ {claim.amount.toFixed(2).replace('.', ',')}
        </Text>
        <Text style={styles.dateText}>{t('journeys.plan.claims.submittedOn', { date: formattedDate })}</Text>
      </View>

      {/* Progress Timeline */}
      <ClaimStatusTimeline
        status={claim.status}
        sectionTitle={t('journeys.plan.claims.timeline')}
        formattedDate={formattedDate}
        theme={theme}
      />

      {/* Details Section */}
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>{t('journeys.plan.claims.details')}</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('journeys.plan.claims.type')}</Text>
          <Text style={styles.detailValue}>{TYPE_LABELS[claim.type] || claim.type}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('journeys.plan.claims.amount')}</Text>
          <Text style={styles.detailValue}>R$ {claim.amount.toFixed(2).replace('.', ',')}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('journeys.plan.claims.submissionDate')}</Text>
          <Text style={styles.detailValue}>{formattedDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('journeys.plan.claims.plan')}</Text>
          <Text style={styles.detailValue}>{claim.planId}</Text>
        </View>

        {/* Documents */}
        <ClaimDocuments
          documents={claim.documents}
          sectionTitle={t('journeys.plan.claims.documents')}
          theme={theme}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {isDenied && (
          <TouchableOpacity
            style={styles.appealButton}
            onPress={() => {
              // Appeal action placeholder
            }}
            accessibilityRole="button"
            accessibilityLabel={t('journeys.plan.claims.appeal')}
          >
            <Text style={styles.appealButtonText}>{t('journeys.plan.claims.appeal')}</Text>
          </TouchableOpacity>
        )}
        {claim.status === 'pending' && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              // Cancel claim action placeholder
            }}
            accessibilityRole="button"
            accessibilityLabel={t('journeys.plan.claims.cancel')}
          >
            <Text style={styles.cancelButtonText}>{t('journeys.plan.claims.cancel')}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          testID="plan-claim-detail-back"
          style={styles.backButton}
          onPress={() => navigation.navigate('ClaimHistory')}
          accessibilityRole="button"
          accessibilityLabel={t('journeys.plan.claims.backToHistory')}
        >
          <Text style={styles.backButtonText}>{t('journeys.plan.claims.backToHistory')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: plan.background,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: plan.background,
    padding: sp.xl,
  },
  loadingText: {
    marginTop: sp.md,
    fontSize: 16,
    fontFamily: typography.fontFamily.body,
    color: colors.gray[50],
  },
  errorText: {
    fontSize: 18,
    fontWeight: typography.fontWeight.semiBold as any,
    fontFamily: typography.fontFamily.heading,
    color: colors.semantic.error,
    textAlign: 'center',
    marginBottom: sp.sm,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: sp.md,
  },
  headerCard: {
    backgroundColor: theme.colors.background.default,
    margin: sp.md,
    borderRadius: 8,
    padding: sp.lg,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: sp.sm,
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: typography.fontWeight.medium as any,
    fontFamily: typography.fontFamily.body,
    color: colors.gray[50],
  },
  statusBadge: {
    paddingHorizontal: sp.sm,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: typography.fontWeight.semiBold as any,
    fontFamily: typography.fontFamily.body,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: typography.fontWeight.bold as any,
    fontFamily: typography.fontFamily.heading,
    color: plan.text,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.body,
    color: colors.gray[40],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: typography.fontWeight.semiBold as any,
    fontFamily: typography.fontFamily.heading,
    color: plan.text,
    marginBottom: sp.md,
  },
  detailsCard: {
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: sp.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: typography.fontFamily.body,
    color: colors.gray[50],
  },
  detailValue: {
    fontSize: 14,
    fontWeight: typography.fontWeight.medium as any,
    fontFamily: typography.fontFamily.body,
    color: plan.text,
  },
  actionContainer: {
    paddingHorizontal: sp.md,
    gap: sp.sm,
  },
  appealButton: {
    borderWidth: 2,
    borderColor: plan.primary,
    borderRadius: 8,
    paddingVertical: sp.sm,
    alignItems: 'center',
  },
  appealButtonText: {
    fontSize: 16,
    fontWeight: typography.fontWeight.semiBold as any,
    fontFamily: typography.fontFamily.body,
    color: plan.primary,
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: colors.semantic.error,
    borderRadius: 8,
    paddingVertical: sp.sm,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: typography.fontWeight.semiBold as any,
    fontFamily: typography.fontFamily.body,
    color: colors.semantic.error,
  },
  backButton: {
    backgroundColor: theme.colors.background.subtle,
    borderRadius: 8,
    paddingVertical: sp.sm,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: typography.fontWeight.medium as any,
    fontFamily: typography.fontFamily.body,
    color: colors.gray[60],
  },
  bottomSpacer: { height: sp['2xl'] },
});
