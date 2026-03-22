import { borderRadius } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { sizing } from '@design-system/tokens/sizing';
import { spacing } from '@design-system/tokens/spacing';
import { typography } from '@design-system/tokens/typography';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Switch, Alert } from 'react-native';
import styled from 'styled-components/native';

import { updateProfile } from '../../api/auth';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../context/AuthContext';
import type { AuthNavigationProp } from '../../navigation/types';

// --- Types ---

interface NotificationPref {
    id: string;
    icon: string;
    titleKey: string;
    descriptionKey: string;
    defaultValue: boolean;
}

// --- Constants ---

const NOTIFICATION_PREFS: NotificationPref[] = [
    {
        id: 'appointments',
        icon: '\uD83D\uDCC5',
        titleKey: 'profile.notificationPrefs.items.appointments.title',
        descriptionKey: 'profile.notificationPrefs.items.appointments.description',
        defaultValue: true,
    },
    {
        id: 'medications',
        icon: '\uD83D\uDC8A',
        titleKey: 'profile.notificationPrefs.items.medications.title',
        descriptionKey: 'profile.notificationPrefs.items.medications.description',
        defaultValue: true,
    },
    {
        id: 'healthTips',
        icon: '\uD83D\uDCA1',
        titleKey: 'profile.notificationPrefs.items.healthTips.title',
        descriptionKey: 'profile.notificationPrefs.items.healthTips.description',
        defaultValue: true,
    },
    {
        id: 'promotions',
        icon: '\uD83C\uDF81',
        titleKey: 'profile.notificationPrefs.items.promotions.title',
        descriptionKey: 'profile.notificationPrefs.items.promotions.description',
        defaultValue: false,
    },
];

// --- Styled Components ---

const Container = styled.SafeAreaView`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background.default};
`;

const HeaderRow = styled.View`
    flex-direction: row;
    align-items: center;
    padding-horizontal: ${spacing.xl};
    padding-top: ${spacing['2xl']};
    padding-bottom: ${spacing.md};
`;

const BackButton = styled.TouchableOpacity`
    padding: ${spacing.xs};
    margin-right: ${spacing.sm};
`;

const BackIcon = styled.Text`
    font-size: 24px;
    color: ${({ theme }) => theme.colors.text.default};
`;

const HeaderTitle = styled.Text`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-lg']};
    font-weight: ${typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text.default};
    flex: 1;
`;

const ContentWrapper = styled.View`
    padding-horizontal: ${spacing.xl};
    padding-bottom: ${spacing['4xl']};
`;

const Description = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: ${({ theme }) => theme.colors.text.muted};
    margin-bottom: ${spacing['2xl']};
    line-height: 22px;
`;

const PrefsContainer = styled.View`
    margin-bottom: ${spacing['2xl']};
`;

const PrefRow = styled.View`
    flex-direction: row;
    align-items: center;
    padding-vertical: ${spacing.lg};
    border-bottom-width: 1px;
    border-bottom-color: ${colors.gray[10]};
`;

const PrefIconContainer = styled.View`
    width: 40px;
    height: 40px;
    border-radius: ${borderRadius.md};
    background-color: ${({ theme }) => theme.colors.background.muted};
    align-items: center;
    justify-content: center;
    margin-right: ${spacing.md};
`;

const PrefIcon = styled.Text`
    font-size: 20px;
`;

const PrefTextContainer = styled.View`
    flex: 1;
    margin-right: ${spacing.md};
`;

const PrefTitle = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.text.default};
    margin-bottom: ${spacing['3xs']};
`;

const PrefDescription = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${({ theme }) => theme.colors.text.muted};
`;

const BottomSection = styled.View`
    padding-horizontal: ${spacing.xl};
    padding-bottom: ${spacing['3xl']};
    padding-top: ${spacing.md};
`;

const SaveButton = styled.TouchableOpacity`
    background-color: ${colors.brand.primary};
    border-radius: ${borderRadius.md};
    height: ${sizing.component.lg};
    width: 100%;
    align-items: center;
    justify-content: center;
