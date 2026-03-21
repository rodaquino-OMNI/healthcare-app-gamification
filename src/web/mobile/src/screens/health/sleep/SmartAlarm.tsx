import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, Switch, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../../hooks/useTheme';

/**
 * Wake window duration in minutes.
 */
type WakeWindow = 10 | 20 | 30;

/**
 * Alarm sound intensity.
 */
type SoundLevel = 'gentle' | 'moderate' | 'strong';

const WAKE_WINDOW_OPTIONS: { value: WakeWindow; labelKey: string }[] = [
    { value: 10, labelKey: 'journeys.health.sleep.alarm.window10' },
    { value: 20, labelKey: 'journeys.health.sleep.alarm.window20' },
    { value: 30, labelKey: 'journeys.health.sleep.alarm.window30' },
];

const SOUND_OPTIONS: { id: SoundLevel; labelKey: string; descKey: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    {
        id: 'gentle',
        labelKey: 'journeys.health.sleep.alarm.soundGentle',
        descKey: 'journeys.health.sleep.alarm.soundGentleDesc',
        icon: 'musical-note-outline',
    },
    {
        id: 'moderate',
        labelKey: 'journeys.health.sleep.alarm.soundModerate',
        descKey: 'journeys.health.sleep.alarm.soundModerateDesc',
        icon: 'musical-notes-outline',
    },
    {
        id: 'strong',
        labelKey: 'journeys.health.sleep.alarm.soundStrong',
        descKey: 'journeys.health.sleep.alarm.soundStrongDesc',
        icon: 'volume-high-outline',
    },
];

/**
 * SmartAlarm allows users to configure their smart wake-up alarm with
 * a wake window, vibration toggle, and sound intensity selection.
 */
