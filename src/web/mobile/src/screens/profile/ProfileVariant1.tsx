import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { AuthNavigationProp } from '../../navigation/types';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import { colors } from '@design-system/tokens/colors';
import { typography } from '@design-system/tokens/typography';
import { spacing, spacingValues } from '@design-system/tokens/spacing';
import { borderRadius, borderRadiusValues } from '@design-system/tokens/borderRadius';
import { sizing } from '@design-system/tokens/sizing';

import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../api/auth';

/**
 * Validation schema for health information form.
 */
const createHealthInfoSchema = (t: (key: string, options?: any) => string) => yup.object().shape({
  bloodType: yup.string().required(t('common.validation.required')),
  allergies: yup.string().default(''),
});

interface HealthInfoFormData {
  bloodType: string;
  allergies: string;
}

const BLOOD_TYPE_OPTIONS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-',
];

const CHRONIC_CONDITIONS = [
  { id: 'diabetes', labelKey: 'profile.healthInfo.conditions.diabetes' },
  { id: 'hypertension', labelKey: 'profile.healthInfo.conditions.hypertension' },
  { id: 'asthma', labelKey: 'profile.healthInfo.conditions.asthma' },
  { id: 'heart_disease', labelKey: 'profile.healthInfo.conditions.heartDisease' },
  { id: 'none', labelKey: 'profile.healthInfo.conditions.none' },
];

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

const HeaderSection = styled.View`
  margin-bottom: ${spacing['2xl']};
`;

const Title = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: ${spacing.xs};
`;

const Subtitle = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${({ theme }) => theme.colors.text.muted};
  margin-bottom: ${spacing.xs};
`;

const StepIndicator = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const StepBarContainer = styled.View`
  flex-direction: row;
  margin-top: ${spacing.sm};
  gap: ${spacing['3xs']};
`;

const StepDot = styled.View<{ active: boolean }>`
  flex: 1;
  height: 4px;
  border-radius: ${borderRadius.full};
  background-color: ${(props) =>
    props.active ? colors.brand.primary : colors.gray[20]};
`;

const FieldContainer = styled.View`
  margin-bottom: ${spacing.lg};
`;

const Label = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: ${spacing.xs};
`;

const ErrorText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${colors.semantic.error};
  margin-top: ${spacing['3xs']};
`;

const StyledInput = styled.TextInput<{ hasError?: boolean }>`
  border-width: 1px;
  border-color: ${(props) =>
    props.hasError ? colors.semantic.error : colors.gray[20]};
  border-radius: ${borderRadius.md};
  padding-horizontal: ${spacing.md};
  padding-vertical: ${spacing.sm};
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${({ theme }) => theme.colors.text.default};
  background-color: ${({ theme }) => theme.colors.background.default};
  min-height: 100px;
  text-align-vertical: top;
`;

const BloodTypeGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${spacing.xs};
`;

const BloodTypeChip = styled.TouchableOpacity<{ selected: boolean }>`
  padding-horizontal: ${spacing.md};
  padding-vertical: ${spacing.sm};
  border-radius: ${borderRadius.md};
  border-width: 1px;
  border-color: ${(props) =>
    props.selected ? colors.brand.primary : colors.gray[20]};
  background-color: ${(props) =>
    props.selected ? colors.brandPalette[50] : colors.neutral.white};
  min-width: 60px;
  align-items: center;
`;

const BloodTypeText = styled.Text<{ selected: boolean }>`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${(props) =>
    props.selected
      ? typography.fontWeight.semiBold
      : typography.fontWeight.regular};
  color: ${(props) =>
    props.selected ? colors.brand.primary : colors.neutral.gray700};
`;

const ConditionRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-vertical: ${spacing.sm};
`;

const CheckboxBox = styled.View<{ checked: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: ${borderRadius.sm};
  border-width: 2px;
  border-color: ${(props) =>
    props.checked ? colors.brand.primary : colors.gray[30]};
  background-color: ${(props) =>
    props.checked ? colors.brand.primary : colors.neutral.white};
  align-items: center;
  justify-content: center;
  margin-right: ${spacing.sm};
`;

const CheckboxMark = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.onBrand};
  font-weight: ${typography.fontWeight.bold};
`;

const ConditionLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${({ theme }) => theme.colors.text.default};
`;

const PrimaryButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${(props) =>
    props.disabled ? colors.gray[30] : colors.brand.primary};
  border-radius: ${borderRadius.md};
  height: ${sizing.component.lg};
  align-items: center;
  justify-content: center;
  margin-top: ${spacing.xl};
`;

const PrimaryButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.onBrand};
`;

const SkipLink = styled.TouchableOpacity`
  align-items: center;
  margin-top: ${spacing.md};
  padding-vertical: ${spacing.sm};
`;

const SkipLinkText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${({ theme }) => theme.colors.text.muted};
  text-decoration-line: underline;
`;

