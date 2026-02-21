import React, { useEffect, useState } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Benefit } from 'src/web/shared/types/plan.types';
import EmptyState from '../components/shared/EmptyState';
import ErrorState from '../components/shared/ErrorState';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import JourneyHeader from '../components/shared/JourneyHeader';
import { JOURNEY_IDS } from 'src/web/shared/constants/journeys';
import { colors } from '@web/design-system/src/tokens/colors';
import { spacingValues } from '@web/design-system/src/tokens/spacing';
import { fontSizeValues } from '@web/design-system/src/tokens/typography';
import { borderRadiusValues } from '@web/design-system/src/tokens/borderRadius';
import { useTranslation } from 'react-i18next';

/**
 * Categories for filtering benefits.
 */
const BENEFIT_CATEGORIES = ['Todos', 'Medico', 'Dental', 'Visao'] as const;
type BenefitCategory = (typeof BENEFIT_CATEGORIES)[number];

/**
 * Maps category filter labels to benefit type values for filtering.
 */
const CATEGORY_TYPE_MAP: Record<BenefitCategory, string | null> = {
  Todos: null,
  Medico: 'medical',
  Dental: 'dental',
  Visao: 'vision',
};

/**
 * BenefitsScreen component displays a list of benefits available to the user
 * under their insurance plan. Includes category filter tabs, loading, error,
 * and empty states.
 */
const BenefitsScreen: React.FC = () => {
  const { t } = useTranslation();
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<BenefitCategory>('Todos');

  const fetchBenefits = async () => {
    try {
      setLoading(true);
      setError(false);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBenefits([]);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching benefits:', err);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBenefits();
  }, []);

  const filteredBenefits = benefits.filter((b) => {
    const typeFilter = CATEGORY_TYPE_MAP[activeFilter];
    if (!typeFilter) return true;
    return b.type === typeFilter;
  });

  if (loading) {
    return (
      <View style={styles.screen}>
        <JourneyHeader />
        <View style={styles.centered}>
          <LoadingIndicator journey="plan" label={t('journeys.plan.benefits.loading')} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.screen}>
        <JourneyHeader />
        <View style={styles.centered}>
          <ErrorState
            icon="error"
            title={t('journeys.plan.benefits.error')}
            description={t('common.errors.network')}
            actionLabel={t('journeys.plan.benefits.retry')}
            onAction={fetchBenefits}
            journey="plan"
          />
        </View>
      </View>
    );
  }

  if (filteredBenefits.length === 0 && !loading) {
    return (
      <View style={styles.screen}>
        <JourneyHeader />
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {BENEFIT_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.filterTab,
                  activeFilter === cat && styles.filterTabActive,
                ]}
                onPress={() => setActiveFilter(cat)}
                accessibilityLabel={`Filtrar por ${cat}`}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    activeFilter === cat && styles.filterTabTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.centered}>
          <EmptyState
            icon="card"
            title={t('journeys.plan.benefits.empty')}
            description={t('journeys.plan.benefits.emptyDescription')}
            journey="plan"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <JourneyHeader />
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {BENEFIT_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.filterTab,
                activeFilter === cat && styles.filterTabActive,
              ]}
              onPress={() => setActiveFilter(cat)}
              accessibilityLabel={`Filtrar por ${cat}`}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === cat && styles.filterTabTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Benefits List */}
      <FlatList
        data={filteredBenefits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.benefitCard}>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitType}>{item.type}</Text>
              <Text style={styles.benefitDescription}>{item.description}</Text>
              {item.limitations && (
                <View style={styles.benefitDetailRow}>
                  <Text style={styles.benefitDetailLabel}>{t('journeys.plan.benefits.limitations')}: </Text>
                  <Text style={styles.benefitDetailValue}>
                    {item.limitations}
                  </Text>
                </View>
              )}
              {item.usage && (
                <View style={styles.benefitDetailRow}>
                  <Text style={styles.benefitDetailLabel}>{t('journeys.plan.benefits.usage')}: </Text>
                  <Text style={styles.benefitDetailValue}>{item.usage}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.journeys.plan.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Filter Tabs */
  filterContainer: {
    paddingVertical: spacingValues.sm,
    paddingHorizontal: spacingValues.md,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[20],
  },
  filterScroll: {
    gap: spacingValues.xs,
  },
  filterTab: {
    paddingVertical: spacingValues.xs,
    paddingHorizontal: spacingValues.md,
    borderRadius: borderRadiusValues.full,
    backgroundColor: colors.gray[10],
  },
  filterTabActive: {
    backgroundColor: colors.journeys.plan.primary,
  },
  filterTabText: {
    fontSize: fontSizeValues.sm,
    fontWeight: String(500) as any,
    color: colors.gray[50],
  },
  filterTabTextActive: {
    color: colors.neutral.white,
    fontWeight: String(600) as any,
  },

  /* Benefits List */
  listContent: {
    padding: spacingValues.md,
    gap: spacingValues.sm,
  },
  benefitCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadiusValues.md,
    padding: spacingValues.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.journeys.plan.primary,
    shadowColor: colors.neutral.black,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  benefitContent: {
    gap: spacingValues.xs,
  },
  benefitType: {
    fontWeight: String(700) as any,
    fontSize: fontSizeValues.lg,
    color: colors.journeys.plan.text,
  },
  benefitDescription: {
    fontSize: fontSizeValues.sm,
    color: colors.gray[50],
    lineHeight: fontSizeValues.sm * 1.5,
  },
  benefitDetailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  benefitDetailLabel: {
    fontSize: fontSizeValues.sm,
    fontWeight: String(500) as any,
    color: colors.gray[60],
  },
  benefitDetailValue: {
    fontSize: fontSizeValues.sm,
    color: colors.gray[50],
    flex: 1,
  },
});

export default BenefitsScreen;
