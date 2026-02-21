import React, { useEffect } from 'react';
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
 * Validation schema for address form.
 */
const addressSchema = yup.object().shape({
  cep: yup
    .string()
    .required('CEP is required')
    .matches(/^\d{8}$/, 'CEP must be 8 digits'),
  street: yup.string().required('Street is required'),
  number: yup.string().required('Number is required'),
  complement: yup.string().default(''),
  neighborhood: yup.string().required('Neighborhood is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
});

interface AddressFormData {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
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

const RowContainer = styled.View`
  flex-direction: row;
  gap: ${spacing.sm};
`;

const FlexFieldContainer = styled.View<{ flex?: number }>`
  flex: ${(props) => props.flex ?? 1};
  margin-bottom: ${spacing.lg};
`;

const StateGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${spacing['3xs']};
`;

const StateChip = styled.TouchableOpacity<{ selected: boolean }>`
  padding-horizontal: ${spacing.sm};
  padding-vertical: ${spacing.xs};
  border-radius: ${borderRadius.sm};
  border-width: 1px;
  border-color: ${(props) =>
    props.selected ? colors.brand.primary : colors.gray[20]};
  background-color: ${(props) =>
    props.selected ? colors.brandPalette[50] : colors.neutral.white};
  min-width: 44px;
  align-items: center;
`;

const StateText = styled.Text<{ selected: boolean }>`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${(props) =>
    props.selected
      ? typography.fontWeight.semiBold
      : typography.fontWeight.regular};
  color: ${(props) =>
    props.selected ? colors.brand.primary : colors.neutral.gray700};
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
 * ProfileAddress screen -- Step 4/7 of the profile onboarding flow.
 * Collects address: CEP (with auto-fill), street, number, complement,
 * neighborhood, city, state.
 */
const ProfileAddress: React.FC = () => {
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: yupResolver(addressSchema),
    mode: 'onBlur',
    defaultValues: {
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    },
  });

  const cep = watch('cep');
  const state = watch('state');

  /**
   * Auto-fill address fields when CEP reaches 8 digits.
   * TODO: Replace mock with real ViaCEP API call (https://viacep.com.br/ws/{cep}/json/)
   */
  useEffect(() => {
    if (cep && cep.replace(/\D/g, '').length === 8) {
      const cleanCep = cep.replace(/\D/g, '');

      // TODO: Replace with real API call:
      // fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      //   .then(res => res.json())
      //   .then(data => {
      //     if (!data.erro) {
      //       setValue('street', data.logradouro, { shouldValidate: true });
      //       setValue('neighborhood', data.bairro, { shouldValidate: true });
      //       setValue('city', data.localidade, { shouldValidate: true });
      //       setValue('state', data.uf, { shouldValidate: true });
      //     }
      //   })
      //   .catch(console.error);

      // Mock auto-fill for development
      setValue('street', 'Rua Example', { shouldValidate: true });
      setValue('neighborhood', 'Centro', { shouldValidate: true });
      setValue('city', 'Sao Paulo', { shouldValidate: true });
      setValue('state', 'SP', { shouldValidate: true });
    }
  }, [cep, setValue]);

  const onSubmit = (data: AddressFormData) => {
    // TODO: persist address to profile context/store
    navigation.navigate('ProfileDocuments' as never);
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
              <Title>Address</Title>
              <Subtitle>Where should we send communications?</Subtitle>
              <StepIndicator>Step 4 of 7</StepIndicator>
              <StepBarContainer>
                {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                  <StepDot key={step} active={step <= 4} />
                ))}
              </StepBarContainer>
            </HeaderSection>

            {/* CEP */}
            <FieldContainer>
              <Label>CEP (Postal Code)</Label>
              <Controller
                control={control}
                name="cep"
                render={({ field: { onChange, onBlur, value } }) => (
                  <StyledInput
                    value={value}
                    onChangeText={(text: string) =>
                      onChange(text.replace(/\D/g, ''))
                    }
                    onBlur={onBlur}
                    placeholder="00000000"
                    placeholderTextColor={colors.gray[40]}
                    hasError={!!errors.cep}
                    keyboardType="numeric"
                    maxLength={8}
                    testID="profile-address-cep"
                  />
                )}
              />
              {errors.cep && <ErrorText>{errors.cep.message}</ErrorText>}
            </FieldContainer>

            {/* Street */}
            <FieldContainer>
              <Label>Street</Label>
              <Controller
                control={control}
                name="street"
                render={({ field: { onChange, onBlur, value } }) => (
                  <StyledInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Street name"
                    placeholderTextColor={colors.gray[40]}
                    hasError={!!errors.street}
                    testID="profile-address-street"
                  />
                )}
              />
              {errors.street && (
                <ErrorText>{errors.street.message}</ErrorText>
              )}
            </FieldContainer>

            {/* Number + Complement */}
            <RowContainer>
              <FlexFieldContainer flex={1}>
                <Label>Number</Label>
                <Controller
                  control={control}
                  name="number"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <StyledInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="123"
                      placeholderTextColor={colors.gray[40]}
                      hasError={!!errors.number}
                      keyboardType="numeric"
                      testID="profile-address-number"
                    />
                  )}
                />
                {errors.number && (
                  <ErrorText>{errors.number.message}</ErrorText>
                )}
              </FlexFieldContainer>

              <FlexFieldContainer flex={2}>
                <Label>Complement</Label>
                <Controller
                  control={control}
                  name="complement"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <StyledInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Apt, Suite, etc."
                      placeholderTextColor={colors.gray[40]}
                      testID="profile-address-complement"
                    />
                  )}
                />
              </FlexFieldContainer>
            </RowContainer>

            {/* Neighborhood */}
            <FieldContainer>
              <Label>Neighborhood</Label>
              <Controller
                control={control}
                name="neighborhood"
                render={({ field: { onChange, onBlur, value } }) => (
                  <StyledInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Neighborhood"
                    placeholderTextColor={colors.gray[40]}
                    hasError={!!errors.neighborhood}
                    testID="profile-address-neighborhood"
                  />
                )}
              />
              {errors.neighborhood && (
                <ErrorText>{errors.neighborhood.message}</ErrorText>
              )}
            </FieldContainer>

            {/* City */}
            <FieldContainer>
              <Label>City</Label>
              <Controller
                control={control}
                name="city"
                render={({ field: { onChange, onBlur, value } }) => (
                  <StyledInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="City"
                    placeholderTextColor={colors.gray[40]}
                    hasError={!!errors.city}
                    testID="profile-address-city"
                  />
                )}
              />
              {errors.city && <ErrorText>{errors.city.message}</ErrorText>}
            </FieldContainer>

            {/* State */}
            <FieldContainer>
              <Label>State</Label>
              <StateGrid>
                {BRAZILIAN_STATES.map((st) => (
                  <StateChip
                    key={st}
                    selected={state === st}
                    onPress={() =>
                      setValue('state', st, { shouldValidate: true })
                    }
                    accessibilityRole="radio"
                    accessibilityState={{ selected: state === st }}
                    accessibilityLabel={`State ${st}`}
                    testID={`state-${st}`}
                  >
                    <StateText selected={state === st}>{st}</StateText>
                  </StateChip>
                ))}
              </StateGrid>
              {errors.state && (
                <ErrorText>{errors.state.message}</ErrorText>
              )}
            </FieldContainer>

            {/* Continue Button */}
            <PrimaryButton
              onPress={handleSubmit(onSubmit)}
              accessibilityRole="button"
              accessibilityLabel="Continue to documents"
              testID="profile-address-continue"
            >
              <PrimaryButtonText>Continue</PrimaryButtonText>
            </PrimaryButton>
          </ContentWrapper>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default ProfileAddress;
