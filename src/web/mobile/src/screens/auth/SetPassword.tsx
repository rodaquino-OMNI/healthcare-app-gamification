/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { borderRadiusValues } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { sizingValues } from '@design-system/tokens/sizing';
import { spacingValues } from '@design-system/tokens/spacing';
import { typography, fontSizeValues } from '@design-system/tokens/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import React, { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { z } from 'zod';

import { setPassword } from '../../api/auth';
import { ROUTES } from '../../constants/routes';
import type { AuthNavigationProp, AuthStackParamList } from '../../navigation/types';

// --- Constants ---

/**
 * Password strength levels with corresponding colors and labels
 */
const STRENGTH_LEVELS = {
    none: { labelKey: '', color: colors.neutral.gray300, progress: 0 },
    weak: { labelKey: 'auth.setPassword.strength.weak', color: colors.semantic.error, progress: 25 },
    fair: { labelKey: 'auth.setPassword.strength.fair', color: colors.semantic.warning, progress: 50 },
    good: { labelKey: 'auth.setPassword.strength.good', color: colors.semantic.success, progress: 75 },
    strong: { labelKey: 'auth.setPassword.strength.strong', color: colors.semantic.success, progress: 100 },
} as const;

type StrengthLevel = keyof typeof STRENGTH_LEVELS;

/**
 * Validation criteria for password strength
 */
interface PasswordCriteria {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
}

// --- Validation Schema ---

const setPasswordSchema = (t: (key: string, options?: Record<string, unknown>) => string) =>
    z
        .object({
            password: z
                .string()
                .min(1, t('common.validation.required'))
                .min(8, t('common.validation.minLength', { count: 8 })),
            confirmPassword: z.string().min(1, t('common.validation.required')),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: t('auth.setPassword.passwordsMustMatch'),
            path: ['confirmPassword'],
        });

type SetPasswordFormData = {
    password: string;
    confirmPassword: string;
};

// --- Styled Components ---

const Container = styled.View`
    flex: 1;
    padding: ${spacingValues.xl}px;
    background-color: ${({ theme }) => theme.colors.background.default};
    justify-content: center;
`;

const Title = styled.Text`
    font-size: ${fontSizeValues['2xl']}px;
    font-weight: ${typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text.default};
    margin-bottom: ${spacingValues.xs}px;
    text-align: center;
`;

const Description = styled.Text`
    font-size: ${fontSizeValues.md}px;
    color: ${({ theme }) => theme.colors.text.muted};
    text-align: center;
    margin-bottom: ${spacingValues['2xl']}px;
    line-height: ${Math.round(fontSizeValues.md * 1.5)}px;
`;

const InputWrapper = styled.View`
    margin-bottom: ${spacingValues.md}px;
`;

const InputLabel = styled.Text`
    font-size: ${fontSizeValues.sm}px;
    font-weight: ${typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.default};
    margin-bottom: ${spacingValues['3xs']}px;
`;

const StyledInput = styled.TextInput<{ hasError?: boolean }>`
    height: ${sizingValues.component.lg}px;
    border-width: 1px;
    border-color: ${(props: { hasError?: boolean }) =>
        props.hasError ? colors.semantic.error : colors.neutral.gray300};
    border-radius: ${borderRadiusValues.md}px;
    padding-horizontal: ${spacingValues.md}px;
    font-size: ${fontSizeValues.md}px;
    color: ${({ theme }) => theme.colors.text.default};
    background-color: ${({ theme }) => theme.colors.background.default};
`;

const ErrorText = styled.Text`
    color: ${colors.semantic.error};
    font-size: ${fontSizeValues.xs}px;
    margin-top: ${spacingValues['3xs']}px;
`;

const StrengthContainer = styled.View`
    margin-bottom: ${spacingValues.lg}px;
`;

const StrengthBarBackground = styled.View`
    height: ${spacingValues['3xs']}px;
    background-color: ${({ theme }) => theme.colors.background.subtle};
    border-radius: ${borderRadiusValues.full}px;
    overflow: hidden;
    margin-bottom: ${spacingValues.xs}px;
`;

