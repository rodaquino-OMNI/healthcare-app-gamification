/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import type { Theme } from '@design-system/themes/base.theme';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTheme } from 'styled-components/native';

import { ROUTES } from '@constants/routes';

const MAX_PHOTOS = 5;

interface PhotoItem {
    id: string;
    uri: string;
    timestamp: number;
}

type SymptomPhotoUploadRouteParams = {
    symptoms: Array<{ id: string; name: string }>;
    description: string;
    regions: Array<{ id: string; label: string }>;
};

/**
 * Camera/gallery photo upload screen for visible symptoms.
 * Users can take photos or choose from gallery (mocked).
 * Photos are optional -- users can skip this step.
 */
const SymptomPhotoUpload: React.FC = () => {
    const { t } = useTranslation();
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<{ params: SymptomPhotoUploadRouteParams }, 'params'>>();
    const { symptoms = [], description = '', regions = [] } = route.params || {};

    const [photos, setPhotos] = useState<PhotoItem[]>([]);

    const handleTakePhoto = (): void => {
        if (photos.length >= MAX_PHOTOS) {
            Alert.alert(
                t('journeys.care.symptomChecker.photoUpload.maxPhotosTitle'),
                t('journeys.care.symptomChecker.photoUpload.maxPhotosMessage', { max: MAX_PHOTOS })
            );
            return;
        }

        Alert.alert(
            t('journeys.care.symptomChecker.photoUpload.cameraPermissionTitle'),
            t('journeys.care.symptomChecker.photoUpload.cameraPermissionMessage'),
            [
                {
                    text: t('journeys.care.symptomChecker.photoUpload.cancel'),
                    style: 'cancel',
                },
                {
                    text: t('journeys.care.symptomChecker.photoUpload.allowCamera'),
                    onPress: () => {
                        const newPhoto: PhotoItem = {
                            id: `photo-${Date.now()}`,
                            uri: `https://placeholder.example.com/symptom-photo-${photos.length + 1}.jpg`,
                            timestamp: Date.now(),
                        };
                        setPhotos((prev) => [...prev, newPhoto]);
                    },
                },
            ]
        );
    };

    const handleChooseFromGallery = (): void => {
        if (photos.length >= MAX_PHOTOS) {
            Alert.alert(
                t('journeys.care.symptomChecker.photoUpload.maxPhotosTitle'),
                t('journeys.care.symptomChecker.photoUpload.maxPhotosMessage', { max: MAX_PHOTOS })
            );
            return;
        }

        const newPhoto: PhotoItem = {
            id: `gallery-${Date.now()}`,
            uri: `https://placeholder.example.com/gallery-photo-${photos.length + 1}.jpg`,
            timestamp: Date.now(),
        };
        setPhotos((prev) => [...prev, newPhoto]);
    };

    const handleRemovePhoto = (photoId: string): void => {
        setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    };

    const handleContinue = (): void => {
        navigation.navigate(ROUTES.CARE_SYMPTOM_MEDICAL_HISTORY, {
            symptoms,
            description,
            regions,
            photos: photos.map((p) => ({ id: p.id, uri: p.uri })),
        });
    };

    const handleSkip = (): void => {
        navigation.navigate(ROUTES.CARE_SYMPTOM_MEDICAL_HISTORY, {
            symptoms,
            description,
            regions,
            photos: [],
        });
    };

    const handleBack = (): void => {
        navigation.goBack();
    };

    return (
        <View style={styles.root}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <Text variant="heading" journey="care" testID="photo-upload-title">
                    {t('journeys.care.symptomChecker.photoUpload.title')}
                </Text>

                <Text variant="body" journey="care" testID="photo-upload-subtitle">
                    {t('journeys.care.symptomChecker.photoUpload.subtitle')}
                </Text>

                <Card journey="care" elevation="sm">
                    <Text variant="body" fontWeight="semiBold" journey="care">
                        {t('journeys.care.symptomChecker.photoUpload.instructions')}
                    </Text>

                    <View style={styles.actionButtons}>
                        <Button
                            variant="secondary"
                            onPress={handleTakePhoto}
                            journey="care"
                            accessibilityLabel={t('journeys.care.symptomChecker.photoUpload.takePhoto')}
                            testID="take-photo-button"
                        >
                            {t('journeys.care.symptomChecker.photoUpload.takePhoto')}
                        </Button>
                        <Button
                            variant="secondary"
                            onPress={handleChooseFromGallery}
                            journey="care"
                            accessibilityLabel={t('journeys.care.symptomChecker.photoUpload.chooseFromGallery')}
                            testID="choose-gallery-button"
                        >
                            {t('journeys.care.symptomChecker.photoUpload.chooseFromGallery')}
                        </Button>
                    </View>

                    <Text variant="caption" color={colors.neutral.gray600} testID="photo-count-label">
                        {t('journeys.care.symptomChecker.photoUpload.photoCount', {
                            current: photos.length,
                            max: MAX_PHOTOS,
                        })}
                    </Text>
                </Card>

                {photos.length > 0 && (
                    <View style={styles.photoGrid}>
                        {photos.map((photo) => (
                            <View key={photo.id} style={styles.photoItem}>
                                <View style={styles.photoPlaceholder}>
                                    <Text fontSize="text-xs" color={colors.neutral.gray600} textAlign="center">
                                        {t('journeys.care.symptomChecker.photoUpload.photoPlaceholder')}
                                    </Text>
                                </View>
                                <Touchable
                                    onPress={() => handleRemovePhoto(photo.id)}
                                    style={styles.removeButton}
                                    accessibilityLabel={t('journeys.care.symptomChecker.photoUpload.removePhoto')}
                                    accessibilityRole="button"
                                    testID={`remove-photo-${photo.id}`}
                                >
                                    <Text
                                        fontSize="text-xs"
                                        fontWeight="bold"
                                        color={colors.semantic.error}
                                        textAlign="center"
                                    >
                                        {t('journeys.care.symptomChecker.photoUpload.remove')}
                                    </Text>
                                </Touchable>
                            </View>
                        ))}
                    </View>
                )}

                <View style={styles.buttonRow}>
                    <Button
                        variant="secondary"
                        onPress={handleBack}
                        journey="care"
                        accessibilityLabel={t('journeys.care.symptomChecker.photoUpload.back')}
                        testID="back-button"
                    >
                        {t('journeys.care.symptomChecker.photoUpload.back')}
                    </Button>
                    {photos.length === 0 ? (
                        <Button
                            variant="secondary"
                            onPress={handleSkip}
                            journey="care"
                            accessibilityLabel={t('journeys.care.symptomChecker.photoUpload.skip')}
                            testID="skip-button"
                        >
                            {t('journeys.care.symptomChecker.photoUpload.skip')}
                        </Button>
                    ) : (
                        <Button
                            onPress={handleContinue}
                            journey="care"
                            accessibilityLabel={t('journeys.care.symptomChecker.photoUpload.continue')}
                            testID="continue-button"
                        >
                            {t('journeys.care.symptomChecker.photoUpload.continue')}
                        </Button>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: colors.journeys.care.background,
        },
        scrollView: {
            flex: 1,
        },
        scrollContent: {
            padding: spacingValues.md,
            paddingBottom: spacingValues['3xl'],
        },
        actionButtons: {
            flexDirection: 'row',
            gap: spacingValues.sm,
            marginTop: spacingValues.md,
            marginBottom: spacingValues.sm,
        },
        photoGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: spacingValues.sm,
            marginTop: spacingValues.md,
        },
        photoItem: {
            width: '30%',
            aspectRatio: 1,
            borderRadius: spacingValues.xs,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: theme.colors.border.default,
        },
        photoPlaceholder: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.neutral.gray200,
        },
        removeButton: {
            backgroundColor: theme.colors.background.default,
            paddingVertical: spacingValues['3xs'],
            alignItems: 'center',
            borderTopWidth: 1,
            borderTopColor: theme.colors.border.default,
        },
        buttonRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: spacingValues.xl,
            gap: spacingValues.md,
        },
    });

export { SymptomPhotoUpload };
export default SymptomPhotoUpload;
