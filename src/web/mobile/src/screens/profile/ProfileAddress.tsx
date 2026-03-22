/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { borderRadius } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { sizing } from '@design-system/tokens/sizing';
import { spacing } from '@design-system/tokens/spacing';
import { typography } from '@design-system/tokens/typography';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { useForm, Controller, type Resolver } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import styled from 'styled-components/native';
import * as yup from 'yup';

import { updateProfile } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import type { AuthNavigationProp } from '../../navigation/types';

/**
 * Validation schema for address form.
 */
const createAddressSchema = (t: (key: string, options?: Record<string, unknown>) => string) =>
    yup.object().shape({
        cep: yup
            .string()
            .required(t('common.validation.required'))
            .matches(/^\d{8}$/, t('profileSetup.address.cepFormat')),
        street: yup.string().required(t('common.validation.required')),
        number: yup.string().required(t('common.validation.required')),
        complement: yup.string().default(''),
        neighborhood: yup.string().required(t('common.validation.required')),
        city: yup.string().required(t('common.validation.required')),
        state: yup.string().required(t('common.validation.required')),
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

/** ViaCEP API response shape. */
interface ViaCepResponse {
    erro?: boolean;
    logradouro?: string;
    bairro?: string;
    localidade?: string;
    uf?: string;
}

const BRAZILIAN_STATES = [
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO',
];

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
    border-color: ${(props) => (props.selected ? colors.brand.primary : colors.gray[20])};
    background-color: ${(props) => (props.selected ? colors.brandPalette[50] : colors.neutral.white)};
    min-width: 44px;
    align-items: center;
`;

const StateText = styled.Text<{ selected: boolean }>`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    font-weight: ${(props) => (props.selected ? typography.fontWeight.semiBold : typography.fontWeight.regular)};
    color: ${(props) => (props.selected ? colors.brand.primary : colors.neutral.gray700)};
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
 * ProfileAddress screen -- Step 4/7 of the profile onboarding flow.
 * Collects address: CEP (with auto-fill), street, number, complement,
 * neighborhood, city, state.
 */
const ProfileAddress: React.FC = () => {
    const navigation = useNavigation<AuthNavigationProp>();
    const { t } = useTranslation();
    const { session } = useAuth();
    const [_saving, setSaving] = useState(false);
    const [_loadingCep, setLoadingCep] = useState(false);

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<AddressFormData>({
        resolver: yupResolver(
            createAddressSchema(
                t as (key: string, options?: Record<string, unknown>) => string
            ) as unknown as yup.ObjectSchema<AddressFormData>
        ) as Resolver<AddressFormData>,
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

    useEffect(() => {
        if (cep && cep.replace(/\D/g, '').length === 8) {
            const cleanCep = cep.replace(/\D/g, '');
            setLoadingCep(true);
            fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
                .then((res) => res.json() as Promise<ViaCepResponse>)
                .then((data) => {
                    if (data.erro) {
                        Alert.alert(t('profileSetup.address.cepError'));
                        return;
                    }
                    setValue('street', data.logradouro ?? '', { shouldValidate: true });
                    setValue('neighborhood', data.bairro ?? '', { shouldValidate: true });
                    setValue('city', data.localidade ?? '', { shouldValidate: true });
                    setValue('state', data.uf ?? '', { shouldValidate: true });
                })
                .catch(() => {
                    Alert.alert(t('profileSetup.address.cepError'));
                })
                .finally(() => {
                    setLoadingCep(false);
                });
        }
    }, [cep, setValue, t]);

    const onSubmit = async (data: AddressFormData): Promise<void> => {
        if (!session?.accessToken) {
            return;
        }
        setSaving(true);
        try {
            await updateProfile(session.accessToken, {
                address: {
                    cep: data.cep,
                    street: data.street,
                    number: data.number,
                    complement: data.complement,
                    neighborhood: data.neighborhood,
                    city: data.city,
                    state: data.state,
                },
            });
            navigation.navigate('ProfileDocuments');
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
                            <Title>{t('profileSetup.address.title')}</Title>
                            <Subtitle>{t('profileSetup.address.subtitle')}</Subtitle>
                            <StepIndicator>{t('profileSetup.stepIndicator', { current: 4, total: 7 })}</StepIndicator>
                            <StepBarContainer>
                                {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                                    <StepDot key={step} active={step <= 4} />
                                ))}
                            </StepBarContainer>
                        </HeaderSection>

                        {/* CEP */}
                        <FieldContainer>
                            <Label>{t('profileSetup.address.cep')}</Label>
                            <Controller
                                control={control}
                                name="cep"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <StyledInput
                                        value={value}
                                        onChangeText={(text: string) => onChange(text.replace(/\D/g, ''))}
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
                            <Label>{t('profileSetup.address.street')}</Label>
                            <Controller
                                control={control}
                                name="street"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <StyledInput
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        placeholder={t('profileSetup.address.streetPlaceholder')}
                                        placeholderTextColor={colors.gray[40]}
                                        hasError={!!errors.street}
                                        testID="profile-address-street"
                                    />
                                )}
                            />
                            {errors.street && <ErrorText>{errors.street.message}</ErrorText>}
                        </FieldContainer>

                        {/* Number + Complement */}
                        <RowContainer>
                            <FlexFieldContainer flex={1}>
                                <Label>{t('profileSetup.address.number')}</Label>
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
                                {errors.number && <ErrorText>{errors.number.message}</ErrorText>}
                            </FlexFieldContainer>

                            <FlexFieldContainer flex={2}>
                                <Label>{t('profileSetup.address.complement')}</Label>
                                <Controller
                                    control={control}
                                    name="complement"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <StyledInput
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            placeholder={t('profileSetup.address.complementPlaceholder')}
                                            placeholderTextColor={colors.gray[40]}
                                            testID="profile-address-complement"
                                        />
                                    )}
                                />
                            </FlexFieldContainer>
                        </RowContainer>

                        {/* Neighborhood */}
                        <FieldContainer>
                            <Label>{t('profileSetup.address.neighborhood')}</Label>
                            <Controller
                                control={control}
                                name="neighborhood"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <StyledInput
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        placeholder={t('profileSetup.address.neighborhoodPlaceholder')}
                                        placeholderTextColor={colors.gray[40]}
                                        hasError={!!errors.neighborhood}
                                        testID="profile-address-neighborhood"
                                    />
                                )}
                            />
                            {errors.neighborhood && <ErrorText>{errors.neighborhood.message}</ErrorText>}
                        </FieldContainer>

                        {/* City */}
                        <FieldContainer>
                            <Label>{t('profileSetup.address.city')}</Label>
                            <Controller
                                control={control}
                                name="city"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <StyledInput
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        placeholder={t('profileSetup.address.cityPlaceholder')}
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
                            <Label>{t('profileSetup.address.state')}</Label>
                            <StateGrid>
                                {BRAZILIAN_STATES.map((st) => (
                                    <StateChip
                                        key={st}
                                        selected={state === st}
                                        onPress={() => setValue('state', st, { shouldValidate: true })}
                                        accessibilityRole="radio"
                                        accessibilityState={{ selected: state === st }}
                                        accessibilityLabel={`State ${st}`}
                                        testID={`state-${st}`}
                                    >
                                        <StateText selected={state === st}>{st}</StateText>
                                    </StateChip>
                                ))}
                            </StateGrid>
                            {errors.state && <ErrorText>{errors.state.message}</ErrorText>}
                        </FieldContainer>

                        {/* Continue Button */}
                        <PrimaryButton
                            onPress={handleSubmit(onSubmit)}
                            accessibilityRole="button"
                            accessibilityLabel={t('common.buttons.next')}
                            testID="profile-address-continue"
                        >
                            <PrimaryButtonText>{t('common.buttons.next')}</PrimaryButtonText>
                        </PrimaryButton>
                    </ContentWrapper>
                </ScrollView>
            </KeyboardAvoidingView>
        </Container>
    );
};

export default ProfileAddress;
