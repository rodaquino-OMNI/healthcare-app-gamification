import { borderRadius } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { sizing } from '@design-system/tokens/sizing';
import { spacing } from '@design-system/tokens/spacing';
import { typography } from '@design-system/tokens/typography';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Alert } from 'react-native';
import styled from 'styled-components/native';

import { updateProfile } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import type { AuthNavigationProp } from '../../navigation/types';

// --- Styled Components ---

const Container = styled.SafeAreaView`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background.default};
`;

const ContentWrapper = styled.View`
    padding-horizontal: ${spacing.xl};
    padding-top: ${spacing['2xl']};
    padding-bottom: ${spacing['4xl']};
    align-items: center;
`;

const HeaderSection = styled.View`
    width: 100%;
    margin-bottom: ${spacing['3xl']};
`;

const Title = styled.Text`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-xl']};
    font-weight: ${typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text.default};
    margin-bottom: ${spacing.xs};
`;

const Subtitle = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: ${({ theme }) => theme.colors.text.muted};
    margin-bottom: ${spacing.xs};
`;

const StepIndicator = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${({ theme }) => theme.colors.text.muted};
`;

const StepBarContainer = styled.View`
    flex-direction: row;
    margin-top: ${spacing.sm};
    gap: ${spacing['3xs']};
`;

const StepDot = styled.View<{ active: boolean }>`
    flex: 1;
    height: 4px;
    border-radius: ${borderRadius.full};
    background-color: ${(props) => (props.active ? colors.brand.primary : colors.gray[20])};
`;

const AvatarContainer = styled.View`
    width: 150px;
    height: 150px;
    border-radius: 75px;
    background-color: ${({ theme }) => theme.colors.background.subtle};
    align-items: center;
    justify-content: center;
    margin-bottom: ${spacing['2xl']};
    overflow: hidden;
    border-width: 3px;
    border-color: ${({ theme }) => theme.colors.border.default};
`;

const AvatarPlaceholder = styled.Text`
    font-size: 56px;
`;

const AvatarImage = styled.Image`
    width: 150px;
    height: 150px;
`;

const ButtonsContainer = styled.View`
    width: 100%;
    gap: ${spacing.sm};
    margin-bottom: ${spacing.xl};
`;

const ActionButton = styled.TouchableOpacity<{ variant?: 'primary' | 'secondary' }>`
    background-color: ${(props) => (props.variant === 'secondary' ? colors.neutral.white : colors.brand.primary)};
    border-radius: ${borderRadius.md};
    height: ${sizing.component.lg};
    align-items: center;
    justify-content: center;
    flex-direction: row;
    border-width: ${(props) => (props.variant === 'secondary' ? '1px' : '0px')};
    border-color: ${colors.brand.primary};
`;

const ActionButtonText = styled.Text<{ variant?: 'primary' | 'secondary' }>`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${(props) => (props.variant === 'secondary' ? colors.brand.primary : colors.neutral.white)};
    margin-left: ${spacing.xs};
`;

const ActionButtonIcon = styled.Text<{ variant?: 'primary' | 'secondary' }>`
    font-size: 20px;
`;

const PrimaryButton = styled.TouchableOpacity`
    background-color: ${colors.brand.primary};
    border-radius: ${borderRadius.md};
    height: ${sizing.component.lg};
    width: 100%;
    align-items: center;
    justify-content: center;
`;

const PrimaryButtonText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.text.onBrand};
`;

const SkipLink = styled.TouchableOpacity`
    align-items: center;
    margin-top: ${spacing.md};
    padding-vertical: ${spacing.sm};
`;

const SkipLinkText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${({ theme }) => theme.colors.text.muted};
    text-decoration-line: underline;
`;

/**
 * ProfilePhoto screen -- Step 6/7 of the profile onboarding flow.
 * Allows the user to take or choose a profile photo.
 */
