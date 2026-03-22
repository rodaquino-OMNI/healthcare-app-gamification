/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import type { Theme } from '@design-system/themes/base.theme';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useTheme } from 'styled-components/native';

import { ROUTES } from '../../constants/routes';
import type { HealthStackParamList } from '../../navigation/types';

/**
 * Route params for the MedicationDoseMissed screen.
 */
type DoseMissedRouteParams = {
    MedicationDoseMissed: {
        medicationId?: string;
        medicationName?: string;
        dosage?: string;
        scheduledTime?: string;
    };
};

/**
 * Reason option for why a dose was missed.
 */
interface MissedReason {
    id: string;
    labelKey: string;
    value: string;
}

const MISSED_REASONS: MissedReason[] = [
    { id: 'forgot', labelKey: 'medication.doseMissed.reasons.forgot', value: 'forgot' },
    { id: 'side_effects', labelKey: 'medication.doseMissed.reasons.sideEffects', value: 'side_effects' },
    { id: 'ran_out', labelKey: 'medication.doseMissed.reasons.ranOut', value: 'ran_out' },
    { id: 'other', labelKey: 'medication.doseMissed.reasons.other', value: 'other' },
];

/**
 * MedicationDoseMissed allows users to log a missed dose with a reason,
 * and optionally reschedule or take the dose now.
 */
