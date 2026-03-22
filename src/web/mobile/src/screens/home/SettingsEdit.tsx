/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { borderRadius } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { sizing } from '@design-system/tokens/sizing';
import { spacing, spacingValues } from '@design-system/tokens/spacing';
import { typography } from '@design-system/tokens/typography';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

import { restClient } from '../../api/client';
import type { SettingsStackParamList } from '../../navigation/types';

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

const AvatarSection = styled.View`
    align-items: center;
    margin-bottom: ${spacing['2xl']};
`;

const AvatarPlaceholder = styled.View`
    width: 96px;
    height: 96px;
    border-radius: 48px;
    background-color: ${({ theme }) => theme.colors.background.subtle};
    align-items: center;
    justify-content: center;
    margin-bottom: ${spacing.sm};
`;

const AvatarInitials = styled.Text`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-xl']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.brand.primary};
`;

const AvatarImage = styled.Image`
    width: 96px;
    height: 96px;
    border-radius: 48px;
    margin-bottom: ${spacing.sm};
`;

const ChangePhotoButton = styled.TouchableOpacity`
    padding-vertical: ${spacing.xs};
    padding-horizontal: ${spacing.md};
`;

const ChangePhotoText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.brand.primary};
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

const StyledInput = styled.TextInput<{ hasError?: boolean; isDisabled?: boolean }>`
    height: ${sizing.component.md};
    border-width: 1px;
    border-color: ${(props) => (props.hasError ? colors.semantic.error : colors.gray[20])};
    border-radius: ${borderRadius.md};
    padding-horizontal: ${spacing.md};
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: ${(props) => (props.isDisabled ? colors.gray[40] : colors.neutral.gray900)};
    background-color: ${(props) => (props.isDisabled ? colors.gray[10] : colors.neutral.white)};
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

const LoadingContainer = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
`;

// --- Types ---

interface UserProfileResponse {
    name?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    cpf?: string;
    photoUrl?: string;
}

interface FormState {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    cpf: string;
}

interface FormErrors {
    fullName?: string;
    phone?: string;
}

/**
 * SettingsEdit screen -- allows the user to edit their profile information.
 *
 * Fields:
 *  - Avatar with "Alterar foto" action (camera or gallery via expo-image-picker)
 *  - Nome completo (editable, required)
 *  - Email (read-only)
 *  - Telefone (editable, validated)
 *  - Data de nascimento (editable, DD/MM/YYYY format)
 *  - CPF (read-only)
 *
 * Actions: "Salvar alteracoes" (primary), "Cancelar" (secondary)
 */
