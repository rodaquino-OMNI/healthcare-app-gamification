import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import { colors } from '@design-system/tokens/colors';
import { typography } from '@design-system/tokens/typography';
import { spacing, spacingValues } from '@design-system/tokens/spacing';
import { borderRadius } from '@design-system/tokens/borderRadius';
import { sizing } from '@design-system/tokens/sizing';

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const ContentWrapper = styled.View`
  padding-horizontal: ${spacing.xl};
  padding-top: ${spacing['2xl']};
  padding-bottom: ${spacing['4xl']};
`;

const Title = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: ${spacing['2xl']};
`;

const SectionLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: ${spacing.md};
`;

// Star Rating
const StarRow = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: ${spacing.md};
  margin-bottom: ${spacing.sm};
`;

const StarButton = styled.TouchableOpacity`
  width: ${sizing.component.lg};
  height: ${sizing.component.lg};
  align-items: center;
  justify-content: center;
`;

const StarText = styled.Text<{ filled: boolean }>`
  font-size: 32px;
  color: ${(props) =>
    props.filled ? colors.semantic.warning : colors.gray[20]};
`;

const RatingLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
  margin-bottom: ${spacing['2xl']};
`;

// Category Picker
const CategoryGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${spacing.xs};
  margin-bottom: ${spacing['2xl']};
`;

const CategoryOption = styled.TouchableOpacity<{ selected: boolean }>`
  padding-vertical: ${spacing.xs};
  padding-horizontal: ${spacing.md};
  border-radius: ${borderRadius.full};
  border-width: 1px;
  border-color: ${(props) =>
    props.selected ? colors.brand.primary : colors.gray[20]};
  background-color: ${(props) =>
    props.selected ? colors.brand.primary + '15' : colors.neutral.white};
`;

const CategoryText = styled.Text<{ selected: boolean }>`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${(props) =>
    props.selected ? colors.brand.primary : colors.gray[60]};
`;

// Comment
const CommentInput = styled.TextInput`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.default};
  border-radius: ${borderRadius.md};
  padding: ${spacing.md};
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${({ theme }) => theme.colors.text.default};
  min-height: 120px;
  text-align-vertical: top;
`;

const CharCount = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.text.subtle};
  text-align: right;
  margin-top: ${spacing['3xs']};
  margin-bottom: ${spacing.xl};
`;

// Buttons
const PrimaryButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${(props) =>
    props.disabled ? colors.gray[30] : colors.brand.primary};
  border-radius: ${borderRadius.md};
  height: ${sizing.component.lg};
  align-items: center;
  justify-content: center;
`;

const PrimaryButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.onBrand};
`;

const StoreLinkButton = styled.TouchableOpacity`
  align-items: center;
  margin-top: ${spacing.xl};
  padding-vertical: ${spacing.sm};
`;

