/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { borderRadius } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { sizing } from '@design-system/tokens/sizing';
import { spacing, spacingValues } from '@design-system/tokens/spacing';
import { typography } from '@design-system/tokens/typography';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Switch } from 'react-native';
import styled from 'styled-components/native';

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

const TimeInputRow = styled.View`
    flex-direction: row;
    align-items: center;
    padding-horizontal: ${spacing.xl};
    padding-vertical: ${spacing.md};
    background-color: ${({ theme }) => theme.colors.background.default};
    border-bottom-width: 1px;
    border-bottom-color: ${colors.gray[10]};
`;

const TimeLabel = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.regular};
    color: ${({ theme }) => theme.colors.text.default};
    flex: 1;
`;

const TimeInput = styled.TextInput`
    width: 72px;
    height: ${sizing.component.sm};
    border-width: 1px;
    border-color: ${({ theme }) => theme.colors.border.default};
    border-radius: ${borderRadius.md};
    text-align: center;
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: ${({ theme }) => theme.colors.text.default};
`;

const _DisabledOverlay = styled.View`
    opacity: 0.4;
`;

const InfoText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    color: ${({ theme }) => theme.colors.text.muted};
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
    const { t } = useTranslation();
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
                    <SectionHeaderText>{t('settings.notifications.channels')}</SectionHeaderText>
                </SectionHeader>

                <ToggleRow>
                    <ToggleLabel>{t('settings.notifications.push')}</ToggleLabel>
                    <Switch
                        value={prefs.pushEnabled}
                        onValueChange={() => toggle('pushEnabled')}
                        trackColor={trackColor}
                        thumbColor={colors.neutral.white}
                        accessibilityLabel={t('settings.notifications.pushA11y')}
                        testID="settings-notif-push"
                    />
                </ToggleRow>

                <ToggleRow>
                    <ToggleLabel>{t('settings.notifications.email')}</ToggleLabel>
                    <Switch
                        value={prefs.emailEnabled}
                        onValueChange={() => toggle('emailEnabled')}
                        trackColor={trackColor}
                        thumbColor={colors.neutral.white}
                        accessibilityLabel={t('settings.notifications.emailA11y')}
                        testID="settings-notif-email"
                    />
                </ToggleRow>

                <ToggleRow>
                    <ToggleLabel>{t('settings.notifications.sms')}</ToggleLabel>
                    <Switch
                        value={prefs.smsEnabled}
                        onValueChange={() => toggle('smsEnabled')}
                        trackColor={trackColor}
                        thumbColor={colors.neutral.white}
                        accessibilityLabel={t('settings.notifications.smsA11y')}
                        testID="settings-notif-sms"
                    />
                </ToggleRow>

                {/* Por Jornada */}
                <SectionHeader>
                    <SectionHeaderText>{t('settings.notifications.byJourney')}</SectionHeaderText>
                </SectionHeader>

                <ToggleRow>
                    <ToggleLabel>{t('settings.notifications.health')}</ToggleLabel>
                    <Switch
                        value={prefs.healthJourney}
                        onValueChange={() => toggle('healthJourney')}
                        trackColor={{ false: colors.gray[20], true: colors.journeys.health.primary }}
                        thumbColor={colors.neutral.white}
                        accessibilityLabel={t('settings.notifications.healthA11y')}
                        testID="settings-notif-health"
                    />
                </ToggleRow>

                <ToggleRow>
                    <ToggleLabel>{t('settings.notifications.care')}</ToggleLabel>
                    <Switch
                        value={prefs.careJourney}
                        onValueChange={() => toggle('careJourney')}
                        trackColor={{ false: colors.gray[20], true: colors.journeys.care.primary }}
                        thumbColor={colors.neutral.white}
                        accessibilityLabel={t('settings.notifications.careA11y')}
                        testID="settings-notif-care"
                    />
                </ToggleRow>

                <ToggleRow>
                    <ToggleLabel>{t('settings.notifications.plan')}</ToggleLabel>
                    <Switch
                        value={prefs.planJourney}
                        onValueChange={() => toggle('planJourney')}
                        trackColor={{ false: colors.gray[20], true: colors.journeys.plan.primary }}
                        thumbColor={colors.neutral.white}
                        accessibilityLabel={t('settings.notifications.planA11y')}
                        testID="settings-notif-plan"
                    />
                </ToggleRow>

                <ToggleRow>
                    <ToggleLabel>{t('settings.notifications.achievements')}</ToggleLabel>
                    <Switch
                        value={prefs.achievementsJourney}
                        onValueChange={() => toggle('achievementsJourney')}
                        trackColor={{ false: colors.gray[20], true: colors.journeys.community.primary }}
                        thumbColor={colors.neutral.white}
                        accessibilityLabel={t('settings.notifications.achievementsA11y')}
                        testID="settings-notif-achievements"
                    />
                </ToggleRow>

                {/* Horario Silencioso */}
                <SectionHeader>
                    <SectionHeaderText>{t('settings.notifications.quietHours')}</SectionHeaderText>
                </SectionHeader>

                <ToggleRow>
                    <ToggleLabel>{t('settings.notifications.enableQuietHours')}</ToggleLabel>
                    <Switch
                        value={prefs.quietHoursEnabled}
                        onValueChange={() => toggle('quietHoursEnabled')}
                        trackColor={trackColor}
                        thumbColor={colors.neutral.white}
                        accessibilityLabel={t('settings.notifications.enableQuietHoursA11y')}
                        testID="settings-notif-quiet-toggle"
                    />
                </ToggleRow>

                {prefs.quietHoursEnabled && (
                    <>
                        <TimeInputRow>
                            <TimeLabel>{t('settings.notifications.start')}</TimeLabel>
                            <TimeInput
                                value={prefs.quietHoursStart}
                                onChangeText={(val: string) => updateTime('quietHoursStart', val)}
                                placeholder="22:00"
                                placeholderTextColor={colors.gray[40]}
                                keyboardType="numeric"
                                maxLength={5}
                                accessibilityLabel={t('settings.notifications.startA11y')}
                                testID="settings-notif-quiet-start"
                            />
                        </TimeInputRow>

                        <TimeInputRow>
                            <TimeLabel>{t('settings.notifications.end')}</TimeLabel>
                            <TimeInput
                                value={prefs.quietHoursEnd}
                                onChangeText={(val: string) => updateTime('quietHoursEnd', val)}
                                placeholder="07:00"
                                placeholderTextColor={colors.gray[40]}
                                keyboardType="numeric"
                                maxLength={5}
                                accessibilityLabel={t('settings.notifications.endA11y')}
                                testID="settings-notif-quiet-end"
                            />
                        </TimeInputRow>

                        <InfoText>{t('settings.notifications.quietHoursInfo')}</InfoText>
                    </>
                )}
            </ScrollView>
        </Container>
    );
};

export default SettingsNotificationsScreen;
