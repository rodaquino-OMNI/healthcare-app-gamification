import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Claim, ClaimStatus, ClaimType } from 'src/web/shared/types/plan.types';
import { useJourney } from 'src/web/mobile/src/hooks/useJourney';
import { MOBILE_PLAN_ROUTES } from 'src/web/shared/constants/routes';
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from '@web/design-system/src/tokens';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import type { Theme } from '@web/design-system/src/themes/base.theme';

const { plan } = colors.journeys;
const sp = { xs: 8, sm: 12, md: 16, lg: 20, xl: 24, '2xl': 32 };

type FilterTab = 'all' | ClaimStatus;

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'pending', label: 'Pendentes' },
  { key: 'approved', label: 'Aprovados' },
  { key: 'denied', label: 'Negados' },
];

const CLAIM_TYPE_LABELS: Record<ClaimType, string> = {
  medical: 'Medico',
  dental: 'Odontologico',
  vision: 'Oftalmologico',
  prescription: 'Receita',
  other: 'Outro',
};

const STATUS_COLORS: Record<ClaimStatus, { bg: string; text: string }> = {
  pending: { bg: colors.semantic.warningBg, text: colors.semantic.warning },
  approved: { bg: colors.semantic.successBg, text: colors.semantic.success },
  denied: { bg: colors.semantic.errorBg, text: colors.semantic.error },
  additional_info_required: { bg: colors.semantic.warningBg, text: colors.semantic.warning },
};

const STATUS_LABELS: Record<ClaimStatus, string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  denied: 'Negado',
  additional_info_required: 'Info Adicional',
};

const CLAIM_TYPE_ICONS: Record<ClaimType, string> = {
  medical: '\u2695',
  dental: '\u{1F9B7}',
  vision: '\u{1F441}',
  prescription: '\u{1F48A}',
  other: '\u{1F4C4}',
};

// Mock claims data with proper typing
const MOCK_CLAIMS: Claim[] = [
  {
    id: '1',
    planId: 'plan-001',
    type: 'medical',
    amount: 250.0,
    status: 'approved',
    submittedAt: '2025-12-15',
    documents: [],
  },
  {
    id: '2',
    planId: 'plan-001',
    type: 'dental',
    amount: 180.0,
    status: 'pending',
    submittedAt: '2026-01-10',
    documents: [],
  },
  {
    id: '3',
    planId: 'plan-001',
    type: 'vision',
    amount: 420.0,
    status: 'denied',
    submittedAt: '2026-01-22',
    documents: [],
  },
  {
    id: '4',
    planId: 'plan-001',
    type: 'prescription',
    amount: 95.5,
    status: 'approved',
    submittedAt: '2026-02-01',
    documents: [],
  },
  {
    id: '5',
    planId: 'plan-001',
    type: 'medical',
    amount: 1200.0,
    status: 'pending',
    submittedAt: '2026-02-10',
    documents: [],
  },
];

/**
 * Renders the claim history screen with filter tabs, claim list, and submit button.
 */
