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

import { useAuth } from '../../hooks/useAuth';

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

const SelectorButton = styled.TouchableOpacity<{ isActive?: boolean }>`
    height: ${sizing.component.md};
    border-width: 1px;
    border-color: ${(props) => (props.isActive ? colors.brand.primary : colors.gray[20])};
    border-radius: ${borderRadius.md};
    padding-horizontal: ${spacing.md};
    justify-content: center;
    background-color: ${({ theme }) => theme.colors.background.default};
`;

const SelectorText = styled.Text<{ isPlaceholder?: boolean }>`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: ${(props) => (props.isPlaceholder ? colors.gray[40] : colors.neutral.gray900)};
`;

const OptionsContainer = styled.View`
    margin-top: ${spacing.xs};
    border-width: 1px;
    border-color: ${({ theme }) => theme.colors.border.default};
    border-radius: ${borderRadius.md};
    overflow: hidden;
`;

const OptionItem = styled.TouchableOpacity<{ isSelected?: boolean }>`
    padding-horizontal: ${spacing.md};
    padding-vertical: ${spacing.sm};
    background-color: ${(props) => (props.isSelected ? colors.gray[10] : colors.neutral.white)};
    border-bottom-width: 1px;
    border-bottom-color: ${colors.gray[10]};
`;

