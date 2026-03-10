import React, { useState, useCallback } from 'react';
import { ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import ReactNativeBiometrics from 'react-native-biometrics';

import { colors } from '@design-system/tokens/colors';
import { typography } from '@design-system/tokens/typography';
import { spacing } from '@design-system/tokens/spacing';
import { borderRadius } from '@design-system/tokens/borderRadius';
import { sizing } from '@design-system/tokens/sizing';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../context/AuthContext';
import { registerBiometricKey, getBiometricChallenge, verifyBiometricSignature } from '../../api/auth';
import { secureTokenStorage } from '../../utils/secure-storage';
import * as LocalAuthentication from 'expo-local-authentication';

const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });

// --- Styled Components ---

const Container = styled.SafeAreaView`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background.default};
`;

const ContentWrapper = styled.View`
    padding-horizontal: ${spacing.xl};
    padding-top: ${spacing['3xl']};
    padding-bottom: ${spacing['4xl']};
    align-items: center;
    flex: 1;
    justify-content: center;
`;

const IllustrationContainer = styled.View`
    width: 140px;
    height: 140px;
    border-radius: 70px;
    background-color: ${({ theme }) => theme.colors.background.muted};
    align-items: center;
    justify-content: center;
    margin-bottom: ${spacing['2xl']};
    border-width: 3px;
    border-color: ${colors.brand.primary};
`;

const IllustrationEmoji = styled.Text`
    font-size: 64px;
`;

const Title = styled.Text`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-2xl']};
    font-weight: ${typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text.default};
    text-align: center;
    margin-bottom: ${spacing.sm};
`;

const Subtitle = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: ${({ theme }) => theme.colors.text.muted};
    text-align: center;
    margin-bottom: ${spacing['2xl']};
    line-height: 24px;
    padding-horizontal: ${spacing.md};
`;

const BenefitsList = styled.View`
    width: 100%;
    margin-bottom: ${spacing['3xl']};
`;

const BenefitRow = styled.View`
    flex-direction: row;
    align-items: center;
    padding-vertical: ${spacing.sm};
    padding-horizontal: ${spacing.md};
    background-color: ${({ theme }) => theme.colors.background.muted};
    border-radius: ${borderRadius.md};
    margin-bottom: ${spacing.sm};
`;

const BenefitIcon = styled.Text`
    font-size: 20px;
    margin-right: ${spacing.md};
`;

const BenefitText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: ${({ theme }) => theme.colors.text.default};
    flex: 1;
`;

const ButtonsContainer = styled.View`
    width: 100%;
`;

const PrimaryButton = styled.TouchableOpacity`
    background-color: ${colors.brand.primary};
    border-radius: ${borderRadius.md};
    height: ${sizing.component.lg};
    width: 100%;
    align-items: center;
    justify-content: center;
    margin-bottom: ${spacing.md};
`;

const PrimaryButtonText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.text.onBrand};
`;

const SkipLink = styled.TouchableOpacity`
    align-items: center;
    padding-vertical: ${spacing.sm};
`;

const SkipLinkText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${({ theme }) => theme.colors.text.muted};
    text-decoration-line: underline;
`;

const SecurityNote = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    color: ${({ theme }) => theme.colors.text.subtle};
    text-align: center;
    margin-top: ${spacing.xl};
    padding-horizontal: ${spacing.lg};