const StrengthBarFill = styled.View<{ width: number; fillColor: string }>`
    height: 100%;
    width: ${(props: { width: number }) => props.width}%;
    background-color: ${(props: { fillColor: string }) => props.fillColor};
    border-radius: ${borderRadiusValues.full}px;
`;

const StrengthLabel = styled.Text<{ labelColor: string }>`
    font-size: ${fontSizeValues.xs}px;
    font-weight: ${typography.fontWeight.medium};
    color: ${(props: { labelColor: string }) => props.labelColor};
    text-align: right;
    margin-bottom: ${spacingValues.sm}px;
`;

const CriteriaContainer = styled.View`
    margin-bottom: ${spacingValues.lg}px;
`;

const CriteriaRow = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: ${spacingValues['3xs']}px;
`;

const CriteriaIcon = styled.Text<{ met: boolean }>`
    font-size: ${fontSizeValues.sm}px;
    color: ${(props: { met: boolean }) => (props.met ? colors.semantic.success : colors.neutral.gray400)};
    margin-right: ${spacingValues.xs}px;
    width: ${spacingValues.lg}px;
`;

const CriteriaText = styled.Text<{ met: boolean }>`
    font-size: ${fontSizeValues.sm}px;
    color: ${(props: { met: boolean }) => (props.met ? colors.neutral.gray800 : colors.neutral.gray500)};
`;

const SubmitButton = styled.TouchableOpacity<{ disabled?: boolean }>`
    background-color: ${(props: { disabled?: boolean }) =>
        props.disabled ? colors.neutral.gray400 : colors.brand.primary};
    border-radius: ${borderRadiusValues.md}px;
    padding: ${spacingValues.md}px;
    align-items: center;
    margin-top: ${spacingValues.sm}px;
`;

const SubmitButtonText = styled.Text`
    color: ${({ theme }) => theme.colors.text.onBrand};
    font-size: ${fontSizeValues.md}px;
    font-weight: ${typography.fontWeight.semiBold};
