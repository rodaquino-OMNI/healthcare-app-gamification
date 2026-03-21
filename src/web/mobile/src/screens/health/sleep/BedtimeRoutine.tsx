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
import { View, FlatList, Switch, StyleSheet, Alert, ListRenderItemInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../../hooks/useTheme';

/**
 * A single step in the bedtime routine.
 */
interface RoutineStep {
    id: string;
    name: string;
    duration: string;
}

const INITIAL_STEPS: RoutineStep[] = [
    { id: 'step-1', name: 'Read a book', duration: '20 min' },
    { id: 'step-2', name: 'Dim lights', duration: '5 min' },
    { id: 'step-3', name: 'Meditation', duration: '10 min' },
    { id: 'step-4', name: 'Brush teeth', duration: '5 min' },
    { id: 'step-5', name: 'Set alarm', duration: '2 min' },
];

const MOCK_WIND_DOWN = '42 min';

/**
 * BedtimeRoutine allows users to manage an ordered list of pre-sleep steps,
 * toggle Do Not Disturb and bedtime reminders, and save their routine.
 */
export const BedtimeRoutine: React.FC = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const _theme = useTheme();
    const [steps, setSteps] = useState<RoutineStep[]>(INITIAL_STEPS);
    const [dndEnabled, setDndEnabled] = useState(false);
    const [reminderEnabled, setReminderEnabled] = useState(true);

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleDeleteStep = useCallback((stepId: string) => {
        setSteps((prev) => prev.filter((s) => s.id !== stepId));
    }, []);

    const handleAddStep = useCallback(() => {
        const newId = `step-${Date.now()}`;
        setSteps((prev) => [
            ...prev,
            { id: newId, name: t('journeys.health.sleep.routine.newStep'), duration: '5 min' },
        ]);
    }, [t]);

    const handleSave = useCallback(() => {
        Alert.alert(t('journeys.health.sleep.routine.savedTitle'), t('journeys.health.sleep.routine.savedMessage'));
    }, [t]);

    const renderStep = useCallback(
        ({ item, index }: ListRenderItemInfo<RoutineStep>) => (
            <Card journey="health" elevation="sm" padding="md">
                <View style={styles.stepRow} testID={`sleep-routine-step-${index}`}>
                    <View style={styles.stepOrderContainer}>
                        <Text fontSize="sm" fontWeight="bold" color={colors.journeys.health.primary}>
                            {index + 1}
                        </Text>
                    </View>
                    <View style={styles.stepInfo}>
                        <Text fontSize="md" fontWeight="medium">
                            {item.name}
                        </Text>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {item.duration}
                        </Text>
                    </View>
                    <Touchable
                        onPress={() => handleDeleteStep(item.id)}
                        accessibilityLabel={t('journeys.health.sleep.routine.deleteStep')}
                        accessibilityRole="button"
                        testID={`sleep-routine-delete-${index}`}
                    >
                        <Ionicons name="trash-outline" size={20} color={colors.semantic.error} />
                    </Touchable>
                    <View style={styles.reorderIcon}>
                        <Ionicons name="reorder-three-outline" size={22} color={colors.gray[40]} />
                    </View>
                </View>
            </Card>
        ),
        [handleDeleteStep, t]
    );

    const stepKeyExtractor = useCallback((item: RoutineStep) => item.id, []);

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
                    {t('journeys.health.sleep.routine.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <FlatList
                data={steps}
                renderItem={renderStep}
                keyExtractor={stepKeyExtractor}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                testID="sleep-routine-list"
                ListHeaderComponent={
                    <>
                        {/* Wind Down Timer */}
                        <Card journey="health" elevation="md" padding="md">
                            <View style={styles.windDownRow}>
                                <Ionicons name="time-outline" size={24} color={colors.journeys.health.primary} />
                                <View style={styles.windDownInfo}>
                                    <Text fontSize="sm" color={colors.gray[50]}>
                                        {t('journeys.health.sleep.routine.windDownTime')}
                                    </Text>
                                    <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.primary}>
                                        {MOCK_WIND_DOWN}
                                    </Text>
                                </View>
                            </View>
                        </Card>

                        {/* Section Label */}
                        <Text fontSize="lg" fontWeight="semiBold" journey="health" style={styles.sectionLabel}>
                            {t('journeys.health.sleep.routine.steps')}
                        </Text>
                    </>
                }
                ListFooterComponent={
                    <>
                        {/* Add Step Button */}
                        <Touchable
                            onPress={handleAddStep}
                            accessibilityLabel={t('journeys.health.sleep.routine.addStep')}
                            accessibilityRole="button"
                            testID="sleep-routine-add-step"
                        >
                            <View style={styles.addStepRow}>
                                <Ionicons name="add-circle-outline" size={24} color={colors.journeys.health.primary} />
                                <Text fontSize="md" fontWeight="medium" color={colors.journeys.health.primary}>
                                    {t('journeys.health.sleep.routine.addStep')}
                                </Text>
                            </View>
                        </Touchable>

                        {/* Toggles */}
                        <View style={styles.toggleSection}>
                            <Card journey="health" elevation="sm" padding="md">
                                <View style={styles.toggleRow}>
                                    <View style={styles.toggleInfo}>
                                        <Ionicons name="notifications-outline" size={20} color={colors.gray[60]} />
                                        <Text fontSize="md" fontWeight="medium" style={styles.toggleLabelText}>
                                            {t('journeys.health.sleep.routine.doNotDisturb')}
                                        </Text>
                                    </View>
                                    <Switch
                                        value={dndEnabled}
                                        onValueChange={setDndEnabled}
                                        trackColor={{
                                            false: colors.gray[20],
                                            true: colors.journeys.health.primary,
                                        }}
                                        thumbColor={colors.gray[0]}
                                        accessibilityLabel={t('journeys.health.sleep.routine.doNotDisturb')}
                                        testID="sleep-routine-dnd-toggle"
                                    />
                                </View>
                            </Card>

                            <Card journey="health" elevation="sm" padding="md">
                                <View style={styles.toggleRow}>
                                    <View style={styles.toggleInfo}>
                                        <Ionicons name="alarm-outline" size={20} color={colors.gray[60]} />
                                        <Text fontSize="md" fontWeight="medium" style={styles.toggleLabelText}>
                                            {t('journeys.health.sleep.routine.bedtimeReminder')}
                                        </Text>
                                    </View>
                                    <Switch
                                        value={reminderEnabled}
                                        onValueChange={setReminderEnabled}
                                        trackColor={{
                                            false: colors.gray[20],
                                            true: colors.journeys.health.primary,
                                        }}
                                        thumbColor={colors.gray[0]}
                                        accessibilityLabel={t('journeys.health.sleep.routine.bedtimeReminder')}
                                        testID="sleep-routine-reminder-toggle"
                                    />
                                </View>
                            </Card>
                        </View>

                        {/* Save Button */}
                        <View style={styles.actionsContainer}>
                            <Button
                                journey="health"
                                onPress={handleSave}
                                accessibilityLabel={t('journeys.health.sleep.routine.save')}
                                testID="sleep-routine-save-button"
                            >
                                {t('journeys.health.sleep.routine.save')}
                            </Button>
                        </View>
                    </>
                }
            />
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
    listContent: {
        paddingHorizontal: spacingValues.md,
        paddingBottom: spacingValues['3xl'],
        gap: spacingValues.sm,
    },
    windDownRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues.md,
    },
    windDownInfo: {
        gap: spacingValues['4xs'],
    },
    sectionLabel: {
        marginTop: spacingValues.sm,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepOrderContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.journeys.health.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacingValues.sm,
    },
    stepInfo: {
        flex: 1,
        gap: spacingValues['4xs'],
    },
    reorderIcon: {
        marginLeft: spacingValues.sm,
    },
    addStepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacingValues.xs,
        paddingVertical: spacingValues.md,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: colors.journeys.health.primary,
        borderRadius: 16,
    },
    toggleSection: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
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
    actionsContainer: {
        marginTop: spacingValues['2xl'],
    },
});

export default BedtimeRoutine;
