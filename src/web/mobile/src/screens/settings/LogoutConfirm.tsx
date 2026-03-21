import { borderRadius } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { sizing } from '@design-system/tokens/sizing';
import { spacing, spacingValues } from '@design-system/tokens/spacing';
import { typography } from '@design-system/tokens/typography';
import { useNavigation, CommonActions } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Alert } from 'react-native';
import styled from 'styled-components/native';

import { useAuth } from '../../hooks/useAuth';

// --- Styled Components ---

const Container = styled.SafeAreaView`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background.default};
`;

const ContentWrapper = styled.View`
    padding-horizontal: ${spacing.xl};
    padding-top: ${spacing['2xl']};
    padding-bottom: ${spacing['4xl']};
`;

const Title = styled.Text`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-xl']};
    font-weight: ${typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text.default};
    margin-bottom: ${spacing['2xl']};
`;

const UserCard = styled.View`
    background-color: ${({ theme }) => theme.colors.background.muted};
    border-radius: ${borderRadius.lg};
    padding: ${spacing.xl};
    margin-bottom: ${spacing['2xl']};
    align-items: center;
`;

const AvatarPlaceholder = styled.View`
    width: 72px;
    height: 72px;
    border-radius: 36px;
    background-color: ${({ theme }) => theme.colors.background.subtle};
    align-items: center;
    justify-content: center;
    margin-bottom: ${spacing.md};
`;

const AvatarInitials = styled.Text`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-lg']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.brand.primary};
`;

const UserName = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-lg']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.text.default};
    margin-bottom: ${spacing['3xs']};
`;

const UserEmail = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.regular};
    color: ${({ theme }) => theme.colors.text.muted};
`;

const InfoSection = styled.View`
    background-color: ${({ theme }) => theme.colors.background.default};
    border-width: 1px;
    border-color: ${({ theme }) => theme.colors.border.default};
    border-radius: ${borderRadius.lg};
    padding: ${spacing.lg};
    margin-bottom: ${spacing['2xl']};
`;

const InfoRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: ${spacing.sm};
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

const WarningCard = styled.View`
    background-color: ${colors.semantic.warningBg};
    border-radius: ${borderRadius.lg};
    padding: ${spacing.lg};
    margin-bottom: ${spacing['2xl']};
`;

const WarningTitle = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.text.default};
    margin-bottom: ${spacing.xs};
`;

const _WarningText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.regular};
    color: ${({ theme }) => theme.colors.text.default};
    line-height: 20px;
`;

const BulletItem = styled.View`
    flex-direction: row;
    margin-bottom: ${spacing['3xs']};
`;

const Bullet = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${({ theme }) => theme.colors.text.default};
    margin-right: ${spacing.xs};
`;

const BulletText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.regular};
    color: ${({ theme }) => theme.colors.text.default};
    flex: 1;
`;

const DangerButton = styled.TouchableOpacity`
    background-color: ${colors.semantic.error};
    border-radius: ${borderRadius.md};
    height: ${sizing.component.lg};
    align-items: center;
    justify-content: center;
`;

const DangerButtonText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.text.onBrand};
`;

const SecondaryButton = styled.TouchableOpacity`
    border-width: 1px;
    border-color: ${({ theme }) => theme.colors.border.default};
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
    color: ${({ theme }) => theme.colors.text.default};
`;

/**
 * LogoutConfirm screen -- sign-out confirmation with user info,
 * session details, warning about consequences, and Sign Out / Cancel.
 */
export const LogoutConfirmScreen: React.FC = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { signOut, session, getUserFromToken } = useAuth();
    const user = session?.accessToken ? getUserFromToken(session.accessToken) : null;

    const userName = user?.name || 'Usuario';
    const userEmail = user?.email || 'usuario@austa.com.br';

    const getInitials = (name: string): string => {
        const parts = name.trim().split(/\s+/);
        if (parts.length === 0) {
            return '?';
        }
        if (parts.length === 1) {
            return parts[0].charAt(0).toUpperCase();
        }
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    const handleSignOut = async (): Promise<void> => {
        try {
            await signOut();
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'AuthWelcome' }],
                })
            );
        } catch {
            Alert.alert(t('settings.logout.error'), t('settings.logout.errorMessage'));
        }
    };

    const handleCancel = (): void => {
        navigation.goBack();
    };

    return (
        <Container>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
            >
                <ContentWrapper>
                    <Title testID="logout-title">{t('settings.logout.title')}</Title>

                    {/* User Info Card */}
                    <UserCard testID="logout-user-card">
                        <AvatarPlaceholder>
                            <AvatarInitials>{getInitials(userName)}</AvatarInitials>
                        </AvatarPlaceholder>
                        <UserName>{userName}</UserName>
                        <UserEmail>{userEmail}</UserEmail>
                    </UserCard>

                    {/* Session Info */}
                    <InfoSection testID="logout-session-info">
                        <InfoRow>
                            <InfoLabel>{t('settings.logout.sessionInfo')}</InfoLabel>
                            <InfoValue>15/01/2024</InfoValue>
                        </InfoRow>
                        <InfoRow>
                            <InfoLabel>{t('settings.logout.device')}</InfoLabel>
                            <InfoValue>iPhone 15</InfoValue>
                        </InfoRow>
                    </InfoSection>

                    {/* Warning */}
                    <WarningCard testID="logout-warning">
                        <WarningTitle>{t('settings.logout.warning')}</WarningTitle>
                        <BulletItem>
                            <Bullet>{'\u2022'}</Bullet>
                            <BulletText>{t('settings.logout.warningSessionEnds')}</BulletText>
                        </BulletItem>
                        <BulletItem>
                            <Bullet>{'\u2022'}</Bullet>
                            <BulletText>{t('settings.logout.warningCacheCleared')}</BulletText>
                        </BulletItem>
                        <BulletItem>
                            <Bullet>{'\u2022'}</Bullet>
                            <BulletText>{t('settings.logout.warningRelogin')}</BulletText>
                        </BulletItem>
                    </WarningCard>

                    {/* Actions */}
                    <DangerButton
                        onPress={handleSignOut}
                        accessibilityRole="button"
                        accessibilityLabel={t('settings.logout.signOut')}
                        testID="logout-sign-out-button"
                    >
                        <DangerButtonText>{t('settings.logout.signOut')}</DangerButtonText>
                    </DangerButton>

                    <SecondaryButton
                        onPress={handleCancel}
                        accessibilityRole="button"
                        accessibilityLabel={t('settings.logout.cancel')}
                        testID="logout-cancel-button"
                    >
                        <SecondaryButtonText>{t('settings.logout.cancel')}</SecondaryButtonText>
                    </SecondaryButton>
                </ContentWrapper>
            </ScrollView>
        </Container>
    );
};

export default LogoutConfirmScreen;
