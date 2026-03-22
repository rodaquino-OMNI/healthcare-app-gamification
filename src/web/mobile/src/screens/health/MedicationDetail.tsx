/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Modal } from '@austa/design-system/src/components/Modal/Modal';
import { ProgressBar } from '@austa/design-system/src/components/ProgressBar/ProgressBar';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, FlatList, StyleSheet, Alert, ListRenderItemInfo } from 'react-native';

import { ROUTES } from '../../constants/routes';
import type { HealthStackParamList } from '../../navigation/types';

/**
 * Dose history record
 */
interface DoseRecord {
    id: string;
    date: string;
    time: string;
    taken: boolean;
}

/**
 * Route params for MedicationDetail screen
 */
type MedicationDetailRouteParams = {
    MedicationDetail: {
        medicationId: string;
    };
};

/**
 * Mock medication detail data
 */
const MOCK_MEDICATION = {
    id: '1',
    name: 'Metformin',
    dosage: '500mg',
    schedule: 'Twice daily',
    frequency: 'twice_daily',
    times: ['08:00 AM', '08:00 PM'],
    startDate: '2025-12-01',
    adherence: true,
    status: 'active' as const,
    refillDate: '2026-03-15',
    refillProgress: 0.6,
    notes: 'Take with food to reduce stomach upset.',
};

/** Mock dose history data */
const MOCK_DOSE_HISTORY: DoseRecord[] = [
    { id: '1', date: '2026-02-21', time: '08:00 AM', taken: true },
    { id: '2', date: '2026-02-20', time: '08:00 PM', taken: true },
    { id: '3', date: '2026-02-20', time: '08:00 AM', taken: true },
    { id: '4', date: '2026-02-19', time: '08:00 PM', taken: false },
    { id: '5', date: '2026-02-19', time: '08:00 AM', taken: true },
    { id: '6', date: '2026-02-18', time: '08:00 PM', taken: true },
    { id: '7', date: '2026-02-18', time: '08:00 AM', taken: true },
    { id: '8', date: '2026-02-17', time: '08:00 PM', taken: true },
];

const STATUS_MAP: Record<string, { label: string; badgeStatus: 'success' | 'warning' | 'info' | 'neutral' }> = {
    active: { label: 'Active', badgeStatus: 'success' },
    paused: { label: 'Paused', badgeStatus: 'warning' },
    completed: { label: 'Completed', badgeStatus: 'info' },
};
const getStatusConfig = (status: string) => STATUS_MAP[status] ?? { label: status, badgeStatus: 'neutral' as const };

