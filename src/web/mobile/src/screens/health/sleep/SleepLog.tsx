import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../../hooks/useTheme';

/**
 * Represents a star rating value (1-5).
 */
type StarRating = 1 | 2 | 3 | 4 | 5;

/**
 * Calculate the duration string between bedtime and wake time.
 */
const calculateDuration = (bedtime: string, wakeTime: string): string => {
    const [bedH, bedM] = bedtime.split(':').map(Number);
    const [wakeH, wakeM] = wakeTime.split(':').map(Number);

    let totalMinutes = wakeH * 60 + wakeM - (bedH * 60 + bedM);
    if (totalMinutes < 0) {
        totalMinutes += 24 * 60;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
};

/**
 * Format a 24h time string to 12h display.
 */
const formatTime12h = (time24: string): string => {
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
};

/**
 * SleepLog allows users to log a sleep session with bedtime,
 * wake time, quality rating, and optional notes.
 */
export const SleepLog: React.FC = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const _theme = useTheme();

    const [bedtime, setBedtime] = useState('22:30');
    const [wakeTime, setWakeTime] = useState('06:30');
    const [quality, setQuality] = useState<StarRating>(3);
    const [notes, setNotes] = useState('');

    const duration = useMemo(() => calculateDuration(bedtime, wakeTime), [bedtime, wakeTime]);

    const handleBedtimePress = useCallback(() => {
        // In production, this would open a time picker
        const times = ['21:00', '21:30', '22:00', '22:30', '23:00', '23:30'];
        const currentIdx = times.indexOf(bedtime);
        const nextIdx = (currentIdx + 1) % times.length;
        setBedtime(times[nextIdx]);
    }, [bedtime]);

    const handleWakeTimePress = useCallback(() => {
        // In production, this would open a time picker
        const times = ['05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00'];
        const currentIdx = times.indexOf(wakeTime);
        const nextIdx = (currentIdx + 1) % times.length;
        setWakeTime(times[nextIdx]);
    }, [wakeTime]);

    const handleQualityPress = useCallback((star: StarRating) => {
        setQuality(star);
    }, []);

    const handleSave = useCallback(() => {
        Alert.alert(t('journeys.health.sleep.log.savedTitle'), t('journeys.health.sleep.log.savedMessage'), [
            { text: t('common.buttons.ok'), onPress: () => navigation.goBack() },
        ]);
    }, [navigation, t]);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Touchable
                    onPress={() => navigation.goBack()}
                    accessibilityLabel={t('common.buttons.back')}
                    accessibilityRole="button"
                    testID="back-button"
                >
                    <Ionicons name="chevron-back" size={24} color={colors.journeys.health.primary} />
                </Touchable>
                <Text variant="heading" journey="health">
                    {t('journeys.health.sleep.log.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Bedtime Picker */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.sleep.log.bedtime')}
                    </Text>
                    <Touchable
                        onPress={handleBedtimePress}
                        accessibilityLabel={t('journeys.health.sleep.log.bedtime')}
                        accessibilityRole="button"
                        testID="sleep-log-bedtime-input"
                    >
                        <Card journey="health" elevation="sm" padding="md">
                            <View style={styles.timeRow}>
                                <Ionicons name="moon-outline" size={24} color={colors.journeys.health.primary} />
                                <Text fontSize="heading-2xl" fontWeight="bold" color={colors.journeys.health.primary}>
                                    {formatTime12h(bedtime)}
                                </Text>
                            </View>
                        </Card>
                    </Touchable>
                </View>

                {/* Wake Time Picker */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.sleep.log.wakeTime')}
                    </Text>
                    <Touchable
                        onPress={handleWakeTimePress}
                        accessibilityLabel={t('journeys.health.sleep.log.wakeTime')}
                        accessibilityRole="button"
                        testID="sleep-log-wake-input"
                    >
                        <Card journey="health" elevation="sm" padding="md">
                            <View style={styles.timeRow}>
                                <Ionicons name="alarm-outline" size={24} color={colors.journeys.health.primary} />
                                <Text fontSize="heading-2xl" fontWeight="bold" color={colors.journeys.health.primary}>
                                    {formatTime12h(wakeTime)}
                                </Text>
                            </View>
                        </Card>
                    </Touchable>
                </View>

                {/* Duration Display */}
                <Card journey="health" elevation="sm" padding="md">
                    <View style={styles.durationRow}>
                        <Ionicons name="time-outline" size={20} color={colors.gray[50]} />
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {t('journeys.health.sleep.log.duration')}
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.primary}>
                            {duration}
                        </Text>
                    </View>
                </Card>

                {/* Sleep Quality Rating */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.sleep.log.quality')}
                    </Text>
                    <View style={styles.starsRow}>
                        {([1, 2, 3, 4, 5] as StarRating[]).map((star) => (
                            <Touchable
                                key={`star-${star}`}
                                onPress={() => handleQualityPress(star)}
                                accessibilityLabel={t('journeys.health.sleep.log.rateStar', { star })}
                                accessibilityRole="button"
                                testID={`sleep-log-quality-${star}`}
                                style={styles.starButton}
                            >
                                <Ionicons
                                    name={star <= quality ? 'star' : 'star-outline'}
                                    size={36}
                                    color={star <= quality ? colors.journeys.health.primary : colors.gray[30]}
                                />
                            </Touchable>
                        ))}
                    </View>
                </View>

                {/* Notes */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.sleep.log.notes')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <TextInput
                            value={notes}
                            onChangeText={setNotes}
                            placeholder={t('journeys.health.sleep.log.notesPlaceholder')}
                            placeholderTextColor={colors.gray[40]}
                            multiline
                            numberOfLines={4}
                            style={styles.textInput}
                            testID="sleep-log-notes-input"
                            accessibilityLabel={t('journeys.health.sleep.log.notes')}
                        />
                    </Card>
                </View>

                {/* Save Button */}
                <View style={styles.actionsContainer}>
                    <Button
                        journey="health"
                        onPress={handleSave}
                        accessibilityLabel={t('journeys.health.sleep.log.save')}
                        testID="sleep-log-save-button"
                    >
                        {t('journeys.health.sleep.log.save')}
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.journeys.health.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacingValues.md,
        paddingTop: spacingValues['3xl'],
        paddingBottom: spacingValues.sm,
    },
    headerSpacer: {
        width: 40,
    },
    scrollContent: {
        paddingHorizontal: spacingValues.md,
        paddingBottom: spacingValues['3xl'],
    },
    sectionContainer: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacingValues.md,
    },
    durationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacingValues.sm,
        marginTop: spacingValues.md,
    },
    starsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacingValues.sm,
    },
    starButton: {
        padding: spacingValues.xs,
    },
    textInput: {
        minHeight: 80,
        textAlignVertical: 'top',
        fontSize: 14,
        color: colors.gray[60],
    },
    actionsContainer: {
        marginTop: spacingValues['2xl'],
    },
});

export default SleepLog;
