import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { ROUTES } from '../../../../constants/routes';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
  helpfulCount: number;
}

type SortOption = 'recent' | 'highest' | 'lowest';

const MOCK_REVIEWS: Review[] = [
  { id: 'r1', reviewerName: 'Maria L.', rating: 5, comment: 'Excelente profissional, muito atenciosa e explicou tudo com clareza. Recomendo muito para todos!', date: '2026-02-18', helpfulCount: 12 },
  { id: 'r2', reviewerName: 'Joao P.', rating: 5, comment: 'Medica muito competente. Me senti acolhido durante toda a consulta. Muito paciente e detalhista.', date: '2026-02-15', helpfulCount: 8 },
  { id: 'r3', reviewerName: 'Carla S.', rating: 4, comment: 'Otima consulta, mas a espera foi um pouco longa. Fora isso, tudo perfeito.', date: '2026-02-10', helpfulCount: 5 },
  { id: 'r4', reviewerName: 'Pedro M.', rating: 5, comment: 'Sempre indico para amigos e familiares. Profissional excepcional com muito conhecimento.', date: '2026-02-05', helpfulCount: 15 },
  { id: 'r5', reviewerName: 'Ana R.', rating: 3, comment: 'Boa consulta, porem senti que poderia ter sido mais detalhada nas explicacoes.', date: '2026-01-28', helpfulCount: 3 },
  { id: 'r6', reviewerName: 'Lucas F.', rating: 5, comment: 'Melhor cardiologista que ja consultei. Muito profissional e acolhedora.', date: '2026-01-20', helpfulCount: 20 },
  { id: 'r7', reviewerName: 'Beatriz O.', rating: 4, comment: 'Consulta muito boa, explicou os exames com paciencia. Voltarei com certeza.', date: '2026-01-15', helpfulCount: 7 },
  { id: 'r8', reviewerName: 'Rafael T.', rating: 2, comment: 'A consulta foi rapida demais. Esperava mais tempo para tirar duvidas.', date: '2026-01-10', helpfulCount: 2 },
  { id: 'r9', reviewerName: 'Fernanda G.', rating: 5, comment: 'Atendimento humanizado e competente. Saí da consulta muito mais tranquila.', date: '2026-01-05', helpfulCount: 11 },
  { id: 'r10', reviewerName: 'Bruno K.', rating: 4, comment: 'Muito boa profissional. Recomendo para quem precisa de acompanhamento cardiologico.', date: '2025-12-28', helpfulCount: 6 },
];

const RATING_DISTRIBUTION = [
  { stars: 5, count: 5 },
  { stars: 4, count: 3 },
  { stars: 3, count: 1 },
  { stars: 2, count: 1 },
  { stars: 1, count: 0 },
];

const TOTAL_REVIEWS = MOCK_REVIEWS.length;
const AVERAGE_RATING = (MOCK_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / TOTAL_REVIEWS).toFixed(1);

const renderStars = (rating: number): string => {
  const full = Math.floor(rating);
  const empty = 5 - full;
  return '\u2605'.repeat(full) + '\u2606'.repeat(empty);
};

/**
 * DoctorReviews screen displays patient reviews and ratings for a doctor.
 * Includes star average, rating breakdown, sortable review list, and write review CTA.
 */
