import { borderRadius } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { sizing } from '@design-system/tokens/sizing';
import { spacing, spacingValues } from '@design-system/tokens/spacing';
import { typography } from '@design-system/tokens/typography';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Alert, Linking, Platform } from 'react-native';
import styled from 'styled-components/native';

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
`;

const LogoContainer = styled.View`
    width: 120px;
    height: 120px;
    border-radius: 60px;
    background-color: ${colors.brand.primary}15;
    align-items: center;
    justify-content: center;
    margin-bottom: ${spacing['2xl']};
`;

const LogoText = styled.Text`
    font-family: ${typography.fontFamily.logo};
    font-size: ${typography.fontSize['heading-2xl']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.brand.primary};
`;

const AppName = styled.Text`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-lg']};
    font-weight: ${typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text.default};
    margin-bottom: ${spacing.xs};
`;

const VersionText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.regular};
    color: ${({ theme }) => theme.colors.text.muted};
    margin-bottom: ${spacing['3xs']};
`;

const BuildText = styled.Text`
    font-family: ${typography.fontFamily.mono};
    font-size: ${typography.fontSize['text-xs']};
    font-weight: ${typography.fontWeight.regular};
    color: ${({ theme }) => theme.colors.text.subtle};
    margin-bottom: ${spacing['3xs']};
`;

const EnvironmentText = styled.Text`
    font-family: ${typography.fontFamily.mono};
    font-size: ${typography.fontSize['text-xs']};
    font-weight: ${typography.fontWeight.regular};
    color: ${({ theme }) => theme.colors.text.subtle};
    margin-bottom: ${spacing['3xl']};
`;

const Divider = styled.View`
    width: 100%;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.background.subtle};
    margin-bottom: ${spacing.xl};
`;

const CreditsText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.default};
    margin-bottom: ${spacing['2xl']};
`;

const MenuRow = styled.TouchableOpacity`
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-vertical: ${spacing.md};
    border-bottom-width: 1px;
    border-bottom-color: ${colors.gray[10]};
`;

const MenuLabel = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.regular};
    color: ${({ theme }) => theme.colors.text.default};
`;

const ChevronText = styled.Text`
    font-size: ${typography.fontSize['text-md']};
    color: ${({ theme }) => theme.colors.text.subtle};
`;

const RateButton = styled.TouchableOpacity`
    width: 100%;
    background-color: ${colors.brand.primary};
    border-radius: ${borderRadius.md};
    height: ${sizing.component.lg};
    align-items: center;
    justify-content: center;
    margin-top: ${spacing['2xl']};
`;

const RateButtonText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.text.onBrand};
`;

const CopyrightText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    font-weight: ${typography.fontWeight.regular};
    color: ${({ theme }) => theme.colors.text.subtle};
    text-align: center;
    margin-top: ${spacing['3xl']};
`;

const LicensesSectionTitle = styled.Text`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.text.muted};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    width: 100%;
    margin-top: ${spacing.xl};
    margin-bottom: ${spacing.sm};
`;

const LicenseRow = styled.View`
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-vertical: ${spacing.xs};
    border-bottom-width: 1px;
    border-bottom-color: ${colors.gray[10]};
`;

const LicenseName = styled.Text`
    font-family: ${typography.fontFamily.mono};
    font-size: ${typography.fontSize['text-xs']};
    font-weight: ${typography.fontWeight.regular};
    color: ${({ theme }) => theme.colors.text.default};
    flex: 1;
`;

const LicenseMeta = styled.Text`
    font-family: ${typography.fontFamily.mono};
    font-size: ${typography.fontSize['text-xs']};
    font-weight: ${typography.fontWeight.regular};
    color: ${({ theme }) => theme.colors.text.subtle};
    margin-left: ${spacing.sm};
`;

interface LicenseEntry {
    name: string;
    version: string;
    license: string;
}