export const MedicationDoseMissed: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<HealthStackParamList>>();
    const { t } = useTranslation();
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);
    const route = useRoute<RouteProp<DoseMissedRouteParams, 'MedicationDoseMissed'>>();

    const medicationName = route.params?.medicationName ?? t('medication.doseMissed.defaultName');
    const dosage = route.params?.dosage ?? '';
    const scheduledTime = route.params?.scheduledTime ?? '';

    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [rescheduleTime, setRescheduleTime] = useState('');
    const [showReschedule, setShowReschedule] = useState(false);

    const handleSelectReason = useCallback((value: string) => {
        setSelectedReason(value);
    }, []);

    const handleToggleReschedule = useCallback(() => {
        setShowReschedule((prev) => !prev);
    }, []);

    const handleSkipDose = useCallback(() => {
        // In production, persist skip record via API
        navigation.goBack();
    }, [navigation]);

    const handleTakeNow = useCallback(() => {
        navigation.navigate(ROUTES.HEALTH_MEDICATION_DOSE_TAKEN, {
            medicationId: route.params?.medicationId,
            medicationName,
            dosage,
            scheduledTime,
        });
    }, [navigation, route.params?.medicationId, medicationName, dosage, scheduledTime]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Touchable
                    onPress={() => navigation.goBack()}
                    accessibilityLabel={t('common.buttons.back')}
                    accessibilityRole="button"
                    testID="back-button"
                >
                    <Text fontSize="lg" color={colors.journeys.health.primary}>
                        {t('common.buttons.back')}
                    </Text>
                </Touchable>
                <Text variant="heading" journey="health">
                    {t('medication.doseMissed.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Medication Info */}
                <Card journey="health" elevation="md" padding="md">
                    <Text fontWeight="semiBold" fontSize="xl">
                        {medicationName}
                    </Text>
                    {dosage ? (
                        <Badge
                            variant="status"
                            status="info"
                            accessibilityLabel={`${t('medication.doseMissed.dosage')} ${dosage}`}
                        >
                            {dosage}
                        </Badge>
                    ) : null}
                    {scheduledTime ? (
                        <Text fontSize="sm" color={colors.neutral.gray600} style={styles.scheduledText}>
                            {t('medication.doseMissed.scheduled')}: {scheduledTime}
                        </Text>
                    ) : null}
                </Card>

                {/* Reason Selector */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('medication.doseMissed.reasonTitle')}
                    </Text>
                    <View style={styles.reasonsList}>
                        {MISSED_REASONS.map((reason) => {
                            const isSelected = selectedReason === reason.value;
                            return (
                                <Touchable
                                    key={reason.id}
                                    onPress={() => handleSelectReason(reason.value)}
                                    accessibilityLabel={t(reason.labelKey)}
                                    accessibilityRole="button"
                                    testID={`reason-${reason.id}`}
                                    style={[styles.reasonItem, isSelected && styles.reasonItemSelected]}
                                >
                                    <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                                        {isSelected && <View style={styles.radioInner} />}
                                    </View>
                                    <Text
                                        fontSize="md"
                                        color={isSelected ? colors.journeys.health.primary : colors.neutral.gray900}
                                        fontWeight={isSelected ? 'medium' : 'regular'}
                                    >
                                        {t(reason.labelKey)}
                                    </Text>
                                </Touchable>
                            );
                        })}
                    </View>
                </View>

                {/* Reschedule Option */}
                <View style={styles.sectionContainer}>
                    <Touchable
                        onPress={handleToggleReschedule}
                        accessibilityLabel={t('medication.doseMissed.reschedule')}
                        accessibilityRole="button"
                        testID="reschedule-toggle"
                    >
                        <Card journey="health" elevation="sm" padding="md">
                            <View style={styles.rescheduleRow}>
                                <Text fontSize="md" fontWeight="medium">
                                    {t('medication.doseMissed.reschedule')}
                                </Text>
                                <Text fontSize="md" color={colors.journeys.health.primary}>
                                    {showReschedule ? '-' : '+'}
                                </Text>
                            </View>
                        </Card>
                    </Touchable>

                    {showReschedule && (
                        <Card journey="health" elevation="sm" padding="md" style={styles.rescheduleCard}>
                            <Text fontSize="sm" color={colors.neutral.gray600} style={styles.rescheduleLabel}>
                                {t('medication.doseMissed.rescheduleTime')}
                            </Text>
                            <TextInput
                                style={styles.timeInput}
                                value={rescheduleTime}
                                onChangeText={setRescheduleTime}
                                placeholder="HH:MM AM/PM"
                                placeholderTextColor={colors.neutral.gray500}
                                accessibilityLabel={t('medication.doseMissed.rescheduleTime')}
                                testID="reschedule-time-input"
                            />
                        </Card>
                    )}
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={handleSkipDose}
                        accessibilityLabel={t('medication.doseMissed.skipDose')}
                        testID="skip-dose-button"
                    >
                        {t('medication.doseMissed.skipDose')}
                    </Button>

                    <View style={styles.actionSpacer} />

                    <Button
                        variant="primary"
                        journey="health"
                        onPress={handleTakeNow}
                        accessibilityLabel={t('medication.doseMissed.takeNow')}
                        testID="take-now-button"
                    >
                        {t('medication.doseMissed.takeNow')}
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
};

const createStyles = (theme: Theme) =>
    StyleSheet.create({
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
        scheduledText: {
            marginTop: spacingValues.xs,
        },
        sectionContainer: {
            marginTop: spacingValues.xl,
        },
        reasonsList: {
            marginTop: spacingValues.sm,
            gap: spacingValues.xs,
        },
        reasonItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: spacingValues.sm,
            paddingHorizontal: spacingValues.md,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            backgroundColor: theme.colors.background.default,
        },
        reasonItemSelected: {
            borderColor: colors.journeys.health.primary,
            backgroundColor: colors.journeys.health.background,
        },
        radioOuter: {
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: colors.neutral.gray400,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacingValues.sm,
        },
        radioOuterSelected: {
            borderColor: colors.journeys.health.primary,
        },
        radioInner: {
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: colors.journeys.health.primary,
        },
        rescheduleRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        rescheduleCard: {
            marginTop: spacingValues.xs,
        },
        rescheduleLabel: {
            marginBottom: spacingValues.xs,
        },
        timeInput: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text.default,
            paddingVertical: spacingValues.xs,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.default,
        },
        actionsContainer: {
            marginTop: spacingValues['2xl'],
            paddingBottom: spacingValues.xl,
            gap: spacingValues.sm,
        },
        actionSpacer: {
            height: spacingValues.xs,
        },
    });

export default MedicationDoseMissed;
