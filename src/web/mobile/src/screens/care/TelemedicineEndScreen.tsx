import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { ROUTES } from '../../../../constants/routes';
import { useTheme } from 'styled-components/native';
import type { Theme } from '../../../../design-system/src/themes/base.theme';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

/**
 * Route params expected by TelemedicineEndScreen.
 */
type TelemedicineEndScreenRouteParams = {
  appointmentId: string;
  doctorName: string;
  callDuration: string;
};

/** Maximum star rating. */
const MAX_STARS = 5;

/**
 * Returns the star display character based on whether it is filled.
 */
const getStarChar = (filled: boolean): string => (filled ? '\u2605' : '\u2606');

/**
 * TelemedicineEndScreen shows a call-ended summary with the doctor name,
 * call duration, a star-based quality rating, optional feedback input,
 * and navigation CTAs for visit summary, follow-up booking, and dashboard.
 */
const TelemedicineEndScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: TelemedicineEndScreenRouteParams }, 'params'>>();
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);

  const {
    appointmentId,
    doctorName = '',
    callDuration = '00:00',
  } = route.params || {};

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleStarPress = useCallback((star: number) => {
    setRating(star);
  }, []);

  const handleSubmitRating = useCallback(() => {
    // Mock: in production this would POST to the backend
    setSubmitted(true);
  }, []);

  const handleViewSummary = useCallback(() => {
    navigation.navigate(ROUTES.CARE_VISIT_SUMMARY, { appointmentId });
  }, [navigation, appointmentId]);

  const handleBookFollowUp = useCallback(() => {
    navigation.navigate(ROUTES.CARE_VISIT_FOLLOW_UP, { appointmentId, doctorName });
  }, [navigation, appointmentId, doctorName]);

  const handleReturnDashboard = useCallback(() => {
    navigation.navigate(ROUTES.CARE_DASHBOARD);
  }, [navigation]);

  const getRatingLabel = useCallback(
    (stars: number): string => {
      if (stars === 0) return '';
      if (stars <= 2) return t('journeys.care.telemedicineDeep.endScreen.ratingLabels.poor');
      if (stars === 3) return t('journeys.care.telemedicineDeep.endScreen.ratingLabels.average');
      if (stars === 4) return t('journeys.care.telemedicineDeep.endScreen.ratingLabels.good');
      return t('journeys.care.telemedicineDeep.endScreen.ratingLabels.excellent');
    },
    [t],
  );

  return (
    <View style={styles.root} testID="telemedicine-end-screen">
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Call ended header */}
        <View style={styles.headerSection}>
          <View style={styles.endIconCircle}>
            <Text
              fontSize="heading-lg"
              color={colors.neutral.white}
              testID="call-ended-icon"
            >
              {'\u{1F4DE}'}
            </Text>
          </View>
          <Text
            variant="heading"
            journey="care"
            testID="call-ended-title"
          >
            {t('journeys.care.telemedicineDeep.endScreen.title')}
          </Text>
        </View>

        {/* Call summary card */}
        <Card journey="care" elevation="md">
          <View style={styles.summaryRow}>
            <Text fontSize="text-sm" color={colors.neutral.gray600}>
              {t('journeys.care.telemedicineDeep.endScreen.doctor')}
            </Text>
            <Text
              fontSize="text-sm"
              fontWeight="semiBold"
              color={colors.journeys.care.text}
              testID="summary-doctor-name"
            >
              {doctorName}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text fontSize="text-sm" color={colors.neutral.gray600}>
              {t('journeys.care.telemedicineDeep.endScreen.duration')}
            </Text>
            <Text
              fontSize="text-sm"
              fontWeight="semiBold"
              color={colors.journeys.care.text}
              testID="summary-duration"
            >
              {callDuration}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text fontSize="text-sm" color={colors.neutral.gray600}>
              {t('journeys.care.telemedicineDeep.endScreen.appointmentId')}
            </Text>
            <Text
              fontSize="text-sm"
              color={colors.neutral.gray600}
              testID="summary-appointment-id"
            >
              #{appointmentId}
            </Text>
          </View>
        </Card>

        {/* Star rating */}
        <Card journey="care" elevation="sm">
          <Text
            variant="body"
            fontWeight="semiBold"
            journey="care"
            testID="rating-prompt"
          >
            {t('journeys.care.telemedicineDeep.endScreen.rateExperience')}
          </Text>

          <View style={styles.starsContainer}>
            {Array.from({ length: MAX_STARS }, (_, i) => i + 1).map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleStarPress(star)}
                disabled={submitted}
                testID={`star-${star}`}
                accessibilityLabel={t('journeys.care.telemedicineDeep.endScreen.starLabel', { star, total: MAX_STARS })}
                accessibilityRole="button"
              >
                <Text
                  fontSize="heading-lg"
                  color={
                    star <= rating
                      ? colors.journeys.care.primary
                      : colors.neutral.gray400
                  }
                >
                  {getStarChar(star <= rating)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {rating > 0 && (
            <Text
              fontSize="text-sm"
              color={colors.journeys.care.primary}
              testID="rating-label"
            >
              {getRatingLabel(rating)}
            </Text>
          )}

          {/* Feedback input */}
          {!submitted && (
            <View style={styles.feedbackSection}>
              <Text
                fontSize="text-sm"
                color={colors.neutral.gray600}
                testID="feedback-label"
              >
                {t('journeys.care.telemedicineDeep.endScreen.feedbackLabel')}
              </Text>
              <TextInput
                style={styles.feedbackInput}
                value={feedback}
                onChangeText={setFeedback}
                placeholder={t('journeys.care.telemedicineDeep.endScreen.feedbackPlaceholder')}
                placeholderTextColor={colors.neutral.gray500}
                multiline
                maxLength={500}
                numberOfLines={4}
                textAlignVertical="top"
                testID="feedback-input"
                accessibilityLabel={t('journeys.care.telemedicineDeep.endScreen.feedbackLabel')}
              />
            </View>
          )}

          {/* Submit button */}
          {!submitted ? (
            <Button
              onPress={handleSubmitRating}
              journey="care"
              disabled={rating === 0}
              accessibilityLabel={t('journeys.care.telemedicineDeep.endScreen.submitRating')}
              testID="submit-rating-button"
            >
              {t('journeys.care.telemedicineDeep.endScreen.submitRating')}
            </Button>
          ) : (
            <View style={styles.thankYouContainer}>
              <Text
                variant="body"
                color={colors.semantic.success}
                testID="thank-you-text"
              >
                {t('journeys.care.telemedicineDeep.endScreen.thankYou')}
              </Text>
            </View>
          )}
        </Card>

        {/* CTA buttons */}
        <View style={styles.ctaSection}>
          <Button
            onPress={handleViewSummary}
            journey="care"
            accessibilityLabel={t('journeys.care.telemedicineDeep.endScreen.viewSummary')}
            testID="view-summary-button"
          >
            {t('journeys.care.telemedicineDeep.endScreen.viewSummary')}
          </Button>

          <Button
            variant="secondary"
            onPress={handleBookFollowUp}
            journey="care"
            accessibilityLabel={t('journeys.care.telemedicineDeep.endScreen.bookFollowUp')}
            testID="book-follow-up-button"
          >
            {t('journeys.care.telemedicineDeep.endScreen.bookFollowUp')}
          </Button>

          <Button
            variant="secondary"
            onPress={handleReturnDashboard}
            journey="care"
            accessibilityLabel={t('journeys.care.telemedicineDeep.endScreen.returnDashboard')}
            testID="return-dashboard-button"
          >
            {t('journeys.care.telemedicineDeep.endScreen.returnDashboard')}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.journeys.care.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacingValues.md,
    paddingBottom: spacingValues['3xl'],
    gap: spacingValues.md,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: spacingValues.xl,
    marginBottom: spacingValues.sm,
    gap: spacingValues.sm,
  },
  endIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.semantic.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacingValues['3xs'],
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacingValues.sm,
    marginVertical: spacingValues.sm,
  },
  feedbackSection: {
    marginTop: spacingValues.sm,
    gap: spacingValues.xs,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: spacingValues.xs,
    paddingHorizontal: spacingValues.sm,
    paddingVertical: spacingValues.xs,
    minHeight: 80,
    fontSize: 14,
    color: colors.journeys.care.text,
    backgroundColor: theme.colors.background.default,
  },
  thankYouContainer: {
    alignItems: 'center',
    paddingVertical: spacingValues.sm,
  },
  ctaSection: {
    marginTop: spacingValues.md,
    gap: spacingValues.sm,
  },
});

export { TelemedicineEndScreen };
export default TelemedicineEndScreen;
