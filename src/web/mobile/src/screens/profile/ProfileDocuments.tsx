import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components/native';

import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing, spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadius, borderRadiusValues } from '../../../../design-system/src/tokens/borderRadius';
import { sizing, sizingValues } from '../../../../design-system/src/tokens/sizing';

/**
 * CPF validation: 11 digits after removing mask characters.
 */
const validateCPF = (value: string | undefined): boolean => {
  if (!value) return false;
  const digits = value.replace(/\D/g, '');
  return digits.length === 11;
};

/**
 * Formats CPF string to ###.###.###-## pattern.
 */
const formatCPF = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

/**
 * Validation schema for document form.
 */
const documentsSchema = yup.object().shape({
  cpf: yup
    .string()
    .required('CPF is required')
    .test('valid-cpf', 'CPF must have 11 digits', validateCPF),
  rg: yup.string().required('RG is required'),
});

interface DocumentsFormData {
  cpf: string;
  rg: string;
}

type DocumentType = 'CPF' | 'RG' | 'CNH';

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

const DocTypeRow = styled.View`
  flex-direction: row;
  gap: ${spacing.xs};
  margin-bottom: ${spacing.lg};
`;

const DocTypeChip = styled.TouchableOpacity<{ selected: boolean }>`
  flex: 1;
  padding-vertical: ${spacing.sm};
  border-radius: ${borderRadius.md};
  border-width: 1px;
  border-color: ${(props) =>
    props.selected ? colors.brand.primary : colors.gray[20]};
  background-color: ${(props) =>
    props.selected ? colors.brandPalette[50] : colors.neutral.white};
  align-items: center;
`;

const DocTypeText = styled.Text<{ selected: boolean }>`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${(props) =>
    props.selected
      ? typography.fontWeight.semiBold
      : typography.fontWeight.regular};
  color: ${(props) =>
    props.selected ? colors.brand.primary : colors.neutral.gray700};
`;

const UploadArea = styled.TouchableOpacity`
  border-width: 2px;
  border-color: ${colors.gray[20]};
  border-style: dashed;
  border-radius: ${borderRadius.lg};
  padding-vertical: ${spacing['3xl']};
  padding-horizontal: ${spacing.xl};
  align-items: center;
  justify-content: center;
  background-color: ${colors.gray[5]};
  margin-bottom: ${spacing.lg};
`;

const UploadIcon = styled.Text`
  font-size: 36px;
  margin-bottom: ${spacing.sm};
`;

const UploadText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.brand.primary};
  margin-bottom: ${spacing['3xs']};
`;

const UploadHint = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${colors.gray[40]};
`;

const SelectedFileContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${spacing.sm};
  background-color: ${colors.semantic.successBg};
  border-radius: ${borderRadius.md};
  margin-bottom: ${spacing.lg};
`;

const SelectedFileText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.semantic.success};
  margin-left: ${spacing.xs};
  flex: 1;
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
 * ProfileDocuments screen -- Step 5/7 of the profile onboarding flow.
 * Collects: CPF (masked), RG, document type selection, document upload.
 */
const ProfileDocuments: React.FC = () => {
  const navigation = useNavigation();
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>('CPF');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<DocumentsFormData>({
    resolver: yupResolver(documentsSchema),
    mode: 'onBlur',
    defaultValues: {
      cpf: '',
      rg: '',
    },
  });

  /**
   * Opens document picker for file upload.
   * Uses react-native-document-picker pattern.
   */
  const handleDocumentUpload = async () => {
    try {
      // TODO: Replace with real document picker integration:
      // import DocumentPicker from 'react-native-document-picker';
      // const result = await DocumentPicker.pick({
      //   type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      // });
      // setUploadedFileName(result[0].name);

      // Mock for development
      setUploadedFileName(`document_${selectedDocType.toLowerCase()}.pdf`);
    } catch (err: unknown) {
      // User cancelled the picker or an error occurred
      const error = err as { code?: string };
      if (error.code !== 'DOCUMENT_PICKER_CANCELED') {
        Alert.alert('Error', 'Failed to pick document. Please try again.');
      }
    }
  };

  const onSubmit = (data: DocumentsFormData) => {
    // TODO: persist documents info to profile context/store
    navigation.navigate('ProfilePhoto' as never);
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
              <Title>Documents</Title>
              <Subtitle>
                Verify your identity for secure access
              </Subtitle>
              <StepIndicator>Step 5 of 7</StepIndicator>
              <StepBarContainer>
                {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                  <StepDot key={step} active={step <= 5} />
                ))}
              </StepBarContainer>
            </HeaderSection>

            {/* CPF */}
            <FieldContainer>
              <Label>CPF</Label>
              <Controller
                control={control}
                name="cpf"
                render={({ field: { onChange, onBlur, value } }) => (
                  <StyledInput
                    value={value}
                    onChangeText={(text: string) => onChange(formatCPF(text))}
                    onBlur={onBlur}
                    placeholder="000.000.000-00"
                    placeholderTextColor={colors.gray[40]}
                    hasError={!!errors.cpf}
                    keyboardType="numeric"
                    maxLength={14}
                    testID="profile-docs-cpf"
                  />
                )}
              />
              {errors.cpf && <ErrorText>{errors.cpf.message}</ErrorText>}
            </FieldContainer>

            {/* RG */}
            <FieldContainer>
              <Label>RG</Label>
              <Controller
                control={control}
                name="rg"
                render={({ field: { onChange, onBlur, value } }) => (
                  <StyledInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter your RG number"
                    placeholderTextColor={colors.gray[40]}
                    hasError={!!errors.rg}
                    testID="profile-docs-rg"
                  />
                )}
              />
              {errors.rg && <ErrorText>{errors.rg.message}</ErrorText>}
            </FieldContainer>

            {/* Document Type Selector */}
            <FieldContainer>
              <Label>Document Type to Upload</Label>
              <DocTypeRow>
                {(['CPF', 'RG', 'CNH'] as DocumentType[]).map((type) => (
                  <DocTypeChip
                    key={type}
                    selected={selectedDocType === type}
                    onPress={() => setSelectedDocType(type)}
                    accessibilityRole="radio"
                    accessibilityState={{
                      selected: selectedDocType === type,
                    }}
                    accessibilityLabel={`Document type ${type}`}
                    testID={`doc-type-${type}`}
                  >
                    <DocTypeText selected={selectedDocType === type}>
                      {type}
                    </DocTypeText>
                  </DocTypeChip>
                ))}
              </DocTypeRow>
            </FieldContainer>

            {/* Upload Area */}
            {!uploadedFileName ? (
              <UploadArea
                onPress={handleDocumentUpload}
                accessibilityRole="button"
                accessibilityLabel={`Upload ${selectedDocType} document`}
                testID="profile-docs-upload"
              >
                <UploadIcon>&#128247;</UploadIcon>
                <UploadText>
                  Upload {selectedDocType} Document
                </UploadText>
                <UploadHint>
                  Tap to take a photo or choose a file
                </UploadHint>
              </UploadArea>
            ) : (
              <SelectedFileContainer>
                <SelectedFileText numberOfLines={1}>
                  {uploadedFileName}
                </SelectedFileText>
              </SelectedFileContainer>
            )}

            {/* Continue Button */}
            <PrimaryButton
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid}
              accessibilityRole="button"
              accessibilityLabel="Continue to profile photo"
              testID="profile-docs-continue"
            >
              <PrimaryButtonText>Continue</PrimaryButtonText>
            </PrimaryButton>
          </ContentWrapper>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default ProfileDocuments;
