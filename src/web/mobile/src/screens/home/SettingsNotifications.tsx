import React, { useState } from 'react';
import {
  ScrollView,
  Switch,
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

const TimeInputRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${spacing.xl};
  padding-vertical: ${spacing.md};
  background-color: ${colors.neutral.white};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray[10]};
`;

const TimeLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.regular};
  color: ${colors.neutral.gray900};
  flex: 1;
`;

const TimeInput = styled.TextInput`
  width: 72px;
  height: ${sizing.component.sm};
  border-width: 1px;
  border-color: ${colors.gray[20]};
  border-radius: ${borderRadius.md};
  text-align: center;
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${colors.neutral.gray900};
`;

const DisabledOverlay = styled.View`
  opacity: 0.4;
`;

const InfoText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${colors.gray[50]};
  padding-horizontal: ${spacing.xl};
  padding-vertical: ${spacing.sm};
  line-height: 18px;
`;

// --- Types ---

interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  healthJourney: boolean;
  careJourney: boolean;
  planJourney: boolean;
  achievementsJourney: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

/**
 * SettingsNotifications screen -- manages notification preferences.
 *
 * Sections:
 *  1. Canais de Notificacao (Push, Email, SMS)
 *  2. Por Jornada (Saude, Cuidados, Plano, Conquistas)
 *  3. Horario Silencioso (toggle + time range)
 */
export const SettingsNotificationsScreen: React.FC = () => {
  const [prefs, setPrefs] = useState<NotificationPreferences>({
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
    healthJourney: true,
    careJourney: true,
    planJourney: true,
    achievementsJourney: true,
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
  });

  const toggle = (key: keyof NotificationPreferences) => {
    setPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const updateTime = (key: 'quietHoursStart' | 'quietHoursEnd', value: string) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
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
        {/* Canais de Notificacao */}
        <SectionHeader>
          <SectionHeaderText>Canais de Notificacao</SectionHeaderText>
        </SectionHeader>

        <ToggleRow>
          <ToggleLabel>Notificacoes Push</ToggleLabel>
          <Switch
            value={prefs.pushEnabled}
            onValueChange={() => toggle('pushEnabled')}
            trackColor={trackColor}
            thumbColor={colors.neutral.white}
            accessibilityLabel="Ativar notificacoes push"
            testID="settings-notif-push"
          />
        </ToggleRow>

        <ToggleRow>
          <ToggleLabel>Email</ToggleLabel>
          <Switch
            value={prefs.emailEnabled}
            onValueChange={() => toggle('emailEnabled')}
            trackColor={trackColor}
            thumbColor={colors.neutral.white}
            accessibilityLabel="Ativar notificacoes por email"
            testID="settings-notif-email"
          />
        </ToggleRow>

        <ToggleRow>
          <ToggleLabel>SMS</ToggleLabel>
          <Switch
            value={prefs.smsEnabled}
            onValueChange={() => toggle('smsEnabled')}
            trackColor={trackColor}
            thumbColor={colors.neutral.white}
            accessibilityLabel="Ativar notificacoes por SMS"
            testID="settings-notif-sms"
          />
        </ToggleRow>

        {/* Por Jornada */}
        <SectionHeader>
          <SectionHeaderText>Por Jornada</SectionHeaderText>
        </SectionHeader>

        <ToggleRow>
          <ToggleLabel>Saude</ToggleLabel>
          <Switch
            value={prefs.healthJourney}
            onValueChange={() => toggle('healthJourney')}
            trackColor={{ false: colors.gray[20], true: colors.journeys.health.primary }}
            thumbColor={colors.neutral.white}
            accessibilityLabel="Notificacoes da jornada Saude"
            testID="settings-notif-health"
          />
        </ToggleRow>

        <ToggleRow>
          <ToggleLabel>Cuidados</ToggleLabel>
          <Switch
            value={prefs.careJourney}
            onValueChange={() => toggle('careJourney')}
            trackColor={{ false: colors.gray[20], true: colors.journeys.care.primary }}
            thumbColor={colors.neutral.white}
            accessibilityLabel="Notificacoes da jornada Cuidados"
            testID="settings-notif-care"
          />
        </ToggleRow>

        <ToggleRow>
          <ToggleLabel>Plano</ToggleLabel>
          <Switch
            value={prefs.planJourney}
            onValueChange={() => toggle('planJourney')}
            trackColor={{ false: colors.gray[20], true: colors.journeys.plan.primary }}
            thumbColor={colors.neutral.white}
            accessibilityLabel="Notificacoes da jornada Plano"
            testID="settings-notif-plan"
          />
        </ToggleRow>

        <ToggleRow>
          <ToggleLabel>Conquistas</ToggleLabel>
          <Switch
            value={prefs.achievementsJourney}
            onValueChange={() => toggle('achievementsJourney')}
            trackColor={{ false: colors.gray[20], true: colors.journeys.community.primary }}
            thumbColor={colors.neutral.white}
            accessibilityLabel="Notificacoes de conquistas"
            testID="settings-notif-achievements"
          />
        </ToggleRow>

        {/* Horario Silencioso */}
        <SectionHeader>
          <SectionHeaderText>Horario Silencioso</SectionHeaderText>
        </SectionHeader>

        <ToggleRow>
          <ToggleLabel>Ativar horario silencioso</ToggleLabel>
          <Switch
            value={prefs.quietHoursEnabled}
            onValueChange={() => toggle('quietHoursEnabled')}
            trackColor={trackColor}
            thumbColor={colors.neutral.white}
            accessibilityLabel="Ativar horario silencioso"
            testID="settings-notif-quiet-toggle"
          />
        </ToggleRow>

        {prefs.quietHoursEnabled && (
          <>
            <TimeInputRow>
              <TimeLabel>Inicio</TimeLabel>
              <TimeInput
                value={prefs.quietHoursStart}
                onChangeText={(val: string) => updateTime('quietHoursStart', val)}
                placeholder="22:00"
                placeholderTextColor={colors.gray[40]}
                keyboardType="numeric"
                maxLength={5}
                accessibilityLabel="Horario de inicio do silencioso"
                testID="settings-notif-quiet-start"
              />
            </TimeInputRow>

            <TimeInputRow>
              <TimeLabel>Fim</TimeLabel>
              <TimeInput
                value={prefs.quietHoursEnd}
                onChangeText={(val: string) => updateTime('quietHoursEnd', val)}
                placeholder="07:00"
                placeholderTextColor={colors.gray[40]}
                keyboardType="numeric"
                maxLength={5}
                accessibilityLabel="Horario de fim do silencioso"
                testID="settings-notif-quiet-end"
              />
            </TimeInputRow>

            <InfoText>
              Durante o horario silencioso, notificacoes push serao silenciadas.
              Notificacoes por email e SMS nao sao afetadas.
            </InfoText>
          </>
        )}
      </ScrollView>
    </Container>
  );
};

export default SettingsNotificationsScreen;
