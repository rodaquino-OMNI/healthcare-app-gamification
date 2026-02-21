import React from 'react';
import {
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
 *  2. Notificacoes (Notifications)
 *  3. Privacidade (Privacy)
 *  4. App
 *  5. Sair (Logout)
 */
export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { signOut } = useAuth();
  const { journey } = useJourney();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Erro', 'Nao foi possivel sair da conta. Tente novamente.');
    }
  };

  const confirmSignOut = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: handleSignOut },
      ],
    );
  };

  const sections: SettingSection[] = [
    {
      title: 'Conta',
      items: [
        {
          label: 'Editar Perfil',
          onPress: () => navigation.navigate('SettingsEdit' as never),
          showChevron: true,
        },
        {
          label: 'Alterar Senha',
          onPress: () => navigation.navigate(ROUTES.AUTH_MFA as never),
          showChevron: true,
        },
      ],
    },
    {
      title: 'Notificacoes',
      items: [
        {
          label: 'Preferencias de Notificacao',
          onPress: () => navigation.navigate('SettingsNotifications' as never),
          showChevron: true,
        },
      ],
    },
    {
      title: 'Privacidade',
      items: [
        {
          label: 'Privacidade e Dados',
          onPress: () => navigation.navigate('SettingsPrivacy' as never),
          showChevron: true,
        },
        {
          label: 'Termos de Uso',
          onPress: () => {/* TODO: navigate to Terms */},
          showChevron: true,
        },
        {
          label: 'Politica de Privacidade',
          onPress: () => {/* TODO: navigate to Privacy Policy */},
          showChevron: true,
        },
      ],
    },
    {
      title: 'App',
      items: [
        {
          label: 'Idioma',
          onPress: () => {/* TODO: navigate to Language */},
          showChevron: true,
        },
        {
          label: 'Sobre',
          onPress: () => {/* TODO: navigate to About */},
          showChevron: true,
        },
        {
          label: 'Avaliar App',
          onPress: () => {/* TODO: open app store rating */},
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
          onPress={confirmSignOut}
          accessibilityRole="button"
          accessibilityLabel="Sair da conta"
          testID="settings-logout"
        >
          <LogoutText>Sair da conta</LogoutText>
        </LogoutRow>

        <AppVersionText>AUSTA SuperApp v1.0.0</AppVersionText>
      </ScrollView>
    </Container>
  );
};

export default SettingsScreen;
