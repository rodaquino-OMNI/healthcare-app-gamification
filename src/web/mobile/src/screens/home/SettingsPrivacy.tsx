import React, { useState } from 'react';
import {
  ScrollView,
  Switch,
  Modal as RNModal,
  Alert,
} from 'react-native';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import { colors } from '@design-system/tokens/colors';
import { typography } from '@design-system/tokens/typography';
import { spacing, spacingValues } from '@design-system/tokens/spacing';
import { borderRadius } from '@design-system/tokens/borderRadius';
import { sizing } from '@design-system/tokens/sizing';

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

const ToggleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${spacing.xl};
  padding-vertical: ${spacing.md};
  background-color: ${({ theme }) => theme.colors.background.default};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray[10]};
`;

const ToggleLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.text.default};
  flex: 1;
  margin-right: ${spacing.md};
`;

const CheckboxRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${spacing.xl};
  padding-vertical: ${spacing.md};
  background-color: ${({ theme }) => theme.colors.background.default};
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
  color: ${({ theme }) => theme.colors.text.onBrand};
  line-height: 20px;
`;

const CheckboxLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.text.default};
  flex: 1;
`;

const InfoText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${({ theme }) => theme.colors.text.muted};
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
  border-color: ${({ theme }) => theme.colors.border.default};
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
  color: ${({ theme }) => theme.colors.text.default};
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
  border-top-color: ${({ theme }) => theme.colors.border.default};
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
  color: ${({ theme }) => theme.colors.text.onBrand};
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
  background-color: ${({ theme }) => theme.colors.background.default};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.xl};
`;

const ModalTitle = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-md']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: ${spacing.sm};
`;

const ModalBody = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.text.default};
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
  border-color: ${({ theme }) => theme.colors.border.default};