const ProfilePhoto: React.FC = () => {
    const navigation = useNavigation<AuthNavigationProp>();
    const { t } = useTranslation();
    const { session } = useAuth();
    const [_saving, setSaving] = useState(false);
    const [photoUri, setPhotoUri] = useState<string | null>(null);

    /**
     * Launch camera to take a profile photo.
     * Uses expo-image-picker to capture from the device camera.
     */
    const handleTakePhoto = async (): Promise<void> => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== ImagePicker.PermissionStatus.GRANTED) {
                Alert.alert(t('common.permissions.camera'));
                return;
            }
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
                allowsEditing: true,
                aspect: [1, 1],
            });
            if (!result.canceled && result.assets[0]) {
                setPhotoUri(result.assets[0].uri);
            }
        } catch {
            Alert.alert(t('common.errors.default'), t('profile.photo.cameraError'));
        }
    };

    /**
     * Launch gallery to pick a profile photo.
     * Uses expo-image-picker to select from the device media library.
     */
    const handleChooseFromGallery = async (): Promise<void> => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== ImagePicker.PermissionStatus.GRANTED) {
                Alert.alert(t('common.permissions.gallery'));
                return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
                allowsEditing: true,
                aspect: [1, 1],
            });
            if (!result.canceled && result.assets[0]) {
                setPhotoUri(result.assets[0].uri);
            }
        } catch {
            Alert.alert(t('common.errors.default'), t('profile.photo.galleryError'));
        }
    };

    const handleContinue = async (): Promise<void> => {
        if (!session?.accessToken) {
            navigation.navigate('ProfileConfirmation');
            return;
        }
        setSaving(true);
        try {
            await updateProfile(session.accessToken, {
                avatarUrl: photoUri || undefined,
            });
            navigation.navigate('ProfileConfirmation');
        } catch (err: unknown) {
            Alert.alert(t('common.errors.default'), err instanceof Error ? err.message : t('common.errors.generic'));
        } finally {
            setSaving(false);
        }
    };

    const handleSkip = (): void => {
        navigation.navigate('ProfileConfirmation');
    };

    return (
        <Container>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                <ContentWrapper>
                    {/* Header */}
                    <HeaderSection>
                        <Title>{t('profile.photo.title')}</Title>
                        <Subtitle>{t('profile.photo.subtitle')}</Subtitle>
                        <StepIndicator>{t('profileSetup.stepIndicator', { current: 6, total: 7 })}</StepIndicator>
                        <StepBarContainer>
                            {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                                <StepDot key={step} active={step <= 6} />
                            ))}
                        </StepBarContainer>
                    </HeaderSection>

                    {/* Avatar Preview */}
                    <AvatarContainer>
                        {photoUri ? (
                            <AvatarImage
                                source={{ uri: photoUri }}
                                resizeMode="cover"
                                accessibilityLabel="Profile photo preview"
                            />
                        ) : (
                            <AvatarPlaceholder accessibilityLabel="Default profile placeholder">
                                &#128100;
                            </AvatarPlaceholder>
                        )}
                    </AvatarContainer>

                    {/* Camera & Gallery Buttons */}
                    <ButtonsContainer>
                        <ActionButton
                            onPress={handleTakePhoto}
                            accessibilityRole="button"
                            accessibilityLabel={t('profile.photo.takePhoto')}
                            testID="profile-photo-camera"
                        >
                            <ActionButtonIcon>&#128247;</ActionButtonIcon>
                            <ActionButtonText>{t('profile.photo.takePhoto')}</ActionButtonText>
                        </ActionButton>

                        <ActionButton
                            variant="secondary"
                            onPress={handleChooseFromGallery}
                            accessibilityRole="button"
                            accessibilityLabel={t('profile.photo.chooseFromGallery')}
                            testID="profile-photo-gallery"
                        >
                            <ActionButtonIcon variant="secondary">&#128444;</ActionButtonIcon>
                            <ActionButtonText variant="secondary">
                                {t('profile.photo.chooseFromGallery')}
                            </ActionButtonText>
                        </ActionButton>
                    </ButtonsContainer>

                    {/* Continue Button */}
                    <PrimaryButton
                        onPress={handleContinue}
                        accessibilityRole="button"
                        accessibilityLabel={t('common.buttons.next')}
                        testID="profile-photo-continue"
                    >
                        <PrimaryButtonText>{t('common.buttons.next')}</PrimaryButtonText>
                    </PrimaryButton>

                    {/* Skip Link */}
                    <SkipLink
                        onPress={handleSkip}
                        accessibilityRole="link"
                        accessibilityLabel={t('onboarding.skip')}
                        testID="profile-photo-skip"
                    >
                        <SkipLinkText>{t('onboarding.skip')}</SkipLinkText>
                    </SkipLink>
                </ContentWrapper>
            </ScrollView>
        </Container>
    );
};

export default ProfilePhoto;
