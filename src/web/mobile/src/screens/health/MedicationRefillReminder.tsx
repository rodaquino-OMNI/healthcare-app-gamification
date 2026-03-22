import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { ProgressBar } from '@austa/design-system/src/components/ProgressBar/ProgressBar';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';

import { ROUTES } from '../../constants/routes';
import type { HealthStackParamList } from '../../navigation/types';

type RefillReminderRouteParams = {
    MedicationRefillReminder: {
        medicationId: string;
        medicationName: string;
        daysRemaining: number;
    };
};

const getCountdownColor = (days: number): string => {
    if (days > 14) {
        return colors.semantic.success;
    }
    if (days >= 7) {
        return colors.semantic.warning;
    }
    return colors.semantic.error;
};

const getSupplyLevel = (daysRemaining: number): number => {
    const maxDays = 30;
    return Math.min(Math.max((daysRemaining / maxDays) * 100, 0), 100);
};

type SnoozeOption = { label: string; days: number };

const SNOOZE_OPTIONS: SnoozeOption[] = [
    { label: '3 days', days: 3 },
    { label: '1 week', days: 7 },
];

/**
 * MedicationRefillReminder shows refill countdown with supply level
 * and actions to find a pharmacy or order refills.
 */
export const MedicationRefillReminder: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<HealthStackParamList>>();
    const route = useRoute<RouteProp<RefillReminderRouteParams, 'MedicationRefillReminder'>>();
    const { t } = useTranslation();

    const { medicationId = '1', medicationName = 'Metformin', daysRemaining: initialDays = 10 } = route.params ?? {};

    const [daysRemaining, _setDaysRemaining] = useState(initialDays);
    const [snoozed, setSnoozed] = useState(false);

    const supplyLevel = getSupplyLevel(daysRemaining);
    const countdownColor = getCountdownColor(daysRemaining);

    const handleFindPharmacy = useCallback(() => {
        navigation.navigate(ROUTES.HEALTH_MEDICATION_PHARMACY_LOCATOR, {
            medicationId,
            medicationName,
        });
    }, [navigation, medicationId, medicationName]);

    const handleOrderRefill = useCallback(() => {
        Alert.alert(t('medication.comingSoon'), t('medication.orderRefillMessage'));
    }, [t]);

    const handleSnooze = useCallback(
        (option: SnoozeOption) => {
            setSnoozed(true);
            Alert.alert(t('medication.snoozed'), `${t('medication.reminderSnoozedFor')} ${option.label}`);
        },
        [t]
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Touchable
                    onPress={() => navigation.goBack()}
                    accessibilityLabel={t('medication.goBack')}
                    accessibilityRole="button"
                    testID="back-button"
                >
                    <Text fontSize="lg" color={colors.journeys.health.primary}>
                        {t('medication.back')}
                    </Text>
                </Touchable>
                <Text variant="heading" journey="health">
                    {t('medication.refillReminder')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Medication Name Card */}
                <Card journey="health" elevation="md" padding="md">
                    <Text fontWeight="semiBold" fontSize="xl" journey="health" textAlign="center">
                        {medicationName}
                    </Text>
                </Card>

                {/* Countdown Display */}
                <View style={styles.countdownContainer}>
                    <Text
                        fontSize="heading-2xl"
                        fontWeight="bold"
                        color={countdownColor}
                        textAlign="center"
                        testID="days-remaining-count"
                    >
                        {daysRemaining}
                    </Text>
                    <Text fontSize="lg" color={countdownColor} textAlign="center">
                        {t('medication.daysRemaining')}
                    </Text>
                </View>

                {/* Supply Level */}
                <Card journey="health" elevation="sm" padding="md">
                    <Text fontWeight="medium" fontSize="md" color={colors.neutral.gray700}>
                        {t('medication.supplyLevel')}
                    </Text>
                    <View style={styles.progressContainer}>
                        <ProgressBar
                            current={supplyLevel}
                            total={100}
                            journey="health"
                            ariaLabel={`${t('medication.supplyLevel')}: ${Math.round(supplyLevel)}%`}
                            testId="supply-progress-bar"
                        />
                    </View>
                    <Text fontSize="sm" color={colors.neutral.gray600} textAlign="center">
                        {Math.round(supplyLevel)}% {t('medication.remaining')}
                    </Text>
                </Card>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <Button
                        variant="primary"
                        journey="health"
                        onPress={handleFindPharmacy}
                        accessibilityLabel={t('medication.findPharmacy')}
                        testID="find-pharmacy-button"
                    >
                        {t('medication.findPharmacy')}
                    </Button>
                    <View style={styles.actionSpacer} />
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={handleOrderRefill}
                        accessibilityLabel={t('medication.orderRefillOnline')}
                        testID="order-refill-button"
                    >
                        {t('medication.orderRefillOnline')}
                    </Button>
                </View>

                {/* Snooze Options */}
                {!snoozed && (
                    <View style={styles.snoozeContainer}>
                        <Text fontWeight="medium" fontSize="md" color={colors.neutral.gray700} textAlign="center">
                            {t('medication.snoozeReminder')}
                        </Text>
                        <View style={styles.snoozeOptions}>
                            {SNOOZE_OPTIONS.map((option) => (
                                <Touchable
                                    key={`snooze-${option.days}`}
                                    onPress={() => handleSnooze(option)}
                                    accessibilityLabel={`${t('medication.snooze')} ${option.label}`}
                                    accessibilityRole="button"
                                    testID={`snooze-${option.days}-button`}
                                    style={styles.snoozeChip}
                                >
                                    <Text fontSize="sm" color={colors.journeys.health.primary} fontWeight="medium">
                                        {option.label}
                                    </Text>
                                </Touchable>
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>
        </View>
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
    countdownContainer: {
        alignItems: 'center',
        paddingVertical: spacingValues['2xl'],
    },
    progressContainer: {
        marginVertical: spacingValues.sm,
    },
    actionsContainer: {
        marginTop: spacingValues.xl,
    },
    actionSpacer: {
        height: spacingValues.sm,
    },
    snoozeContainer: {
        marginTop: spacingValues['2xl'],
        alignItems: 'center',
    },
    snoozeOptions: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: spacingValues.sm,
        gap: spacingValues.md,
    },
    snoozeChip: {
        paddingVertical: spacingValues.sm,
        paddingHorizontal: spacingValues.lg,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.journeys.health.primary,
    },
});

export default MedicationRefillReminder;
