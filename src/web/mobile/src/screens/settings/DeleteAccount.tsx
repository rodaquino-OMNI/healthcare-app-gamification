import React, { useState } from 'react';
import {
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../constants/routes';
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

const ContentWrapper = styled.View`
  padding-horizontal: ${spacing.xl};
  padding-top: ${spacing['2xl']};
  padding-bottom: ${spacing['4xl']};
  align-items: center;
`;

const WarningIcon = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${colors.semantic.error};
  align-items: center;
  justify-content: center;
  margin-bottom: ${spacing.xl};
`;

const WarningIconText = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: 40px;
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.neutral.white};
`;

const Title = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-lg']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.semantic.error};
  text-align: center;
  margin-bottom: ${spacing.sm};
`;

const WarningText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${colors.gray[60]};
  text-align: center;
  line-height: 24px;
  margin-bottom: ${spacing.xl};
`;

const ConsequencesContainer = styled.View`
  width: 100%;
  margin-bottom: ${spacing.xl};
`;

const ConsequencesTitle = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.gray700};
  text-transform: uppercase;
  letter-spacing: ${typography.letterSpacing.wide};
  margin-bottom: ${spacing.sm};
`;

const ConsequenceItem = styled.View`
  flex-direction: row;
  align-items: flex-start;
  padding-vertical: ${spacing.xs};
`;

const BulletDot = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: ${colors.semantic.error};
  margin-top: 7px;
  margin-right: ${spacing.sm};
`;

const ConsequenceText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${colors.neutral.gray900};
  flex: 1;
  line-height: 22px;
`;

const CheckboxRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding-vertical: ${spacing.md};
  padding-horizontal: ${spacing.md};
  background-color: ${colors.gray[10]};
  border-radius: ${borderRadius.md};
  margin-bottom: ${spacing.xl};
`;

const CheckboxBox = styled.View<{ checked: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: ${borderRadius.xs};
  border-width: 2px;
  border-color: ${(props) =>
    props.checked ? colors.semantic.error : colors.gray[40]};
  background-color: ${(props) =>
    props.checked ? colors.semantic.error : 'transparent'};
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
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.neutral.gray900};
  flex: 1;
`;

const DangerButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  width: 100%;
  background-color: ${(props) =>
    props.disabled ? colors.gray[30] : colors.semantic.error};
  border-radius: ${borderRadius.md};
  height: ${sizing.component.lg};
  align-items: center;
  justify-content: center;
`;

const DangerButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.white};
`;

const SecondaryButton = styled.TouchableOpacity`
  width: 100%;
  border-width: 1px;
  border-color: ${colors.gray[20]};
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
  color: ${colors.gray[60]};
`;

// --- Constants ---

const CONSEQUENCE_KEYS = [
  'settings.deleteAccount.consequences.healthData',
  'settings.deleteAccount.consequences.cancelPlan',
  'settings.deleteAccount.consequences.leaderboards',
  'settings.deleteAccount.consequences.xpAchievements',
  'settings.deleteAccount.consequences.cannotUndo',
];

/**
 * DeleteAccount screen -- displays account deletion warnings,
 * consequences list, and a confirmation checkbox before proceeding.
 */
export const DeleteAccountScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const [understood, setUnderstood] = useState(false);

  const handleProceed = () => {
    navigation.navigate(ROUTES.SETTINGS_DELETE_CONFIRM);
  };

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
      >
        <ContentWrapper>
          <WarningIcon>
            <WarningIconText>!</WarningIconText>
          </WarningIcon>

          <Title>{t('settings.deleteAccount.title')}</Title>
          <WarningText>{t('settings.deleteAccount.warning')}</WarningText>

          <ConsequencesContainer>
            <ConsequencesTitle>
              {t('settings.deleteAccount.consequencesTitle')}
            </ConsequencesTitle>
            {CONSEQUENCE_KEYS.map((key) => (
              <ConsequenceItem key={key}>
                <BulletDot />
                <ConsequenceText>{t(key)}</ConsequenceText>
              </ConsequenceItem>
            ))}
          </ConsequencesContainer>

          <CheckboxRow
            onPress={() => setUnderstood(!understood)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: understood }}
            accessibilityLabel={t('settings.deleteAccount.understand')}
            testID="delete-account-understand"
          >
            <CheckboxBox checked={understood}>
              {understood && <CheckmarkText>{'✓'}</CheckmarkText>}
            </CheckboxBox>
            <CheckboxLabel>{t('settings.deleteAccount.understand')}</CheckboxLabel>
          </CheckboxRow>

          <DangerButton
            onPress={handleProceed}
            disabled={!understood}
            accessibilityRole="button"
            accessibilityLabel={t('settings.deleteAccount.proceed')}
            testID="delete-account-proceed"
          >
            <DangerButtonText>{t('settings.deleteAccount.proceed')}</DangerButtonText>
          </DangerButton>

          <SecondaryButton
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel={t('settings.deleteAccount.goBack')}
            testID="delete-account-go-back"
          >
            <SecondaryButtonText>{t('settings.deleteAccount.goBack')}</SecondaryButtonText>
          </SecondaryButton>
        </ContentWrapper>
      </ScrollView>
    </Container>
  );
};

export default DeleteAccountScreen;
