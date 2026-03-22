import { Button } from '@austa/design-system/src/components/Button/Button';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

import type { CareStackParamList } from '../../navigation/types';

/**
 * Returns a display label for the shared content type.
 */
const getContentTypeLabel = (contentType: string, t: (key: string) => string): string => {
    switch (contentType) {
        case 'lab_results':
            return t('journeys.care.telemedicineDeep.screenShare.contentTypes.labResults');
        case 'imaging':
            return t('journeys.care.telemedicineDeep.screenShare.contentTypes.imaging');
        case 'prescription':
            return t('journeys.care.telemedicineDeep.screenShare.contentTypes.prescription');
        default:
            return t('journeys.care.telemedicineDeep.screenShare.contentTypes.document');
    }
};

/**
 * TelemedicineScreenShare displays the screen sharing view during a
 * telemedicine call. Shows a full-screen shared content area with a banner
 * indicating who is sharing, pinch-to-zoom instructions, a small self-view
 * overlay, and a button to return to the video call.
 */
const TelemedicineScreenShare: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<CareStackParamList>>();
    const route = useRoute<RouteProp<CareStackParamList, 'CareTelemedicineScreenShare'>>();
    const { t } = useTranslation();

    const _sessionId = route.params?.sessionId ?? '';
    const doctorName = '';
    const sharedContentType = 'document';

    const contentLabel = getContentTypeLabel(sharedContentType, t);

    const handleReturnToVideo = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    return (
        <SafeAreaView style={styles.root} testID="telemedicine-screen-share">
            {/* Banner */}
            <View style={styles.banner}>
                <Text
                    fontSize="text-sm"
                    fontWeight="semiBold"
                    color={colors.neutral.white}
                    testID="sharing-banner-text"
                >
                    {t('journeys.care.telemedicineDeep.screenShare.sharingBanner', { name: doctorName })}
                </Text>
                <Text fontSize="text-sm" color={colors.neutral.gray400} testID="content-type-label">
                    {contentLabel}
                </Text>
            </View>

            {/* Shared content area (mock) */}
            <View style={styles.sharedContentArea}>
                <View style={styles.mockImagePlaceholder}>
                    <Text fontSize="heading-lg" color={colors.neutral.gray500} testID="shared-content-icon">
                        {'\u{1F4C4}'}
                    </Text>
                    <Text variant="body" color={colors.neutral.gray600} testID="shared-content-label">
                        {t('journeys.care.telemedicineDeep.screenShare.sharedContent')}
                    </Text>
                    <Text fontSize="text-sm" color={colors.neutral.gray500} testID="content-type-display">
                        {contentLabel}
                    </Text>
                </View>

                {/* Pinch-to-zoom hint */}
                <View style={styles.zoomHint}>
                    <Text fontSize="text-sm" color={colors.neutral.gray500} testID="pinch-to-zoom-hint">
                        {t('journeys.care.telemedicineDeep.screenShare.pinchToZoom')}
                    </Text>
                </View>

                {/* Self-view overlay */}
                <View
                    style={styles.selfView}
                    testID="self-view-overlay"
                    accessibilityLabel={t('journeys.care.telemedicineDeep.screenShare.selfView')}
                    accessibilityRole="image"
                >
                    <Text fontSize="text-sm" color={colors.neutral.gray400}>
                        {t('journeys.care.telemedicineDeep.screenShare.selfView')}
                    </Text>
                </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.fullscreenButton}
                    testID="fullscreen-button"
                    accessibilityLabel={t('journeys.care.telemedicineDeep.screenShare.fullscreen')}
                    accessibilityRole="button"
                >
                    <Text fontSize="text-sm" color={colors.neutral.white}>
                        {t('journeys.care.telemedicineDeep.screenShare.fullscreen')}
                    </Text>
                </TouchableOpacity>

                <Button
                    onPress={handleReturnToVideo}
                    journey="care"
                    accessibilityLabel={t('journeys.care.telemedicineDeep.screenShare.returnToVideo')}
                    testID="return-to-video-button"
                >
                    {t('journeys.care.telemedicineDeep.screenShare.returnToVideo')}
                </Button>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.neutral.gray900,
    },
    banner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacingValues.md,
        paddingVertical: spacingValues.sm,
        backgroundColor: colors.journeys.care.primary,
    },
    sharedContentArea: {
        flex: 1,
        position: 'relative',
    },
    mockImagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.neutral.gray100,
        margin: spacingValues.xs,
        borderRadius: spacingValues.xs,
        gap: spacingValues.xs,
    },
    zoomHint: {
        position: 'absolute',
        bottom: spacingValues['5xl'],
        alignSelf: 'center',
        paddingHorizontal: spacingValues.sm,
        paddingVertical: spacingValues['3xs'],
        backgroundColor: colors.neutral.gray800,
        borderRadius: spacingValues.md,
        opacity: 0.8,
    },
    selfView: {
        position: 'absolute',
        bottom: spacingValues.md,
        right: spacingValues.md,
        width: 80,
        height: 110,
        borderRadius: spacingValues.xs,
        backgroundColor: colors.neutral.gray700,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.neutral.gray600,
    },
    actions: {
        paddingHorizontal: spacingValues.md,
        paddingVertical: spacingValues.sm,
        gap: spacingValues.sm,
        backgroundColor: colors.neutral.gray800,
    },
    fullscreenButton: {
        alignSelf: 'center',
        paddingHorizontal: spacingValues.md,
        paddingVertical: spacingValues.xs,
        borderRadius: spacingValues.lg,
        backgroundColor: colors.neutral.gray700,
    },
});

export { TelemedicineScreenShare };
export default TelemedicineScreenShare;
