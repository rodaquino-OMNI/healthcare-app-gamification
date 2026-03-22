/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Card } from '@austa/design-system/src/components/Card/Card';
import Input from '@austa/design-system/src/components/Input/Input';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, FlatList, StyleSheet, ListRenderItemInfo } from 'react-native';

import { ROUTES } from '../../constants/routes';
import type { HealthStackParamList } from '../../navigation/types';

/**
 * Medication data model used across all medication screens
 */
export interface Medication {
    id: string;
    name: string;
    dosage: string;
    schedule: string;
    frequency: string;
    startDate: string;
    endDate?: string;
    adherence: boolean;
    status: 'active' | 'completed' | 'paused';
    refillDate?: string;
    refillProgress?: number;
}

/**
 * Mock medication data for development
 */
const MOCK_MEDICATIONS: Medication[] = [
    {
        id: '1',
        name: 'Metformin',
        dosage: '500mg',
        schedule: 'Twice daily',
        frequency: 'twice_daily',
        startDate: '2025-12-01',
        adherence: true,
        status: 'active',
        refillDate: '2026-03-15',
        refillProgress: 0.6,
    },
    {
        id: '2',
        name: 'Lisinopril',
        dosage: '10mg',
        schedule: 'Once daily',
        frequency: 'once_daily',
        startDate: '2025-10-15',
        adherence: true,
        status: 'active',
        refillDate: '2026-03-01',
        refillProgress: 0.45,
    },
    {
        id: '3',
        name: 'Atorvastatin',
        dosage: '20mg',
        schedule: 'Once daily at bedtime',
        frequency: 'once_daily',
        startDate: '2025-11-20',
        adherence: false,
        status: 'active',
        refillDate: '2026-02-28',
        refillProgress: 0.2,
    },
    {
        id: '4',
        name: 'Amoxicillin',
        dosage: '500mg',
        schedule: 'Three times daily',
        frequency: 'three_times_daily',
        startDate: '2026-01-10',
        endDate: '2026-01-20',
        adherence: true,
        status: 'completed',
    },
    {
        id: '5',
        name: 'Omeprazole',
        dosage: '20mg',
        schedule: 'Once daily before breakfast',
        frequency: 'once_daily',
        startDate: '2025-09-01',
        endDate: '2026-01-01',
        adherence: true,
        status: 'completed',
    },
    {
        id: '6',
        name: 'Sertraline',
        dosage: '50mg',
        schedule: 'Once daily',
        frequency: 'once_daily',
        startDate: '2026-01-15',
        adherence: true,
        status: 'paused',
        refillDate: '2026-04-01',
        refillProgress: 0.8,
    },
];

type TabFilter = 'active' | 'completed';

/**
 * MedicationList screen displays the user's medications in a filterable,
 * searchable list grouped by Active and Completed tabs.
 */
