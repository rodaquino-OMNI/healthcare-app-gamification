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
import { View, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';

import { ROUTES } from '@constants/routes';

import type { CareStackParamList } from '../../navigation/types';

/**
 * Prescription item from the visit.
 */
interface PrescriptionItem {
    id: string;
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    hasInteraction: boolean;
    interactionNote?: string;
    sentToPharmacy: boolean;
}

/** Mock prescription data. */
const MOCK_PRESCRIPTIONS: PrescriptionItem[] = [
    {
        id: 'rx-001',
        medicationName: 'Losartana Potassica',
        dosage: '50mg',
        frequency: '1x ao dia',
        duration: '30 dias',
        instructions: 'Tomar pela manha em jejum com um copo de agua.',
        hasInteraction: false,
        sentToPharmacy: false,
    },
    {
        id: 'rx-002',
        medicationName: 'Hidroclorotiazida',
        dosage: '25mg',
        frequency: '1x ao dia',
        duration: '30 dias',
        instructions: 'Tomar pela manha junto com a Losartana.',
        hasInteraction: true,
        interactionNote: 'Pode causar hipotensao quando combinado com Losartana. Monitorar pressao.',
        sentToPharmacy: false,
    },
    {
        id: 'rx-003',
        medicationName: 'Atorvastatina',
        dosage: '20mg',
        frequency: '1x ao dia',
        duration: '60 dias',
        instructions: 'Tomar a noite antes de dormir. Evitar consumo de grapefruit.',
        hasInteraction: false,
        sentToPharmacy: false,
    },
    {
        id: 'rx-004',
        medicationName: 'AAS (Acido Acetilsalicilico)',
        dosage: '100mg',
        frequency: '1x ao dia',
        duration: '30 dias',
        instructions: 'Tomar apos o almoco. Nao tomar em jejum.',
        hasInteraction: true,
        interactionNote: 'Risco aumentado de sangramento. Informar dentista antes de procedimentos.',
        sentToPharmacy: false,
    },
];

/**
 * VisitPrescriptions screen shows all prescriptions from a consultation,
 * with options to send to pharmacy individually or in bulk, and to add
 * medications to the user's medication tracking list.
 *
 * Part of the Care Now journey (orange theme).
 */
const VisitPrescriptions: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<CareStackParamList>>();
    const route = useRoute<RouteProp<CareStackParamList, 'CareVisitPrescriptions'>>();
    const { t } = useTranslation();

    const _appointmentId = route.params?.visitId ?? 'apt-001';

    const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>(MOCK_PRESCRIPTIONS);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const handleSendToPharmacy = useCallback(
        (rxId: string) => {
            setPrescriptions((prev) => prev.map((rx) => (rx.id === rxId ? { ...rx, sentToPharmacy: true } : rx)));
            Alert.alert(
                t('journeys.care.visit.prescriptions.sentTitle'),
                t('journeys.care.visit.prescriptions.sentMessage')
            );
        },
        [t]
    );

    const handleSendAllToPharmacy = useCallback(() => {
        setPrescriptions((prev) => prev.map((rx) => ({ ...rx, sentToPharmacy: true })));
        Alert.alert(
            t('journeys.care.visit.prescriptions.sentAllTitle'),
            t('journeys.care.visit.prescriptions.sentAllMessage')
        );
    }, [t]);

    const handleAddToMedications = useCallback(
        (_medicationName: string) => {
            navigation.navigate(ROUTES.CARE_MEDICATION_TRACKING);
        },
        [navigation]
    );

    const toggleExpand = useCallback((rxId: string) => {
        setExpandedId((prev) => (prev === rxId ? null : rxId));
    }, []);

    const allSent = prescriptions.every((rx) => rx.sentToPharmacy);
    const interactionCount = prescriptions.filter((rx) => rx.hasInteraction).length;

    const renderPrescriptionItem = useCallback(
        ({ item }: { item: PrescriptionItem }) => (
            <TouchableOpacity
                onPress={() => toggleExpand(item.id)}
                activeOpacity={0.7}
                testID={`prescription-item-${item.id}`}
                accessibilityLabel={t('journeys.care.visit.prescriptions.itemAccessibility', {
                    name: item.medicationName,
                })}
                accessibilityRole="button"
            >
                <Card journey="care" elevation="sm">
                    {/* Header row */}
                    <View style={styles.rxHeader}>
                        <View style={styles.rxNameRow}>
                            <Text fontWeight="semiBold" fontSize="text-md" journey="care">
                                {item.medicationName}
                            </Text>
                            {item.hasInteraction && (
                                <Badge
                                    variant="status"
                                    status="warning"
                                    size="sm"
                                    testID={`interaction-badge-${item.id}`}
                                >
                                    {t('journeys.care.visit.prescriptions.interaction')}
                                </Badge>
                            )}
                        </View>
                        <Text fontSize="text-sm" color={colors.neutral.gray600}>
                            {item.dosage} - {item.frequency}
                        </Text>
                    </View>

                    {/* Duration */}
                    <View style={styles.rxDetailRow}>
                        <Text fontSize="text-sm" color={colors.neutral.gray500}>
                            {t('journeys.care.visit.prescriptions.duration')}
                        </Text>
                        <Text fontSize="text-sm" fontWeight="medium">
                            {item.duration}
                        </Text>
                    </View>

                    {/* Expanded details */}
                    {expandedId === item.id && (
                        <View style={styles.expandedSection}>
                            {/* Instructions */}
                            <View style={styles.instructionsBox}>
                                <Text fontSize="text-sm" fontWeight="medium" color={colors.journeys.care.text}>
                                    {t('journeys.care.visit.prescriptions.instructions')}
                                </Text>
                                <Text fontSize="text-sm" color={colors.neutral.gray700}>
                                    {item.instructions}
                                </Text>
                            </View>

                            {/* Interaction warning */}
                            {item.hasInteraction && item.interactionNote && (
                                <View style={styles.warningBox}>
                                    <Text fontSize="text-sm" fontWeight="medium" color={colors.semantic.warning}>
                                        {t('journeys.care.visit.prescriptions.interactionWarning')}
                                    </Text>
                                    <Text fontSize="text-sm" color={colors.neutral.gray700}>
                                        {item.interactionNote}
                                    </Text>
                                </View>
                            )}

                            {/* Action buttons */}
                            <View style={styles.rxActions}>
                                {!item.sentToPharmacy ? (
                                    <Button
                                        variant="secondary"
                                        journey="care"
                                        onPress={() => handleSendToPharmacy(item.id)}
                                        accessibilityLabel={t('journeys.care.visit.prescriptions.sendToPharmacy')}
                                        testID={`send-pharmacy-${item.id}`}
                                    >
                                        {t('journeys.care.visit.prescriptions.sendToPharmacy')}
                                    </Button>
                                ) : (
                                    <Badge variant="status" status="success" size="md" testID={`sent-badge-${item.id}`}>
                                        {t('journeys.care.visit.prescriptions.sent')}
                                    </Badge>
                                )}
                                <TouchableOpacity
                                    onPress={() => handleAddToMedications(item.medicationName)}
                                    style={styles.addMedButton}
                                    testID={`add-medication-${item.id}`}
                                    accessibilityLabel={t('journeys.care.visit.prescriptions.addToMedications')}
                                    accessibilityRole="button"
                                >
                                    <Text fontSize="text-sm" fontWeight="medium" color={colors.journeys.care.primary}>
                                        {t('journeys.care.visit.prescriptions.addToMedications')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </Card>
            </TouchableOpacity>
        ),
        [expandedId, handleSendToPharmacy, handleAddToMedications, toggleExpand, t]
    );

    return (
        <View style={styles.root}>
            {/* Header summary */}
            <View style={styles.headerSection}>
                <Text variant="heading" journey="care" testID="prescriptions-title">
                    {t('journeys.care.visit.prescriptions.title')}
                </Text>
                <View style={styles.summaryRow}>
                    <Text fontSize="text-sm" color={colors.neutral.gray600}>
                        {t('journeys.care.visit.prescriptions.totalCount', {
                            count: prescriptions.length,
                        })}
                    </Text>
                    {interactionCount > 0 && (
                        <Badge variant="status" status="warning" size="sm" testID="interaction-count-badge">
                            {t('journeys.care.visit.prescriptions.interactionCount', {
                                count: interactionCount,
                            })}
                        </Badge>
                    )}
                </View>
            </View>

            {/* Prescription list */}
            <FlatList
                data={prescriptions}
                renderItem={renderPrescriptionItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                testID="prescriptions-list"
            />

            {/* Bottom actions */}
            <View style={styles.bottomActions}>
                {!allSent && (
                    <Button
                        onPress={handleSendAllToPharmacy}
                        journey="care"
                        accessibilityLabel={t('journeys.care.visit.prescriptions.sendAllToPharmacy')}
                        testID="send-all-pharmacy-button"
                    >
                        {t('journeys.care.visit.prescriptions.sendAllToPharmacy')}
                    </Button>
                )}
                {allSent && (
                    <Badge variant="status" status="success" size="md" testID="all-sent-badge">
                        {t('journeys.care.visit.prescriptions.allSent')}
                    </Badge>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.journeys.care.background,
    },
    headerSection: {
        padding: spacingValues.md,
        gap: spacingValues.xs,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: spacingValues.md,
        paddingBottom: spacingValues['4xl'],
    },
    separator: {
        height: spacingValues.sm,
    },
    rxHeader: {
        gap: spacingValues['3xs'],
        marginBottom: spacingValues.xs,
    },
    rxNameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rxDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    expandedSection: {
        marginTop: spacingValues.sm,
        paddingTop: spacingValues.sm,
        borderTopWidth: 1,
        borderTopColor: colors.neutral.gray300,
        gap: spacingValues.sm,
    },
    instructionsBox: {
        backgroundColor: colors.neutral.gray100,
        padding: spacingValues.sm,
        borderRadius: 8,
        gap: spacingValues['3xs'],
    },
    warningBox: {
        backgroundColor: colors.semantic.warningBg,
        padding: spacingValues.sm,
        borderRadius: 8,
        gap: spacingValues['3xs'],
        borderLeftWidth: 3,
        borderLeftColor: colors.semantic.warning,
    },
    rxActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addMedButton: {
        paddingVertical: spacingValues.xs,
        paddingHorizontal: spacingValues.sm,
    },
    bottomActions: {
        padding: spacingValues.md,
        borderTopWidth: 1,
        borderTopColor: colors.neutral.gray300,
        backgroundColor: colors.journeys.care.background,
        alignItems: 'center',
    },
});

export { VisitPrescriptions };
export default VisitPrescriptions;
