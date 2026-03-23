/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return -- Third-party native module lacks TypeScript definitions */
import { borderRadius } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { sizing } from '@design-system/tokens/sizing';
import { spacing } from '@design-system/tokens/spacing';
import { typography } from '@design-system/tokens/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
// eslint-disable-next-line import/no-unresolved -- Native module resolved at runtime
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import styled from 'styled-components/native';
import { z } from 'zod';

import { updateProfile } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import type { AuthNavigationProp } from '../../navigation/types';

/**
 * CPF validation: 11 digits after removing mask characters.
 */
const validateCPF = (value: string | undefined): boolean => {
    if (!value) {
        return false;
    }
    const digits = value.replace(/\D/g, '');
    return digits.length === 11;
};

/**
 * Formats CPF string to ###.###.###-## pattern.
 */
const formatCPF = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) {
        return digits;
    }
    if (digits.length <= 6) {
        return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    }
    if (digits.length <= 9) {
        return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    }
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

/**
 * Validation schema for document form.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- Render helper return type is inferred from JSX
const createDocumentsSchema = (t: (key: string, options?: Record<string, unknown>) => string) =>
    z.object({
        cpf: z
            .string()
            .min(1, t('common.validation.required'))
            .refine(validateCPF, { message: t('profile.documents.cpfFormat') }),
        rg: z.string().min(1, t('common.validation.required')),
    });

interface DocumentsFormData {
    cpf: string;
    rg: string;
}

type DocumentType = 'CPF' | 'RG' | 'CNH';

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
    background-color: ${(props) => (props.active ? colors.brand.primary : colors.gray[20])};
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
    border-color: ${(props) => (props.hasError ? colors.semantic.error : colors.gray[20])};
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
    border-color: ${(props) => (props.selected ? colors.brand.primary : colors.gray[20])};
    background-color: ${(props) => (props.selected ? colors.brandPalette[50] : colors.neutral.white)};
    align-items: center;
`;

const DocTypeText = styled.Text<{ selected: boolean }>`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${(props) => (props.selected ? typography.fontWeight.semiBold : typography.fontWeight.regular)};
    color: ${(props) => (props.selected ? colors.brand.primary : colors.neutral.gray700)};
`;

const UploadArea = styled.TouchableOpacity`
    border-width: 2px;
    border-color: ${({ theme }) => theme.colors.border.default};
    border-style: dashed;
    border-radius: ${borderRadius.lg};
    padding-vertical: ${spacing['3xl']};
    padding-horizontal: ${spacing.xl};
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.colors.background.muted};
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
    color: ${({ theme }) => theme.colors.text.subtle};
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
    background-color: ${(props) => (props.disabled ? colors.gray[30] : colors.brand.primary)};
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
 * ProfileDocuments screen -- Step 5/7 of the profile onboarding flow.
 * Collects: CPF (masked), RG, document type selection, document upload.
 */
const ProfileDocuments: React.FC = () => {
    const navigation = useNavigation<AuthNavigationProp>();
    const { t } = useTranslation();
    const { session } = useAuth();
    const [_saving, setSaving] = useState(false);
    const [documentUri, setDocumentUri] = useState<string | null>(null);
    const [selectedDocType, setSelectedDocType] = useState<DocumentType>('CPF');
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<DocumentsFormData>({
        resolver: zodResolver(createDocumentsSchema(t as (key: string, options?: Record<string, unknown>) => string)),
        mode: 'onBlur',
        defaultValues: {
            cpf: '',
            rg: '',
        },
    });

    /**
     * Opens document picker for file upload.
     * Uses expo-document-picker to select images or PDF documents.
     */
    const handleDocumentUpload = async (): Promise<void> => {
        try {
            /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call -- Third-party date library lacks strict typing */
            const result = await DocumentPicker.getDocumentAsync({
                type: ['image/*', 'application/pdf'],
                copyToCacheDirectory: true,
            });
            /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
            if (!result.canceled && result.assets && result.assets[0]) {
                setUploadedFileName(result.assets[0].name);
                setDocumentUri(result.assets[0].uri);
            }
        } catch (err: unknown) {
            Alert.alert(t('common.errors.default'), t('profile.documents.uploadError'));
        }
    };

    const onSubmit = async (data: DocumentsFormData): Promise<void> => {
        if (!session?.accessToken) {
            return;
        }
        setSaving(true);
        try {
            await updateProfile(session.accessToken, {
                documents: {
                    cpf: data.cpf,
                    rg: data.rg,
                    documentType: selectedDocType,
                    documentUrl: documentUri || undefined,
                },
            });
            navigation.navigate('ProfilePhoto');
        } catch (err: unknown) {
            Alert.alert(t('common.errors.default'), err instanceof Error ? err.message : t('common.errors.generic'));
        } finally {
            setSaving(false);
        }
    };

    return (
        <Container>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    <ContentWrapper>
                        {/* Header */}
                        <HeaderSection>
                            <Title>{t('profile.documents.title')}</Title>
                            <Subtitle>{t('profile.documents.subtitle')}</Subtitle>
                            <StepIndicator>{t('profileSetup.stepIndicator', { current: 5, total: 7 })}</StepIndicator>
                            <StepBarContainer>
                                {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                                    <StepDot key={step} active={step <= 5} />
                                ))}
                            </StepBarContainer>
                        </HeaderSection>

                        {/* CPF */}
                        <FieldContainer>
                            <Label>{t('profile.documents.cpfLabel')}</Label>
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
                            <Label>{t('profile.documents.rgLabel')}</Label>
                            <Controller
                                control={control}
                                name="rg"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <StyledInput
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        placeholder={t('profile.documents.rgPlaceholder')}
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
                            <Label>{t('profile.documents.docTypeLabel')}</Label>
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
                                        <DocTypeText selected={selectedDocType === type}>{type}</DocTypeText>
                                    </DocTypeChip>
                                ))}
                            </DocTypeRow>
                        </FieldContainer>

                        {/* Upload Area */}
                        {!uploadedFileName ? (
                            <UploadArea
                                onPress={() => void handleDocumentUpload()}
                                accessibilityRole="button"
                                accessibilityLabel={`Upload ${selectedDocType} document`}
                                testID="profile-docs-upload"
                            >
                                <UploadIcon>&#128247;</UploadIcon>
                                <UploadText>
                                    {t('profile.documents.uploadDocument', { type: selectedDocType })}
                                </UploadText>
                                <UploadHint>{t('profile.documents.uploadHint')}</UploadHint>
                            </UploadArea>
                        ) : (
                            <SelectedFileContainer>
                                <SelectedFileText numberOfLines={1}>{uploadedFileName}</SelectedFileText>
                            </SelectedFileContainer>
                        )}

                        {/* Continue Button */}
                        <PrimaryButton
                            onPress={() => void handleSubmit(onSubmit)()}
                            disabled={!isValid}
                            accessibilityRole="button"
                            accessibilityLabel={t('common.buttons.next')}
                            testID="profile-docs-continue"
                        >
                            <PrimaryButtonText>{t('common.buttons.next')}</PrimaryButtonText>
                        </PrimaryButton>
                    </ContentWrapper>
                </ScrollView>
            </KeyboardAvoidingView>
        </Container>
    );
};

export default ProfileDocuments;