const MedicationList: React.FC = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<HealthStackParamList>>();
    const [activeTab, setActiveTab] = useState<TabFilter>('active');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMedications = useMemo(() => {
        let filtered = MOCK_MEDICATIONS;

        // Filter by tab
        if (activeTab === 'active') {
            filtered = filtered.filter((m) => m.status === 'active' || m.status === 'paused');
        } else {
            filtered = filtered.filter((m) => m.status === 'completed');
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((m) => m.name.toLowerCase().includes(query));
        }

        return filtered;
    }, [activeTab, searchQuery]);

    const handleMedicationPress = useCallback(
        (medication: Medication) => {
            navigation.navigate(ROUTES.HEALTH_MEDICATION_DETAIL, {
                medicationId: medication.id,
            });
        },
        [navigation]
    );

    const handleAddPress = useCallback(() => {
        navigation.navigate(ROUTES.HEALTH_MEDICATION_ADD);
    }, [navigation]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);

    const getStatusBadge = (status: Medication['status']) => {
        switch (status) {
            case 'active':
                return (
                    <Badge variant="status" status="success" accessibilityLabel="Active">
                        {t('journeys.care.medications.status.active')}
                    </Badge>
                );
            case 'paused':
                return (
                    <Badge
                        variant="status"
                        status="warning"
                        accessibilityLabel={t('journeys.care.medications.status.paused')}
                    >
                        {t('journeys.care.medications.status.paused')}
                    </Badge>
                );
            case 'completed':
                return (
                    <Badge
                        variant="status"
                        status="info"
                        accessibilityLabel={t('journeys.care.medications.status.completed')}
                    >
                        {t('journeys.care.medications.status.completed')}
                    </Badge>
                );
            default:
                return null;
        }
    };

    const renderMedicationItem = useCallback(
        ({ item }: ListRenderItemInfo<Medication>) => (
            <Touchable
                onPress={() => handleMedicationPress(item)}
                accessibilityLabel={`${item.name} ${item.dosage}, ${item.schedule}, ${
                    item.adherence ? 'taken as prescribed' : 'not taken as prescribed'
                }`}
                accessibilityHint="Opens medication details"
                testID={`medication-item-${item.id}`}
                journey="health"
            >
                <Card journey="health" elevation="sm" padding="md">
                    <View style={styles.cardRow}>
                        <View style={styles.cardInfo}>
                            <Text fontWeight="semiBold" fontSize="lg">
                                {item.name}
                            </Text>
                            <Text fontSize="sm" color={colors.neutral.gray600}>
                                {item.dosage} - {item.schedule}
                            </Text>
                        </View>
                        <View style={styles.cardRight}>
                            {getStatusBadge(item.status)}
                            <View style={styles.adherenceIndicator}>
                                <Text
                                    fontSize="xs"
                                    color={item.adherence ? colors.semantic.success : colors.semantic.warning}
                                >
                                    {item.adherence
                                        ? t('journeys.care.medications.onTrack')
                                        : t('journeys.care.medications.missed')}
                                </Text>
                            </View>
                        </View>
                    </View>
                </Card>
            </Touchable>
        ),
        [handleMedicationPress]
    );

    const renderEmptyState = (): React.ReactElement | null => (
        <View style={styles.emptyState}>
            <Text fontSize="xl" color={colors.neutral.gray500} textAlign="center">
                {t('journeys.care.medications.empty')}
            </Text>
            <Text fontSize="sm" color={colors.neutral.gray500} textAlign="center">
                {activeTab === 'active'
                    ? t('journeys.care.medications.emptyActiveHint')
                    : t('journeys.care.medications.emptyCompletedHint')}
            </Text>
        </View>
    );

    const keyExtractor = useCallback((item: Medication) => item.id, []);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text variant="heading" journey="health">
                    {t('journeys.care.medications.title')}
                </Text>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <Input
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder={t('common.placeholders.search')}
                    journey="health"
                    aria-label="Search medications"
                    testID="medication-search-input"
                />
            </View>

            {/* Tab Buttons */}
            <View style={styles.tabContainer}>
                <Touchable
                    onPress={() => setActiveTab('active')}
                    accessibilityLabel="Show active medications"
                    accessibilityRole="button"
                    testID="tab-active"
                    style={[styles.tab, activeTab === 'active' && styles.tabActive]}
                >
                    <Text
                        fontWeight={activeTab === 'active' ? 'semiBold' : 'regular'}
                        color={activeTab === 'active' ? colors.journeys.health.primary : colors.neutral.gray600}
                    >
                        {t('journeys.care.medications.status.active')}
                    </Text>
                </Touchable>
                <Touchable
                    onPress={() => setActiveTab('completed')}
                    accessibilityLabel={t('journeys.care.medications.status.completed')}
                    accessibilityRole="button"
                    testID="tab-completed"
                    style={[styles.tab, activeTab === 'completed' && styles.tabActive]}
                >
                    <Text
                        fontWeight={activeTab === 'completed' ? 'semiBold' : 'regular'}
                        color={activeTab === 'completed' ? colors.journeys.health.primary : colors.neutral.gray600}
                    >
                        {t('journeys.care.medications.status.completed')}
                    </Text>
                </Touchable>
            </View>

            {/* Medication List */}
            <FlatList
                data={filteredMedications}
                renderItem={renderMedicationItem}
                keyExtractor={keyExtractor}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
                testID="medication-list"
            />

            {/* Floating Action Button */}
            <Touchable
                onPress={handleAddPress}
                accessibilityLabel="Add new medication"
                accessibilityRole="button"
                testID="fab-add-medication"
                style={styles.fab}
            >
                <Text fontSize="2xl" color={colors.neutral.white} textAlign="center">
                    +
                </Text>
            </Touchable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.journeys.health.background,
    },
    header: {
        paddingHorizontal: spacingValues.md,
        paddingTop: spacingValues['3xl'],
        paddingBottom: spacingValues.sm,
    },
    searchContainer: {
        paddingHorizontal: spacingValues.md,
        paddingBottom: spacingValues.sm,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: spacingValues.md,
        marginBottom: spacingValues.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.gray300,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: spacingValues.sm,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: colors.journeys.health.primary,
    },
    listContent: {
        paddingHorizontal: spacingValues.md,
        paddingBottom: spacingValues['5xl'],
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardInfo: {
        flex: 1,
        marginRight: spacingValues.sm,
    },
    cardRight: {
        alignItems: 'flex-end',
    },
    adherenceIndicator: {
        marginTop: spacingValues['3xs'],
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacingValues['5xl'],
        gap: spacingValues.xs,
    },
    fab: {
        position: 'absolute',
        bottom: spacingValues.xl,
        right: spacingValues.md,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.journeys.health.primary,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: colors.neutral.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
});

export default MedicationList;
