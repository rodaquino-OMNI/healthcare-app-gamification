import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/web/mobile/src/hooks/useAuth';
import { getDigitalCard } from 'src/web/mobile/src/api/plan';
import { colors } from '@web/design-system/src/tokens/colors';
import { spacingValues } from '@web/design-system/src/tokens/spacing';
import { fontSizeValues } from '@web/design-system/src/tokens/typography';
import { borderRadiusValues } from '@web/design-system/src/tokens/borderRadius';

/**
 * Type definition for the route parameters.
 */
type RootStackParamList = {
  DigitalCard: { planId: string };
};

type DigitalCardScreenRouteProp = RouteProp<RootStackParamList, 'DigitalCard'>;

/**
 * Shape of the card data returned from the API.
 */
interface CardData {
  cardImageUrl: string;
  cardData: {
    planName?: string;
    planType?: string;
    memberName?: string;
    cpf?: string;
    planNumber?: string;
    validityStart?: string;
    validityEnd?: string;
  };
}

/**
 * Renders the Digital Insurance Card screen, displaying the user's insurance
 * card with plan details and action buttons for sharing and saving.
 */
export const DigitalCardScreen: React.FC = () => {
  const { t } = useTranslation();
  const { params } = useRoute<DigitalCardScreenRouteProp>();
  const { planId } = params;
  const { isAuthenticated } = useAuth();

  const [cardData, setCardData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isAuthenticated && planId) {
      setLoading(true);
      getDigitalCard(planId)
        .then((data: any) => setCardData(data))
        .catch((error: Error) =>
          console.error('Failed to load digital card:', error),
        )
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, planId]);

  const handleShareCard = async () => {
    try {
      await Share.share({
        message: `Carteirinha Digital - Plano: ${
          cardData?.cardData?.planName ?? planId
        }`,
      });
    } catch (err) {
      console.error('Error sharing card:', err);
    }
  };

  const handleSaveToWallet = () => {
    console.log('Save to wallet pressed');
  };

  if (loading) {
    return (
      <View style={styles.screen}>
        <View style={styles.centered}>
          <ActivityIndicator
            size="large"
            color={colors.journeys.plan.primary}
          />
          <Text style={styles.loadingText}>
            {t('journeys.plan.digitalCard.loading')}
          </Text>
        </View>
      </View>
    );
  }

  const card = cardData?.cardData ?? {};

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Card Container */}
      <View style={styles.cardContainer}>
        {/* Blue Header */}
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderTop}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>AUSTA</Text>
            </View>
            <View style={styles.planTypeBadge}>
              <Text style={styles.planTypeText}>
                {card.planType ?? 'HMO'}
              </Text>
            </View>
          </View>
          <Text style={styles.planName}>
            {card.planName ?? 'AUSTA Care Plan'}
          </Text>
        </View>

        {/* Card Body */}
        <View style={styles.cardBody}>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>{t('journeys.plan.digitalCard.holder')}</Text>
            <Text style={styles.fieldValue}>
              {card.memberName ?? '---'}
            </Text>
          </View>

          <View style={styles.fieldColumns}>
            <View style={styles.fieldCol}>
              <Text style={styles.fieldLabel}>{t('journeys.plan.digitalCard.cpf')}</Text>
              <Text style={styles.fieldValue}>{card.cpf ?? '---'}</Text>
            </View>
            <View style={styles.fieldCol}>
              <Text style={styles.fieldLabel}>{t('journeys.plan.digitalCard.planNumber')}</Text>
              <Text style={styles.fieldValue}>
                {card.planNumber ?? '---'}
              </Text>
            </View>
          </View>

          <View style={styles.fieldColumns}>
            <View style={styles.fieldCol}>
              <Text style={styles.fieldLabel}>{t('journeys.plan.digitalCard.startDate')}</Text>
              <Text style={styles.fieldValue}>
                {card.validityStart ?? '---'}
              </Text>
            </View>
            <View style={styles.fieldCol}>
              <Text style={styles.fieldLabel}>{t('journeys.plan.digitalCard.validity')}</Text>
              <Text style={styles.fieldValue}>
                {card.validityEnd ?? '---'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* QR Code Placeholder */}
      <View style={styles.qrContainer}>
        <View style={styles.qrBox}>
          <Text style={styles.qrText}>QR Code</Text>
        </View>
        <Text style={styles.qrHint}>
          {t('journeys.plan.digitalCard.qrHint')}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleShareCard}
          accessibilityLabel={t('journeys.plan.digitalCard.share')}
        >
          <Text style={styles.primaryButtonText}>{t('journeys.plan.digitalCard.share')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleSaveToWallet}
          accessibilityLabel={t('journeys.plan.digitalCard.saveToWallet')}
        >
          <Text style={styles.secondaryButtonText}>{t('journeys.plan.digitalCard.saveToWallet')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.journeys.plan.background,
  },
  scrollContent: {
    padding: spacingValues.md,
    gap: spacingValues.lg,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacingValues.sm,
    fontSize: fontSizeValues.md,
    color: colors.gray[50],
  },

  /* Card */
  cardContainer: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadiusValues.lg,
    overflow: 'hidden',
    shadowColor: colors.neutral.black,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    backgroundColor: colors.journeys.plan.primary,
    paddingVertical: spacingValues.lg,
    paddingHorizontal: spacingValues.lg,
  },
  cardHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingValues.xs,
  },
  logoPlaceholder: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: spacingValues['3xs'],
    paddingHorizontal: spacingValues.sm,
    borderRadius: borderRadiusValues.sm,
  },
  logoText: {
    color: colors.neutral.white,
    fontSize: fontSizeValues.md,
    fontWeight: String(700) as any,
    letterSpacing: 1,
  },
  planTypeBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingVertical: spacingValues['4xs'],
    paddingHorizontal: spacingValues.xs,
    borderRadius: borderRadiusValues.full,
  },
  planTypeText: {
    color: colors.neutral.white,
    fontSize: fontSizeValues.xs,
    fontWeight: String(600) as any,
  },
  planName: {
    color: colors.neutral.white,
    fontSize: fontSizeValues.xl,
    fontWeight: String(700) as any,
  },
  cardBody: {
    padding: spacingValues.lg,
    gap: spacingValues.sm,
  },
  fieldRow: {
    marginBottom: spacingValues['3xs'],
  },
  fieldColumns: {
    flexDirection: 'row',
  },
  fieldCol: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: fontSizeValues.xs,
    fontWeight: String(500) as any,
    color: colors.gray[40],
    marginBottom: spacingValues['4xs'],
  },
  fieldValue: {
    fontSize: fontSizeValues.sm,
    fontWeight: String(600) as any,
    color: colors.journeys.plan.text,
  },

  /* QR Code */
  qrContainer: {
    alignItems: 'center',
  },
  qrBox: {
    width: 160,
    height: 160,
    borderWidth: 2,
    borderColor: colors.gray[20],
    borderStyle: 'dashed',
    borderRadius: borderRadiusValues.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
  },
  qrText: {
    fontSize: fontSizeValues.sm,
    fontWeight: String(500) as any,
    color: colors.gray[40],
  },
  qrHint: {
    marginTop: spacingValues.xs,
    fontSize: fontSizeValues.xs,
    color: colors.gray[50],
  },

  /* Actions */
  actions: {
    gap: spacingValues.sm,
  },
  primaryButton: {
    backgroundColor: colors.journeys.plan.primary,
    paddingVertical: spacingValues.sm,
    borderRadius: borderRadiusValues.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.neutral.white,
    fontSize: fontSizeValues.md,
    fontWeight: String(600) as any,
  },
  secondaryButton: {
    backgroundColor: colors.neutral.white,
    paddingVertical: spacingValues.sm,
    borderRadius: borderRadiusValues.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.journeys.plan.primary,
  },
  secondaryButtonText: {
    color: colors.journeys.plan.primary,
    fontSize: fontSizeValues.md,
    fontWeight: String(600) as any,
  },
});

export default DigitalCardScreen;
