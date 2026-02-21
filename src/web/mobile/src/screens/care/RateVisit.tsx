import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

interface RouteParams {
  appointmentId: string;
  doctorId: string;
}

const MOCK_VISIT = {
  doctorName: 'Dra. Ana Carolina Silva',
  specialty: 'Cardiologia',
  date: '05 Mar 2026',
};

const RATING_LABEL_KEYS = [
  'consultation.rateVisit.terrible',
  'consultation.rateVisit.poor',
  'consultation.rateVisit.average',
  'consultation.rateVisit.good',
  'consultation.rateVisit.excellent',
];

const CATEGORY_KEYS = [
  'consultation.rateVisit.punctuality',
  'consultation.rateVisit.communication',
  'consultation.rateVisit.expertise',
  'consultation.rateVisit.facility',
];

const renderStars = (count: number, selected: number, onSelect: (val: number) => void, testPrefix: string, label: string) => (
  <View style={starStyles.row}>
    {[1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity
        key={star}
        onPress={() => onSelect(star)}
        accessibilityLabel={`${label} ${star}`}
        accessibilityRole="button"
        testID={`${testPrefix}-star-${star}`}
      >
        <Text fontSize="xl" color={star <= selected ? colors.journeys.care.primary : colors.neutral.gray300}>
          {star <= selected ? '\u2605' : '\u2606'}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const starStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacingValues.xs },
});

export const RateVisit: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { t } = useTranslation();
  const params = route.params as RouteParams;

  const [mainRating, setMainRating] = useState(0);
  const [categoryRatings, setCategoryRatings] = useState<Record<string, number>>({});
  const [review, setReview] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState(false);

  const updateCategoryRating = useCallback((key: string, value: number) => {
    setCategoryRatings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    Alert.alert(t('consultation.rateVisit.title'), t('consultation.rateVisit.submit'));
    navigation.goBack();
  }, [navigation, t]);

  const handleSkip = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const ratingLabel = mainRating > 0 ? t(RATING_LABEL_KEYS[mainRating - 1]) : '';

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          testID="back-button"
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
        >
          <Text fontSize="lg">{'<-'}</Text>
        </TouchableOpacity>
        <Text fontSize="lg" fontWeight="bold" color={colors.journeys.care.text}>
          {t('consultation.rateVisit.title')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Card journey="care" elevation="sm">
          <Text fontSize="md" fontWeight="bold" color={colors.journeys.care.text}>
            {MOCK_VISIT.doctorName}
          </Text>
          <Badge journey="care" size="sm">{MOCK_VISIT.specialty}</Badge>
          <Text fontSize="sm" color={colors.neutral.gray500} style={styles.visitDate}>
            {MOCK_VISIT.date}
          </Text>
        </Card>

        <View style={styles.mainRatingSection}>
          <Text fontSize="md" fontWeight="bold" color={colors.journeys.care.text} textAlign="center">
            {t('consultation.rateVisit.ratingLabel')}
          </Text>
          <View style={styles.mainStars}>
            {renderStars(5, mainRating, setMainRating, 'main', t('consultation.rateVisit.ratingLabel'))}
          </View>
          {ratingLabel !== '' && (
            <Text fontSize="sm" color={colors.journeys.care.primary} textAlign="center" testID="rating-label">
              {ratingLabel}
            </Text>
          )}
        </View>

        <Card journey="care" elevation="sm">
          {CATEGORY_KEYS.map((key) => (
            <View key={key} style={styles.categoryRow}>
              <Text fontSize="sm" color={colors.journeys.care.text} style={styles.categoryLabel}>
                {t(key)}
              </Text>
              {renderStars(
                5,
                categoryRatings[key] || 0,
                (val) => updateCategoryRating(key, val),
                key.split('.').pop() || key,
                t(key),
              )}
            </View>
          ))}
        </Card>

        <TextInput
          style={styles.reviewInput}
          value={review}
          onChangeText={setReview}
          placeholder={t('consultation.rateVisit.reviewPlaceholder')}
          placeholderTextColor={colors.neutral.gray500}
          multiline
          numberOfLines={4}
          accessibilityLabel={t('consultation.rateVisit.review')}
          testID="review-input"
        />

        <View style={styles.recommendRow}>
          <Text fontSize="sm" color={colors.journeys.care.text} style={styles.recommendLabel}>
            {t('consultation.rateVisit.wouldRecommend')}
          </Text>
          <Switch
            value={wouldRecommend}
            onValueChange={setWouldRecommend}
            trackColor={{ false: colors.neutral.gray300, true: colors.journeys.care.primary }}
            accessibilityLabel={t('consultation.rateVisit.wouldRecommend')}
            testID="recommend-switch"
          />
        </View>

        <Button
          journey="care"
          variant="primary"
          onPress={handleSubmit}
          disabled={mainRating === 0}
          accessibilityLabel={t('consultation.rateVisit.submit')}
          testID="submit-review-button"
        >
          {t('consultation.rateVisit.submit')}
        </Button>

        <TouchableOpacity
          onPress={handleSkip}
          style={styles.skipButton}
          accessibilityLabel={t('consultation.rateVisit.skip')}
          accessibilityRole="button"
          testID="skip-button"
        >
          <Text fontSize="sm" color={colors.neutral.gray500} textAlign="center">
            {t('consultation.rateVisit.skip')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.journeys.care.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacingValues.md, paddingTop: spacingValues.lg, paddingBottom: spacingValues.sm,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: spacingValues.md, paddingBottom: spacingValues['3xl'], gap: spacingValues.md },
  visitDate: { marginTop: spacingValues['3xs'] },
  mainRatingSection: { alignItems: 'center', gap: spacingValues.xs, paddingVertical: spacingValues.sm },
  mainStars: { paddingVertical: spacingValues.xs },
  categoryRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: spacingValues.xs,
  },
  categoryLabel: { flex: 1 },
  reviewInput: {
    borderWidth: 1, borderColor: colors.neutral.gray300, borderRadius: spacingValues.xs,
    padding: spacingValues.sm, minHeight: 100, textAlignVertical: 'top',
    color: colors.journeys.care.text, fontSize: 14,
  },
  recommendRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: spacingValues.xs,
  },
  recommendLabel: { flex: 1 },
  skipButton: { paddingVertical: spacingValues.sm },
});

export default RateVisit;
