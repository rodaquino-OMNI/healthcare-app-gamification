import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import { ROUTES } from '@constants/routes';

import type { CareStackParamList } from '../../navigation/types';

/**
 * Lab test item ordered by the doctor.
 */
interface LabTestItem {
    id: string;
    testName: string;
    urgency: 'routine' | 'urgent' | 'stat';
    preparationInstructions: string;
    fastingRequired: boolean;
    fastingHours?: number;
    sampleType: string;
}

/**
 * Nearby lab location.
 */
interface LabLocation {
    id: string;
    name: string;
    address: string;
    distance: string;
    openHours: string;
    rating: number;
}

/** Mock lab test data. */
const MOCK_LAB_TESTS: LabTestItem[] = [
    {
        id: 'lab-001',
        testName: 'Hemograma Completo',
        urgency: 'routine',
        preparationInstructions: 'Nao necessita preparo especial. Pode ser realizado a qualquer horario.',
        fastingRequired: false,
        sampleType: 'Sangue',
    },
    {
        id: 'lab-002',
        testName: 'Perfil Lipidico Completo',
        urgency: 'routine',
        preparationInstructions: 'Jejum de 12 horas obrigatorio. Evitar alcool 72h antes.',
        fastingRequired: true,
        fastingHours: 12,
        sampleType: 'Sangue',
    },
    {
        id: 'lab-003',
        testName: 'Glicemia de Jejum',
        urgency: 'urgent',
        preparationInstructions: 'Jejum de 8 horas obrigatorio. Colher preferencialmente pela manha.',
        fastingRequired: true,
        fastingHours: 8,
        sampleType: 'Sangue',
    },
    {
        id: 'lab-004',
        testName: 'Creatinina Serica',
        urgency: 'routine',
        preparationInstructions: 'Evitar exercicio fisico intenso 24h antes. Manter hidratacao normal.',
        fastingRequired: false,
        sampleType: 'Sangue',
    },
    {
        id: 'lab-005',
        testName: 'TSH e T4 Livre',
        urgency: 'routine',
        preparationInstructions: 'Colher pela manha. Informar medicamentos em uso ao laboratorio.',
        fastingRequired: false,
        sampleType: 'Sangue',
    },
];

/** Mock nearby labs. */
const MOCK_LABS: LabLocation[] = [
    {
        id: 'loc-001',
        name: 'Laboratorio Fleury',
        address: 'Av. Paulista, 1500 - Bela Vista',
        distance: '0.8 km',
        openHours: '06:00 - 18:00',
        rating: 4.8,
    },
    {
        id: 'loc-002',
        name: 'DASA Diagnosticos',
        address: 'R. Augusta, 2200 - Jardins',
        distance: '1.2 km',
        openHours: '07:00 - 17:00',
        rating: 4.6,
    },
    {
        id: 'loc-003',
        name: 'Laboratorio Hermes Pardini',
        address: 'R. Haddock Lobo, 400 - Cerqueira Cesar',
        distance: '2.1 km',
        openHours: '06:30 - 16:00',
        rating: 4.7,
    },
];

/**
 * Returns badge status based on lab urgency level.
 */
const getUrgencyStatus = (urgency: 'routine' | 'urgent' | 'stat'): 'success' | 'warning' | 'error' => {
    if (urgency === 'routine') {
        return 'success';
    }
    if (urgency === 'urgent') {
        return 'warning';
    }
    return 'error';
};

/**
 * VisitLabOrders screen displays lab tests ordered from a consultation,
 * with preparation instructions, fasting requirements, and nearby lab
 * locations for scheduling.
 *
 * Part of the Care Now journey (orange theme).
 */
