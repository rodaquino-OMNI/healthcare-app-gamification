import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components/native';

import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing, spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadius, borderRadiusValues } from '../../../../design-system/src/tokens/borderRadius';
import { sizing } from '../../../../design-system/src/tokens/sizing';

/**
 * Validation schema for health information form.
 */
const healthInfoSchema = yup.object().shape({
  bloodType: yup.string().required('Blood type is required'),
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
  { id: 'diabetes', label: 'Diabetes' },
  { id: 'hypertension', label: 'Hypertension' },
  { id: 'asthma', label: 'Asthma' },
  { id: 'heart_disease', label: 'Heart Disease' },
  { id: 'none', label: 'None of the above' },
];

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.neutral.white};
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
  color: ${colors.neutral.gray900};
  margin-bottom: ${spacing.xs};
`;

const Subtitle = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${colors.gray[50]};
  margin-bottom: ${spacing.xs};
`;

const StepIndicator = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.gray[50]};
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
  color: ${colors.neutral.gray700};
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
  color: ${colors.neutral.gray900};
  background-color: ${colors.neutral.white};
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
  color: ${colors.neutral.white};
  font-weight: ${typography.fontWeight.bold};
`;

const ConditionLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${colors.neutral.gray900};
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
  color: ${colors.neutral.white};
`;

const SkipLink = styled.TouchableOpacity`
  align-items: center;
  margin-top: ${spacing.md};
  padding-vertical: ${spacing.sm};
`;

const SkipLinkText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.gray[50]};
  text-decoration-line: underline;
`;

/**
 * ProfileVariant1 screen -- Step 2/7 of the profile onboarding flow.
 * Collects health information: blood type, allergies, chronic conditions.
 */
const ProfileVariant1: React.FC = () => {
  const navigation = useNavigation();
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HealthInfoFormData>({
    resolver: yupResolver(healthInfoSchema),
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

  const onSubmit = (data: HealthInfoFormData) => {
    // TODO: persist health info with selectedConditions to profile context/store
    navigation.navigate('ProfileVariant2' as never);
  };

  const handleSkip = () => {
    navigation.navigate('ProfileAddress' as never);
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
              <Title>Health Information</Title>
              <Subtitle>
                This helps us personalize your health journey
              </Subtitle>
              <StepIndicator>Step 2 of 7</StepIndicator>
              <StepBarContainer>
                {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                  <StepDot key={step} active={step <= 2} />
                ))}
              </StepBarContainer>
            </HeaderSection>

            {/* Blood Type */}
            <FieldContainer>
              <Label>Blood Type</Label>
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
              <Label>Allergies</Label>
              <Controller
                control={control}
                name="allergies"
                render={({ field: { onChange, onBlur, value } }) => (
                  <StyledInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="List any allergies (medications, food, etc.)"
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
              <Label>Chronic Conditions</Label>
              {CHRONIC_CONDITIONS.map((condition) => (
                <ConditionRow
                  key={condition.id}
                  onPress={() => toggleCondition(condition.id)}
                  accessibilityRole="checkbox"
                  accessibilityState={{
                    checked: selectedConditions.includes(condition.id),
                  }}
                  accessibilityLabel={condition.label}
                  testID={`condition-${condition.id}`}
                >
                  <CheckboxBox
                    checked={selectedConditions.includes(condition.id)}
                  >
                    {selectedConditions.includes(condition.id) && (
                      <CheckboxMark>&#10003;</CheckboxMark>
                    )}
                  </CheckboxBox>
                  <ConditionLabel>{condition.label}</ConditionLabel>
                </ConditionRow>
              ))}
            </FieldContainer>

            {/* Continue Button */}
            <PrimaryButton
              onPress={handleSubmit(onSubmit)}
              accessibilityRole="button"
              accessibilityLabel="Continue to insurance information"
              testID="profile-health-continue"
            >
              <PrimaryButtonText>Continue</PrimaryButtonText>
            </PrimaryButton>

            {/* Skip Link */}
            <SkipLink
              onPress={handleSkip}
              accessibilityRole="link"
              accessibilityLabel="Skip to address"
              testID="profile-health-skip"
            >
              <SkipLinkText>Skip</SkipLinkText>
            </SkipLink>
          </ContentWrapper>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default ProfileVariant1;
