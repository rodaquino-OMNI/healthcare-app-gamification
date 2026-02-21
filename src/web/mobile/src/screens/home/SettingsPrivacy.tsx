import React, { useState } from 'react';
import {
  ScrollView,
  Switch,
  Modal as RNModal,
  Alert,
} from 'react-native';
import styled from 'styled-components/native';

import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing, spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadius } from '../../../../design-system/src/tokens/borderRadius';
import { sizing } from '../../../../design-system/src/tokens/sizing';

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

const ToggleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${spacing.xl};
  padding-vertical: ${spacing.md};
  background-color: ${colors.neutral.white};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray[10]};
`;

const ToggleLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.regular};
  color: ${colors.neutral.gray900};
  flex: 1;
  margin-right: ${spacing.md};
`;

const CheckboxRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${spacing.xl};
  padding-vertical: ${spacing.md};
  background-color: ${colors.neutral.white};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray[10]};
`;

const CheckboxBox = styled.View<{ checked: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: ${borderRadius.xs};
  border-width: 2px;
  border-color: ${(props) =>
    props.checked ? colors.brand.primary : colors.gray[40]};
  background-color: ${(props) =>
    props.checked ? colors.brand.primary : 'transparent'};
  align-items: center;
  justify-content: center;
  margin-right: ${spacing.sm};
`;

const CheckmarkText = styled.Text`
  font-size: 14px;
  color: ${colors.neutral.white};
  line-height: 20px;
`;

const CheckboxLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.regular};
  color: ${colors.neutral.gray900};
  flex: 1;
`;

const InfoText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${colors.gray[50]};
  padding-horizontal: ${spacing.xl};
  padding-vertical: ${spacing.sm};
  line-height: 18px;
`;

const ActionButtonContainer = styled.View`
  padding-horizontal: ${spacing.xl};
  padding-vertical: ${spacing.sm};
`;

const OutlineButton = styled.TouchableOpacity`
  border-width: 1px;
  border-color: ${colors.gray[20]};
  border-radius: ${borderRadius.md};
  height: ${sizing.component.md};
  align-items: center;
  justify-content: center;
  margin-bottom: ${spacing.sm};
`;

const OutlineButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.gray[60]};
`;

const DangerOutlineButton = styled.TouchableOpacity`
  border-width: 1px;
  border-color: ${colors.semantic.error};
  border-radius: ${borderRadius.md};
  height: ${sizing.component.md};
  align-items: center;
  justify-content: center;
  margin-bottom: ${spacing.sm};
`;

const DangerOutlineButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.semantic.error};
`;

const DangerSection = styled.View`
  margin-top: ${spacing['2xl']};
  padding-horizontal: ${spacing.xl};
  padding-vertical: ${spacing.lg};
  border-top-width: 1px;
  border-top-color: ${colors.gray[20]};
`;

const DangerSectionTitle = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.semantic.error};
  text-transform: uppercase;
  letter-spacing: ${typography.letterSpacing.wide};
  margin-bottom: ${spacing.md};
`;

const DangerButton = styled.TouchableOpacity`
  background-color: ${colors.semantic.error};
  border-radius: ${borderRadius.md};
  height: ${sizing.component.md};
  align-items: center;
  justify-content: center;
`;

const DangerButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.white};
`;

// --- Modal Styled Components ---

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.View`
  width: 85%;
  background-color: ${colors.neutral.white};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.xl};
`;

const ModalTitle = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-md']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.neutral.gray900};
  margin-bottom: ${spacing.sm};
`;

const ModalBody = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.regular};
  color: ${colors.gray[60]};
  line-height: 24px;
  margin-bottom: ${spacing.xl};
`;

const ModalActions = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  gap: ${spacing.sm};
`;

const ModalCancelButton = styled.TouchableOpacity`
  padding-vertical: ${spacing.sm};
  padding-horizontal: ${spacing.lg};
  border-radius: ${borderRadius.md};
  border-width: 1px;
  border-color: ${colors.gray[20]};