export const DoctorReviews: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { t } = useTranslation();
  const { doctorId } = route.params || { doctorId: 'doc-001' };

  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [helpedIds, setHelpedIds] = useState<Set<string>>(new Set());

  const sortedReviews = useMemo(() => {
    const sorted = [...MOCK_REVIEWS];
    switch (sortBy) {
      case 'highest':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        sorted.sort((a, b) => a.rating - b.rating);
        break;
      default:
        sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return sorted;
  }, [sortBy]);

  const handleHelpful = useCallback((reviewId: string) => {
    setHelpedIds((prev) => {
      const next = new Set(prev);
      if (next.has(reviewId)) {
        next.delete(reviewId);
      } else {
        next.add(reviewId);
      }
      return next;
    });
  }, []);

  const SORT_OPTIONS: { key: SortOption; labelKey: string }[] = [
    { key: 'recent', labelKey: 'consultation.doctorReviews.mostRecent' },
    { key: 'highest', labelKey: 'consultation.doctorReviews.highest' },
    { key: 'lowest', labelKey: 'consultation.doctorReviews.lowest' },
  ];

  const renderRatingBar = (stars: number, count: number) => {
    const percentage = TOTAL_REVIEWS > 0 ? (count / TOTAL_REVIEWS) * 100 : 0;
    return (
      <View key={stars} style={styles.ratingBarRow}>
        <Text fontSize="sm" color={colors.neutral.gray700} style={styles.ratingBarLabel}>
          {stars} {'\u2605'}
        </Text>
        <View style={styles.ratingBarTrack}>
          <View style={[styles.ratingBarFill, { width: `${percentage}%` }]} />
        </View>
        <Text fontSize="sm" color={colors.neutral.gray500} style={styles.ratingBarCount}>
          {count}
        </Text>
      </View>
    );
  };

  const renderReviewItem = ({ item }: { item: Review }) => {
    const isHelped = helpedIds.has(item.id);
    const displayCount = isHelped ? item.helpfulCount + 1 : item.helpfulCount;
    return (
      <Card journey="care" elevation="sm">
        <View style={styles.reviewHeader}>
          <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
            {item.reviewerName}
          </Text>
          <Text fontSize="sm" color={colors.journeys.care.primary}>
            {renderStars(item.rating)}
          </Text>
        </View>
        <Text fontSize="sm" color={colors.neutral.gray700} style={styles.reviewComment}>
          {item.comment}
        </Text>
        <View style={styles.reviewFooter}>
          <Text fontSize="sm" color={colors.neutral.gray500}>{item.date}</Text>
          <TouchableOpacity
            onPress={() => handleHelpful(item.id)}
            accessibilityLabel={t('consultation.doctorReviews.helpful')}
            accessibilityRole="button"
            testID={`helpful-btn-${item.id}`}
            style={[styles.helpfulButton, isHelped && styles.helpfulButtonActive]}
          >
            <Text
              fontSize="sm"
              color={isHelped ? colors.journeys.care.primary : colors.neutral.gray500}
            >
              {'\u{1F44D}'} {displayCount}
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  const ListHeader = () => (
    <View>
      {/* Average Rating Section */}
      <View style={styles.averageSection}>
        <Text fontSize="sm" color={colors.neutral.gray700}>
          {t('consultation.doctorReviews.averageRating')}
        </Text>
        <View style={styles.averageRow}>
          <Text fontWeight="bold" fontSize="xl" color={colors.journeys.care.text} style={styles.averageNumber}>
            {AVERAGE_RATING}
          </Text>
          <View>
            <Text fontSize="lg" color={colors.journeys.care.primary}>
              {renderStars(parseFloat(AVERAGE_RATING))}
            </Text>
            <Text fontSize="sm" color={colors.neutral.gray500}>
              {TOTAL_REVIEWS} {t('consultation.doctorReviews.reviews')}
            </Text>
          </View>
        </View>
      </View>

      {/* Rating Breakdown */}
      <View style={styles.breakdownSection}>
        {RATING_DISTRIBUTION.map((d) => renderRatingBar(d.stars, d.count))}
      </View>

      {/* Sort Filter */}
      <View style={styles.sortSection}>
        <Text fontSize="sm" fontWeight="bold" color={colors.neutral.gray700}>
          {t('consultation.doctorReviews.sortBy')}:
        </Text>
        <View style={styles.sortRow}>
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              onPress={() => setSortBy(opt.key)}
              accessibilityLabel={t(opt.labelKey)}
              accessibilityRole="button"
              testID={`sort-${opt.key}`}
              style={[styles.sortChip, sortBy === opt.key && styles.sortChipActive]}
            >
              <Text
                fontSize="sm"
                fontWeight={sortBy === opt.key ? 'bold' : 'regular'}
                color={sortBy === opt.key ? colors.neutral.white : colors.neutral.gray700}
              >
                {t(opt.labelKey)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          testID="back-button"
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
        >
          <Text fontSize="lg">{'\u2190'}</Text>
        </TouchableOpacity>
        <Text fontSize="lg" fontWeight="bold" color={colors.journeys.care.text}>
          {t('consultation.doctorReviews.title')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={sortedReviews}
        renderItem={renderReviewItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        testID="reviews-list"
      />

      {/* Write Review CTA */}
      <View style={styles.ctaContainer}>
        <Button
          variant="primary"
          journey="care"
          size="lg"
          onPress={() => {}}
          accessibilityLabel={t('consultation.doctorReviews.writeReview')}
          testID="write-review-cta"
        >
          {t('consultation.doctorReviews.writeReview')}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.journeys.care.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray300,
  },
  listContent: {
    padding: spacingValues.md,
    paddingBottom: spacingValues['6xl'],
    gap: spacingValues.sm,
  },
  averageSection: {
    alignItems: 'center',
    marginBottom: spacingValues.lg,
  },
  averageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues.sm,
    marginTop: spacingValues.xs,
  },
  averageNumber: {
    fontSize: 48,
    lineHeight: 56,
  },
  breakdownSection: {
    marginBottom: spacingValues.lg,
    gap: spacingValues['3xs'],
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues.xs,
  },
  ratingBarLabel: {
    width: 36,
    textAlign: 'right',
  },
  ratingBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.neutral.gray200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: 8,
    backgroundColor: colors.journeys.care.primary,
    borderRadius: 4,
  },
  ratingBarCount: {
    width: 24,
    textAlign: 'right',
  },
  sortSection: {
    marginBottom: spacingValues.md,
  },
  sortRow: {
    flexDirection: 'row',
    gap: spacingValues.xs,
    marginTop: spacingValues.xs,
  },
  sortChip: {
    paddingHorizontal: spacingValues.sm,
    paddingVertical: spacingValues['2xs'],
    borderRadius: spacingValues.md,
    backgroundColor: colors.neutral.gray200,
  },
  sortChipActive: {
    backgroundColor: colors.journeys.care.primary,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingValues['3xs'],
  },
  reviewComment: {
    marginBottom: spacingValues.xs,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacingValues.xs,
    paddingVertical: spacingValues['3xs'],
    borderRadius: spacingValues.sm,
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
  },
  helpfulButtonActive: {
    borderColor: colors.journeys.care.primary,
    backgroundColor: colors.journeys.care.background,
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.journeys.care.background,
    padding: spacingValues.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray300,
  },
});

export default DoctorReviews;
