import React, { useState } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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

const RelationshipLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: ${spacing.xs};
`;

const RelationshipGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${spacing.xs};
`;

const RelationshipOption = styled.TouchableOpacity<{ selected: boolean }>`
  padding-vertical: ${spacing.xs};
  padding-horizontal: ${spacing.md};
  border-radius: ${borderRadius.full};
  border-width: 1px;
  border-color: ${(props) =>
    props.selected ? colors.brand.primary : colors.gray[20]};
  background-color: ${(props) =>
    props.selected ? colors.brand.primary + '15' : colors.neutral.white};
`;

const RelationshipOptionText = styled.Text<{ selected: boolean }>`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${(props) =>
    props.selected ? colors.brand.primary : colors.gray[60]};
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
  fullName: string;
  dateOfBirth: string;
  cpf: string;
  relationship: string;
}

interface FormErrors {
  fullName?: string;
  dateOfBirth?: string;
  cpf?: string;
  relationship?: string;
}

const RELATIONSHIP_OPTIONS = ['Conjuge', 'Filho(a)', 'Pai', 'Mae', 'Outro'];

/**
 * AddDependent screen -- form to register a new dependent.
 * Fields: full name, date of birth (DD/MM/YYYY), CPF (masked numeric),
 * relationship selector. Validates all required fields before saving.
 */
export const AddDependentScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [form, setForm] = useState<FormState>({
    fullName: '',
    dateOfBirth: '',
    cpf: '',
    relationship: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const formatDateInput = (text: string): string => {
    const digits = text.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  };

  const formatCpfInput = (text: string): string => {
    const digits = text.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.fullName.trim() || form.fullName.trim().length < 3) {
      newErrors.fullName = t('settings.addDependent.validation.nameRequired');
    }

    if (!form.dateOfBirth || form.dateOfBirth.length < 10) {
      newErrors.dateOfBirth = t('settings.addDependent.validation.dobRequired');
    }

    const cpfDigits = form.cpf.replace(/\D/g, '');
    if (!cpfDigits || cpfDigits.length !== 11) {
      newErrors.cpf = t('settings.addDependent.validation.cpfInvalid');
    }

    if (!form.relationship) {
      newErrors.relationship = t('settings.addDependent.validation.relationshipRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      // TODO: call API to register dependent
      await new Promise((resolve) => setTimeout(resolve, 800));
      Alert.alert(
        t('settings.addDependent.success'),
        t('settings.addDependent.successMessage'),
      );
      navigation.goBack();
    } catch {
      Alert.alert(
        t('settings.addDependent.error'),
        t('settings.addDependent.errorMessage'),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
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
          contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
        >
          <ContentWrapper>
            <Title>{t('settings.addDependent.title')}</Title>

            {/* Full Name */}
            <FieldContainer>
              <Label>{t('settings.addDependent.fullName')}</Label>
              <StyledInput
                value={form.fullName}
                onChangeText={(val: string) => updateField('fullName', val)}
                placeholder={t('settings.addDependent.fullName')}
                placeholderTextColor={colors.gray[40]}
                hasError={!!errors.fullName}
                autoCapitalize="words"
                testID="add-dependent-fullname"
              />
              {errors.fullName && <ErrorText>{errors.fullName}</ErrorText>}
            </FieldContainer>

            {/* Date of Birth */}
            <FieldContainer>
              <Label>{t('settings.addDependent.dateOfBirth')}</Label>
              <StyledInput
                value={form.dateOfBirth}
                onChangeText={(val: string) =>
                  updateField('dateOfBirth', formatDateInput(val))
                }
                placeholder="DD/MM/AAAA"
                placeholderTextColor={colors.gray[40]}
                hasError={!!errors.dateOfBirth}
                keyboardType="numeric"
                maxLength={10}
                testID="add-dependent-dob"
              />
              {errors.dateOfBirth && <ErrorText>{errors.dateOfBirth}</ErrorText>}
            </FieldContainer>

            {/* CPF */}
            <FieldContainer>
              <Label>{t('settings.addDependent.cpf')}</Label>
              <StyledInput
                value={form.cpf}
                onChangeText={(val: string) =>
                  updateField('cpf', formatCpfInput(val))
                }
                placeholder="000.000.000-00"
                placeholderTextColor={colors.gray[40]}
                hasError={!!errors.cpf}
                keyboardType="numeric"
                maxLength={14}
                testID="add-dependent-cpf"
              />
              {errors.cpf && <ErrorText>{errors.cpf}</ErrorText>}
            </FieldContainer>

            {/* Relationship */}
            <FieldContainer>
              <RelationshipLabel>{t('settings.addDependent.relationship')}</RelationshipLabel>
              <RelationshipGrid>
                {RELATIONSHIP_OPTIONS.map((option) => (
                  <RelationshipOption
                    key={option}
                    selected={form.relationship === option}
                    onPress={() => updateField('relationship', option)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: form.relationship === option }}
                    accessibilityLabel={option}
                    testID={`add-dependent-rel-${option.toLowerCase()}`}
                  >
                    <RelationshipOptionText selected={form.relationship === option}>
                      {option}
                    </RelationshipOptionText>
                  </RelationshipOption>
                ))}
              </RelationshipGrid>
              {errors.relationship && <ErrorText>{errors.relationship}</ErrorText>}
            </FieldContainer>

            {/* Actions */}
            <PrimaryButton
              onPress={handleSave}
              disabled={isSaving}
              accessibilityRole="button"
              accessibilityLabel={t('settings.addDependent.save')}
              testID="add-dependent-save"
            >
              <PrimaryButtonText>
                {isSaving ? t('settings.addDependent.saving') : t('settings.addDependent.save')}
              </PrimaryButtonText>
            </PrimaryButton>

            <SecondaryButton
              onPress={handleCancel}
              accessibilityRole="button"
              accessibilityLabel={t('settings.addDependent.cancel')}
              testID="add-dependent-cancel"
            >
              <SecondaryButtonText>{t('settings.addDependent.cancel')}</SecondaryButtonText>
            </SecondaryButton>
          </ContentWrapper>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default AddDependentScreen;
