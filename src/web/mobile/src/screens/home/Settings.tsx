import React from 'react';
import {
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { useAuth } from '../../hooks/useAuth';
import { useJourney } from '../../hooks/useJourney';
import { ROUTES } from '../../constants/routes';
import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing, spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadius } from '../../../../design-system/src/tokens/borderRadius';

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.neutral.white};
`;

const SectionHeader = styled.View`
  background-color: ${colors.gray[10]};
  padding-horizontal: ${spacing.xl};
  padding-vertical: ${spacing.sm};
`;

const SectionHeaderText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.gray[50]};
  text-transform: uppercase;
  letter-spacing: ${typography.letterSpacing.wide};
`;

const SettingRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${spacing.xl};
  padding-vertical: ${spacing.md};
  background-color: ${colors.neutral.white};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray[10]};
`;

const SettingLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.regular};
  color: ${colors.neutral.gray900};
  flex: 1;
`;

const ChevronText = styled.Text`
  font-size: ${typography.fontSize['text-md']};
  color: ${colors.gray[40]};
`;

const LogoutRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-horizontal: ${spacing.xl};
  padding-vertical: ${spacing.md};
  background-color: ${colors.neutral.white};
  margin-top: ${spacing.xl};
  border-top-width: 1px;
  border-top-color: ${colors.gray[20]};
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
  color: ${colors.gray[40]};
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
  const navigation = useNavigation();
  const { signOut } = useAuth();
  const { journey } = useJourney();
  const { t } = useTranslation();

  const handleLogout = () => {
    navigation.navigate(ROUTES.SETTINGS_LOGOUT as never);
  };

  const sections: SettingSection[] = [
    {
      title: t('settings.sections.account'),
      items: [
        {
          label: t('settings.editProfile'),
          onPress: () => navigation.navigate(ROUTES.SETTINGS_EDIT as never),
          showChevron: true,
        },
      ],
    },
    {
      title: t('settings.sections.security'),
      items: [
        {
          label: t('settings.personalInfo.title'),
          onPress: () => navigation.navigate(ROUTES.SETTINGS_PERSONAL_INFO as never),
          showChevron: true,
        },
        {
          label: t('settings.changePassword.title'),
          onPress: () => navigation.navigate(ROUTES.SETTINGS_CHANGE_PASSWORD as never),
          showChevron: true,
        },
        {
          label: t('settings.twoFactor.title'),
          onPress: () => navigation.navigate(ROUTES.SETTINGS_TWO_FACTOR as never),
          showChevron: true,
        },
        {
          label: t('settings.biometric.title'),
          onPress: () => navigation.navigate(ROUTES.SETTINGS_BIOMETRIC as never),
          showChevron: true,
        },
      ],
    },
    {
      title: t('settings.sections.notifications'),
      items: [
        {
          label: t('settings.notifications'),
          onPress: () => navigation.navigate(ROUTES.SETTINGS_NOTIFICATIONS as never),
          showChevron: true,
        },
      ],
    },
    {
      title: t('settings.sections.privacy'),
      items: [
        {
          label: t('settings.privacy'),
          onPress: () => navigation.navigate(ROUTES.SETTINGS_PRIVACY as never),
          showChevron: true,
        },
        {
          label: t('settings.terms.title'),
          onPress: () => navigation.navigate(ROUTES.SETTINGS_TERMS as never),
          showChevron: true,
        },
        {
          label: t('settings.privacyPolicy.title'),
          onPress: () => navigation.navigate(ROUTES.SETTINGS_PRIVACY_POLICY as never),
          showChevron: true,
        },
      ],
    },
    {
      title: t('settings.sections.healthPlan'),
      items: [
        {
          label: t('settings.healthPlan.title'),
          onPress: () => navigation.navigate(ROUTES.SETTINGS_HEALTH_PLAN as never),
          showChevron: true,
        },
        {
          label: t('settings.insuranceDocs.title'),
          onPress: () => navigation.navigate(ROUTES.SETTINGS_INSURANCE_DOCS as never),
          showChevron: true,
        },
        {
          label: t('settings.dependents.title'),
          onPress: () => navigation.navigate(ROUTES.SETTINGS_DEPENDENTS as never),
          showChevron: true,
        },
      ],
    },
    {
      title: t('settings.sections.devices'),
      items: [
        {
          label: t('settings.connectedDevices.title'),
          onPress: () => navigation.navigate(ROUTES.SETTINGS_CONNECTED_DEVICES as never),
          showChevron: true,
        },
      ],
    },
    {
      title: t('settings.sections.preferences'),
      items: [
        {
          label: t('settings.languageSelect.title'),
          onPress: () => navigation.navigate(ROUTES.SETTINGS_LANGUAGE as never),
          showChevron: true,
        },
        {
          label: t('settings.themeSelect.title'),
          onPress: () => navigation.navigate(ROUTES.SETTINGS_THEME as never),
          showChevron: true,
        },
        {
          label: t('settings.accessibility.title'),
          onPress: () => navigation.navigate(ROUTES.SETTINGS_ACCESSIBILITY as never),
          showChevron: true,
        },
      ],
    },
    {
      title: t('settings.sections.help'),
      items: [
        {
          label: t('help.home.title'),
          onPress: () => navigation.navigate(ROUTES.HELP_HOME as never),
          showChevron: true,
        },
      ],
    },
    {
      title: t('settings.sections.data'),
      items: [
        {
          label: t('settings.dataExport.title'),
          onPress: () => navigation.navigate(ROUTES.SETTINGS_DATA_EXPORT as never),
          showChevron: true,
        },
        {
          label: t('settings.deleteAccount.title'),
          onPress: () => navigation.navigate(ROUTES.SETTINGS_DELETE_ACCOUNT as never),
          showChevron: true,
        },
      ],
    },
    {
      title: t('settings.sections.app'),
      items: [
        {
          label: t('settings.aboutApp.title'),
          onPress: () => navigation.navigate(ROUTES.SETTINGS_ABOUT as never),
          showChevron: true,
        },
        {
          label: t('settings.feedback.title'),
          onPress: () => navigation.navigate(ROUTES.SETTINGS_FEEDBACK as never),
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
                {item.showChevron && (
                  <ChevronText accessibilityElementsHidden>{'>'}</ChevronText>
                )}
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
