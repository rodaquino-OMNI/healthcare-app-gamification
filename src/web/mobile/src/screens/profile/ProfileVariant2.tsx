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
 * Validation schema for insurance information form.
 * Fields are optional when the user toggles "I don't have insurance".
 */
const insuranceSchema = yup.object().shape({
  provider: yup.string().when('$hasInsurance', {
    is: true,
    then: (schema) => schema.required('Insurance provider is required'),
    otherwise: (schema) => schema.default(''),
  }),
  planNumber: yup.string().when('$hasInsurance', {
    is: true,
    then: (schema) => schema.required('Plan number is required'),
    otherwise: (schema) => schema.default(''),
  }),
  groupNumber: yup.string().default(''),
  planType: yup.string().when('$hasInsurance', {
    is: true,
    then: (schema) => schema.required('Plan type is required'),
    otherwise: (schema) => schema.default(''),
  }),
});

interface InsuranceFormData {
  provider: string;
  planNumber: string;
  groupNumber: string;
  planType: string;
}

const PLAN_TYPES = [
  { value: 'basic', label: 'Basic' },
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' },
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

const StyledInput = styled.TextInput<{ hasError?: boolean }>`
  height: ${sizing.component.md};
  border-width: 1px;
  border-color: ${(props) =>
    props.hasError ? colors.semantic.error : colors.gray[20]};
  border-radius: ${borderRadius.md};
  padding-horizontal: ${spacing.md};
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${colors.neutral.gray900};
  background-color: ${colors.neutral.white};
`;

const ErrorText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${colors.semantic.error};
  margin-top: ${spacing['3xs']};
`;

const PlanTypeGrid = styled.View`
  flex-direction: row;
  gap: ${spacing.xs};
`;

const PlanTypeChip = styled.TouchableOpacity<{ selected: boolean }>`
  flex: 1;
  padding-vertical: ${spacing.sm};
  border-radius: ${borderRadius.md};
  border-width: 1px;
  border-color: ${(props) =>
    props.selected ? colors.journeys.plan.primary : colors.gray[20]};
  background-color: ${(props) =>
    props.selected ? colors.journeys.plan.background : colors.neutral.white};
  align-items: center;
`;

const PlanTypeText = styled.Text<{ selected: boolean }>`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${(props) =>
    props.selected
      ? typography.fontWeight.semiBold
      : typography.fontWeight.regular};
  color: ${(props) =>
    props.selected
      ? colors.journeys.plan.primary
      : colors.neutral.gray700};
`;

const ToggleRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-vertical: ${spacing.md};
  margin-bottom: ${spacing.md};
`;

const ToggleBox = styled.View<{ active: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: ${borderRadius.sm};
  border-width: 2px;
  border-color: ${(props) =>
    props.active ? colors.brand.primary : colors.gray[30]};
  background-color: ${(props) =>
    props.active ? colors.brand.primary : colors.neutral.white};
  align-items: center;
  justify-content: center;
  margin-right: ${spacing.sm};
`;

const ToggleMark = styled.Text`
  font-size: 12px;
  color: ${colors.neutral.white};
  font-weight: ${typography.fontWeight.bold};
`;

const ToggleLabel = styled.Text`
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

/**
 * ProfileVariant2 screen -- Step 3/7 of the profile onboarding flow.
 * Collects insurance information: provider, plan number, group number, plan type.
 */
const ProfileVariant2: React.FC = () => {
  const navigation = useNavigation();
  const [hasInsurance, setHasInsurance] = useState(true);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InsuranceFormData>({
    resolver: yupResolver(insuranceSchema),
    context: { hasInsurance },
    mode: 'onBlur',
    defaultValues: {
      provider: '',
      planNumber: '',
      groupNumber: '',
      planType: '',
    },
  });

  const planType = watch('planType');

  const onSubmit = (data: InsuranceFormData) => {
    // TODO: persist insurance info to profile context/store
    navigation.navigate('ProfileAddress' as never);
  };

  const toggleInsurance = () => {
    setHasInsurance((prev) => !prev);
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
              <Title>Insurance Information</Title>
              <Subtitle>
                Add your insurance details for easier claims
              </Subtitle>
              <StepIndicator>Step 3 of 7</StepIndicator>
              <StepBarContainer>
                {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                  <StepDot key={step} active={step <= 3} />
                ))}
              </StepBarContainer>
            </HeaderSection>

            {/* No Insurance Toggle */}
            <ToggleRow
              onPress={toggleInsurance}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: !hasInsurance }}
              accessibilityLabel="I don't have insurance"
              testID="profile-insurance-toggle"
            >
              <ToggleBox active={!hasInsurance}>
                {!hasInsurance && <ToggleMark>&#10003;</ToggleMark>}
              </ToggleBox>
              <ToggleLabel>I don't have insurance</ToggleLabel>
            </ToggleRow>

            {hasInsurance && (
              <>
                {/* Insurance Provider */}
                <FieldContainer>
                  <Label>Insurance Provider</Label>
                  <Controller
                    control={control}
                    name="provider"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <StyledInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="e.g. Unimed, Bradesco Saude"
                        placeholderTextColor={colors.gray[40]}
                        hasError={!!errors.provider}
                        autoCapitalize="words"
                        testID="profile-insurance-provider"
                      />
                    )}
                  />
                  {errors.provider && (
                    <ErrorText>{errors.provider.message}</ErrorText>
                  )}
                </FieldContainer>

                {/* Plan Number */}
                <FieldContainer>
                  <Label>Plan Number</Label>
                  <Controller
                    control={control}
                    name="planNumber"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <StyledInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Enter your plan number"
                        placeholderTextColor={colors.gray[40]}
                        hasError={!!errors.planNumber}
                        testID="profile-insurance-plan-number"
                      />
                    )}
                  />
                  {errors.planNumber && (
                    <ErrorText>{errors.planNumber.message}</ErrorText>
                  )}
                </FieldContainer>

                {/* Group Number */}
                <FieldContainer>
                  <Label>Group Number (Optional)</Label>
                  <Controller
                    control={control}
                    name="groupNumber"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <StyledInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Enter your group number"
                        placeholderTextColor={colors.gray[40]}
                        testID="profile-insurance-group-number"
                      />
                    )}
                  />
                </FieldContainer>

                {/* Plan Type */}
                <FieldContainer>
                  <Label>Plan Type</Label>
                  <PlanTypeGrid>
                    {PLAN_TYPES.map((type) => (
                      <PlanTypeChip
                        key={type.value}
                        selected={planType === type.value}
                        onPress={() =>
                          setValue('planType', type.value, {
                            shouldValidate: true,
                          })
                        }
                        accessibilityRole="radio"
                        accessibilityState={{
                          selected: planType === type.value,
                        }}
                        accessibilityLabel={`Plan type ${type.label}`}
                        testID={`plan-type-${type.value}`}
                      >
                        <PlanTypeText selected={planType === type.value}>
                          {type.label}
                        </PlanTypeText>
                      </PlanTypeChip>
                    ))}
                  </PlanTypeGrid>
                  {errors.planType && (
                    <ErrorText>{errors.planType.message}</ErrorText>
                  )}
                </FieldContainer>
              </>
            )}

            {/* Continue Button */}
            <PrimaryButton
              onPress={handleSubmit(onSubmit)}
              accessibilityRole="button"
              accessibilityLabel="Continue to address"
              testID="profile-insurance-continue"
            >
              <PrimaryButtonText>Continue</PrimaryButtonText>
            </PrimaryButton>
          </ContentWrapper>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default ProfileVariant2;