export const SettingsEditScreen: React.FC = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<SettingsStackParamList>>();

    const [form, setForm] = useState<FormState>({
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        cpf: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [photo, setPhoto] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const response = await restClient.get<UserProfileResponse>('/users/me');
                const data: UserProfileResponse = response.data ?? {};
                setForm({
                    fullName: data.name ?? data.fullName ?? '',
                    email: data.email ?? '',
                    phone: data.phone ?? '',
                    dateOfBirth: data.dateOfBirth ?? '',
                    cpf: data.cpf ?? '',
                });
                if (data.photoUrl) {
                    setPhoto(data.photoUrl);
                }
            } catch (err: unknown) {
                Alert.alert('Erro', err instanceof Error ? err.message : 'Erro inesperado.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const getInitials = (name: string): string => {
        const parts = name.trim().split(/\s+/);
        if (parts.length === 0) {
            return '?';
        }
        if (parts.length === 1) {
            return parts[0].charAt(0).toUpperCase();
        }
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    const updateField = (field: keyof FormState, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!form.fullName.trim() || form.fullName.trim().length < 3) {
            newErrors.fullName = t('settings.edit.validation.nameMin');
        }

        if (form.phone && !/^\+?\d{10,14}$/.test(form.phone.replace(/[\s\-()]/g, ''))) {
            newErrors.phone = t('settings.edit.validation.phoneInvalid');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePickImage = async (): Promise<void> => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled) {
            setPhoto(result.assets[0].uri);
        }
    };

    const handleTakePhoto = async (): Promise<void> => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled) {
            setPhoto(result.assets[0].uri);
        }
    };

    const handleChangePhoto = (): void => {
        Alert.alert(t('settings.edit.changePhoto'), t('settings.edit.chooseOption'), [
            { text: t('settings.edit.camera'), onPress: handleTakePhoto },
            { text: t('settings.edit.gallery'), onPress: handlePickImage },
            { text: t('common.buttons.cancel'), style: 'cancel' },
        ]);
    };

    const handleSave = async (): Promise<void> => {
        if (!validate()) {
            return;
        }

        setIsSaving(true);
        try {
            const formData = {
                name: form.fullName,
                phone: form.phone,
                dateOfBirth: form.dateOfBirth,
                ...(photo ? { photoUrl: photo } : {}),
            };
            await restClient.put('/users/me', formData);
            Alert.alert(t('settings.edit.alerts.successTitle'), t('settings.edit.alerts.successMessage'));
            navigation.goBack();
        } catch (err: unknown) {
            Alert.alert('Erro', err instanceof Error ? err.message : 'Erro inesperado.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = (): void => {
        navigation.goBack();
    };

    if (isLoading) {
        return (
            <Container>
                <LoadingContainer>
                    <ActivityIndicator size="large" color={colors.brand.primary} testID="settings-edit-loading" />
                </LoadingContainer>
            </Container>
        );
    }

    return (
        <Container>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
                >
                    <ContentWrapper>
                        {/* Avatar */}
                        <AvatarSection>
                            {photo ? (
                                <AvatarImage source={{ uri: photo }} />
                            ) : (
                                <AvatarPlaceholder>
                                    <AvatarInitials>{getInitials(form.fullName)}</AvatarInitials>
                                </AvatarPlaceholder>
                            )}
                            <ChangePhotoButton
                                onPress={handleChangePhoto}
                                accessibilityRole="button"
                                accessibilityLabel={t('settings.edit.changePhotoA11y')}
                                testID="settings-edit-change-photo"
                            >
                                <ChangePhotoText>{t('settings.edit.changePhoto')}</ChangePhotoText>
                            </ChangePhotoButton>
                        </AvatarSection>

                        {/* Nome completo */}
                        <FieldContainer>
                            <Label>{t('settings.edit.fullName')}</Label>
                            <StyledInput
                                value={form.fullName}
                                onChangeText={(val: string) => updateField('fullName', val)}
                                placeholder={t('settings.edit.fullNamePlaceholder')}
                                placeholderTextColor={colors.gray[40]}
                                hasError={!!errors.fullName}
                                autoCapitalize="words"
                                testID="settings-edit-fullname"
                            />
                            {errors.fullName && <ErrorText>{errors.fullName}</ErrorText>}
                        </FieldContainer>

                        {/* Email (read-only) */}
                        <FieldContainer>
                            <Label>{t('settings.edit.email')}</Label>
                            <StyledInput
                                value={form.email}
                                editable={false}
                                isDisabled
                                placeholderTextColor={colors.gray[40]}
                                testID="settings-edit-email"
                            />
                            <HelperText>{t('settings.edit.emailReadonly')}</HelperText>
                        </FieldContainer>

                        {/* Telefone */}
                        <FieldContainer>
                            <Label>{t('settings.edit.phone')}</Label>
                            <StyledInput
                                value={form.phone}
                                onChangeText={(val: string) => updateField('phone', val)}
                                placeholder="+55 11 99999-9999"
                                placeholderTextColor={colors.gray[40]}
                                hasError={!!errors.phone}
                                keyboardType="phone-pad"
                                testID="settings-edit-phone"
                            />
                            {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
                        </FieldContainer>

                        {/* Data de nascimento */}
                        <FieldContainer>
                            <Label>{t('settings.edit.dateOfBirth')}</Label>
                            <StyledInput
                                value={form.dateOfBirth}
                                onChangeText={(val: string) => updateField('dateOfBirth', val)}
                                placeholder="DD/MM/AAAA"
                                placeholderTextColor={colors.gray[40]}
                                keyboardType="numeric"
                                maxLength={10}
                                testID="settings-edit-dob"
                            />
                        </FieldContainer>

                        {/* CPF (read-only) */}
                        <FieldContainer>
                            <Label>{t('settings.edit.cpf')}</Label>
                            <StyledInput
                                value={form.cpf}
                                editable={false}
                                isDisabled
                                placeholder="000.000.000-00"
                                placeholderTextColor={colors.gray[40]}
                                testID="settings-edit-cpf"
                            />
                            <HelperText>{t('settings.edit.cpfReadonly')}</HelperText>
                        </FieldContainer>

                        {/* Actions */}
                        <PrimaryButton
                            onPress={handleSave}
                            disabled={isSaving}
                            accessibilityRole="button"
                            accessibilityLabel={t('settings.edit.save')}
                            testID="settings-edit-save"
                        >
                            <PrimaryButtonText>
                                {isSaving ? t('settings.edit.saving') : t('settings.edit.save')}
                            </PrimaryButtonText>
                        </PrimaryButton>

                        <SecondaryButton
                            onPress={handleCancel}
                            accessibilityRole="button"
                            accessibilityLabel={t('common.buttons.cancel')}
                            testID="settings-edit-cancel"
                        >
                            <SecondaryButtonText>{t('common.buttons.cancel')}</SecondaryButtonText>
                        </SecondaryButton>
                    </ContentWrapper>
                </ScrollView>
            </KeyboardAvoidingView>
        </Container>
    );
};

export default SettingsEditScreen;
