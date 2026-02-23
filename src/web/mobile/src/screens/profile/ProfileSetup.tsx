import React from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { AuthNavigationProp } from '../../navigation/types';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import { colors } from '@design-system/tokens/colors';
import { typography, fontSizeValues } from '@design-system/tokens/typography';
import { spacing, spacingValues } from '@design-system/tokens/spacing';
import { borderRadius, borderRadiusValues } from '@design-system/tokens/borderRadius';
import { sizing, sizingValues } from '@design-system/tokens/sizing';

/**
 * Validation schema for the profile setup form.
 */
const createProfileSetupSchema = (t: (key: string, options?: any) => string) => yup.object().shape({
  fullName: yup
    .string()
    .required(t('common.validation.required'))
    .min(3, t('common.validation.minLength', { count: 3 })),
  email: yup
    .string()
    .email(t('common.validation.email'))
    .required(t('common.validation.required')),
  phone: yup
    .string()
    .required(t('common.validation.required'))
    .matches(/^\+?\d{10,14}$/, t('profileSetup.validation.phone')),
  dateOfBirth: yup
    .string()
    .required(t('common.validation.required'))
    .matches(
      /^\d{2}\/\d{2}\/\d{4}$/,
      t('profileSetup.validation.dateOfBirth'),
    ),
});

interface ProfileSetupFormData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}

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

const StyledInput = styled.TextInput<{ hasError?: boolean }>`
  height: ${sizing.component.md};
  border-width: 1px;
  border-color: ${(props) =>
    props.hasError ? colors.semantic.error : colors.gray[20]};
  border-radius: ${borderRadius.md};
  padding-horizontal: ${spacing.md};
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${({ theme }) => theme.colors.text.default};
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const ErrorText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${colors.semantic.error};
  margin-top: ${spacing['3xs']};
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

/**
 * ProfileSetup screen -- Step 1/7 of the profile onboarding flow.
 * Collects: full name, email (read-only), phone, date of birth.
 */
const ProfileSetup: React.FC = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ProfileSetupFormData>({
    resolver: yupResolver(createProfileSetupSchema(t as (key: string, options?: any) => string) as any),
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
    },
  });

  const onSubmit = (data: ProfileSetupFormData) => {
    // TODO: persist to profile context/store
    navigation.navigate('ProfileHealth');
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
              <Title>{t('profileSetup.title')}</Title>
              <StepIndicator>{t('profileSetup.stepIndicator', { current: 1, total: 7 })}</StepIndicator>
              <StepBarContainer>
                {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                  <StepDot key={step} active={step <= 1} />
                ))}
              </StepBarContainer>
            </HeaderSection>

            {/* Full Name */}
            <FieldContainer>
              <Label>{t('common.labels.name')}</Label>
              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <StyledInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder={t('profileSetup.fullNamePlaceholder')}
                    placeholderTextColor={colors.gray[40]}
                    hasError={!!errors.fullName}
                    autoCapitalize="words"
                    testID="profile-setup-fullname"
                  />
                )}
              />
              {errors.fullName && (
                <ErrorText>{errors.fullName.message}</ErrorText>
              )}
            </FieldContainer>

            {/* Email (read-only) */}
            <FieldContainer>
              <Label>{t('common.labels.email')}</Label>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <StyledInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="your@email.com"
                    placeholderTextColor={colors.gray[40]}
                    hasError={!!errors.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={false}
                    style={{ backgroundColor: colors.gray[10] }}
                    testID="profile-setup-email"
                  />
                )}
              />
              {errors.email && (
                <ErrorText>{errors.email.message}</ErrorText>
              )}
            </FieldContainer>

            {/* Phone */}
            <FieldContainer>
              <Label>{t('common.labels.phone')}</Label>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <StyledInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="+55 11 99999-9999"
                    placeholderTextColor={colors.gray[40]}
                    hasError={!!errors.phone}
                    keyboardType="phone-pad"
                    testID="profile-setup-phone"
                  />
                )}
              />
              {errors.phone && (
                <ErrorText>{errors.phone.message}</ErrorText>
              )}
            </FieldContainer>

            {/* Date of Birth */}
            <FieldContainer>
              <Label>{t('profileSetup.dateOfBirth')}</Label>
              <Controller
                control={control}
                name="dateOfBirth"
                render={({ field: { onChange, onBlur, value } }) => (
                  <StyledInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor={colors.gray[40]}
                    hasError={!!errors.dateOfBirth}
                    keyboardType="numeric"
                    maxLength={10}
                    testID="profile-setup-dob"
                  />
                )}
              />
              {errors.dateOfBirth && (
                <ErrorText>{errors.dateOfBirth.message}</ErrorText>
              )}
            </FieldContainer>

            {/* Continue Button */}
            <PrimaryButton
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid}
              accessibilityRole="button"
              accessibilityLabel={t('common.buttons.next')}
              testID="profile-setup-continue"
            >
              <PrimaryButtonText>{t('common.buttons.next')}</PrimaryButtonText>
            </PrimaryButton>
          </ContentWrapper>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default ProfileSetup;