const OptionText = styled.Text<{ isSelected?: boolean }>`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${(props) => (props.isSelected ? typography.fontWeight.semiBold : typography.fontWeight.regular)};
    color: ${(props) => (props.isSelected ? colors.brand.primary : colors.neutral.gray900)};
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

// --- Types ---

type GenderOption = 'male' | 'female' | 'other' | 'preferNotToSay';
type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

interface FormState {
    fullName: string;
    dateOfBirth: string;
    gender: GenderOption | null;
    bloodType: BloodType | null;
    cpf: string;
}

const GENDER_OPTIONS: { key: GenderOption; labelKey: string }[] = [
    { key: 'male', labelKey: 'settings.personalInfo.genderOptions.male' },
    { key: 'female', labelKey: 'settings.personalInfo.genderOptions.female' },
    { key: 'other', labelKey: 'settings.personalInfo.genderOptions.other' },
    { key: 'preferNotToSay', labelKey: 'settings.personalInfo.genderOptions.preferNotToSay' },
];

const BLOOD_TYPES: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

/**
 * PersonalInfo screen -- full personal data edit form with avatar,
 * name, date of birth, gender selector, blood type selector, and CPF.
 */
export const PersonalInfoScreen: React.FC = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { session, getUserFromToken } = useAuth();
    const user = session?.accessToken ? getUserFromToken(session.accessToken) : null;

    const [form, setForm] = useState<FormState>({
        fullName: user?.name || '',
        dateOfBirth: '',
        gender: null,
        bloodType: null,
        cpf: '***.***.***-**',
    });

    const [errors, setErrors] = useState<{ fullName?: string }>({});
    const [isSaving, setIsSaving] = useState(false);
    const [showGender, setShowGender] = useState(false);
    const [showBloodType, setShowBloodType] = useState(false);

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

    const validate = (): boolean => {
        const newErrors: { fullName?: string } = {};
        if (!form.fullName.trim() || form.fullName.trim().length < 3) {
            newErrors.fullName = t('settings.personalInfo.validation.minLength');
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
            Alert.alert(t('settings.personalInfo.successTitle'), t('settings.personalInfo.successMessage'));
            navigation.goBack();
        } catch {
            Alert.alert(t('settings.personalInfo.errorTitle'), t('settings.personalInfo.errorMessage'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePhoto = (): void => {
        Alert.alert(t('settings.personalInfo.changePhoto'), '', [
            { text: 'Camera', onPress: () => {} },
            { text: 'Galeria', onPress: () => {} },
            { text: t('settings.personalInfo.cancel'), style: 'cancel' },
        ]);
    };

    const genderLabel = form.gender ? t(GENDER_OPTIONS.find((g) => g.key === form.gender)?.labelKey || '') : null;

    return (
        <Container>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
                >
                    <ContentWrapper>
                        <AvatarSection>
                            <AvatarPlaceholder>
                                <AvatarInitials>{getInitials(form.fullName)}</AvatarInitials>
                            </AvatarPlaceholder>
                            <ChangePhotoButton
                                onPress={handleChangePhoto}
                                accessibilityRole="button"
                                accessibilityLabel={t('settings.personalInfo.changePhoto')}
                                testID="personal-info-change-photo"
                            >
                                <ChangePhotoText>{t('settings.personalInfo.changePhoto')}</ChangePhotoText>
                            </ChangePhotoButton>
                        </AvatarSection>

                        <FieldContainer>
                            <Label>{t('settings.personalInfo.fullName')}</Label>
                            <StyledInput
                                value={form.fullName}
                                onChangeText={(val: string) => {
                                    setForm((prev) => ({ ...prev, fullName: val }));
                                    if (errors.fullName) {
                                        setErrors({});
                                    }
                                }}
                                placeholder={t('settings.personalInfo.fullName')}
                                placeholderTextColor={colors.gray[40]}
                                hasError={!!errors.fullName}
                                autoCapitalize="words"
                                accessibilityLabel={t('settings.personalInfo.fullName')}
                                testID="personal-info-fullname"
                            />
                            {errors.fullName && <ErrorText>{errors.fullName}</ErrorText>}
                        </FieldContainer>

                        <FieldContainer>
                            <Label>{t('settings.personalInfo.dateOfBirth')}</Label>
                            <StyledInput
                                value={form.dateOfBirth}
                                onChangeText={(val: string) => setForm((prev) => ({ ...prev, dateOfBirth: val }))}
                                placeholder="DD/MM/AAAA"
                                placeholderTextColor={colors.gray[40]}
                                keyboardType="numeric"
                                maxLength={10}
                                accessibilityLabel={t('settings.personalInfo.dateOfBirth')}
                                testID="personal-info-dob"
                            />
                        </FieldContainer>

                        <FieldContainer>
                            <Label>{t('settings.personalInfo.gender')}</Label>
                            <SelectorButton
                                onPress={() => {
                                    setShowGender(!showGender);
                                    setShowBloodType(false);
                                }}
                                isActive={showGender}
                                accessibilityRole="button"
                                accessibilityLabel={t('settings.personalInfo.gender')}
                                testID="personal-info-gender-selector"
                            >
                                <SelectorText isPlaceholder={!genderLabel}>
                                    {genderLabel || t('settings.personalInfo.gender')}
                                </SelectorText>
                            </SelectorButton>
                            {showGender && (
                                <OptionsContainer>
                                    {GENDER_OPTIONS.map((opt) => (
                                        <OptionItem
                                            key={opt.key}
                                            isSelected={form.gender === opt.key}
                                            onPress={() => {
                                                setForm((prev) => ({ ...prev, gender: opt.key }));
                                                setShowGender(false);
                                            }}
                                            accessibilityRole="radio"
                                            accessibilityState={{ selected: form.gender === opt.key }}
                                            testID={`personal-info-gender-${opt.key}`}
                                        >
                                            <OptionText isSelected={form.gender === opt.key}>
                                                {t(opt.labelKey)}
                                            </OptionText>
                                        </OptionItem>
                                    ))}
                                </OptionsContainer>
                            )}
                        </FieldContainer>

                        <FieldContainer>
                            <Label>{t('settings.personalInfo.bloodType')}</Label>
                            <SelectorButton
                                onPress={() => {
                                    setShowBloodType(!showBloodType);
                                    setShowGender(false);
                                }}
                                isActive={showBloodType}
                                accessibilityRole="button"
                                accessibilityLabel={t('settings.personalInfo.bloodType')}
                                testID="personal-info-blood-selector"
                            >
                                <SelectorText isPlaceholder={!form.bloodType}>
                                    {form.bloodType || t('settings.personalInfo.bloodType')}
                                </SelectorText>
                            </SelectorButton>
                            {showBloodType && (
                                <OptionsContainer>
                                    {BLOOD_TYPES.map((bt) => (
                                        <OptionItem
                                            key={bt}
                                            isSelected={form.bloodType === bt}
                                            onPress={() => {
                                                setForm((prev) => ({ ...prev, bloodType: bt }));
                                                setShowBloodType(false);
                                            }}
                                            accessibilityRole="radio"
                                            accessibilityState={{ selected: form.bloodType === bt }}
                                            testID={`personal-info-blood-${bt}`}
                                        >
                                            <OptionText isSelected={form.bloodType === bt}>{bt}</OptionText>
                                        </OptionItem>
                                    ))}
                                </OptionsContainer>
                            )}
                        </FieldContainer>

                        <FieldContainer>
                            <Label>{t('settings.personalInfo.cpf')}</Label>
                            <StyledInput
                                value={form.cpf}
                                editable={false}
                                isDisabled
                                placeholderTextColor={colors.gray[40]}
                                accessibilityLabel={t('settings.personalInfo.cpf')}
                                testID="personal-info-cpf"
                            />
                            <HelperText>{t('settings.personalInfo.cpfHelper')}</HelperText>
                        </FieldContainer>

                        <PrimaryButton
                            onPress={handleSave}
                            disabled={isSaving}
                            accessibilityRole="button"
                            accessibilityLabel={t('settings.personalInfo.save')}
                            testID="personal-info-save"
                        >
                            <PrimaryButtonText>
                                {isSaving ? t('settings.personalInfo.saving') : t('settings.personalInfo.save')}
                            </PrimaryButtonText>
                        </PrimaryButton>

                        <SecondaryButton
                            onPress={() => navigation.goBack()}
                            accessibilityRole="button"
                            accessibilityLabel={t('settings.personalInfo.cancel')}
                            testID="personal-info-cancel"
                        >
                            <SecondaryButtonText>{t('settings.personalInfo.cancel')}</SecondaryButtonText>
                        </SecondaryButton>
                    </ContentWrapper>
                </ScrollView>
            </KeyboardAvoidingView>
        </Container>
    );
};

export default PersonalInfoScreen;
