import { Button } from '@austa/design-system/src/components/Button/Button';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Animated, Easing } from 'react-native';

import { ROUTES } from '@constants/routes';

/**
 * Route params expected by TelemedicineConnecting.
 */
type TelemedicineConnectingRouteParams = {
    appointmentId: string;
    doctorName: string;
    doctorSpecialty: string;
};

/** Connection timeout in seconds. */
const CONNECTION_TIMEOUT_SECONDS = 30;

/**
 * Extracts initials from a full name (up to 2 characters).
 */
const getInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return (parts[0]?.[0] ?? '').toUpperCase();
};

/**
 * Formats elapsed seconds as M:SS.
 */
const formatElapsed = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
};

/**
 * TelemedicineConnecting shows a pulsing animation around the doctor avatar
 * while establishing a video call connection. Displays an elapsed timer and
 * provides cancel / retry actions.
 */
const TelemedicineConnecting: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<{ params: TelemedicineConnectingRouteParams }, 'params'>>();
    const { t } = useTranslation();

    const { appointmentId, doctorName = '', doctorSpecialty = '' } = route.params || {};

    const [elapsed, setElapsed] = useState(0);
    const [timedOut, setTimedOut] = useState(false);
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(0.6)).current;
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Pulsing animation loop
    useEffect(() => {
        const pulse = Animated.loop(
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.4,
                        duration: 1200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(opacityAnim, {
                        toValue: 0.15,
                        duration: 1200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityAnim, {
                        toValue: 0.6,
                        duration: 1200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ]),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, [pulseAnim, opacityAnim]);

    // Elapsed timer
    useEffect(() => {
        if (timedOut) {
            return;
        }
        timerRef.current = setInterval(() => {
            setElapsed((prev) => {
                const next = prev + 1;
                if (next >= CONNECTION_TIMEOUT_SECONDS) {
                    setTimedOut(true);
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                    }
                }
                return next;
            });
        }, 1000);
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [timedOut]);

    const handleCancel = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleRetry = useCallback(() => {
        setElapsed(0);
        setTimedOut(false);
    }, []);

    // Mock: auto-connect at 5 seconds for demo purposes
    useEffect(() => {
        if (elapsed === 5 && !timedOut) {
            navigation.navigate(ROUTES.CARE_TELEMEDICINE_CONTROLS, {
                appointmentId,
                doctorName,
            });
        }
    }, [elapsed, timedOut, navigation, appointmentId, doctorName]);

    const initials = getInitials(doctorName);

    return (
        <View style={styles.root} testID="telemedicine-connecting-screen">
            <View style={styles.content}>
                {/* Pulsing ring + avatar */}
                <View style={styles.avatarContainer}>
                    <Animated.View
                        style={[styles.pulseRing, { transform: [{ scale: pulseAnim }], opacity: opacityAnim }]}
                    />
                    <View
                        style={styles.avatar}
                        accessibilityLabel={t('journeys.care.telemedicineDeep.connecting.doctorAvatar', {
                            name: doctorName,
                        })}
                        accessibilityRole="image"
                    >
                        <Text
                            fontSize="heading-md"
                            fontWeight="bold"
                            color={colors.neutral.white}
                            testID="doctor-initials"
                        >
                            {initials}
                        </Text>
                    </View>
                </View>

                {/* Doctor info */}
                <Text variant="heading" journey="care" testID="doctor-name-text">
                    {doctorName}
                </Text>
                <Text fontSize="text-sm" color={colors.neutral.gray600} testID="doctor-specialty-text">
                    {doctorSpecialty}
                </Text>

                {/* Connection status */}
                <Text variant="body" journey="care" testID="connection-status-text">
                    {timedOut
                        ? t('journeys.care.telemedicineDeep.connecting.timedOut')
                        : t('journeys.care.telemedicineDeep.connecting.status')}
                </Text>

                {/* Elapsed timer */}
                <Text
                    fontSize="heading-lg"
                    fontWeight="bold"
                    color={colors.journeys.care.primary}
                    testID="elapsed-timer"
                >
                    {formatElapsed(elapsed)}
                </Text>

                {/* Timeout message */}
                {timedOut && (
                    <Text variant="body" color={colors.semantic.warning} testID="timeout-message">
                        {t('journeys.care.telemedicineDeep.connecting.timeoutMessage')}
                    </Text>
                )}
            </View>

            {/* Action buttons */}
            <View style={styles.actions}>
                {timedOut ? (
                    <>
                        <Button
                            onPress={handleRetry}
                            journey="care"
                            accessibilityLabel={t('journeys.care.telemedicineDeep.connecting.retry')}
                            testID="retry-button"
                        >
                            {t('journeys.care.telemedicineDeep.connecting.retry')}
                        </Button>
                        <Button
                            variant="secondary"
                            onPress={handleCancel}
                            journey="care"
                            accessibilityLabel={t('journeys.care.telemedicineDeep.connecting.cancel')}
                            testID="cancel-button"
                        >
                            {t('journeys.care.telemedicineDeep.connecting.cancel')}
                        </Button>
                    </>
                ) : (
                    <Button
                        variant="secondary"
                        onPress={handleCancel}
                        journey="care"
                        accessibilityLabel={t('journeys.care.telemedicineDeep.connecting.cancel')}
                        testID="cancel-button"
                    >
                        {t('journeys.care.telemedicineDeep.connecting.cancel')}
                    </Button>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.journeys.care.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacingValues.xl,
        gap: spacingValues.sm,
    },
    avatarContainer: {
        width: 160,
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacingValues.xl,
    },
    pulseRing: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: colors.journeys.care.primary,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.journeys.care.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actions: {
        width: '100%',
        paddingHorizontal: spacingValues.xl,
        paddingBottom: spacingValues['3xl'],
        gap: spacingValues.sm,
    },
});

export { TelemedicineConnecting };
export default TelemedicineConnecting;