const StoreLinkText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.brand.primary};
`;

// --- Constants ---

const MAX_COMMENT_LENGTH = 500;

const RATING_LABELS: Record<number, string> = {
  1: 'Pessimo',
  2: 'Ruim',
  3: 'Regular',
  4: 'Bom',
  5: 'Excelente',
};

const CATEGORY_OPTIONS = ['Bug', 'Sugestao', 'Elogio', 'Outro'];

/**
 * AppFeedback screen -- star rating, category picker, multiline comment,
 * and submit feedback form. Also includes "Rate on App Store" link.
 */
export const AppFeedbackScreen: React.FC = () => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = rating > 0;

  const handleSubmit = async () => {
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      // TODO: call API to submit feedback
      await new Promise((resolve) => setTimeout(resolve, 800));
      Alert.alert(
        t('settings.feedback.successTitle'),
        t('settings.feedback.successMessage'),
      );
      setRating(0);
      setCategory('');
      setComment('');
    } catch {
      Alert.alert(
        t('settings.feedback.errorTitle'),
        t('settings.feedback.errorMessage'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRateOnStore = () => {
    Alert.alert(
      t('settings.feedback.rateOnStore'),
      t('settings.feedback.rateOnStoreConfirm'),
      [
        { text: t('settings.feedback.cancel'), style: 'cancel' },
        { text: t('settings.feedback.confirm'), onPress: () => {/* TODO: open store */} },
      ],
    );
  };

  const getRatingLabel = (): string => {
    if (rating === 0) return t('settings.feedback.ratingPlaceholder');
    const key = `settings.feedback.ratingLabels.${rating}`;
    const translated = t(key);
    // Fallback to hardcoded labels if translation missing
    return translated !== key ? translated : RATING_LABELS[rating] || '';
  };

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
      >
        <ContentWrapper>
          <Title testID="feedback-title">{t('settings.feedback.title')}</Title>

          {/* Star Rating */}
          <SectionLabel>{t('settings.feedback.rating')}</SectionLabel>
          <StarRow>
            {[1, 2, 3, 4, 5].map((star) => (
              <StarButton
                key={star}
                onPress={() => setRating(star)}
                accessibilityRole="button"
                accessibilityLabel={`${star} ${star === 1 ? 'estrela' : 'estrelas'}`}
                accessibilityState={{ selected: rating >= star }}
                testID={`feedback-star-${star}`}
              >
                <StarText filled={rating >= star}>
                  {rating >= star ? '\u2605' : '\u2606'}
                </StarText>
              </StarButton>
            ))}
          </StarRow>
          <RatingLabel testID="feedback-rating-label">
            {getRatingLabel()}
          </RatingLabel>

          {/* Category Picker */}
          <SectionLabel>{t('settings.feedback.category')}</SectionLabel>
          <CategoryGrid>
            {CATEGORY_OPTIONS.map((option) => (
              <CategoryOption
                key={option}
                selected={category === option}
                onPress={() => setCategory(category === option ? '' : option)}
                accessibilityRole="radio"
                accessibilityState={{ selected: category === option }}
                accessibilityLabel={option}
                testID={`feedback-category-${option.toLowerCase()}`}
              >
                <CategoryText selected={category === option}>
                  {t(`settings.feedback.categoryOptions.${option.toLowerCase()}`) !== `settings.feedback.categoryOptions.${option.toLowerCase()}`
                    ? t(`settings.feedback.categoryOptions.${option.toLowerCase()}`)
                    : option}
                </CategoryText>
              </CategoryOption>
            ))}
          </CategoryGrid>

          {/* Comment */}
          <SectionLabel>{t('settings.feedback.comment')}</SectionLabel>
          <CommentInput
            value={comment}
            onChangeText={(text: string) =>
              setComment(text.slice(0, MAX_COMMENT_LENGTH))
            }
            placeholder={t('settings.feedback.commentPlaceholder')}
            placeholderTextColor={colors.gray[40]}
            multiline
            maxLength={MAX_COMMENT_LENGTH}
            testID="feedback-comment"
          />
          <CharCount testID="feedback-char-count">
            {t('settings.feedback.charCount', {
              current: comment.length,
              max: MAX_COMMENT_LENGTH,
            }) || `${comment.length}/${MAX_COMMENT_LENGTH}`}
          </CharCount>

          {/* Submit */}
          <PrimaryButton
            onPress={handleSubmit}
            disabled={!isValid || isSubmitting}
            accessibilityRole="button"
            accessibilityLabel={t('settings.feedback.submit')}
            testID="feedback-submit"
          >
            <PrimaryButtonText>
              {isSubmitting
                ? t('settings.feedback.submitting')
                : t('settings.feedback.submit')}
            </PrimaryButtonText>
          </PrimaryButton>

          {/* Rate on App Store */}
          <StoreLinkButton
            onPress={handleRateOnStore}
            accessibilityRole="link"
            accessibilityLabel={t('settings.feedback.rateOnStore')}
            testID="feedback-rate-store"
          >
            <StoreLinkText>{t('settings.feedback.rateOnStore')}</StoreLinkText>
          </StoreLinkButton>
        </ContentWrapper>
      </ScrollView>
    </Container>
  );
};

export default AppFeedbackScreen;