const VisitLabOrders: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<CareStackParamList>>();
    const route = useRoute<RouteProp<CareStackParamList, 'CareVisitLabOrders'>>();
    const { t } = useTranslation();

    const _appointmentId = route.params?.visitId ?? 'apt-001';

    const [expandedTest, setExpandedTest] = useState<string | null>(null);

    const toggleTest = useCallback((testId: string) => {
        setExpandedTest((prev) => (prev === testId ? null : testId));
    }, []);

    const handleScheduleLabVisit = useCallback(() => {
        navigation.navigate(ROUTES.CARE_BOOKING_SCHEDULE, { doctorId: 'doctor-001' });
    }, [navigation]);

    const handleViewAllLabs = useCallback(() => {
        navigation.navigate(ROUTES.CARE_MEDICAL_RECORDS);
    }, [navigation]);

    const fastingTests = MOCK_LAB_TESTS.filter((test) => test.fastingRequired);
    const maxFastingHours = Math.max(...fastingTests.map((test) => test.fastingHours || 0), 0);

    const renderLabTest = useCallback(
        ({ item }: { item: LabTestItem }) => {
            const isExpanded = expandedTest === item.id;
            return (
                <TouchableOpacity
                    onPress={() => toggleTest(item.id)}
                    activeOpacity={0.7}
                    testID={`lab-test-${item.id}`}
                    accessibilityLabel={t('journeys.care.visit.labOrders.testAccessibility', {
                        name: item.testName,
                    })}
                    accessibilityRole="button"
                >
                    <Card journey="care" elevation="sm">
                        {/* Test header */}
                        <View style={styles.testHeader}>
                            <View style={styles.testNameRow}>
                                <Text
                                    fontWeight="semiBold"
                                    fontSize="text-md"
                                    journey="care"
                                    style={styles.testNameText}
                                >
                                    {item.testName}
                                </Text>
                                <Badge
                                    variant="status"
                                    status={getUrgencyStatus(item.urgency)}
                                    size="sm"
                                    testID={`urgency-badge-${item.id}`}
                                >
                                    {t(`journeys.care.visit.labOrders.urgency.${item.urgency}`)}
                                </Badge>
                            </View>

                            {/* Quick info */}
                            <View style={styles.quickInfoRow}>
                                <Text fontSize="text-sm" color={colors.neutral.gray600}>
                                    {item.sampleType}
                                </Text>
                                {item.fastingRequired && (
                                    <Badge
                                        variant="status"
                                        status="warning"
                                        size="sm"
                                        testID={`fasting-badge-${item.id}`}
                                    >
                                        {t('journeys.care.visit.labOrders.fastingRequired', {
                                            hours: item.fastingHours,
                                        })}
                                    </Badge>
                                )}
                            </View>
                        </View>

                        {/* Expanded details */}
                        {isExpanded && (
                            <View style={styles.expandedSection}>
                                <View style={styles.instructionsBox}>
                                    <Text fontSize="text-sm" fontWeight="medium" color={colors.journeys.care.text}>
                                        {t('journeys.care.visit.labOrders.preparation')}
                                    </Text>
                                    <Text fontSize="text-sm" color={colors.neutral.gray700}>
                                        {item.preparationInstructions}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </Card>
                </TouchableOpacity>
            );
        },
        [expandedTest, toggleTest, t]
    );

    return (
        <View style={styles.root}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Title */}
                <Text variant="heading" journey="care" testID="lab-orders-title">
                    {t('journeys.care.visit.labOrders.title')}
                </Text>

                {/* Summary */}
                <View style={styles.summaryRow}>
                    <Text fontSize="text-sm" color={colors.neutral.gray600}>
                        {t('journeys.care.visit.labOrders.totalTests', {
                            count: MOCK_LAB_TESTS.length,
                        })}
                    </Text>
                    {maxFastingHours > 0 && (
                        <Badge variant="status" status="warning" size="sm" testID="max-fasting-badge">
                            {t('journeys.care.visit.labOrders.maxFasting', {
                                hours: maxFastingHours,
                            })}
                        </Badge>
                    )}
                </View>

                {/* Lab tests list */}
                <View style={styles.testsList}>
                    {MOCK_LAB_TESTS.map((test) => (
                        <View key={test.id}>{renderLabTest({ item: test })}</View>
                    ))}
                </View>

                {/* Preparation instructions card */}
                {fastingTests.length > 0 && (
                    <View style={styles.section}>
                        <Text variant="heading" fontSize="heading-md" journey="care" testID="prep-instructions-heading">
                            {t('journeys.care.visit.labOrders.prepInstructionsTitle')}
                        </Text>
                        <Card journey="care" elevation="sm">
                            <View style={styles.prepNote}>
                                <Text fontSize="text-sm" fontWeight="medium" color={colors.semantic.warning}>
                                    {t('journeys.care.visit.labOrders.fastingNote')}
                                </Text>
                                <Text fontSize="text-sm" color={colors.neutral.gray700}>
                                    {t('journeys.care.visit.labOrders.fastingInstructions', {
                                        hours: maxFastingHours,
                                    })}
                                </Text>
                            </View>
                            <View style={styles.prepTipsList}>
                                <Text fontSize="text-sm" color={colors.neutral.gray700}>
                                    {t('journeys.care.visit.labOrders.prepTip1')}
                                </Text>
                                <Text fontSize="text-sm" color={colors.neutral.gray700}>
                                    {t('journeys.care.visit.labOrders.prepTip2')}
                                </Text>
                                <Text fontSize="text-sm" color={colors.neutral.gray700}>
                                    {t('journeys.care.visit.labOrders.prepTip3')}
                                </Text>
                            </View>
                        </Card>
                    </View>
                )}

                {/* Nearby labs section */}
                <View style={styles.section}>
                    <Text variant="heading" fontSize="heading-md" journey="care" testID="nearby-labs-heading">
                        {t('journeys.care.visit.labOrders.nearbyLabs')}
                    </Text>
                    {MOCK_LABS.map((lab) => (
                        <TouchableOpacity
                            key={lab.id}
                            activeOpacity={0.7}
                            testID={`lab-location-${lab.id}`}
                            accessibilityLabel={t('journeys.care.visit.labOrders.labAccessibility', {
                                name: lab.name,
                                distance: lab.distance,
                            })}
                            accessibilityRole="button"
                        >
                            <Card journey="care" elevation="sm">
                                <View style={styles.labHeader}>
                                    <Text fontWeight="semiBold" fontSize="text-md" journey="care">
                                        {lab.name}
                                    </Text>
                                    <Badge journey="care" size="sm" testID={`lab-distance-${lab.id}`}>
                                        {lab.distance}
                                    </Badge>
                                </View>
                                <Text fontSize="text-sm" color={colors.neutral.gray600}>
                                    {lab.address}
                                </Text>
                                <View style={styles.labDetailsRow}>
                                    <Text fontSize="text-sm" color={colors.neutral.gray500}>
                                        {lab.openHours}
                                    </Text>
                                    <Text fontSize="text-sm" color={colors.journeys.care.primary}>
                                        {lab.rating}
                                    </Text>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Action buttons */}
                <View style={styles.actionsSection}>
                    <Button
                        onPress={handleScheduleLabVisit}
                        journey="care"
                        accessibilityLabel={t('journeys.care.visit.labOrders.scheduleLabVisit')}
                        testID="schedule-lab-button"
                    >
                        {t('journeys.care.visit.labOrders.scheduleLabVisit')}
                    </Button>

                    <Button
                        variant="secondary"
                        onPress={handleViewAllLabs}
                        journey="care"
                        accessibilityLabel={t('journeys.care.visit.labOrders.viewAllLabs')}
                        testID="view-all-labs-button"
                    >
                        {t('journeys.care.visit.labOrders.viewAllLabs')}
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.journeys.care.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacingValues.md,
        paddingBottom: spacingValues['3xl'],
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacingValues.xs,
        marginBottom: spacingValues.md,
    },
    testsList: {
        gap: spacingValues.sm,
    },
    testHeader: {
        gap: spacingValues['3xs'],
    },
    testNameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    testNameText: {
        flex: 1,
        marginRight: spacingValues.xs,
    },
    quickInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    expandedSection: {
        marginTop: spacingValues.sm,
        paddingTop: spacingValues.sm,
        borderTopWidth: 1,
        borderTopColor: colors.neutral.gray300,
    },
    instructionsBox: {
        backgroundColor: colors.neutral.gray100,
        padding: spacingValues.sm,
        borderRadius: 8,
        gap: spacingValues['3xs'],
    },
    section: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
    prepNote: {
        gap: spacingValues['3xs'],
        marginBottom: spacingValues.sm,
    },
    prepTipsList: {
        gap: spacingValues.xs,
        paddingLeft: spacingValues.sm,
    },
    labHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacingValues['3xs'],
    },
    labDetailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacingValues['3xs'],
    },
    actionsSection: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
});

export { VisitLabOrders };
export default VisitLabOrders;