const ClaimHistory: React.FC = () => {
  const { t } = useTranslation();
  const { journey } = useJourney();
  const navigation = useNavigation<any>();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  // In a real app, replace with API call: const { claims, isLoading, error } = useClaims(planId);
  const claims = MOCK_CLAIMS;
  const isLoading = false;
  const error: Error | null = null;

  const filteredClaims = useMemo(() => {
    if (activeFilter === 'all') return claims;
    return claims.filter((c) => c.status === activeFilter);
  }, [claims, activeFilter]);

  const formatDate = (dateStr: string): string => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatCurrency = (amount: number): string => {
    return `R$ ${amount.toFixed(2).replace('.', ',')}`;
  };

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
        <Text style={styles.errorSubText}>{error.message}</Text>
      </View>
    );
  }

  const renderClaimItem = ({ item }: { item: Claim }) => {
    const statusStyle = STATUS_COLORS[item.status];
    return (
      <TouchableOpacity
        style={styles.claimCard}
        onPress={() => navigation.navigate(MOBILE_PLAN_ROUTES.CLAIMS, { claimId: item.id })}
        accessibilityRole="button"
        accessibilityLabel={`Solicitacao ${CLAIM_TYPE_LABELS[item.type]}, ${formatCurrency(item.amount)}, ${STATUS_LABELS[item.status]}`}
      >
        <View style={styles.claimCardRow}>
          <View style={styles.claimIconContainer}>
            <Text style={styles.claimIcon}>{CLAIM_TYPE_ICONS[item.type]}</Text>
          </View>
          <View style={styles.claimInfo}>
            <Text style={styles.claimType}>{CLAIM_TYPE_LABELS[item.type]}</Text>
            <Text style={styles.claimDate}>{formatDate(item.submittedAt)}</Text>
          </View>
          <View style={styles.claimRight}>
            <Text style={styles.claimAmount}>{formatCurrency(item.amount)}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>
                {STATUS_LABELS[item.status]}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>{'\u{1F4CB}'}</Text>
      <Text style={styles.emptyTitle}>{t('journeys.plan.claims.empty')}</Text>
      <Text style={styles.emptySubtitle}>
        {activeFilter === 'all'
          ? t('journeys.plan.claims.emptyHint')
          : t('journeys.plan.claims.emptyFiltered', { status: STATUS_LABELS[activeFilter as ClaimStatus] })}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.filterTab, isActive && styles.filterTabActive]}
              onPress={() => setActiveFilter(tab.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Claims List */}
      <FlatList
        data={filteredClaims}
        keyExtractor={(item) => item.id}
        renderItem={renderClaimItem}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Submit New Claim FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate(MOBILE_PLAN_ROUTES.CLAIM_SUBMISSION)}
        accessibilityRole="button"
        accessibilityLabel={t('journeys.plan.claims.newClaim')}
      >
        <Text style={styles.fabIcon}>+</Text>
        <Text style={styles.fabText}>{t('journeys.plan.claims.newClaim')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.journeys.plan.background,
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
    fontWeight: typography.fontWeight.bold as any,
    fontFamily: typography.fontFamily.heading,
    color: colors.semantic.error,
    textAlign: 'center',
    marginBottom: sp.xs,
  },
  errorSubText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.body,
    color: colors.gray[50],
    textAlign: 'center',
  },
  // Filter tabs
  filterContainer: {
    maxHeight: 56,
    paddingVertical: sp.sm,
    backgroundColor: plan.background,
  },
  filterContent: {
    paddingHorizontal: sp.md,
    gap: sp.xs,
  },
  filterTab: {
    paddingHorizontal: sp.md,
    paddingVertical: sp.xs,
    borderRadius: 9999,
    backgroundColor: theme.colors.background.default,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    marginRight: sp.xs,
  },
  filterTabActive: {
    backgroundColor: plan.primary,
    borderColor: plan.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: typography.fontWeight.medium as any,
    fontFamily: typography.fontFamily.body,
    color: colors.gray[50],
  },
  filterTabTextActive: {
    color: colors.neutral.white,
  },
  // List
  listContent: {
    paddingHorizontal: sp.md,
    paddingBottom: 80,
  },
  // Claim card
  claimCard: {
    backgroundColor: theme.colors.background.default,
    borderRadius: 8,
    padding: sp.md,
    marginBottom: sp.sm,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  claimCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  claimIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: plan.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: sp.sm,
  },
  claimIcon: {
    fontSize: 20,
  },
  claimInfo: {
    flex: 1,
  },
  claimType: {
    fontSize: 16,
    fontWeight: typography.fontWeight.semiBold as any,
    fontFamily: typography.fontFamily.body,
    color: plan.text,
  },
  claimDate: {
    fontSize: 12,
    fontFamily: typography.fontFamily.body,
    color: colors.gray[40],
    marginTop: 2,
  },
  claimRight: {
    alignItems: 'flex-end',
  },
  claimAmount: {
    fontSize: 16,
    fontWeight: typography.fontWeight.bold as any,
    fontFamily: typography.fontFamily.body,
    color: plan.text,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: sp.xs,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: typography.fontWeight.semiBold as any,
    fontFamily: typography.fontFamily.body,
  },
  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: sp['2xl'] * 2,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: sp.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: typography.fontWeight.semiBold as any,
    fontFamily: typography.fontFamily.heading,
    color: plan.text,
    marginBottom: sp.xs,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.body,
    color: colors.gray[50],
    textAlign: 'center',
    paddingHorizontal: sp['2xl'],
  },
  // FAB
  fab: {
    position: 'absolute',
    bottom: sp.xl,
    left: sp.md,
    right: sp.md,
    backgroundColor: plan.primary,
    borderRadius: 8,
    paddingVertical: sp.sm,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: plan.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  fabIcon: {
    fontSize: 20,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.neutral.white,
    marginRight: sp.xs,
  },
  fabText: {
    fontSize: 16,
    fontWeight: typography.fontWeight.semiBold as any,
    fontFamily: typography.fontFamily.body,
    color: colors.neutral.white,
  },
});

export default ClaimHistory;