export const SmartAlarm: React.FC = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const _theme = useTheme();
    const [wakeWindow, setWakeWindow] = useState<WakeWindow>(20);
    const [vibrationEnabled, setVibrationEnabled] = useState(true);
    const [selectedSound, setSelectedSound] = useState<SoundLevel>('gentle');

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handlePreview = useCallback(() => {
        Alert.alert(
            t('journeys.health.sleep.alarm.previewTitle'),
            t('journeys.health.sleep.alarm.previewMessage', { sound: selectedSound })
        );
    }, [selectedSound, t]);

    const handleSave = useCallback(() => {
        Alert.alert(t('journeys.health.sleep.alarm.savedTitle'), t('journeys.health.sleep.alarm.savedMessage'));
    }, [t]);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Touchable
                    onPress={handleGoBack}
                    accessibilityLabel={t('common.buttons.back')}
                    accessibilityRole="button"
                    testID="back-button"
                >
                    <Text fontSize="lg" color={colors.journeys.health.primary}>
                        {t('common.buttons.back')}
                    </Text>
                </Touchable>
                <Text variant="heading" journey="health">
                    {t('journeys.health.sleep.alarm.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                testID="sleep-alarm-scroll"
            >
                {/* Wake Window */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.sleep.alarm.wakeWindow')}
                    </Text>
                    <Text fontSize="sm" color={colors.gray[50]}>
                        {t('journeys.health.sleep.alarm.wakeWindowDesc')}
                    </Text>
                    <View style={styles.windowSelector}>
                        {WAKE_WINDOW_OPTIONS.map((option) => (
                            <Touchable
                                key={option.value}
                                onPress={() => setWakeWindow(option.value)}
                                accessibilityLabel={t(option.labelKey)}
                                accessibilityRole="button"
                                testID={`sleep-alarm-window-${option.value}`}
                                style={[styles.windowOption, wakeWindow === option.value && styles.windowOptionActive]}
                            >
                                <Text
                                    fontSize="md"
                                    fontWeight={wakeWindow === option.value ? 'bold' : 'regular'}
                                    color={
                                        wakeWindow === option.value ? colors.journeys.health.primary : colors.gray[50]
                                    }
                                >
                                    {option.value}
                                </Text>
                                <Text
                                    fontSize="xs"
                                    color={
                                        wakeWindow === option.value ? colors.journeys.health.primary : colors.gray[40]
                                    }
                                >
                                    {t('journeys.health.sleep.alarm.minutes')}
                                </Text>
                            </Touchable>
                        ))}
                    </View>
                </View>

                {/* Vibration Toggle */}
                <View style={styles.sectionContainer}>
                    <Card journey="health" elevation="sm" padding="md">
                        <View style={styles.toggleRow}>
                            <View style={styles.toggleInfo}>
                                <Ionicons name="phone-portrait-outline" size={20} color={colors.gray[60]} />
                                <Text fontSize="md" fontWeight="medium" style={styles.toggleLabelText}>
                                    {t('journeys.health.sleep.alarm.vibration')}
                                </Text>
                            </View>
                            <Switch
                                value={vibrationEnabled}
                                onValueChange={setVibrationEnabled}
                                trackColor={{
                                    false: colors.gray[20],
                                    true: colors.journeys.health.primary,
                                }}
                                thumbColor={colors.gray[0]}
                                accessibilityLabel={t('journeys.health.sleep.alarm.vibration')}
                                testID="sleep-alarm-vibration-toggle"
                            />
                        </View>
                    </Card>
                </View>

                {/* Sound Selector */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.sleep.alarm.sound')}
                    </Text>
                    <View style={styles.soundContainer}>
                        {SOUND_OPTIONS.map((option) => (
                            <Touchable
                                key={option.id}
                                onPress={() => setSelectedSound(option.id)}
                                accessibilityLabel={t(option.labelKey)}
                                accessibilityRole="button"
                                testID={`sleep-alarm-sound-${option.id}`}
                            >
                                <Card journey="health" elevation="sm" padding="md">
                                    <View style={styles.radioRow}>
                                        <View style={styles.radioOuter}>
                                            {selectedSound === option.id && <View style={styles.radioInner} />}
                                        </View>
                                        <Ionicons
                                            name={option.icon}
                                            size={20}
                                            color={
                                                selectedSound === option.id
                                                    ? colors.journeys.health.primary
                                                    : colors.gray[40]
                                            }
                                            style={styles.soundIcon}
                                        />
                                        <View style={styles.soundInfo}>
                                            <Text fontSize="md" fontWeight="semiBold">
                                                {t(option.labelKey)}
                                            </Text>
                                            <Text fontSize="sm" color={colors.gray[50]}>
                                                {t(option.descKey)}
                                            </Text>
                                        </View>
                                    </View>
                                </Card>
                            </Touchable>
                        ))}
                    </View>
                </View>

                {/* Preview & Save */}
                <View style={styles.actionsContainer}>
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={handlePreview}
                        accessibilityLabel={t('journeys.health.sleep.alarm.preview')}
                        testID="sleep-alarm-preview-button"
                    >
                        {t('journeys.health.sleep.alarm.preview')}
                    </Button>
                    <View style={styles.buttonSpacer} />
                    <Button
                        journey="health"
                        onPress={handleSave}
                        accessibilityLabel={t('journeys.health.sleep.alarm.save')}
                        testID="sleep-alarm-save-button"
                    >
                        {t('journeys.health.sleep.alarm.save')}
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
    windowSelector: {
        flexDirection: 'row',
        gap: spacingValues.sm,
    },
    windowOption: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacingValues.md,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: colors.gray[20],
        backgroundColor: colors.gray[0],
    },
    windowOptionActive: {
        borderColor: colors.journeys.health.primary,
        backgroundColor: colors.journeys.health.background,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    toggleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues.sm,
    },
    toggleLabelText: {
        flex: 1,
        marginRight: spacingValues.sm,
    },
    soundContainer: {
        gap: spacingValues.sm,
    },
    radioRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: colors.journeys.health.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacingValues.sm,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.journeys.health.primary,
    },
    soundIcon: {
        marginRight: spacingValues.sm,
    },
    soundInfo: {
        flex: 1,
        gap: spacingValues['4xs'],
    },
    actionsContainer: {
        marginTop: spacingValues['2xl'],
        marginBottom: spacingValues.xl,
    },
    buttonSpacer: {
        height: spacingValues.sm,
    },
});

export default SmartAlarm;
