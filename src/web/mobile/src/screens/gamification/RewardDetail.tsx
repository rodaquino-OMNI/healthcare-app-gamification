import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacingValues } from 'src/web/design-system/src/tokens/spacing';
import { borderRadiusValues } from 'src/web/design-system/src/tokens/borderRadius';
import { sizingValues } from 'src/web/design-system/src/tokens/sizing';
import { Reward } from 'src/web/shared/types/gamification.types';

interface RewardDetailRouteParams { rewardId: string; }

/** Mock reward data matching the RewardCatalog mock data. */
const MOCK_REWARDS: Reward[] = [
  { id: 'r-001', title: 'Priority Scheduling', description: 'Get priority access when booking your next appointment within 30 days.', journey: 'care', icon: '\u{1F4C5}', xp: 500 },
  { id: 'r-002', title: 'Health Report', description: 'Detailed monthly health insights report with personalized analysis of vitals and trends.', journey: 'health', icon: '\u{1F4CA}', xp: 300 },
  { id: 'r-003', title: 'Plan Upgrade', description: 'One month of premium plan features including extended telehealth and priority support.', journey: 'plan', icon: '\u{1F31F}', xp: 1000 },
  { id: 'r-004', title: 'Wellness Kit', description: 'Curated digital wellness pack with meditations, exercise plans, and nutrition guides.', journey: 'health', icon: '\u{1F381}', xp: 750 },
  { id: 'r-005', title: 'Telehealth Credit', description: 'Credit toward your next telemedicine consultation with any AUSTA network specialist.', journey: 'care', icon: '\u{1F4F1}', xp: 600 },
  { id: 'r-006', title: 'Copay Discount', description: 'Percentage discount on your next copayment based on your plan tier.', journey: 'plan', icon: '\u{1F4B0}', xp: 800 },
  { id: 'r-007', title: 'Fitness Badge', description: 'Exclusive digital fitness badge displayed on your profile.', journey: 'health', icon: '\u{1F3C5}', xp: 150 },
  { id: 'r-008', title: 'Care Package', description: 'Personalized care recommendations based on your health history and goals.', journey: 'care', icon: '\u{1F49D}', xp: 400 },
];

const MOCK_USER_XP = 1250;

const REDEMPTION_INSTRUCTION_KEYS: Record<string, string> = {
  health: 'gamification.rewardDetail.instructionsHealth',
  care: 'gamification.rewardDetail.instructionsCare',
  plan: 'gamification.rewardDetail.instructionsPlan',
};

const JOURNEY_COLORS: Record<string, string> = { health: colors.journeys.health.primary, care: colors.journeys.care.primary, plan: colors.journeys.plan.primary };
const getJourneyColor = (journey: string): string => JOURNEY_COLORS[journey] || colors.brand.primary;

/**
 * RewardDetail screen shows full information about a reward,
 * cost comparison with user balance, and a claim action with confirmation.
 */