/** MedicationDetail shows details about a single medication with dose history and actions. */
const MedicationDetail: React.FC = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<HealthStackParamList>>();
    const _route = useRoute<RouteProp<MedicationDetailRouteParams, 'MedicationDetail'>>();
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const medication = MOCK_MEDICATION;
    const doseHistory = MOCK_DOSE_HISTORY;
    const statusConfig = getStatusConfig(medication.status);

    const handleEdit = useCallback(() => {
        navigation.navigate(ROUTES.HEALTH_MEDICATION_ADD, {
            medicationId: medication.id,
            medicationName: medication.name,
            medicationDosage: medication.dosage,
        });
    }, [navigation, medication]);

    const handlePause = useCallback(() => {
        Alert.alert(
            t('journeys.care.medications.pause'),
            t('journeys.care.medications.pauseConfirm', { name: medication.name }),
            [
                { text: t('common.buttons.cancel'), style: 'cancel' },
                { text: t('journeys.care.medications.pause'), onPress: () => navigation.goBack() },
            ]
        );
    }, [medication.name, navigation]);

    const handleDelete = useCallback(() => setDeleteModalVisible(true), []);

    const confirmDelete = useCallback(() => {
        setDeleteModalVisible(false);
        // In production, call API to delete medication
        navigation.goBack();
    }, [navigation]);

    const adherenceRate = useMemo(() => {
        if (doseHistory.length === 0) {
            return 0;
        }
        const taken = doseHistory.filter((d) => d.taken).length;
        return Math.round((taken / doseHistory.length) * 100);
    }, [doseHistory]);

    const renderDoseItem = useCallback(
        ({ item }: ListRenderItemInfo<DoseRecord>) => (
            <View style={styles.doseRow}>
                <View style={styles.doseInfo}>
                    <Text fontSize="sm" fontWeight="medium">
                        {item.date}
                    </Text>
                    <Text fontSize="xs" color={colors.neutral.gray600}>
                        {item.time}
                    </Text>
                </View>
                <Badge
                    variant="status"
                    status={item.taken ? 'success' : 'error'}
                    accessibilityLabel={item.taken ? 'Taken' : 'Missed'}
                >
                    {item.taken ? t('journeys.care.medications.taken') : t('journeys.care.medications.missed')}
                </Badge>
            </View>
        ),
        []
    );

    const doseKeyExtractor = useCallback((item: DoseRecord) => item.id, []);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Touchable
                    onPress={() => navigation.goBack()}
                    accessibilityLabel="Go back"
                    accessibilityRole="button"
                    testID="back-button"
                >
                    <Text fontSize="lg" color={colors.journeys.health.primary}>
                        {t('common.buttons.back')}
                    </Text>
                </Touchable>
                <Text variant="heading" journey="health">
                    {t('journeys.care.medications.detail')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Medication Info Card */}
                <Card journey="health" elevation="md" padding="md">
                    <View style={styles.titleRow}>
                        <View style={styles.titleInfo}>
                            <Text variant="heading" fontSize="heading-xl" journey="health">
                                {medication.name}
                            </Text>
                            <View style={styles.badgeRow}>
                                <Badge
                                    variant="status"
                                    status="info"
                                    accessibilityLabel={`Dosage ${medication.dosage}`}
                                >
                                    {medication.dosage}
                                </Badge>
                                <View style={styles.badgeSpacer} />
                                <Badge
                                    variant="status"
                                    status={statusConfig.badgeStatus}
                                    accessibilityLabel={`Status ${statusConfig.label}`}
                                >
                                    {statusConfig.label}
                                </Badge>
                            </View>
                        </View>
                    </View>

                    {/* Adherence Summary */}
                    <View style={styles.adherenceRow}>
                        <Text fontSize="sm" color={colors.neutral.gray600}>
                            {t('journeys.care.medications.adherenceRate')}
                        </Text>
                        <Text
                            fontSize="lg"
                            fontWeight="semiBold"
                            color={
                                adherenceRate >= 80
                                    ? colors.semantic.success
                                    : adherenceRate >= 50
                                      ? colors.semantic.warning
                                      : colors.semantic.error
                            }
                        >
                            {adherenceRate}%
                        </Text>
                    </View>
                </Card>

                {/* Schedule Section */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.care.medications.schedule')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <View style={styles.scheduleRow}>
                            <Text fontSize="sm" color={colors.neutral.gray600}>
                                {t('journeys.care.medications.frequency')}
                            </Text>
                            <Text fontSize="sm" fontWeight="medium">
                                {medication.schedule}
                            </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.scheduleRow}>
                            <Text fontSize="sm" color={colors.neutral.gray600}>
                                {t('journeys.care.medications.times')}
                            </Text>
                            <View>
                                {medication.times.map((time, i) => (
                                    <Text key={`t-${i}`} fontSize="sm" fontWeight="medium" textAlign="right">
                                        {time}
                                    </Text>
                                ))}
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.scheduleRow}>
                            <Text fontSize="sm" color={colors.neutral.gray600}>
                                {t('journeys.care.medications.startDate')}
                            </Text>
                            <Text fontSize="sm" fontWeight="medium">
                                {medication.startDate}
                            </Text>
                        </View>
                        {medication.notes && (
                            <>
                                <View style={styles.divider} />
                                <View style={styles.scheduleRow}>
                                    <Text fontSize="sm" color={colors.neutral.gray600}>
                                        {t('common.labels.notes')}
                                    </Text>
                                    <Text fontSize="sm" fontWeight="medium" style={styles.notesText}>
                                        {medication.notes}
                                    </Text>
                                </View>
                            </>
                        )}
                    </Card>
                </View>

                {/* Refill Tracker */}
                {medication.refillDate && (
                    <View style={styles.sectionContainer}>
                        <Text fontSize="lg" fontWeight="semiBold" journey="health">
                            {t('journeys.care.medications.refillTracker')}
                        </Text>
                        <Card journey="health" elevation="sm" padding="md">
                            <View style={styles.refillRow}>
                                <Text fontSize="sm" color={colors.neutral.gray600}>
                                    {t('journeys.care.medications.nextRefill')}
                                </Text>
                                <Text fontSize="sm" fontWeight="medium">
                                    {medication.refillDate}
                                </Text>
                            </View>
                            <View style={styles.progressContainer}>
                                <ProgressBar
                                    current={medication.refillProgress * 100}
                                    total={100}
                                    journey="health"
                                    ariaLabel={`Refill progress: ${Math.round(medication.refillProgress * 100)}%`}
                                    testId="refill-progress-bar"
                                />
                            </View>
                            <Text fontSize="xs" color={colors.neutral.gray500} textAlign="center">
                                {t('journeys.care.medications.supplyRemaining', {
                                    percent: Math.round(medication.refillProgress * 100),
                                })}
                            </Text>
                        </Card>
                    </View>
                )}

                {/* Dose History */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.care.medications.doseHistory')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <FlatList
                            data={doseHistory}
                            renderItem={renderDoseItem}
                            keyExtractor={doseKeyExtractor}
                            scrollEnabled={false}
                            ItemSeparatorComponent={() => <View style={styles.doseSeparator} />}
                            testID="dose-history-list"
                        />
                    </Card>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={handleEdit}
                        accessibilityLabel="Edit medication"
                    >
                        {t('common.buttons.edit')}
                    </Button>
                    <View style={styles.actionSpacer} />
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={handlePause}
                        accessibilityLabel="Pause medication"
                    >
                        {t('journeys.care.medications.pause')}
                    </Button>
                    <View style={styles.actionSpacer} />
                    <Touchable
                        onPress={handleDelete}
                        accessibilityLabel="Delete medication"
                        accessibilityRole="button"
                        testID="delete-medication-button"
                        style={styles.deleteButton}
                    >
                        <Text fontSize="md" fontWeight="medium" color={colors.semantic.error} textAlign="center">
                            {t('common.buttons.delete')}
                        </Text>
                    </Touchable>
                </View>
            </ScrollView>

            {/* Delete Confirmation Modal */}
            <Modal
                visible={deleteModalVisible}
                onClose={() => setDeleteModalVisible(false)}
                title={t('journeys.care.medications.deleteConfirm')}
                journey="health"
            >
                <Text fontSize="md" color={colors.neutral.gray700}>
                    {t('journeys.care.medications.deleteConfirmMessage', { name: medication.name })}
                </Text>
                <View style={styles.modalActions}>
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={() => setDeleteModalVisible(false)}
                        accessibilityLabel="Cancel deletion"
                    >
                        {t('common.buttons.cancel')}
                    </Button>
                    <View style={styles.actionSpacer} />
                    <Touchable
                        onPress={confirmDelete}
                        accessibilityLabel="Confirm delete medication"
                        accessibilityRole="button"
                        testID="confirm-delete-button"
                        style={styles.confirmDeleteButton}
                    >
                        <Text fontSize="md" fontWeight="medium" color={colors.neutral.white} textAlign="center">
                            {t('common.buttons.delete')}
                        </Text>
                    </Touchable>
                </View>
            </Modal>
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
    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: spacingValues.sm,
    },
    titleInfo: {
        flex: 1,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacingValues.xs,
    },
    badgeSpacer: {
        width: spacingValues.xs,
    },
    adherenceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: spacingValues.sm,
        borderTopWidth: 1,
        borderTopColor: colors.neutral.gray300,
    },
    sectionContainer: {
        marginTop: spacingValues.xl,
    },
    scheduleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: spacingValues.xs,
    },
    notesText: {
        flex: 1,
        textAlign: 'right',
        marginLeft: spacingValues.md,
    },
    divider: {
        height: 1,
        backgroundColor: colors.neutral.gray200,
    },
    refillRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacingValues.sm,
    },
    progressContainer: {
        marginBottom: spacingValues.xs,
    },
    doseRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacingValues['3xs'],
    },
    doseInfo: {
        flex: 1,
    },
    doseSeparator: {
        height: 1,
        backgroundColor: colors.neutral.gray200,
        marginVertical: spacingValues['3xs'],
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacingValues['2xl'],
        paddingBottom: spacingValues.xl,
    },
    actionSpacer: {
        width: spacingValues.sm,
    },
    deleteButton: {
        paddingVertical: spacingValues.sm,
        paddingHorizontal: spacingValues.md,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.semantic.error,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: spacingValues.xl,
    },
    confirmDeleteButton: {
        paddingVertical: spacingValues.sm,
        paddingHorizontal: spacingValues.xl,
        borderRadius: 8,
        backgroundColor: colors.semantic.error,
    },
});

export default MedicationDetail;
