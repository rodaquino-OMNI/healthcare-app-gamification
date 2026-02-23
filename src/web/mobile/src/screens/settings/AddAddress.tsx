import React, { useState } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

const HelperText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${({ theme }) => theme.colors.text.muted};
  margin-top: ${spacing['3xs']};
`;

const LabelPickerRow = styled.View`
  flex-direction: row;
  gap: ${spacing.xs};
`;

const LabelOption = styled.TouchableOpacity<{ selected: boolean }>`
  flex: 1;
  padding-vertical: ${spacing.sm};
  border-radius: ${borderRadius.md};
  border-width: 1px;
  border-color: ${(props) =>
    props.selected ? colors.brand.primary : colors.gray[20]};
  background-color: ${(props) =>
    props.selected ? colors.brand.primary + '15' : colors.neutral.white};
  align-items: center;
`;

const LabelOptionText = styled.Text<{ selected: boolean }>`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${(props) =>
    props.selected ? colors.brand.primary : colors.gray[60]};
`;

const RowFields = styled.View`
  flex-direction: row;
  gap: ${spacing.sm};
`;

const HalfField = styled.View`
  flex: 1;
`;

const ToggleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: ${spacing.md};
  border-top-width: 1px;
  border-top-color: ${colors.gray[10]};
  margin-top: ${spacing.sm};
`;

const ToggleLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.text.default};
  flex: 1;
  margin-right: ${spacing.md};
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

const SecondaryButton = styled.TouchableOpacity`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.default};
  border-radius: ${borderRadius.md};
  height: ${sizing.component.lg};
  align-items: center;
  justify-content: center;
  margin-top: ${spacing.sm};
`;

const SecondaryButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.default};
`;

// --- Types ---

interface FormState {
  label: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  isPrimary: boolean;
}

const LABEL_OPTIONS = ['Casa', 'Trabalho', 'Outro'];

/**
 * AddAddress screen -- address registration form with CEP auto-fill.
 * Fields: label picker, CEP (triggers auto-fill at 8 digits), street, number,
 * complement, neighborhood, city, state, primary toggle.
 */
export const AddAddressScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [form, setForm] = useState<FormState>({
    label: 'Casa',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    isPrimary: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isCepLoading, setIsCepLoading] = useState(false);

  const updateField = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const formatCep = (text: string): string => {
    const digits = text.replace(/\D/g, '');
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
  };

  const handleCepChange = (text: string) => {
    const formatted = formatCep(text);
    updateField('cep', formatted);

    const digits = text.replace(/\D/g, '');
    if (digits.length === 8) {
      setIsCepLoading(true);
      // Mock auto-fill after CEP reaches 8 digits
      setTimeout(() => {
        setForm((prev) => ({
          ...prev,
          street: 'Rua Auto-Preenchida',
          neighborhood: 'Centro',
          city: 'Sao Paulo',
          state: 'SP',
        }));
        setIsCepLoading(false);
      }, 600);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.cep || form.cep.replace(/\D/g, '').length !== 8) {
      newErrors.cep = t('settings.addAddress.validation.cepRequired');
    }
    if (!form.street.trim()) {
      newErrors.street = t('settings.addAddress.validation.streetRequired');
    }
    if (!form.number.trim()) {
      newErrors.number = t('settings.addAddress.validation.numberRequired');
    }
    if (!form.neighborhood.trim()) {
      newErrors.neighborhood = t('settings.addAddress.validation.neighborhoodRequired');
    }
    if (!form.city.trim()) {
      newErrors.city = t('settings.addAddress.validation.cityRequired');
    }
    if (!form.state.trim()) {
      newErrors.state = t('settings.addAddress.validation.stateRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      Alert.alert(t('settings.addAddress.success'), t('settings.addAddress.successMessage'));
      navigation.goBack();
    } catch {
      Alert.alert(t('settings.addAddress.error'), t('settings.addAddress.errorMessage'));
    } finally {
      setIsSaving(false);
    }
  };

  const trackColor = { false: colors.gray[20], true: colors.brand.primary };

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
        >
          <ContentWrapper>
            <Title>{t('settings.addAddress.title')}</Title>

            {/* Label Picker */}
            <FieldContainer>
              <Label>{t('settings.addAddress.label')}</Label>
              <LabelPickerRow>
                {LABEL_OPTIONS.map((option) => (
                  <LabelOption
                    key={option}
                    selected={form.label === option}
                    onPress={() => updateField('label', option)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: form.label === option }}
                    accessibilityLabel={option}
                    testID={`add-address-label-${option.toLowerCase()}`}
                  >
                    <LabelOptionText selected={form.label === option}>
                      {option}
                    </LabelOptionText>
                  </LabelOption>
                ))}
              </LabelPickerRow>
            </FieldContainer>

            {/* CEP */}
            <FieldContainer>
              <Label>{t('settings.addAddress.cep')}</Label>
              <StyledInput
                value={form.cep}
                onChangeText={handleCepChange}
                placeholder="00000-000"
                placeholderTextColor={colors.gray[40]}
                hasError={!!errors.cep}
                keyboardType="numeric"
                maxLength={9}
                testID="add-address-cep"
              />
              {isCepLoading && <HelperText>{t('settings.addAddress.cepLoading')}</HelperText>}
              {errors.cep && <ErrorText>{errors.cep}</ErrorText>}
            </FieldContainer>

            {/* Street */}
            <FieldContainer>
              <Label>{t('settings.addAddress.street')}</Label>
              <StyledInput
                value={form.street}
                onChangeText={(val: string) => updateField('street', val)}
                placeholder={t('settings.addAddress.street')}
                placeholderTextColor={colors.gray[40]}
                hasError={!!errors.street}
                testID="add-address-street"
              />
              {errors.street && <ErrorText>{errors.street}</ErrorText>}
            </FieldContainer>

            {/* Number + Complement */}
            <RowFields>
              <HalfField>
                <FieldContainer>
                  <Label>{t('settings.addAddress.number')}</Label>
                  <StyledInput
                    value={form.number}
                    onChangeText={(val: string) => updateField('number', val)}
                    placeholder={t('settings.addAddress.number')}
                    placeholderTextColor={colors.gray[40]}
                    hasError={!!errors.number}
                    keyboardType="numeric"
                    testID="add-address-number"
                  />
                  {errors.number && <ErrorText>{errors.number}</ErrorText>}
                </FieldContainer>
              </HalfField>
              <HalfField>
                <FieldContainer>
                  <Label>{t('settings.addAddress.complement')}</Label>
                  <StyledInput
                    value={form.complement}
                    onChangeText={(val: string) => updateField('complement', val)}
                    placeholder={t('settings.addAddress.complement')}
                    placeholderTextColor={colors.gray[40]}
                    testID="add-address-complement"
                  />
                </FieldContainer>
              </HalfField>
            </RowFields>

            {/* Neighborhood */}
            <FieldContainer>
              <Label>{t('settings.addAddress.neighborhood')}</Label>
              <StyledInput
                value={form.neighborhood}
                onChangeText={(val: string) => updateField('neighborhood', val)}
                placeholder={t('settings.addAddress.neighborhood')}
                placeholderTextColor={colors.gray[40]}
                hasError={!!errors.neighborhood}
                testID="add-address-neighborhood"
              />
              {errors.neighborhood && <ErrorText>{errors.neighborhood}</ErrorText>}
            </FieldContainer>

            {/* City + State */}
            <RowFields>
              <HalfField>
                <FieldContainer>
                  <Label>{t('settings.addAddress.city')}</Label>
                  <StyledInput
                    value={form.city}
                    onChangeText={(val: string) => updateField('city', val)}
                    placeholder={t('settings.addAddress.city')}
                    placeholderTextColor={colors.gray[40]}
                    hasError={!!errors.city}
                    testID="add-address-city"
                  />
                  {errors.city && <ErrorText>{errors.city}</ErrorText>}
                </FieldContainer>
              </HalfField>
              <HalfField>
                <FieldContainer>
                  <Label>{t('settings.addAddress.state')}</Label>
                  <StyledInput
                    value={form.state}
                    onChangeText={(val: string) => updateField('state', val)}
                    placeholder="SP"
                    placeholderTextColor={colors.gray[40]}
                    hasError={!!errors.state}
                    maxLength={2}
                    autoCapitalize="characters"
                    testID="add-address-state"
                  />
                  {errors.state && <ErrorText>{errors.state}</ErrorText>}
                </FieldContainer>
              </HalfField>
            </RowFields>

            {/* Primary toggle */}
            <ToggleRow>
              <ToggleLabel>{t('settings.addAddress.setPrimary')}</ToggleLabel>
              <Switch
                value={form.isPrimary}
                onValueChange={(val) => updateField('isPrimary', val)}
                trackColor={trackColor}
                thumbColor={colors.neutral.white}
                accessibilityLabel={t('settings.addAddress.setPrimary')}
                testID="add-address-primary-toggle"
              />
            </ToggleRow>

            {/* Actions */}
            <PrimaryButton
              onPress={handleSave}
              disabled={isSaving}
              accessibilityRole="button"
              accessibilityLabel={t('settings.addAddress.save')}
              testID="add-address-save"
            >
              <PrimaryButtonText>
                {isSaving ? t('settings.addAddress.saving') : t('settings.addAddress.save')}
              </PrimaryButtonText>
            </PrimaryButton>

            <SecondaryButton
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel={t('settings.addAddress.cancel')}
              testID="add-address-cancel"
            >
              <SecondaryButtonText>{t('settings.addAddress.cancel')}</SecondaryButtonText>
            </SecondaryButton>
          </ContentWrapper>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default AddAddressScreen;