const RewardDetail: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { rewardId } = route.params as RewardDetailRouteParams;

  const [showTerms, setShowTerms] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const reward = useMemo(
    () => MOCK_REWARDS.find((r) => r.id === rewardId),
    [rewardId],
  );

  const relatedRewards = useMemo(() => {
    if (!reward) return [];
    return MOCK_REWARDS.filter(
      (r) => r.journey === reward.journey && r.id !== reward.id,
    ).slice(0, 4);
  }, [reward]);

  const userXP = MOCK_USER_XP;

  if (!reward) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{t('gamification.rewardDetail.notFound')}</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.errorButton}
            accessibilityLabel={t('common.buttons.back')}
          >
            <Text style={styles.errorButtonText}>{t('common.buttons.back')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const journeyColor = getJourneyColor(reward.journey);
  const canAfford = userXP >= reward.xp;
  const deficit = reward.xp - userXP;
  const redemptionInstructionKey = REDEMPTION_INSTRUCTION_KEYS[reward.journey] || REDEMPTION_INSTRUCTION_KEYS.health;
  const redemptionInstructions = t(redemptionInstructionKey);

  const handleClaim = useCallback(() => {
    setShowConfirmModal(true);
  }, []);

  const handleConfirm = useCallback(() => {
    setShowConfirmModal(false);
    // Mock: show success state
  }, []);

  const handleRelatedPress = useCallback(
    (relatedId: string) => {
      navigation.push('GamificationRewardDetail', { rewardId: relatedId });
    },
    [navigation],
  );

  const renderRelatedItem = ({ item }: { item: Reward }) => {
    const relColor = getJourneyColor(item.journey);
    return (
      <TouchableOpacity
        onPress={() => handleRelatedPress(item.id)}
        style={styles.relatedCard}
        accessibilityLabel={`${item.title}, ${item.xp} XP`}
      >
        <View style={styles.relatedIconContainer}>
          <Text style={styles.relatedIcon}>{item.icon}</Text>
        </View>
        <Text style={styles.relatedTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.relatedXP, { color: relColor }]}>
          {item.xp} XP
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.headerBar, { backgroundColor: journeyColor }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel={t('common.buttons.back')}
        >
          <Text style={styles.backArrow}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('gamification.rewardDetail.screenTitle')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Large Icon */}
        <View style={styles.heroSection}>
          <View style={[styles.iconCircle, { backgroundColor: journeyColor + '20' }]}>
            <Text style={styles.heroIcon}>{reward.icon}</Text>
          </View>
        </View>

        {/* Title and Description */}
        <Text style={styles.rewardTitle}>{reward.title}</Text>
        <Text style={styles.rewardDescription}>{reward.description}</Text>

        {/* Journey Badge */}
        <View style={styles.journeyBadge}>
          <View style={[styles.journeyDot, { backgroundColor: journeyColor }]} />
          <Text style={[styles.journeyLabel, { color: journeyColor }]}>
            {t('gamification.rewardDetail.journeyLabel', { journey: reward.journey.charAt(0).toUpperCase() + reward.journey.slice(1) })}
          </Text>
        </View>

        {/* Cost Section */}
        <View style={styles.costCard}>
          <Text style={styles.costLabel}>{t('gamification.rewardDetail.cost')}</Text>
          <View style={styles.costRow}>
            <Text style={styles.costValue}>{reward.xp} XP</Text>
          </View>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>{t('gamification.rewardDetail.yourBalance')}</Text>
            <Text style={styles.balanceValue}>{userXP.toLocaleString()} XP</Text>
          </View>
          <View style={styles.affordRow}>
            {canAfford ? (
              <>
                <View style={[styles.affordDot, { backgroundColor: colors.semantic.success }]} />
                <Text style={[styles.affordText, { color: colors.semantic.success }]}>
                  {t('gamification.rewardDetail.enoughXP', { remaining: userXP - reward.xp })}
                </Text>
              </>
            ) : (
              <>
                <View style={[styles.affordDot, { backgroundColor: colors.semantic.error }]} />
                <Text style={[styles.affordText, { color: colors.semantic.error }]}>
                  {t('gamification.rewardDetail.needMoreXP', { xp: deficit })}
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Redemption Instructions */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>{t('gamification.rewardDetail.howItWorks')}</Text>
          <Text style={styles.instructionsText}>{redemptionInstructions}</Text>
        </View>

        {/* Terms & Conditions (expandable) */}
        <TouchableOpacity
          onPress={() => setShowTerms(!showTerms)}
          style={styles.termsHeader}
          accessibilityLabel={showTerms ? t('gamification.rewardDetail.collapseTerms') : t('gamification.rewardDetail.expandTerms')}
        >
          <Text style={styles.termsHeaderText}>{t('gamification.rewardDetail.termsAndConditions')}</Text>
          <Text style={styles.termsChevron}>{showTerms ? '\u25B2' : '\u25BC'}</Text>
        </TouchableOpacity>
        {showTerms && (
          <View style={styles.termsContent}>
            <Text style={styles.termsText}>{t('gamification.rewardDetail.termsText')}</Text>
          </View>
        )}

        {/* Claim Button */}
        <TouchableOpacity
          onPress={handleClaim}
          style={[
            styles.claimButton,
            canAfford
              ? { backgroundColor: journeyColor }
              : { backgroundColor: colors.neutral.gray400 },
          ]}
          disabled={!canAfford}
          accessibilityLabel={canAfford ? t('gamification.rewardDetail.claimAccessibility', { title: reward.title, xp: reward.xp }) : t('gamification.rewardDetail.notEnoughXPLabel')}
        >
          <Text style={styles.claimButtonText}>
            {canAfford ? t('gamification.rewardDetail.claimFor', { xp: reward.xp }) : t('gamification.rewardDetail.notEnoughXP')}
          </Text>
        </TouchableOpacity>

        {/* Related Rewards */}
        {relatedRewards.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedSectionTitle}>{t('gamification.rewardDetail.relatedRewards')}</Text>
            <FlatList
              data={relatedRewards}
              keyExtractor={(item) => item.id}
              renderItem={renderRelatedItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedList}
            />
          </View>
        )}
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('gamification.rewardDetail.confirmTitle')}</Text>
            <Text style={styles.modalMessage}>
              {t('gamification.rewardDetail.confirmMessage', { title: reward.title, xp: reward.xp })}
            </Text>
            <View style={styles.modalCostRow}>
              <Text style={styles.modalCostLabel}>{t('gamification.rewardDetail.currentBalance')}</Text>
              <Text style={styles.modalCostValue}>{userXP.toLocaleString()} XP</Text>
            </View>
            <View style={styles.modalCostRow}>
              <Text style={styles.modalCostLabel}>{t('gamification.rewardDetail.afterClaim')}</Text>
              <Text style={[styles.modalCostValue, { color: colors.semantic.success }]}>
                {(userXP - reward.xp).toLocaleString()} XP
              </Text>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setShowConfirmModal(false)}
                style={styles.modalCancelButton}
                accessibilityLabel={t('common.buttons.cancel')}
              >
                <Text style={styles.modalCancelText}>{t('common.buttons.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirm}
                style={[styles.modalConfirmButton, { backgroundColor: journeyColor }]}
                accessibilityLabel={t('gamification.rewardDetail.confirmClaim')}
              >
                <Text style={styles.modalConfirmText}>{t('gamification.rewardDetail.confirm')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const cardBase = { backgroundColor: colors.neutral.white, borderRadius: borderRadiusValues.lg, padding: spacingValues.md, marginBottom: spacingValues.sm, shadowColor: colors.neutral.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 2, elevation: 2 } as const;
const labelBase = { fontSize: 14, fontWeight: '600' as const, color: colors.neutral.gray600, textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: spacingValues.xs };
const btnBase = { flex: 1, borderRadius: borderRadiusValues.md, paddingVertical: spacingValues.sm, alignItems: 'center' as const };

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral.gray100 },
  headerBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacingValues.md, paddingVertical: spacingValues.sm },
  backButton: { width: sizingValues.component.sm, height: sizingValues.component.sm, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 20, color: colors.neutral.white, fontWeight: '600' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: colors.neutral.white, textAlign: 'center' },
  headerSpacer: { width: sizingValues.component.sm },
  scrollView: { flex: 1 },
  scrollContent: { padding: spacingValues.md, paddingBottom: spacingValues['5xl'] },
  heroSection: { alignItems: 'center', marginBottom: spacingValues.md },
  iconCircle: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  heroIcon: { fontSize: 48 },
  rewardTitle: { fontSize: 24, fontWeight: '700', color: colors.neutral.gray800, textAlign: 'center', marginBottom: spacingValues.xs },
  rewardDescription: { fontSize: 15, color: colors.neutral.gray600, textAlign: 'center', lineHeight: 22, marginBottom: spacingValues.sm },
  journeyBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: spacingValues.lg },
  journeyDot: { width: 8, height: 8, borderRadius: 4, marginRight: spacingValues['3xs'] },
  journeyLabel: { fontSize: 14, fontWeight: '500' },
  costCard: { ...cardBase },
  costLabel: { ...labelBase },
  costRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacingValues.xs },
  costValue: { fontSize: 28, fontWeight: '700', color: colors.neutral.gray800 },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacingValues.xs },
  balanceLabel: { fontSize: 14, color: colors.neutral.gray600 },
  balanceValue: { fontSize: 16, fontWeight: '600', color: colors.neutral.gray800 },
  affordRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacingValues['3xs'] },
  affordDot: { width: 8, height: 8, borderRadius: 4, marginRight: spacingValues.xs },
  affordText: { fontSize: 13, fontWeight: '500', flex: 1 },
  card: { ...cardBase },
  cardLabel: { ...labelBase },
  instructionsText: { fontSize: 14, color: colors.neutral.gray700, lineHeight: 21 },
  termsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.neutral.white, borderRadius: borderRadiusValues.lg, padding: spacingValues.md, marginBottom: spacingValues['4xs'] },
  termsHeaderText: { fontSize: 14, fontWeight: '600', color: colors.neutral.gray600 },
  termsChevron: { fontSize: 12, color: colors.neutral.gray500 },
  termsContent: { backgroundColor: colors.neutral.white, borderBottomLeftRadius: borderRadiusValues.lg, borderBottomRightRadius: borderRadiusValues.lg, paddingHorizontal: spacingValues.md, paddingBottom: spacingValues.md, marginBottom: spacingValues.sm },
  termsText: { fontSize: 13, color: colors.neutral.gray500, lineHeight: 20 },
  claimButton: { borderRadius: borderRadiusValues.md, paddingVertical: spacingValues.sm, alignItems: 'center', marginTop: spacingValues.sm, marginBottom: spacingValues.lg },
  claimButtonText: { fontSize: 16, fontWeight: '700', color: colors.neutral.white },
  relatedSection: { marginTop: spacingValues.xs },
  relatedSectionTitle: { fontSize: 16, fontWeight: '600', color: colors.neutral.gray700, marginBottom: spacingValues.sm },
  relatedList: { gap: spacingValues.sm },
  relatedCard: { width: 120, backgroundColor: colors.neutral.white, borderRadius: borderRadiusValues.md, padding: spacingValues.sm, alignItems: 'center', shadowColor: colors.neutral.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 2, elevation: 2 },
  relatedIconContainer: { width: sizingValues.component.lg, height: sizingValues.component.lg, borderRadius: borderRadiusValues.md, backgroundColor: colors.neutral.gray200, alignItems: 'center', justifyContent: 'center', marginBottom: spacingValues.xs },
  relatedIcon: { fontSize: 22 },
  relatedTitle: { fontSize: 12, fontWeight: '500', color: colors.neutral.gray700, textAlign: 'center', marginBottom: spacingValues['4xs'] },
  relatedXP: { fontSize: 12, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: spacingValues['2xl'] },
  modalContent: { backgroundColor: colors.neutral.white, borderRadius: borderRadiusValues.lg, padding: spacingValues.xl, width: '100%' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: colors.neutral.gray800, marginBottom: spacingValues.sm, textAlign: 'center' },
  modalMessage: { fontSize: 14, color: colors.neutral.gray600, lineHeight: 21, marginBottom: spacingValues.md, textAlign: 'center' },
  modalCostRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacingValues.xs },
  modalCostLabel: { fontSize: 14, color: colors.neutral.gray600 },
  modalCostValue: { fontSize: 16, fontWeight: '600', color: colors.neutral.gray800 },
  modalActions: { flexDirection: 'row', gap: spacingValues.sm, marginTop: spacingValues.lg },
  modalCancelButton: { ...btnBase, borderWidth: 1, borderColor: colors.neutral.gray300 },
  modalCancelText: { fontSize: 16, fontWeight: '600', color: colors.neutral.gray700 },
  modalConfirmButton: { ...btnBase },
  modalConfirmText: { fontSize: 16, fontWeight: '700', color: colors.neutral.white },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacingValues['2xl'] },
  errorText: { fontSize: 18, fontWeight: '600', color: colors.neutral.gray700, marginBottom: spacingValues.md },
  errorButton: { backgroundColor: colors.brand.primary, borderRadius: borderRadiusValues.md, paddingVertical: spacingValues.sm, paddingHorizontal: spacingValues['2xl'] },
  errorButtonText: { fontSize: 16, fontWeight: '600', color: colors.neutral.white },
});

export default RewardDetail;