const OPEN_SOURCE_LICENSES: LicenseEntry[] = [
    { name: 'react-native', version: '0.73.0', license: 'MIT' },
    { name: 'react', version: '18.2.0', license: 'MIT' },
    { name: '@react-navigation/native', version: '6.1.9', license: 'MIT' },
    { name: '@react-navigation/stack', version: '6.3.20', license: 'MIT' },
    { name: '@tanstack/react-query', version: '5.22.2', license: 'MIT' },
    { name: 'styled-components', version: '6.0.5', license: 'MIT' },
    { name: 'axios', version: '1.7.8', license: 'MIT' },
    { name: 'i18next', version: '23.2.11', license: 'MIT' },
    { name: 'date-fns', version: '3.3.1', license: 'MIT' },
    { name: 'zod', version: '3.22.4', license: 'MIT' },
];

const APP_STORE_URL_IOS = 'itms-apps://apps.apple.com/app/id6450000000?action=write-review';
const APP_STORE_URL_ANDROID = 'market://details?id=com.austa.health';

/**
 * AboutApp screen -- displays app logo, version info, credits,
 * open-source licenses list, rate-the-app button, and copyright.
 */
export const AboutAppScreen: React.FC = () => {
    const _navigation = useNavigation();
    const { t } = useTranslation();

    const [showLicenses, setShowLicenses] = React.useState(false);

    const handleLicenses = (): void => {
        setShowLicenses((prev) => !prev);
    };

    const handleRateApp = (): void => {
        const url = Platform.OS === 'ios' ? APP_STORE_URL_IOS : APP_STORE_URL_ANDROID;
        Alert.alert(t('settings.aboutApp.rateApp'), t('settings.aboutApp.rateAppConfirm'), [
            { text: t('settings.aboutApp.cancel'), style: 'cancel' },
            {
                text: t('settings.aboutApp.confirm'),
                onPress: () => Linking.openURL(url),
            },
        ]);
    };

    return (
        <Container>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
            >
                <ContentWrapper>
                    {/* App Logo */}
                    <LogoContainer testID="about-logo">
                        <LogoText>AUSTA</LogoText>
                    </LogoContainer>

                    {/* Version Info */}
                    <AppName testID="about-app-name">AUSTA SuperApp</AppName>
                    <VersionText testID="about-version">{t('settings.aboutApp.version')} 1.0.0</VersionText>
                    <BuildText testID="about-build">{t('settings.aboutApp.build')} 2024.1</BuildText>
                    <EnvironmentText testID="about-environment">
                        {t('settings.aboutApp.environment')}: Production
                    </EnvironmentText>

                    <Divider />

                    {/* Credits */}
                    <CreditsText testID="about-credits">{t('settings.aboutApp.credits')}</CreditsText>

                    {/* Open-source licenses toggle */}
                    <MenuRow
                        onPress={handleLicenses}
                        accessibilityRole="button"
                        accessibilityLabel={t('settings.aboutApp.licenses')}
                        testID="about-licenses"
                    >
                        <MenuLabel>{t('settings.aboutApp.licenses')}</MenuLabel>
                        <ChevronText accessibilityElementsHidden>{showLicenses ? 'v' : '>'}</ChevronText>
                    </MenuRow>

                    {/* Open-source licenses list */}
                    {showLicenses && (
                        <>
                            <LicensesSectionTitle testID="about-licenses-title">Open Source</LicensesSectionTitle>
                            {OPEN_SOURCE_LICENSES.map((entry) => (
                                <LicenseRow key={entry.name} testID={`about-license-${entry.name}`}>
                                    <LicenseName numberOfLines={1}>
                                        {entry.name} {entry.version}
                                    </LicenseName>
                                    <LicenseMeta>{entry.license}</LicenseMeta>
                                </LicenseRow>
                            ))}
                        </>
                    )}

                    {/* Rate App */}
                    <RateButton
                        onPress={handleRateApp}
                        accessibilityRole="button"
                        accessibilityLabel={t('settings.aboutApp.rateApp')}
                        testID="about-rate-app"
                    >
                        <RateButtonText>{t('settings.aboutApp.rateApp')}</RateButtonText>
                    </RateButton>

                    {/* Copyright */}
                    <CopyrightText testID="about-copyright">{t('settings.aboutApp.copyright')}</CopyrightText>
                </ContentWrapper>
            </ScrollView>
        </Container>
    );
};

export default AboutAppScreen;
