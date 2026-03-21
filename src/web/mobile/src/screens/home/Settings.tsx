import { colors } from '@design-system/tokens/colors';
import { spacing, spacingValues } from '@design-system/tokens/spacing';
import { typography } from '@design-system/tokens/typography';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';

import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { useJourney } from '../../hooks/useJourney';
import type { SettingsNavigationProp } from '../../navigation/types';

// --- Styled Components ---

const Container = styled.SafeAreaView`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background.default};
`;

const SectionHeader = styled.View`
    background-color: ${({ theme }) => theme.colors.background.subtle};
    padding-horizontal: ${spacing.xl};
    padding-vertical: ${spacing.sm};
`;

const SectionHeaderText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.text.muted};
    text-transform: uppercase;
    letter-spacing: ${typography.letterSpacing.wide};
`;

const SettingRow = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-horizontal: ${spacing.xl};
    padding-vertical: ${spacing.md};
    background-color: ${({ theme }) => theme.colors.background.default};
    border-bottom-width: 1px;
    border-bottom-color: ${colors.gray[10]};
`;

const SettingLabel = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.regular};
    color: ${({ theme }) => theme.colors.text.default};
    flex: 1;
`;

const ChevronText = styled.Text`
    font-size: ${typography.fontSize['text-md']};
    color: ${({ theme }) => theme.colors.text.subtle};
`;

const LogoutRow = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding-horizontal: ${spacing.xl};
    padding-vertical: ${spacing.md};
    background-color: ${({ theme }) => theme.colors.background.default};
    margin-top: ${spacing.xl};
    border-top-width: 1px;
    border-top-color: ${({ theme }) => theme.colors.border.default};
`;

const LogoutText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.semantic.error};
`;

const AppVersionText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    color: ${({ theme }) => theme.colors.text.subtle};
    text-align: center;
    margin-top: ${spacing.xl};
    margin-bottom: ${spacing['2xl']};
`;

// --- Types ---

interface SettingItem {
    label: string;
    onPress: () => void;
    showChevron?: boolean;
}

interface SettingSection {
    title: string;
    items: SettingItem[];
}

/**
 * Settings screen with grouped sections.
 * Implements the "Preferences & Settings" requirement from User Management Features.
 *
 * Sections:
 *  1. Conta (Account)
 *  2. Seguranca (Security)
 *  3. Notificacoes (Notifications)
 *  4. Privacidade (Privacy)
 *  5. Plano de Saude (Health Plan)
 *  6. Dispositivos (Devices)
 *  7. Preferencias (Preferences)
 *  8. Ajuda (Help)
 *  9. Dados (Data)
 *  10. App
 */