/**
 * ProfileVariant1 screen -- Step 2/7 of the profile onboarding flow.
 * Collects health information: blood type, allergies, chronic conditions.
 */
const ProfileVariant1: React.FC = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { t } = useTranslation();
  const { session } = useAuth();
  const [saving, setSaving] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HealthInfoFormData>({
    resolver: yupResolver(createHealthInfoSchema(t as (key: string, options?: any) => string) as any),
    mode: 'onBlur',
    defaultValues: {
      bloodType: '',
      allergies: '',
    },
  });

  const bloodType = watch('bloodType');

  const toggleCondition = (conditionId: string) => {
    setSelectedConditions((prev) => {
      if (conditionId === 'none') {
        return prev.includes('none') ? [] : ['none'];
      }
      const withoutNone = prev.filter((c) => c !== 'none');
      if (withoutNone.includes(conditionId)) {
        return withoutNone.filter((c) => c !== conditionId);
      }
      return [...withoutNone, conditionId];
    });
  };

  const onSubmit = async (data: HealthInfoFormData) => {
    if (!session?.accessToken) return;
    setSaving(true);
    try {
      await updateProfile(session.accessToken, {
        bloodType: data.bloodType,
        allergies: data.allergies,
        chronicConditions: selectedConditions,
      });
      navigation.navigate('ProfileInsurance');
    } catch (err: unknown) {
      Alert.alert(
        t('common.errors.default'),
        err instanceof Error ? err.message : t('common.errors.generic'),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    navigation.navigate('ProfileAddress');
  };

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ContentWrapper>
            {/* Header */}
            <HeaderSection>
              <Title>{t('profile.healthInfo.title')}</Title>
              <Subtitle>
                {t('profile.healthInfo.subtitle')}
              </Subtitle>
              <StepIndicator>{t('profileSetup.stepIndicator', { current: 2, total: 7 })}</StepIndicator>
              <StepBarContainer>
                {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                  <StepDot key={step} active={step <= 2} />
                ))}
              </StepBarContainer>
            </HeaderSection>

            {/* Blood Type */}
            <FieldContainer>
              <Label>{t('profile.healthInfo.bloodType')}</Label>
              <BloodTypeGrid>
                {BLOOD_TYPE_OPTIONS.map((type) => (
                  <BloodTypeChip
                    key={type}
                    selected={bloodType === type}
                    onPress={() => setValue('bloodType', type, { shouldValidate: true })}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: bloodType === type }}
                    accessibilityLabel={`Blood type ${type}`}
                    testID={`blood-type-${type}`}
                  >
                    <BloodTypeText selected={bloodType === type}>
                      {type}
                    </BloodTypeText>
                  </BloodTypeChip>
                ))}
              </BloodTypeGrid>
              {errors.bloodType && (
                <ErrorText>{errors.bloodType.message}</ErrorText>
              )}
            </FieldContainer>

            {/* Allergies */}
            <FieldContainer>
              <Label>{t('profile.healthInfo.allergies')}</Label>
              <Controller
                control={control}
                name="allergies"
                render={({ field: { onChange, onBlur, value } }) => (
                  <StyledInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder={t('profile.healthInfo.allergiesPlaceholder')}
                    placeholderTextColor={colors.gray[40]}
                    multiline
                    numberOfLines={4}
                    testID="profile-health-allergies"
                  />
                )}
              />
            </FieldContainer>

            {/* Chronic Conditions */}
            <FieldContainer>
              <Label>{t('profile.healthInfo.chronicConditions')}</Label>
              {CHRONIC_CONDITIONS.map((condition) => (
                <ConditionRow
                  key={condition.id}
                  onPress={() => toggleCondition(condition.id)}
                  accessibilityRole="checkbox"
                  accessibilityState={{
                    checked: selectedConditions.includes(condition.id),
                  }}
                  accessibilityLabel={t(condition.labelKey)}
                  testID={`condition-${condition.id}`}
                >
                  <CheckboxBox
                    checked={selectedConditions.includes(condition.id)}
                  >
                    {selectedConditions.includes(condition.id) && (
                      <CheckboxMark>&#10003;</CheckboxMark>
                    )}
                  </CheckboxBox>
                  <ConditionLabel>{t(condition.labelKey)}</ConditionLabel>
                </ConditionRow>
              ))}
            </FieldContainer>

            {/* Continue Button */}
            <PrimaryButton
              onPress={handleSubmit(onSubmit)}
              accessibilityRole="button"
              accessibilityLabel={t('common.buttons.next')}
              testID="profile-health-continue"
            >
              <PrimaryButtonText>{t('common.buttons.next')}</PrimaryButtonText>
            </PrimaryButton>

            {/* Skip Link */}
            <SkipLink
              onPress={handleSkip}
              accessibilityRole="link"
              accessibilityLabel={t('onboarding.skip')}
              testID="profile-health-skip"
            >
              <SkipLinkText>{t('onboarding.skip')}</SkipLinkText>
            </SkipLink>
          </ContentWrapper>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default ProfileVariant1;