`;

const SaveButtonText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.text.onBrand};
`;

const InfoText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    color: ${({ theme }) => theme.colors.text.subtle};
    text-align: center;
    margin-top: ${spacing.md};
`;

// --- Component ---

/**
 * ProfileNotificationPrefs screen allows users to configure their
 * notification preferences during profile setup. Each preference
 * has a toggle, icon, title, and description.
 */
export const ProfileNotificationPrefs: React.FC = () => {
    const navigation = useNavigation<AuthNavigationProp>();
    const { t } = useTranslation();
    const { session } = useAuth();
    const [_saving, setSaving] = useState(false);

    const [prefs, setPrefs] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        NOTIFICATION_PREFS.forEach((pref) => {
            initial[pref.id] = pref.defaultValue;
        });
        return initial;
    });

    const togglePref = useCallback((prefId: string) => {
        setPrefs((prev) => ({
            ...prev,
            [prefId]: !prev[prefId],
        }));
    }, []);

    const handleBack = (): void => {
        navigation.goBack();
    };

    const handleSave = useCallback(async () => {
        if (!session?.accessToken) {
            return;
        }
        setSaving(true);
        try {
            await updateProfile(session.accessToken, {
                notificationsEnabled: prefs.appointments || prefs.medications || prefs.healthTips,
            });
            navigation.navigate(ROUTES.PROFILE_CONFIRMATION);
        } catch (err: unknown) {
            Alert.alert(t('common.errors.default'), err instanceof Error ? err.message : t('common.errors.generic'));
        } finally {
            setSaving(false);
        }
    }, [session, prefs, navigation, t]);

    return (
        <Container>
            {/* Header */}
            <HeaderRow>
                <BackButton
                    onPress={handleBack}
                    accessibilityRole="button"
                    accessibilityLabel={t('common.buttons.back')}
                    testID="notification-prefs-back"
                >
                    <BackIcon>{'\u2190'}</BackIcon>
                </BackButton>
                <HeaderTitle>{t('profile.notificationPrefs.title')}</HeaderTitle>
            </HeaderRow>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                testID="notification-prefs-scroll"
            >
                <ContentWrapper>
                    {/* Description */}
                    <Description>{t('profile.notificationPrefs.description')}</Description>

                    {/* Notification Toggles */}
                    <PrefsContainer>
                        {NOTIFICATION_PREFS.map((pref) => (
                            <PrefRow key={pref.id}>
                                <PrefIconContainer>
                                    <PrefIcon>{pref.icon}</PrefIcon>
                                </PrefIconContainer>
                                <PrefTextContainer>
                                    <PrefTitle>{t(pref.titleKey)}</PrefTitle>
                                    <PrefDescription>{t(pref.descriptionKey)}</PrefDescription>
                                </PrefTextContainer>
                                <Switch
                                    value={prefs[pref.id]}
                                    onValueChange={() => togglePref(pref.id)}
                                    trackColor={{
                                        false: colors.gray[30],
                                        true: colors.brand.primary,
                                    }}
                                    testID={`notification-pref-${pref.id}-toggle`}
                                    accessibilityLabel={t(pref.titleKey)}
                                    accessibilityRole="switch"
                                />
                            </PrefRow>
                        ))}
                    </PrefsContainer>
                </ContentWrapper>
            </ScrollView>

            {/* Save Button */}
            <BottomSection>
                <SaveButton
                    onPress={handleSave}
                    accessibilityRole="button"
                    accessibilityLabel={t('common.buttons.save')}
                    testID="notification-prefs-save"
                >
                    <SaveButtonText>{t('common.buttons.save')}</SaveButtonText>
                </SaveButton>
                <InfoText>{t('profile.notificationPrefs.infoText')}</InfoText>
            </BottomSection>
        </Container>
    );
};

export default ProfileNotificationPrefs;