`;

const ModalCancelText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.default};
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
  color: ${({ theme }) => theme.colors.text.onBrand};
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
  const { t } = useTranslation();
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
      t('settings.privacy.exportTitle'),
      t('settings.privacy.exportMessage'),
    );
  };

  const handleRequestDeletion = () => {
    Alert.alert(
      t('settings.privacy.deletionRequestTitle'),
      t('settings.privacy.deletionRequestMessage'),
    );
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    // TODO: call API to delete account
    Alert.alert(
      t('settings.privacy.accountDeletedTitle'),
      t('settings.privacy.accountDeletedMessage'),
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
          <SectionHeaderText>{t('settings.privacy.lgpdConsent')}</SectionHeaderText>
        </SectionHeader>

        <ToggleRow>
          <ToggleLabel>{t('settings.privacy.serviceImprovement')}</ToggleLabel>
          <Switch
            value={consent.serviceImprovement}
            onValueChange={() => toggleConsent('serviceImprovement')}
            trackColor={trackColor}
            thumbColor={colors.neutral.white}
            accessibilityLabel={t('settings.privacy.serviceImprovement')}
            testID="settings-privacy-service"
          />
        </ToggleRow>

        <ToggleRow>
          <ToggleLabel>{t('settings.privacy.marketing')}</ToggleLabel>
          <Switch
            value={consent.marketing}
            onValueChange={() => toggleConsent('marketing')}
            trackColor={trackColor}
            thumbColor={colors.neutral.white}
            accessibilityLabel={t('settings.privacy.marketing')}
            testID="settings-privacy-marketing"
          />
        </ToggleRow>

        <ToggleRow>
          <ToggleLabel>{t('settings.privacy.analytics')}</ToggleLabel>
          <Switch
            value={consent.analytics}
            onValueChange={() => toggleConsent('analytics')}
            trackColor={trackColor}
            thumbColor={colors.neutral.white}
            accessibilityLabel={t('settings.privacy.analytics')}
            testID="settings-privacy-analytics"
          />
        </ToggleRow>

        <InfoText>
          {t('settings.privacy.lgpdInfo')}
        </InfoText>

        {/* Compartilhamento de Dados */}
        <SectionHeader>
          <SectionHeaderText>{t('settings.privacy.dataSharing')}</SectionHeaderText>
        </SectionHeader>

        <CheckboxRow
          onPress={() => toggleSharing('healthWithDoctors')}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: sharing.healthWithDoctors }}
          accessibilityLabel={t('settings.privacy.healthWithDoctors')}
          testID="settings-privacy-share-doctors"
        >
          <CheckboxBox checked={sharing.healthWithDoctors}>
            {sharing.healthWithDoctors && <CheckmarkText>{'✓'}</CheckmarkText>}
          </CheckboxBox>
          <CheckboxLabel>{t('settings.privacy.healthWithDoctors')}</CheckboxLabel>
        </CheckboxRow>

        <CheckboxRow
          onPress={() => toggleSharing('usageWithPartners')}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: sharing.usageWithPartners }}
          accessibilityLabel={t('settings.privacy.usageWithPartners')}
          testID="settings-privacy-share-partners"
        >
          <CheckboxBox checked={sharing.usageWithPartners}>
            {sharing.usageWithPartners && <CheckmarkText>{'✓'}</CheckmarkText>}
          </CheckboxBox>
          <CheckboxLabel>{t('settings.privacy.usageWithPartners')}</CheckboxLabel>
        </CheckboxRow>

        <CheckboxRow
          onPress={() => toggleSharing('anonymousResearch')}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: sharing.anonymousResearch }}
          accessibilityLabel={t('settings.privacy.anonymousResearch')}
          testID="settings-privacy-share-research"
        >
          <CheckboxBox checked={sharing.anonymousResearch}>
            {sharing.anonymousResearch && <CheckmarkText>{'✓'}</CheckmarkText>}
          </CheckboxBox>
          <CheckboxLabel>{t('settings.privacy.anonymousResearch')}</CheckboxLabel>
        </CheckboxRow>

        {/* Seus Dados */}
        <SectionHeader>
          <SectionHeaderText>{t('settings.privacy.yourData')}</SectionHeaderText>
        </SectionHeader>

        <ActionButtonContainer>
          <OutlineButton
            onPress={handleExportData}
            accessibilityRole="button"
            accessibilityLabel={t('settings.privacy.exportData')}
            testID="settings-privacy-export"
          >
            <OutlineButtonText>{t('settings.privacy.exportData')}</OutlineButtonText>
          </OutlineButton>

          <DangerOutlineButton
            onPress={handleRequestDeletion}
            accessibilityRole="button"
            accessibilityLabel={t('settings.privacy.requestDeletion')}
            testID="settings-privacy-request-deletion"
          >
            <DangerOutlineButtonText>{t('settings.privacy.requestDeletion')}</DangerOutlineButtonText>
          </DangerOutlineButton>
        </ActionButtonContainer>

        {/* Danger Zone */}
        <DangerSection>
          <DangerSectionTitle>{t('settings.privacy.dangerZone')}</DangerSectionTitle>
          <DangerButton
            onPress={() => setShowDeleteModal(true)}
            accessibilityRole="button"
            accessibilityLabel={t('settings.privacy.deleteAccount')}
            testID="settings-privacy-delete-account"
          >
            <DangerButtonText>{t('settings.privacy.deleteAccount')}</DangerButtonText>
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
            <ModalTitle>{t('settings.privacy.deleteAccount')}</ModalTitle>
            <ModalBody>
              {t('settings.privacy.deleteConfirmMessage')}
            </ModalBody>
            <ModalActions>
              <ModalCancelButton
                onPress={() => setShowDeleteModal(false)}
                accessibilityRole="button"
                accessibilityLabel={t('settings.privacy.cancelDeletion')}
                testID="settings-privacy-delete-cancel"
              >
                <ModalCancelText>{t('common.buttons.cancel')}</ModalCancelText>
              </ModalCancelButton>
              <ModalConfirmButton
                onPress={handleDeleteAccount}
                accessibilityRole="button"
                accessibilityLabel={t('settings.privacy.deletePermanently')}
                testID="settings-privacy-delete-confirm"
              >
                <ModalConfirmText>{t('settings.privacy.deletePermanently')}</ModalConfirmText>
              </ModalConfirmButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      </RNModal>
    </Container>
  );
};

export default SettingsPrivacyScreen;
