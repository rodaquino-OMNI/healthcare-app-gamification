import { borderRadius } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { sizing } from '@design-system/tokens/sizing';
import { spacing, spacingValues } from '@design-system/tokens/spacing';
import { typography } from '@design-system/tokens/typography';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import styled from 'styled-components/native';

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

const StrengthBarContainer = styled.View`
    flex-direction: row;
    margin-top: ${spacing.xs};
    gap: ${spacing.xs};
`;

const StrengthSegment = styled.View<{ isActive: boolean; color: string }>`
    flex: 1;
    height: 4px;
    border-radius: 2px;
    background-color: ${(props) => (props.isActive ? props.color : colors.gray[20])};
`;

const StrengthText = styled.Text<{ color: string }>`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    font-weight: ${typography.fontWeight.medium};
    color: ${(props) => props.color};
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

// --- Types ---

interface FormErrors {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

type StrengthLevel = 'weak' | 'medium' | 'strong';

/**
 * ChangePassword screen -- allows the user to change their password
 * with strength validation and confirmation matching.
 */
export const ChangePasswordScreen: React.FC = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSaving, setIsSaving] = useState(false);

    const getPasswordStrength = (password: string): StrengthLevel => {
        if (password.length < 6) {
            return 'weak';
        }
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);
        const score = [password.length >= 8, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;
        if (score >= 3) {
            return 'strong';
        }
        if (score >= 2) {
            return 'medium';
        }
        return 'weak';
    };

    const strengthLevel = getPasswordStrength(newPassword);

    const strengthConfig: Record<StrengthLevel, { color: string; segments: number; label: string }> = {
        weak: { color: colors.semantic.error, segments: 1, label: t('settings.changePassword.strength.weak') },
        medium: { color: colors.semantic.warning, segments: 2, label: t('settings.changePassword.strength.medium') },
        strong: { color: colors.semantic.success, segments: 3, label: t('settings.changePassword.strength.strong') },
    };

    const currentStrength = strengthConfig[strengthLevel];

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!currentPassword) {
            newErrors.currentPassword = t('settings.changePassword.validation.required');
        }

        if (newPassword.length < 8) {
            newErrors.newPassword = t('settings.changePassword.validation.minLength');
        } else if (!/[A-Z]/.test(newPassword)) {
            newErrors.newPassword = t('settings.changePassword.validation.uppercase');
        } else if (!/[0-9]/.test(newPassword)) {
            newErrors.newPassword = t('settings.changePassword.validation.number');
        }

        if (confirmPassword !== newPassword) {
            newErrors.confirmPassword = t('settings.changePassword.validation.match');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async (): Promise<void> => {
        if (!validate()) {
            return;
        }
        setIsSaving(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));
            Alert.alert(t('settings.changePassword.success'), t('settings.changePassword.successMessage'));
            navigation.goBack();
        } catch {
            Alert.alert(t('settings.changePassword.error'), t('settings.changePassword.errorMessage'));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Container>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
                >
                    <ContentWrapper>
                        <FieldContainer>
                            <Label>{t('settings.changePassword.currentPassword')}</Label>
                            <StyledInput
                                value={currentPassword}
                                onChangeText={(val: string) => {
                                    setCurrentPassword(val);
                                    if (errors.currentPassword) {
                                        setErrors((prev) => ({ ...prev, currentPassword: undefined }));
                                    }
                                }}
                                secureTextEntry
                                placeholder={t('settings.changePassword.currentPassword')}
                                placeholderTextColor={colors.gray[40]}
                                hasError={!!errors.currentPassword}
                                accessibilityLabel={t('settings.changePassword.currentPassword')}
                                testID="change-password-current"
                            />
                            {errors.currentPassword && <ErrorText>{errors.currentPassword}</ErrorText>}
                        </FieldContainer>

                        <FieldContainer>
                            <Label>{t('settings.changePassword.newPassword')}</Label>
                            <StyledInput
                                value={newPassword}
                                onChangeText={(val: string) => {
                                    setNewPassword(val);
                                    if (errors.newPassword) {
                                        setErrors((prev) => ({ ...prev, newPassword: undefined }));
                                    }
                                }}
                                secureTextEntry
                                placeholder={t('settings.changePassword.newPassword')}
                                placeholderTextColor={colors.gray[40]}
                                hasError={!!errors.newPassword}
                                accessibilityLabel={t('settings.changePassword.newPassword')}
                                testID="change-password-new"
                            />
                            {newPassword.length > 0 && (
                                <>
                                    <StrengthBarContainer>
                                        {[1, 2, 3].map((seg) => (
                                            <StrengthSegment
                                                key={seg}
                                                isActive={seg <= currentStrength.segments}
                                                color={currentStrength.color}
                                            />
                                        ))}
                                    </StrengthBarContainer>
                                    <StrengthText color={currentStrength.color}>{currentStrength.label}</StrengthText>
                                </>
                            )}
                            {errors.newPassword && <ErrorText>{errors.newPassword}</ErrorText>}
                        </FieldContainer>

                        <FieldContainer>
                            <Label>{t('settings.changePassword.confirmPassword')}</Label>
                            <StyledInput
                                value={confirmPassword}
                                onChangeText={(val: string) => {
                                    setConfirmPassword(val);
                                    if (errors.confirmPassword) {
                                        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                                    }
                                }}
                                secureTextEntry
                                placeholder={t('settings.changePassword.confirmPassword')}
                                placeholderTextColor={colors.gray[40]}
                                hasError={!!errors.confirmPassword}
                                accessibilityLabel={t('settings.changePassword.confirmPassword')}
                                testID="change-password-confirm"
                            />
                            {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
                        </FieldContainer>

                        <PrimaryButton
                            onPress={handleSave}
                            disabled={isSaving}
                            accessibilityRole="button"
                            accessibilityLabel={t('settings.changePassword.save')}
                            testID="change-password-save"
                        >
                            <PrimaryButtonText>
                                {isSaving ? t('settings.changePassword.saving') : t('settings.changePassword.save')}
                            </PrimaryButtonText>
                        </PrimaryButton>
                    </ContentWrapper>
                </ScrollView>
            </KeyboardAvoidingView>
        </Container>
    );
};

export default ChangePasswordScreen;