export const SettingsScreen: React.FC = () => {
    const navigation = useNavigation<SettingsNavigationProp>();
    const { _signOut } = useAuth();
    const { _journey } = useJourney();
    const { t } = useTranslation();

    const handleLogout = (): void => {
        navigation.navigate(ROUTES.SETTINGS_LOGOUT);
    };

    const sections: SettingSection[] = [
        {
            title: t('settings.sections.account'),
            items: [
                {
                    label: t('settings.editProfile'),
                    onPress: () => navigation.navigate(ROUTES.SETTINGS_EDIT),
                    showChevron: true,
                },
            ],
        },
        {
            title: t('settings.sections.security'),
            items: [
                {
                    label: t('settings.personalInfo.title'),
                    onPress: () => navigation.navigate(ROUTES.SETTINGS_PERSONAL_INFO),
                    showChevron: true,
                },
                {
                    label: t('settings.changePassword.title'),
                    onPress: () => navigation.navigate(ROUTES.SETTINGS_CHANGE_PASSWORD),
                    showChevron: true,
                },
                {
                    label: t('settings.twoFactor.title'),
                    onPress: () => navigation.navigate(ROUTES.SETTINGS_TWO_FACTOR),
                    showChevron: true,
                },
                {
                    label: t('settings.biometric.title'),
                    onPress: () => navigation.navigate(ROUTES.SETTINGS_BIOMETRIC),
                    showChevron: true,
                },
            ],
        },
        {
            title: t('settings.sections.notifications'),
            items: [
                {
                    label: t('settings.notifications'),
                    onPress: () => navigation.navigate(ROUTES.SETTINGS_NOTIFICATIONS),
                    showChevron: true,
                },
            ],
        },
        {
            title: t('settings.sections.privacy'),
            items: [
                {
                    label: t('settings.privacy'),
                    onPress: () => navigation.navigate(ROUTES.SETTINGS_PRIVACY),
                    showChevron: true,
                },
                {
                    label: t('settings.terms.title'),
                    onPress: () => navigation.navigate(ROUTES.SETTINGS_TERMS),
                    showChevron: true,
                },
                {
                    label: t('settings.privacyPolicy.title'),
                    onPress: () => navigation.navigate(ROUTES.SETTINGS_PRIVACY_POLICY),
                    showChevron: true,
                },
            ],
        },
        {
            title: t('settings.sections.healthPlan'),
            items: [
                {
                    label: t('settings.healthPlan.title'),
                    onPress: () => navigation.navigate(ROUTES.SETTINGS_HEALTH_PLAN),
                    showChevron: true,
                },
                {
                    label: t('settings.insuranceDocs.title'),
                    onPress: () => navigation.navigate(ROUTES.SETTINGS_INSURANCE_DOCS),
                    showChevron: true,
                },
                {
                    label: t('settings.dependents.title'),
                    onPress: () => navigation.navigate(ROUTES.SETTINGS_DEPENDENTS),
                    showChevron: true,
                },
            ],
        },
        {
            title: t('settings.sections.devices'),
            items: [
                {
                    label: t('settings.connectedDevices.title'),
                    onPress: () => navigation.navigate(ROUTES.SETTINGS_CONNECTED_DEVICES),
                    showChevron: true,
                },
            ],
        },
        {
            title: t('settings.sections.preferences'),
            items: [
                {
                    label: t('settings.languageSelect.title'),
                    onPress: () => navigation.navigate(ROUTES.SETTINGS_LANGUAGE),
                    showChevron: true,
                },
                {
                    label: t('settings.themeSelect.title'),
                    onPress: () => navigation.navigate(ROUTES.SETTINGS_THEME),
                    showChevron: true,
                },
                {
                    label: t('settings.accessibility.title'),
                    onPress: () => navigation.navigate(ROUTES.SETTINGS_ACCESSIBILITY),
                    showChevron: true,
                },
            ],
        },
        {
            title: t('settings.sections.help'),
            items: [
                {
                    label: t('help.home.title'),
                    onPress: () => navigation.navigate(ROUTES.HELP_HOME),
                    showChevron: true,
                },
            ],
        },
        {
            title: t('settings.sections.data'),
            items: [
                {
                    label: t('settings.dataExport.title'),
                    onPress: () => navigation.navigate(ROUTES.SETTINGS_DATA_EXPORT),
                    showChevron: true,
                },
                {
                    label: t('settings.deleteAccount.title'),
                    onPress: () => navigation.navigate(ROUTES.SETTINGS_DELETE_ACCOUNT),
                    showChevron: true,
                },
            ],
        },
        {
            title: t('settings.sections.app'),
            items: [
                {
                    label: t('settings.aboutApp.title'),
                    onPress: () => navigation.navigate(ROUTES.SETTINGS_ABOUT),
                    showChevron: true,
                },
                {
                    label: t('settings.feedback.title'),
                    onPress: () => navigation.navigate(ROUTES.SETTINGS_FEEDBACK),
                    showChevron: true,
                },
            ],
        },
    ];

    return (
        <Container>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
            >
                {sections.map((section) => (
                    <React.Fragment key={section.title}>
                        <SectionHeader>
                            <SectionHeaderText>{section.title}</SectionHeaderText>
                        </SectionHeader>
                        {section.items.map((item) => (
                            <SettingRow
                                key={item.label}
                                onPress={item.onPress}
                                accessibilityRole="button"
                                accessibilityLabel={item.label}
                                testID={`settings-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                                <SettingLabel>{item.label}</SettingLabel>
                                {item.showChevron && <ChevronText accessibilityElementsHidden>{'>'}</ChevronText>}
                            </SettingRow>
                        ))}
                    </React.Fragment>
                ))}

                {/* Logout section */}
                <LogoutRow
                    onPress={handleLogout}
                    accessibilityRole="button"
                    accessibilityLabel={t('settings.logout.signOut')}
                    testID="settings-logout"
                >
                    <LogoutText>{t('settings.logout.signOut')}</LogoutText>
                </LogoutRow>

                <AppVersionText>AUSTA SuperApp v1.0.0</AppVersionText>
            </ScrollView>
        </Container>
    );
};

export default SettingsScreen;
