import React, { useState, useCallback } from 'react';
import { ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
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

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${spacing.md};
  padding-vertical: ${spacing.sm};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray[20]};
`;

const BackButton = styled.TouchableOpacity`
  width: ${sizing.component.sm};
  height: ${sizing.component.sm};
  align-items: center;
  justify-content: center;
`;

const BackText = styled.Text`
  font-size: ${typography.fontSize['text-xl']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.gray900};
`;

const HeaderTitle = styled.Text`
  flex: 1;
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['text-lg']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.neutral.gray900};
  text-align: center;
`;

const HeaderSpacer = styled.View`
  width: ${sizing.component.sm};
`;

const SectionLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.gray[50]};
  text-transform: uppercase;
  letter-spacing: ${typography.letterSpacing.wide};
  padding-horizontal: ${spacing.xl};
  margin-top: ${spacing.xl};
  margin-bottom: ${spacing.sm};
`;

const ToggleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${spacing.xl};
  padding-vertical: ${spacing.md};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray[10]};
`;

const ToggleLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.neutral.gray900};
  flex: 1;
`;

const ToggleDescription = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${colors.gray[40]};
  margin-top: ${spacing['4xs']};
`;

const ToggleTextContainer = styled.View`
  flex: 1;
  margin-right: ${spacing.sm};
`;

const QuietHoursRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${spacing.xl};
  padding-vertical: ${spacing.md};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray[10]};
`;

const TimeLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.neutral.gray900};
`;

const TimeValue = styled.Text`
  font-family: ${typography.fontFamily.mono};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.brand.primary};
`;

const SaveButtonContainer = styled.View`
  padding-horizontal: ${spacing.xl};
  padding-vertical: ${spacing.lg};
  border-top-width: 1px;
  border-top-color: ${colors.gray[20]};
`;

const SaveButton = styled.TouchableOpacity`
  background-color: ${colors.brand.primary};
  border-radius: ${borderRadius.md};
  padding-vertical: ${spacing.md};
  align-items: center;
`;

const SaveButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.neutral.white};
`;

// --- Types ---

interface NotificationToggles {
  healthUpdates: boolean;
  careReminders: boolean;
  planNotifications: boolean;
  systemAlerts: boolean;
  quietHours: boolean;
}

// --- Component ---

export const NotificationSettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [toggles, setToggles] = useState<NotificationToggles>({
    healthUpdates: true,
    careReminders: true,
    planNotifications: true,
    systemAlerts: false,
    quietHours: false,
  });

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleToggle = useCallback(
    (key: keyof NotificationToggles) => {
      setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [],
  );

  const handleSave = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <Container>
      <Header>
        <BackButton
          onPress={handleGoBack}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          testID="notif-settings-back"
        >
          <BackText>{'\u003C'}</BackText>
        </BackButton>
        <HeaderTitle
          accessibilityRole="header"
          testID="notif-settings-title"
        >
          {t('notification.settings.title')}
        </HeaderTitle>
        <HeaderSpacer />
      </Header>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
      >
        <SectionLabel testID="notif-settings-categories-label">
          {t('notification.settings.categoriesSection')}
        </SectionLabel>

        <ToggleRow>
          <ToggleTextContainer>
            <ToggleLabel>
              {t('notification.settings.healthUpdates')}
            </ToggleLabel>
            <ToggleDescription>
              {t('notification.settings.healthUpdatesDesc')}
            </ToggleDescription>
          </ToggleTextContainer>
          <Switch
            value={toggles.healthUpdates}
            onValueChange={() => handleToggle('healthUpdates')}
            trackColor={{
              false: colors.gray[20],
              true: colors.journeys.health.primary,
            }}
            accessibilityLabel={t('notification.settings.healthUpdates')}
            testID="notif-settings-toggle-health"
          />
        </ToggleRow>

        <ToggleRow>
          <ToggleTextContainer>
            <ToggleLabel>
              {t('notification.settings.careReminders')}
            </ToggleLabel>
            <ToggleDescription>
              {t('notification.settings.careRemindersDesc')}
            </ToggleDescription>
          </ToggleTextContainer>
          <Switch
            value={toggles.careReminders}
            onValueChange={() => handleToggle('careReminders')}
            trackColor={{
              false: colors.gray[20],
              true: colors.journeys.care.primary,
            }}
            accessibilityLabel={t('notification.settings.careReminders')}
            testID="notif-settings-toggle-care"
          />
        </ToggleRow>

        <ToggleRow>
          <ToggleTextContainer>
            <ToggleLabel>
              {t('notification.settings.planNotifications')}
            </ToggleLabel>
            <ToggleDescription>
              {t('notification.settings.planNotificationsDesc')}
            </ToggleDescription>
          </ToggleTextContainer>
          <Switch
            value={toggles.planNotifications}
            onValueChange={() => handleToggle('planNotifications')}
            trackColor={{
              false: colors.gray[20],
              true: colors.journeys.plan.primary,
            }}
            accessibilityLabel={t('notification.settings.planNotifications')}
            testID="notif-settings-toggle-plan"
          />
        </ToggleRow>

        <ToggleRow>
          <ToggleTextContainer>
            <ToggleLabel>
              {t('notification.settings.systemAlerts')}
            </ToggleLabel>
            <ToggleDescription>
              {t('notification.settings.systemAlertsDesc')}
            </ToggleDescription>
          </ToggleTextContainer>
          <Switch
            value={toggles.systemAlerts}
            onValueChange={() => handleToggle('systemAlerts')}
            trackColor={{
              false: colors.gray[20],
              true: colors.gray[50],
            }}
            accessibilityLabel={t('notification.settings.systemAlerts')}
            testID="notif-settings-toggle-system"
          />
        </ToggleRow>

        <SectionLabel testID="notif-settings-quiet-label">
          {t('notification.settings.quietHoursSection')}
        </SectionLabel>

        <ToggleRow>
          <ToggleTextContainer>
            <ToggleLabel>
              {t('notification.settings.quietHoursEnable')}
            </ToggleLabel>
            <ToggleDescription>
              {t('notification.settings.quietHoursDesc')}
            </ToggleDescription>
          </ToggleTextContainer>
          <Switch
            value={toggles.quietHours}
            onValueChange={() => handleToggle('quietHours')}
            trackColor={{
              false: colors.gray[20],
              true: colors.brand.primary,
            }}
            accessibilityLabel={t('notification.settings.quietHoursEnable')}
            testID="notif-settings-toggle-quiet"
          />
        </ToggleRow>

        {toggles.quietHours && (
          <>
            <QuietHoursRow>
              <TimeLabel>
                {t('notification.settings.quietFrom')}
              </TimeLabel>
              <TimeValue testID="notif-settings-quiet-from">
                22:00
              </TimeValue>
            </QuietHoursRow>
            <QuietHoursRow>
              <TimeLabel>
                {t('notification.settings.quietTo')}
              </TimeLabel>
              <TimeValue testID="notif-settings-quiet-to">
                07:00
              </TimeValue>
            </QuietHoursRow>
          </>
        )}
      </ScrollView>

      <SaveButtonContainer>
        <SaveButton
          onPress={handleSave}
          accessibilityRole="button"
          accessibilityLabel={t('notification.settings.save')}
          testID="notif-settings-save"
        >
          <SaveButtonText>
            {t('notification.settings.save')}
          </SaveButtonText>
        </SaveButton>
      </SaveButtonContainer>
    </Container>
  );
};

export default NotificationSettingsScreen;