`;

const ModalCancelText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.gray[60]};
`;

const ModalConfirmButton = styled.TouchableOpacity`
  padding-vertical: ${spacing.sm};
  padding-horizontal: ${spacing.lg};
  border-radius: ${borderRadius.md};
  background-color: ${colors.semantic.error};
`;

const ModalConfirmText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.white};
`;

// --- Types ---

interface ConsentState {
  serviceImprovement: boolean;
  marketing: boolean;
  analytics: boolean;
}

interface SharingState {
  healthWithDoctors: boolean;
  usageWithPartners: boolean;
  anonymousResearch: boolean;
}

/**
 * SettingsPrivacy screen -- manages privacy, LGPD consent, data sharing,
 * data export, and account deletion.
 *
 * Sections:
 *  1. Consentimento LGPD (toggles with info)
 *  2. Compartilhamento de Dados (checkboxes)
 *  3. Seus Dados (export + deletion request)
 *  4. Danger Zone (account deletion with modal confirmation)
 */
export const SettingsPrivacyScreen: React.FC = () => {
  const [consent, setConsent] = useState<ConsentState>({
    serviceImprovement: true,
    marketing: false,
    analytics: true,
  });

  const [sharing, setSharing] = useState<SharingState>({
    healthWithDoctors: true,
    usageWithPartners: false,
    anonymousResearch: true,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggleConsent = (key: keyof ConsentState) => {
    setConsent((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSharing = (key: keyof SharingState) => {
    setSharing((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExportData = () => {
    Alert.alert(
      'Exportar dados',
      'Sua solicitacao de exportacao foi registrada. Voce recebera um email com seus dados em ate 15 dias uteis.',
    );
  };

  const handleRequestDeletion = () => {
    Alert.alert(
      'Solicitar exclusao',
      'Sua solicitacao de exclusao de dados foi registrada. Voce recebera um email de confirmacao.',
    );
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    // TODO: call API to delete account
    Alert.alert(
      'Conta excluida',
      'Sua conta foi marcada para exclusao. Voce sera desconectado.',
    );
  };

  const trackColor = {
    false: colors.gray[20],
    true: colors.brand.primary,
  };

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
      >
        {/* Consentimento LGPD */}
        <SectionHeader>
          <SectionHeaderText>Consentimento LGPD</SectionHeaderText>
        </SectionHeader>

        <ToggleRow>
          <ToggleLabel>Compartilhar dados para melhoria do servico</ToggleLabel>
          <Switch
            value={consent.serviceImprovement}
            onValueChange={() => toggleConsent('serviceImprovement')}
            trackColor={trackColor}
            thumbColor={colors.neutral.white}
            accessibilityLabel="Compartilhar dados para melhoria do servico"
            testID="settings-privacy-service"
          />
        </ToggleRow>

        <ToggleRow>
          <ToggleLabel>Permitir comunicacoes de marketing</ToggleLabel>
          <Switch
            value={consent.marketing}
            onValueChange={() => toggleConsent('marketing')}
            trackColor={trackColor}
            thumbColor={colors.neutral.white}
            accessibilityLabel="Permitir comunicacoes de marketing"
            testID="settings-privacy-marketing"
          />
        </ToggleRow>

        <ToggleRow>
          <ToggleLabel>Permitir analytics e rastreamento</ToggleLabel>
          <Switch
            value={consent.analytics}
            onValueChange={() => toggleConsent('analytics')}
            trackColor={trackColor}
            thumbColor={colors.neutral.white}
            accessibilityLabel="Permitir analytics e rastreamento"
            testID="settings-privacy-analytics"
          />
        </ToggleRow>

        <InfoText>
          De acordo com a Lei Geral de Protecao de Dados (LGPD), voce tem o direito
          de controlar como seus dados pessoais sao coletados, utilizados e
          compartilhados. Voce pode alterar suas preferencias a qualquer momento.
        </InfoText>

        {/* Compartilhamento de Dados */}
        <SectionHeader>
          <SectionHeaderText>Compartilhamento de Dados</SectionHeaderText>
        </SectionHeader>

        <CheckboxRow
          onPress={() => toggleSharing('healthWithDoctors')}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: sharing.healthWithDoctors }}
          accessibilityLabel="Dados de saude com medicos"
          testID="settings-privacy-share-doctors"
        >
          <CheckboxBox checked={sharing.healthWithDoctors}>
            {sharing.healthWithDoctors && <CheckmarkText>{'✓'}</CheckmarkText>}
          </CheckboxBox>
          <CheckboxLabel>Dados de saude com medicos</CheckboxLabel>
        </CheckboxRow>

        <CheckboxRow
          onPress={() => toggleSharing('usageWithPartners')}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: sharing.usageWithPartners }}
          accessibilityLabel="Dados de uso com parceiros"
          testID="settings-privacy-share-partners"
        >
          <CheckboxBox checked={sharing.usageWithPartners}>
            {sharing.usageWithPartners && <CheckmarkText>{'✓'}</CheckmarkText>}
          </CheckboxBox>
          <CheckboxLabel>Dados de uso com parceiros</CheckboxLabel>
        </CheckboxRow>

        <CheckboxRow
          onPress={() => toggleSharing('anonymousResearch')}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: sharing.anonymousResearch }}
          accessibilityLabel="Dados anonimos para pesquisa"
          testID="settings-privacy-share-research"
        >
          <CheckboxBox checked={sharing.anonymousResearch}>
            {sharing.anonymousResearch && <CheckmarkText>{'✓'}</CheckmarkText>}
          </CheckboxBox>
          <CheckboxLabel>Dados anonimos para pesquisa</CheckboxLabel>
        </CheckboxRow>

        {/* Seus Dados */}
        <SectionHeader>
          <SectionHeaderText>Seus Dados</SectionHeaderText>
        </SectionHeader>

        <ActionButtonContainer>
          <OutlineButton
            onPress={handleExportData}
            accessibilityRole="button"
            accessibilityLabel="Exportar meus dados"
            testID="settings-privacy-export"
          >
            <OutlineButtonText>Exportar meus dados</OutlineButtonText>
          </OutlineButton>

          <DangerOutlineButton
            onPress={handleRequestDeletion}
            accessibilityRole="button"
            accessibilityLabel="Solicitar exclusao de dados"
            testID="settings-privacy-request-deletion"
          >
            <DangerOutlineButtonText>Solicitar exclusao de dados</DangerOutlineButtonText>
          </DangerOutlineButton>
        </ActionButtonContainer>

        {/* Danger Zone */}
        <DangerSection>
          <DangerSectionTitle>Zona de Perigo</DangerSectionTitle>
          <DangerButton
            onPress={() => setShowDeleteModal(true)}
            accessibilityRole="button"
            accessibilityLabel="Excluir conta"
            testID="settings-privacy-delete-account"
          >
            <DangerButtonText>Excluir conta</DangerButtonText>
          </DangerButton>
        </DangerSection>
      </ScrollView>

      {/* Delete Account Confirmation Modal */}
      <RNModal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Excluir conta</ModalTitle>
            <ModalBody>
              Tem certeza? Esta acao e irreversivel. Todos os seus dados serao
              permanentemente removidos e nao poderao ser recuperados.
            </ModalBody>
            <ModalActions>
              <ModalCancelButton
                onPress={() => setShowDeleteModal(false)}
                accessibilityRole="button"
                accessibilityLabel="Cancelar exclusao"
                testID="settings-privacy-delete-cancel"
              >
                <ModalCancelText>Cancelar</ModalCancelText>
              </ModalCancelButton>
              <ModalConfirmButton
                onPress={handleDeleteAccount}
                accessibilityRole="button"
                accessibilityLabel="Excluir permanentemente"
                testID="settings-privacy-delete-confirm"
              >
                <ModalConfirmText>Excluir permanentemente</ModalConfirmText>
              </ModalConfirmButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      </RNModal>
    </Container>
  );
};

export default SettingsPrivacyScreen;