`;

// --- Helper Functions ---

/**
 * Evaluates password criteria
 */
const evaluateCriteria = (password: string): PasswordCriteria => ({
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
});

/**
 * Calculates password strength level from criteria
 */
const calculateStrength = (criteria: PasswordCriteria): StrengthLevel => {
    const metCount = Object.values(criteria).filter(Boolean).length;

    if (metCount === 0) {
        return 'none';
    }
    if (metCount <= 2) {
        return 'weak';
    }
    if (metCount <= 3) {
        return 'fair';
    }
    if (metCount <= 4) {
        return 'good';
    }
    return 'strong';
};

// --- Component ---

/**
 * SetPassword screen component for setting a new password.
 *
 * Features:
 * - Password + Confirm Password fields with secure text entry
 * - Real-time password strength indicator using a progress bar
 * - Validation rules display with checkmarks for met criteria
 * - Submit button disabled until passwords match and minimum strength met
 * - Uses react-hook-form + yup for validation
 * - All design-system tokens, zero hardcoded colors/sizes
 */
export const SetPasswordScreen: React.FC = () => {
    const navigation = useNavigation<AuthNavigationProp>();
    const route = useRoute<RouteProp<AuthStackParamList, 'AuthSetPassword'>>();
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SetPasswordFormData>({
        resolver: zodResolver(setPasswordSchema(t as (key: string, options?: Record<string, unknown>) => string)),
        mode: 'onChange',
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const watchedPassword = watch('password', '');
    const watchedConfirm = watch('confirmPassword', '');

    // Calculate criteria and strength
    const criteria = useMemo(() => evaluateCriteria(watchedPassword), [watchedPassword]);
    const strength = useMemo(() => calculateStrength(criteria), [criteria]);
    const strengthConfig = STRENGTH_LEVELS[strength];

    // Determine if form can be submitted
    const passwordsMatch = watchedPassword === watchedConfirm && watchedConfirm.length > 0;
    const meetsMinStrength = strength === 'fair' || strength === 'good' || strength === 'strong';
    const canSubmit = passwordsMatch && meetsMinStrength && !isSubmitting;

    /**
     * Handle form submission
     */
    const onSubmit = async (data: SetPasswordFormData): Promise<void> => {
        setIsSubmitting(true);
        try {
            const token = route.params?.token ?? '';
            await setPassword(token, data.password);
            Alert.alert(t('common.success'), t('auth.passwordSet'));
            navigation.navigate(ROUTES.AUTH_LOGIN);
        } catch (err) {
            Alert.alert(t('common.error'), t('common.tryAgain'));
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Criteria display configuration
     */
    const criteriaItems = [
        { key: 'minLength', label: t('auth.setPassword.criteria.minLength'), met: criteria.minLength },
        { key: 'hasUppercase', label: t('auth.setPassword.criteria.uppercase'), met: criteria.hasUppercase },
        { key: 'hasLowercase', label: t('auth.setPassword.criteria.lowercase'), met: criteria.hasLowercase },
        { key: 'hasNumber', label: t('auth.setPassword.criteria.number'), met: criteria.hasNumber },
        { key: 'hasSpecialChar', label: t('auth.setPassword.criteria.specialChar'), met: criteria.hasSpecialChar },
    ];

    return (
        <Container>
            <Title>{t('auth.setPassword.title')}</Title>
            <Description>{t('auth.setPassword.description')}</Description>

            {/* Password field */}
            <InputWrapper>
                <InputLabel>{t('auth.setPassword.passwordLabel')}</InputLabel>
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <StyledInput
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder={t('auth.setPassword.passwordPlaceholder')}
                            placeholderTextColor={colors.neutral.gray500}
                            secureTextEntry
                            hasError={!!errors.password}
                            accessibilityLabel={t('auth.setPassword.passwordLabel')}
                            testID="password-input"
                        />
                    )}
                />
                {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
            </InputWrapper>

            {/* Password strength indicator */}
            {watchedPassword.length > 0 && (
                <StrengthContainer>
                    <StrengthBarBackground>
                        <StrengthBarFill width={strengthConfig.progress} fillColor={strengthConfig.color} />
                    </StrengthBarBackground>
                    {strengthConfig.labelKey !== '' && (
                        <StrengthLabel labelColor={strengthConfig.color}>{t(strengthConfig.labelKey)}</StrengthLabel>
                    )}
                </StrengthContainer>
            )}

            {/* Validation criteria checklist */}
            <CriteriaContainer>
                {criteriaItems.map((item) => (
                    <CriteriaRow key={item.key}>
                        <CriteriaIcon met={item.met}>{item.met ? '\u2713' : '\u25CB'}</CriteriaIcon>
                        <CriteriaText met={item.met}>{item.label}</CriteriaText>
                    </CriteriaRow>
                ))}
            </CriteriaContainer>

            {/* Confirm password field */}
            <InputWrapper>
                <InputLabel>{t('auth.setPassword.confirmPasswordLabel')}</InputLabel>
                <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <StyledInput
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder={t('auth.setPassword.confirmPasswordPlaceholder')}
                            placeholderTextColor={colors.neutral.gray500}
                            secureTextEntry
                            hasError={!!errors.confirmPassword}
                            accessibilityLabel={t('auth.setPassword.confirmPasswordLabel')}
                            testID="confirm-password-input"
                        />
                    )}
                />
                {errors.confirmPassword && <ErrorText>{errors.confirmPassword.message}</ErrorText>}
            </InputWrapper>

            {/* Submit button */}
            <SubmitButton
                onPress={handleSubmit(onSubmit)}
                disabled={!canSubmit}
                accessibilityLabel={t('auth.setPassword.submit')}
                accessibilityRole="button"
                testID="set-password-button"
            >
                <SubmitButtonText>
                    {isSubmitting ? t('auth.setPassword.submitting') : t('auth.setPassword.submit')}
                </SubmitButtonText>
            </SubmitButton>
        </Container>
    );
};

export default SetPasswordScreen;
