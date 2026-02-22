import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { EmptyState } from '@web/mobile/src/components/shared/EmptyState';
import { LoadingIndicator } from '@web/mobile/src/components/shared/LoadingIndicator';
import { useClaims } from '@web/mobile/src/hooks/useClaims';
import { useCoverage } from '@web/mobile/src/hooks/useCoverage';
import { useAuth } from '@web/mobile/src/hooks/useAuth';
import { JourneyHeader } from '@web/mobile/src/components/shared/JourneyHeader';
import { colors } from '@web/design-system/src/tokens/colors';
import { spacingValues } from '@web/design-system/src/tokens/spacing';
import { fontSizeValues } from '@web/design-system/src/tokens/typography';
import { borderRadiusValues } from '@web/design-system/src/tokens/borderRadius';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import type { Theme } from '@web/design-system/src/themes/base.theme';

/**
 * Renders the main dashboard screen for the Plan journey, fetching and
 * displaying key information related to the user's insurance plan and benefits.
 */
const PlanDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);

  const { session, getUserFromToken } = useAuth();

  const decodedToken = session ? getUserFromToken(session.accessToken) : null;
  const userId = decodedToken?.id || decodedToken?.sub;

  const planId = 'plan-123';

  const { coverage, isLoading: isCoverageLoading, error: coverageError } = useCoverage(planId);
  const { claims, isLoading: isClaimsLoading, error: claimsError } = useClaims(planId);

  const [insuranceCardData] = React.useState({
    plan: {
      id: 'plan-123',
      name: 'AUSTA Care Plan',
      type: 'HMO',
      planNumber: 'AXC12345',
      validityStart: '2023-01-01',
      validityEnd: '2023-12-31',
    },
    user: {
      id: 'user-123',
      name: 'Maria Silva',
      cpf: '123.456.789-00',
    },
  });

  const handleClaimPress = (claimId: string) => {
    navigation.navigate('ClaimDetails' as never, { claimId } as never);
  };

  const handleCoveragePress = (coverageId: string) => {
    navigation.navigate('CoverageDetails' as never, { coverageId } as never);
  };

  const handleShareCard = () => {
    console.log('Share card pressed');
  };

  const handleNewClaim = () => {
    navigation.navigate('ClaimSubmission' as never);
  };

  const handleTrackClaim = (claimId: string) => {
    navigation.navigate('ClaimTracking' as never, { claimId } as never);
  };

  const handleViewClaimDetails = (claimId: string) => {
    navigation.navigate('ClaimDetails' as never, { claimId } as never);
  };

  useEffect(() => {
    if (coverageError) {
      console.error('Error fetching coverage:', coverageError);
    }
    if (claimsError) {
      console.error('Error fetching claims:', claimsError);
    }
  }, [coverageError, claimsError]);

  const totalClaims = claims?.length ?? 0;
  const activeBenefits = coverage?.length ?? 0;
  const coveragePercent = coverage && coverage.length > 0 ? 80 : 0;

  return (
    <View style={styles.container}>
      <JourneyHeader title={t('journeys.plan.title')} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Insurance Card (RN-native, replaces web-only InsuranceCard) */}
        <View style={styles.insuranceCard}>
          <View style={styles.insuranceCardHeader}>
            <Text style={styles.insuranceCardPlanName}>
              {insuranceCardData.plan.name}
            </Text>
            <View style={styles.insuranceCardTypeBadge}>
              <Text style={styles.insuranceCardTypeText}>
                {insuranceCardData.plan.type}
              </Text>
            </View>
          </View>
          <View style={styles.insuranceCardBody}>
            <Text style={styles.insuranceCardLabel}>{t('journeys.plan.digitalCard.holder')}</Text>
            <Text style={styles.insuranceCardValue}>
              {insuranceCardData.user.name}
            </Text>
            <View style={styles.insuranceCardRow}>
              <View style={styles.insuranceCardCol}>
                <Text style={styles.insuranceCardLabel}>{t('journeys.plan.digitalCard.cpf')}</Text>
                <Text style={styles.insuranceCardValue}>
                  {insuranceCardData.user.cpf}
                </Text>
              </View>
              <View style={styles.insuranceCardCol}>
                <Text style={styles.insuranceCardLabel}>{t('journeys.plan.digitalCard.planNumber')}</Text>
                <Text style={styles.insuranceCardValue}>
                  {insuranceCardData.plan.planNumber}
                </Text>
              </View>
            </View>
            <View style={styles.insuranceCardRow}>
              <View style={styles.insuranceCardCol}>
                <Text style={styles.insuranceCardLabel}>{t('journeys.plan.digitalCard.startDate')}</Text>
                <Text style={styles.insuranceCardValue}>
                  {insuranceCardData.plan.validityStart}
                </Text>
              </View>
              <View style={styles.insuranceCardCol}>
                <Text style={styles.insuranceCardLabel}>{t('journeys.plan.digitalCard.validity')}</Text>
                <Text style={styles.insuranceCardValue}>
                  {insuranceCardData.plan.validityEnd}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShareCard}
            accessibilityLabel="Compartilhar carteirinha"
          >
            <Text style={styles.shareButtonText}>{t('journeys.plan.digitalCard.share')}</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalClaims}</Text>
            <Text style={styles.statLabel}>{t('journeys.plan.claims.title')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{activeBenefits}</Text>
            <Text style={styles.statLabel}>{t('journeys.plan.benefits.title')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{coveragePercent}%</Text>
            <Text style={styles.statLabel}>{t('journeys.plan.coverage.title')}</Text>
          </View>
        </View>

        {/* Coverage Information */}
        <Text style={styles.sectionTitle}>{t('journeys.plan.coverage.title')}</Text>
        {isCoverageLoading ? (
          <LoadingIndicator label={t('journeys.plan.coverage.loading')} />
        ) : coverageError ? (
          <EmptyState
            icon="error"
            title={t('journeys.plan.coverage.error')}
            description={t('common.errors.network')}
          />
        ) : coverage && coverage.length > 0 ? (
          coverage.map((item: any) => (
            <TouchableOpacity
              key={item.id}
              style={styles.coverageItem}
              onPress={() => handleCoveragePress(item.id)}
              accessibilityLabel={`Cobertura: ${item.name || item.id}`}
            >
              <View style={styles.coverageItemLeft}>
                <Text style={styles.coverageItemName}>
                  {item.name || item.type || 'Cobertura'}
                </Text>
                {item.description && (
                  <Text style={styles.coverageItemDesc}>
                    {item.description}
                  </Text>
                )}
              </View>
              <Text style={styles.chevron}>{'>'}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <EmptyState
            icon="document"
            title={t('journeys.plan.coverage.empty')}
            description={t('journeys.plan.coverage.emptyHint')}
          />
        )}

        {/* Claims */}
        <Text style={styles.sectionTitle}>{t('journeys.plan.claims.title')}</Text>
        {isClaimsLoading ? (
          <LoadingIndicator label={t('journeys.plan.claims.loading')} />
        ) : claimsError ? (
          <EmptyState
            icon="error"
            title={t('journeys.plan.claims.error')}
            description={t('common.errors.network')}
          />
        ) : claims && claims.length > 0 ? (
          claims.map((claim: any) => (
            <TouchableOpacity
              key={claim.id}
              style={styles.claimItem}
              onPress={() => handleClaimPress(claim.id)}
              accessibilityLabel={`Solicitacao: ${claim.id}`}
            >
              <View style={styles.claimItemHeader}>
                <Text style={styles.claimItemTitle}>
                  {claim.type || 'Solicitacao'}
                </Text>
                <View
                  style={[
                    styles.claimStatusBadge,
                    claim.status === 'approved' && styles.claimStatusApproved,
                    claim.status === 'pending' && styles.claimStatusPending,
                    claim.status === 'denied' && styles.claimStatusDenied,
                  ]}
                >
                  <Text style={styles.claimStatusText}>
                    {claim.status || 'pendente'}
                  </Text>
                </View>
              </View>
              {claim.amount !== undefined && (
                <Text style={styles.claimAmount}>
                  R$ {Number(claim.amount).toFixed(2)}
                </Text>
              )}
              <View style={styles.claimActions}>
                <TouchableOpacity
                  onPress={() => handleViewClaimDetails(claim.id)}
                  style={styles.claimActionBtn}
                >
                  <Text style={styles.claimActionText}>{t('journeys.plan.claims.details')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleTrackClaim(claim.id)}
                  style={styles.claimActionBtn}
                >
                  <Text style={styles.claimActionText}>{t('journeys.plan.claims.track')}</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <EmptyState
            icon="document"
            title={t('journeys.plan.claims.empty')}
            description={t('journeys.plan.claims.emptyHint')}
            actionLabel={t('journeys.plan.claims.newClaim')}
            onAction={handleNewClaim}
          />
        )}
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.journeys.plan.background,
  },
  scrollContent: {
    padding: spacingValues.md,
    gap: spacingValues.md,
  },

  /* Insurance Card */
  insuranceCard: {
    backgroundColor: theme.colors.background.default,
    borderRadius: borderRadiusValues.lg,
    overflow: 'hidden',
    shadowColor: colors.neutral.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  insuranceCardHeader: {
    backgroundColor: colors.journeys.plan.primary,
    paddingVertical: spacingValues.md,
    paddingHorizontal: spacingValues.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insuranceCardPlanName: {
    color: colors.neutral.white,
    fontSize: fontSizeValues.lg,
    fontWeight: String(700) as any,
    flex: 1,
  },
  insuranceCardTypeBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingVertical: spacingValues['3xs'],
    paddingHorizontal: spacingValues.xs,
    borderRadius: borderRadiusValues.full,
  },
  insuranceCardTypeText: {
    color: colors.neutral.white,
    fontSize: fontSizeValues.xs,
    fontWeight: String(600) as any,
  },
  insuranceCardBody: {
    padding: spacingValues.md,
  },
  insuranceCardRow: {
    flexDirection: 'row',
    marginTop: spacingValues.xs,
  },
  insuranceCardCol: {
    flex: 1,
  },
  insuranceCardLabel: {
    fontSize: fontSizeValues.xs,
    fontWeight: String(500) as any,
    color: colors.gray[40],
    marginBottom: spacingValues['4xs'],
  },
  insuranceCardValue: {
    fontSize: fontSizeValues.sm,
    fontWeight: String(600) as any,
    color: colors.journeys.plan.text,
  },
  shareButton: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
    paddingVertical: spacingValues.sm,
    alignItems: 'center',
  },
  shareButtonText: {
    color: colors.journeys.plan.primary,
    fontSize: fontSizeValues.sm,
    fontWeight: String(600) as any,
  },

  /* Stats Row */
  statsRow: {
    flexDirection: 'row',
    gap: spacingValues.xs,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
    borderRadius: borderRadiusValues.md,
    padding: spacingValues.sm,
    alignItems: 'center',
    shadowColor: colors.neutral.black,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  statValue: {
    fontSize: fontSizeValues.xl,
    fontWeight: String(700) as any,
    color: colors.journeys.plan.primary,
  },
  statLabel: {
    fontSize: fontSizeValues.xs,
    fontWeight: String(500) as any,
    color: colors.gray[50],
    marginTop: spacingValues['4xs'],
  },

  /* Section Title */
  sectionTitle: {
    fontSize: fontSizeValues.lg,
    fontWeight: String(700) as any,
    color: colors.journeys.plan.text,
    marginTop: spacingValues.xs,
  },

  /* Coverage Items */
  coverageItem: {
    backgroundColor: theme.colors.background.default,
    borderRadius: borderRadiusValues.md,
    padding: spacingValues.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.neutral.black,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  coverageItemLeft: {
    flex: 1,
  },
  coverageItemName: {
    fontSize: fontSizeValues.md,
    fontWeight: String(600) as any,
    color: colors.journeys.plan.text,
  },
  coverageItemDesc: {
    fontSize: fontSizeValues.sm,
    color: colors.gray[50],
    marginTop: spacingValues['4xs'],
  },
  chevron: {
    fontSize: fontSizeValues.lg,
    color: colors.gray[30],
    marginLeft: spacingValues.xs,
  },

  /* Claim Items */
  claimItem: {
    backgroundColor: theme.colors.background.default,
    borderRadius: borderRadiusValues.md,
    padding: spacingValues.md,
    shadowColor: colors.neutral.black,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  claimItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  claimItemTitle: {
    fontSize: fontSizeValues.md,
    fontWeight: String(600) as any,
    color: colors.journeys.plan.text,
  },
  claimStatusBadge: {
    paddingVertical: spacingValues['4xs'],
    paddingHorizontal: spacingValues.xs,
    borderRadius: borderRadiusValues.full,
    backgroundColor: theme.colors.background.subtle,
  },
  claimStatusApproved: {
    backgroundColor: colors.semantic.successBg,
  },
  claimStatusPending: {
    backgroundColor: colors.semantic.warningBg,
  },
  claimStatusDenied: {
    backgroundColor: colors.semantic.errorBg,
  },
  claimStatusText: {
    fontSize: fontSizeValues.xs,
    fontWeight: String(600) as any,
    color: colors.gray[60],
    textTransform: 'capitalize',
  },
  claimAmount: {
    fontSize: fontSizeValues.lg,
    fontWeight: String(700) as any,
    color: colors.journeys.plan.primary,
    marginTop: spacingValues.xs,
  },
  claimActions: {
    flexDirection: 'row',
    gap: spacingValues.sm,
    marginTop: spacingValues.sm,
  },
  claimActionBtn: {
    paddingVertical: spacingValues['3xs'],
    paddingHorizontal: spacingValues.sm,
    borderRadius: borderRadiusValues.sm,
    borderWidth: 1,
    borderColor: colors.journeys.plan.primary,
  },
  claimActionText: {
    fontSize: fontSizeValues.sm,
    fontWeight: String(600) as any,
    color: colors.journeys.plan.primary,
  },
});

export default PlanDashboard;
