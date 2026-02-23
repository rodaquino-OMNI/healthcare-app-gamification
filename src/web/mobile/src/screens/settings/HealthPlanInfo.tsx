import React from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { SettingsNavigationProp, MainTabParamList } from '../../navigation/types';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../constants/routes';
import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing, spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadius } from '../../../../design-system/src/tokens/borderRadius';
import { sizing } from '../../../../design-system/src/tokens/sizing';

// --- Mock Data ---

const PLAN_DATA = {
  planName: 'AUSTA Premium',
  planNumber: '123456789',
  type: 'Individual',
  validFrom: '01/01/2024',
  validTo: '31/12/2024',
  memberName: 'Maria Silva Santos',
  memberNumber: '987654321',
  ansRegistration: 'ANS 123456',
  operatorName: 'AUSTA Saude',
};

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const Title = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-lg']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.default};
  padding-horizontal: ${spacing.xl};
  padding-top: ${spacing['2xl']};
  padding-bottom: ${spacing.lg};
`;

const PlanCard = styled.View`
  margin-horizontal: ${spacing.xl};
  margin-bottom: ${spacing.lg};
  padding: ${spacing.lg};
  background-color: ${({ theme }) => theme.colors.background.default};
  border-radius: ${borderRadius.lg};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.default};
  shadow-color: ${colors.neutral.black};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.08;
  shadow-radius: 8px;
  elevation: 3;
`;

const PlanBadge = styled.View`
  align-self: flex-start;
  padding-horizontal: ${spacing.sm};
  padding-vertical: ${spacing['3xs']};
  background-color: ${colors.journeys.plan.background};
  border-radius: ${borderRadius.sm};
  margin-bottom: ${spacing.sm};
`;

const PlanBadgeText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.journeys.plan.primary};
`;

const PlanName = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-md']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: ${spacing.sm};
`;

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.xs};
`;

const InfoLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const InfoValue = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.text.default};
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

const DetailRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${spacing.xl};
  padding-vertical: ${spacing.md};
  background-color: ${({ theme }) => theme.colors.background.default};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray[10]};
`;

const DetailLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const DetailValue = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.text.default};
  text-align: right;
  flex-shrink: 1;
  margin-left: ${spacing.md};
`;

const OperatorCard = styled.View`
  margin-horizontal: ${spacing.xl};
  margin-top: ${spacing.md};
  padding: ${spacing.md};
  background-color: ${({ theme }) => theme.colors.background.muted};
  border-radius: ${borderRadius.lg};
  flex-direction: row;
  align-items: center;
`;

const LogoPlaceholder = styled.View`
  width: ${sizing.component.lg};
  height: ${sizing.component.lg};
  border-radius: ${borderRadius.md};
  background-color: ${colors.journeys.plan.primary};
  align-items: center;
  justify-content: center;
  margin-right: ${spacing.md};
`;

const LogoText = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.onBrand};
`;

const OperatorName = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.default};
`;

const ActionButton = styled.TouchableOpacity<{ variant?: 'primary' | 'outline' }>`
  margin-horizontal: ${spacing.xl};
  margin-top: ${spacing.sm};
  height: ${sizing.component.lg};
  background-color: ${({ variant }) =>
    variant === 'outline' ? colors.neutral.white : colors.brand.primary};
  border-radius: ${borderRadius.md};
  border-width: ${({ variant }) => (variant === 'outline' ? '2px' : '0px')};
  border-color: ${colors.brand.primary};
  align-items: center;
  justify-content: center;
`;

const ActionButtonText = styled.Text<{ variant?: 'primary' | 'outline' }>`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ variant }) =>
    variant === 'outline' ? colors.brand.primary : colors.neutral.white};
`;

/**
 * HealthPlanInfo screen -- displays AUSTA health plan details.
 * Shows plan card with name/number/type/validity, member info,
 * operator info, and navigation buttons for Digital Card and Documents.
 */
export const HealthPlanInfoScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<SettingsNavigationProp>();

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
      >
        <Title>{t('settings.healthPlan.title')}</Title>

        {/* Plan Card */}
        <PlanCard>
          <PlanBadge>
            <PlanBadgeText>{PLAN_DATA.type}</PlanBadgeText>
          </PlanBadge>
          <PlanName>{PLAN_DATA.planName}</PlanName>

          <InfoRow>
            <InfoLabel>{t('settings.healthPlan.planNumber')}</InfoLabel>
            <InfoValue>{PLAN_DATA.planNumber}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>{t('settings.healthPlan.type')}</InfoLabel>
            <InfoValue>{PLAN_DATA.type}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>{t('settings.healthPlan.validity')}</InfoLabel>
            <InfoValue>
              {PLAN_DATA.validFrom} - {PLAN_DATA.validTo}
            </InfoValue>
          </InfoRow>
        </PlanCard>

        {/* Member Section */}
        <SectionHeader>
          <SectionHeaderText>
            {t('settings.healthPlan.memberName')}
          </SectionHeaderText>
        </SectionHeader>

        <DetailRow>
          <DetailLabel>{t('settings.healthPlan.memberName')}</DetailLabel>
          <DetailValue>{PLAN_DATA.memberName}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>{t('settings.healthPlan.memberNumber')}</DetailLabel>
          <DetailValue>{PLAN_DATA.memberNumber}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>{t('settings.healthPlan.ansRegistration')}</DetailLabel>
          <DetailValue>{PLAN_DATA.ansRegistration}</DetailValue>
        </DetailRow>

        {/* Operator Section */}
        <SectionHeader>
          <SectionHeaderText>Operadora</SectionHeaderText>
        </SectionHeader>

        <OperatorCard>
          <LogoPlaceholder>
            <LogoText>A</LogoText>
          </LogoPlaceholder>
          <OperatorName>{PLAN_DATA.operatorName}</OperatorName>
        </OperatorCard>

        {/* Action Buttons */}
        <ActionButton
          onPress={() => navigation.getParent<BottomTabNavigationProp<MainTabParamList>>()?.navigate('Plan', { screen: 'DigitalCard' })}
          accessibilityRole="button"
          accessibilityLabel={t('settings.healthPlan.viewCard')}
          testID="health-plan-view-card"
        >
          <ActionButtonText>
            {t('settings.healthPlan.viewCard')}
          </ActionButtonText>
        </ActionButton>

        <ActionButton
          variant="outline"
          onPress={() => navigation.navigate(ROUTES.SETTINGS_INSURANCE_DOCS)}
          accessibilityRole="button"
          accessibilityLabel={t('settings.healthPlan.viewDocs')}
          testID="health-plan-view-docs"
        >
          <ActionButtonText variant="outline">
            {t('settings.healthPlan.viewDocs')}
          </ActionButtonText>
        </ActionButton>
      </ScrollView>
    </Container>
  );
};

export default HealthPlanInfoScreen;