`;

// --- Data ---

const BENEFITS = [
    { icon: '\u26A1', key: 'fasterLogin' },
    { icon: '\uD83D\uDD12', key: 'secureAccess' },
    { icon: '\uD83D\uDE4C', key: 'noPasswords' },
] as const;

// --- Component ---

/**
 * ProfileBiometricSetup screen allows users to enable biometric
 * authentication (Face ID / Touch ID) during profile onboarding.
 * Users can enable it or skip for later.
 */
export const ProfileBiometricSetup: React.FC = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const { session } = useAuth();
    const [enrolling, setEnrolling] = useState(false);
    const [registered, setRegistered] = useState(false);

    /**
     * Enable biometric authentication:
     * 1. Check hardware & enrollment via expo-local-authentication
     * 2. Authenticate locally to confirm user intent
     * 3. Generate RSA keypair via react-native-biometrics
     * 4. Register public key with the backend
     */
    const handleEnable = async () => {
        setEnrolling(true);
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            if (!hasHardware) {
                Alert.alert(t('profile.biometricSetup.notSupported'));
                return;
            }
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (!isEnrolled) {
                Alert.alert(t('profile.biometricSetup.notEnrolled'));
                return;
            }
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: t('profile.biometricSetup.prompt'),
            });
            if (!result.success) {
                Alert.alert(t('profile.biometricSetup.failed'));
                return;
            }

            // Generate RSA keypair in the device secure enclave
            const keyResult = await rnBiometrics.createKeys('Confirm to generate keypair');
            if (!keyResult.publicKey) {
                Alert.alert(t('profile.biometricSetup.failed'));
                return;
            }

            // Register the public key with the backend
            const accessToken = session?.accessToken;
            if (!accessToken) {
                Alert.alert(t('common.errors.default'));
                return;
            }
            await registerBiometricKey(accessToken, keyResult.publicKey);
            setRegistered(true);

            navigation.navigate(ROUTES.PROFILE_CONFIRMATION);
        } catch {
            Alert.alert(t('common.errors.default'));
        } finally {
            setEnrolling(false);
        }
    };

    /**
     * Biometric login flow (challenge-response):
     * 1. Request a one-time challenge from the server
     * 2. Sign the challenge with the device private key (biometric prompt)
     * 3. Send the signature to the server for verification
     * 4. Receive and persist an auth session on success
     */
    const handleBiometricLogin = useCallback(async (): Promise<boolean> => {
        try {
            // Step 1: Get challenge from server
            const { challenge } = await getBiometricChallenge();

            // Step 2: Sign the challenge — triggers biometric prompt
            const signResult = await rnBiometrics.createSignature({
                promptMessage: t('profile.biometricSetup.prompt'),
                payload: challenge,
            });

            if (!signResult.success || !signResult.signature) {
                Alert.alert(t('profile.biometricSetup.failed'));
                return false;
            }

            // Step 3: Verify signature on the server
            const authSession = await verifyBiometricSignature(signResult.signature, challenge);

            // Step 4: Persist the new session
            secureTokenStorage.setSession(JSON.stringify(authSession));

            return true;
        } catch {
            Alert.alert(t('common.errors.default'));
            return false;
        }
    }, [t]);

    const handleSkip = () => {
        navigation.navigate(ROUTES.PROFILE_CONFIRMATION);
    };

    return (
        <Container>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                testID="biometric-setup-scroll"
            >
                <ContentWrapper>
                    {/* Illustration */}
                    <IllustrationContainer>
                        <IllustrationEmoji accessibilityLabel={t('profile.biometricSetup.illustrationAlt')}>
                            {'\uD83D\uDD90\uFE0F'}
                        </IllustrationEmoji>
                    </IllustrationContainer>

                    {/* Title & Subtitle */}
                    <Title testID="biometric-setup-title">{t('profile.biometricSetup.title')}</Title>
                    <Subtitle>{t('profile.biometricSetup.subtitle')}</Subtitle>

                    {/* Benefits */}
                    <BenefitsList>
                        {BENEFITS.map((benefit) => (
                            <BenefitRow key={benefit.key}>
                                <BenefitIcon>{benefit.icon}</BenefitIcon>
                                <BenefitText>{t(`profile.biometricSetup.benefits.${benefit.key}`)}</BenefitText>
                            </BenefitRow>
                        ))}
                    </BenefitsList>

                    {/* Buttons */}
                    <ButtonsContainer>
                        <PrimaryButton
                            onPress={handleEnable}
                            accessibilityRole="button"
                            accessibilityLabel={t('profile.biometricSetup.enable')}
                            testID="biometric-setup-enable"
                        >
                            <PrimaryButtonText>{t('profile.biometricSetup.enable')}</PrimaryButtonText>
                        </PrimaryButton>

                        <SkipLink
                            onPress={handleSkip}
                            accessibilityRole="link"
                            accessibilityLabel={t('profile.biometricSetup.skip')}
                            testID="biometric-setup-skip"
                        >
                            <SkipLinkText>{t('profile.biometricSetup.skip')}</SkipLinkText>
                        </SkipLink>
                    </ButtonsContainer>

                    {/* Security Note */}
                    <SecurityNote>{t('profile.biometricSetup.securityNote')}</SecurityNote>
                </ContentWrapper>
            </ScrollView>
        </Container>
    );
};

export default ProfileBiometricSetup;
