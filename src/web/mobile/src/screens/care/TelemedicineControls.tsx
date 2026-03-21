import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

import { ROUTES } from '@constants/routes';

/**
 * Route params expected by TelemedicineControls.
 */
type TelemedicineControlsRouteParams = {
    appointmentId: string;
    doctorName: string;
};

/**
 * Formats seconds to HH:MM:SS or MM:SS.
 */
const formatDuration = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hours > 0) {
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

/**
 * Connection quality levels.
 */
type ConnectionQuality = 'excellent' | 'good' | 'poor';

const getQualityColor = (quality: ConnectionQuality): string => {
    switch (quality) {
        case 'excellent':
            return colors.semantic.success;
        case 'good':
            return colors.semantic.warning;
        case 'poor':
            return colors.semantic.error;
    }
};

const getQualityBars = (quality: ConnectionQuality): number => {
    switch (quality) {
        case 'excellent':
            return 4;
        case 'good':
            return 3;
        case 'poor':
            return 1;
    }
};

/**
 * TelemedicineControls renders the in-call UI with a mock video area,
 * self-view rectangle, call duration timer, and control bar for
 * mute, camera, speaker, chat, and end call actions.
 */
const TelemedicineControls: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<{ params: TelemedicineControlsRouteParams }, 'params'>>();
    const { t } = useTranslation();

    const { appointmentId, doctorName = '' } = route.params || {};

    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [isSpeakerOn, setIsSpeakerOn] = useState(true);
    const [quality] = useState<ConnectionQuality>('excellent');
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Call duration timer
    useEffect(() => {
        timerRef.current = setInterval(() => {
            setDuration((prev) => prev + 1);
        }, 1000);
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const handleToggleMute = useCallback(() => {
        setIsMuted((prev) => !prev);
    }, []);

    const handleToggleCamera = useCallback(() => {
        setIsCameraOff((prev) => !prev);
    }, []);

    const handleToggleSpeaker = useCallback(() => {
        setIsSpeakerOn((prev) => !prev);
    }, []);

    const handleOpenChat = useCallback(() => {
        navigation.navigate(ROUTES.CARE_TELEMEDICINE_CHAT, {
            appointmentId,
            doctorName,
        });
    }, [navigation, appointmentId, doctorName]);

    const handleEndCall = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        navigation.navigate(ROUTES.CARE_TELEMEDICINE_END, {
            appointmentId,
            doctorName,
            callDuration: formatDuration(duration),
        });
    }, [navigation, appointmentId, doctorName, duration]);

    const qualityColor = getQualityColor(quality);
    const qualityBarCount = getQualityBars(quality);

    return (
        <SafeAreaView style={styles.root} testID="telemedicine-controls-screen">
            {/* Top bar */}
            <View style={styles.topBar}>
                <View style={styles.topBarLeft}>
                    <Text
                        fontSize="text-sm"
                        fontWeight="semiBold"
                        color={colors.neutral.white}
                        testID="doctor-name-label"
                    >
                        {doctorName}
                    </Text>
                    <Text fontSize="text-sm" color={colors.neutral.gray400} testID="call-duration">
                        {formatDuration(duration)}
                    </Text>
                </View>
                <View style={styles.qualityIndicator}>
                    {[1, 2, 3, 4].map((bar) => (
                        <View
                            key={bar}
                            style={[
                                styles.qualityBar,
                                { height: 4 + bar * 4 },
                                bar <= qualityBarCount
                                    ? { backgroundColor: qualityColor }
                                    : { backgroundColor: colors.neutral.gray600 },
                            ]}
                            testID={`quality-bar-${bar}`}
                        />
                    ))}
                    <Text fontSize="text-sm" color={colors.neutral.gray400} testID="quality-label">
                        {t(`journeys.care.telemedicineDeep.controls.quality.${quality}`)}
                    </Text>
                </View>
            </View>

            {/* Mock video area */}
            <View style={styles.videoArea}>
                <Text fontSize="heading-md" color={colors.neutral.gray400} testID="remote-video-placeholder">
                    {isCameraOff
                        ? t('journeys.care.telemedicineDeep.controls.cameraOff')
                        : t('journeys.care.telemedicineDeep.controls.videoPlaceholder', { name: doctorName })}
                </Text>

                {/* Self-view */}
                <View style={styles.selfView}>
                    <Text fontSize="text-sm" color={colors.neutral.gray400} testID="self-view-label">
                        {isCameraOff
                            ? t('journeys.care.telemedicineDeep.controls.cameraOffSelf')
                            : t('journeys.care.telemedicineDeep.controls.selfView')}
                    </Text>
                </View>
            </View>

            {/* Bottom control bar */}
            <View style={styles.controlBar}>
                {/* Mute */}
                <TouchableOpacity
                    style={[styles.controlButton, isMuted && styles.controlButtonActive]}
                    onPress={handleToggleMute}
                    testID="mute-button"
                    accessibilityLabel={
                        isMuted
                            ? t('journeys.care.telemedicineDeep.controls.unmute')
                            : t('journeys.care.telemedicineDeep.controls.mute')
                    }
                    accessibilityRole="button"
                >
                    <Text fontSize="heading-sm" color={colors.neutral.white}>
                        {isMuted ? '\u{1F507}' : '\u{1F3A4}'}
                    </Text>
                    <Text fontSize="text-sm" color={colors.neutral.white}>
                        {isMuted
                            ? t('journeys.care.telemedicineDeep.controls.unmute')
                            : t('journeys.care.telemedicineDeep.controls.mute')}
                    </Text>
                </TouchableOpacity>

                {/* Camera */}
                <TouchableOpacity
                    style={[styles.controlButton, isCameraOff && styles.controlButtonActive]}
                    onPress={handleToggleCamera}
                    testID="camera-button"
                    accessibilityLabel={
                        isCameraOff
                            ? t('journeys.care.telemedicineDeep.controls.cameraOn')
                            : t('journeys.care.telemedicineDeep.controls.cameraToggle')
                    }
                    accessibilityRole="button"
                >
                    <Text fontSize="heading-sm" color={colors.neutral.white}>
                        {isCameraOff ? '\u{1F6AB}' : '\u{1F4F7}'}
                    </Text>
                    <Text fontSize="text-sm" color={colors.neutral.white}>
                        {isCameraOff
                            ? t('journeys.care.telemedicineDeep.controls.cameraOn')
                            : t('journeys.care.telemedicineDeep.controls.cameraToggle')}
                    </Text>
                </TouchableOpacity>

                {/* Speaker */}
                <TouchableOpacity
                    style={[styles.controlButton, !isSpeakerOn && styles.controlButtonActive]}
                    onPress={handleToggleSpeaker}
                    testID="speaker-button"
                    accessibilityLabel={
                        isSpeakerOn
                            ? t('journeys.care.telemedicineDeep.controls.earpiece')
                            : t('journeys.care.telemedicineDeep.controls.speaker')
                    }
                    accessibilityRole="button"
                >
                    <Text fontSize="heading-sm" color={colors.neutral.white}>
                        {isSpeakerOn ? '\u{1F50A}' : '\u{1F4DE}'}
                    </Text>
                    <Text fontSize="text-sm" color={colors.neutral.white}>
                        {isSpeakerOn
                            ? t('journeys.care.telemedicineDeep.controls.speaker')
                            : t('journeys.care.telemedicineDeep.controls.earpiece')}
                    </Text>
                </TouchableOpacity>

                {/* Chat */}
                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handleOpenChat}
                    testID="chat-button"
                    accessibilityLabel={t('journeys.care.telemedicineDeep.controls.chat')}
                    accessibilityRole="button"
                >
                    <Text fontSize="heading-sm" color={colors.neutral.white}>
                        {'\u{1F4AC}'}
                    </Text>
                    <Text fontSize="text-sm" color={colors.neutral.white}>
                        {t('journeys.care.telemedicineDeep.controls.chat')}
                    </Text>
                </TouchableOpacity>

                {/* End call */}
                <TouchableOpacity
                    style={styles.endCallButton}
                    onPress={handleEndCall}
                    testID="end-call-button"
                    accessibilityLabel={t('journeys.care.telemedicineDeep.controls.endCall')}
                    accessibilityRole="button"
                >
                    <Text fontSize="heading-sm" color={colors.neutral.white}>
                        {'\u{1F4F5}'}
                    </Text>
                    <Text fontSize="text-sm" color={colors.neutral.white}>
                        {t('journeys.care.telemedicineDeep.controls.endCall')}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.neutral.gray900,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacingValues.md,
        paddingVertical: spacingValues.sm,
    },
    topBarLeft: {
        gap: spacingValues['3xs'],
    },
    qualityIndicator: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: spacingValues['4xs'],
    },
    qualityBar: {
        width: 4,
        borderRadius: 2,
    },
    videoArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    selfView: {
        position: 'absolute',
        bottom: spacingValues.md,
        right: spacingValues.md,
        width: 100,
        height: 140,
        borderRadius: spacingValues.xs,
        backgroundColor: colors.neutral.gray700,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.neutral.gray600,
    },
    controlBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: spacingValues.md,
        paddingHorizontal: spacingValues.xs,
        backgroundColor: colors.neutral.gray800,
        borderTopLeftRadius: spacingValues.md,
        borderTopRightRadius: spacingValues.md,
    },
    controlButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.neutral.gray700,
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlButtonActive: {
        backgroundColor: colors.neutral.gray600,
    },
    endCallButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.semantic.error,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export { TelemedicineControls };
export default TelemedicineControls;
