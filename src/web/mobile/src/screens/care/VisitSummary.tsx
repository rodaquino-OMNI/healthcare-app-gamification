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
import { View, StyleSheet, ScrollView, TouchableOpacity, Share, Alert } from 'react-native';

import { ROUTES } from '@constants/routes';

import type { CareStackParamList } from '../../navigation/types';

/**
 * Diagnosis entry from the consultation.
 */
interface DiagnosisEntry {
    id: string;
    condition: string;
    icdCode: string;
    severity: 'mild' | 'moderate' | 'severe';
    notes: string;
}

/**
 * Recommendation item from the doctor.
 */
interface Recommendation {
    id: string;
    text: string;
    priority: 'high' | 'medium' | 'low';
}

/** Mock diagnosis data. */
const MOCK_DIAGNOSES: DiagnosisEntry[] = [
    {
        id: 'diag-001',
        condition: 'Hipertensao Arterial Sistemica',
        icdCode: 'I10',
        severity: 'moderate',
        notes: 'Pressao arterial elevada em consulta: 150/95 mmHg. Historico familiar positivo.',
    },
    {
        id: 'diag-002',
        condition: 'Dislipidemia',
        icdCode: 'E78.5',
        severity: 'mild',
        notes: 'Colesterol total acima do recomendado. LDL elevado.',
    },
];

/** Mock clinical notes. */
const MOCK_CLINICAL_NOTES =
    'Paciente apresenta quadro de hipertensao em acompanhamento. Ajustado medicamento anti-hipertensivo. ' +
    'Solicitados exames laboratoriais para controle lipidico. Orientado sobre dieta hipossodica e ' +
    'pratica regular de atividade fisica. Retorno em 30 dias para reavaliacao.';

/** Mock recommendations. */
const MOCK_RECOMMENDATIONS: Recommendation[] = [
    { id: 'rec-001', text: 'Reduzir consumo de sal para menos de 5g/dia', priority: 'high' },
    { id: 'rec-002', text: 'Atividade fisica aerobica 30min, 5x por semana', priority: 'high' },
    { id: 'rec-003', text: 'Monitorar pressao arterial diariamente', priority: 'high' },
    { id: 'rec-004', text: 'Manter dieta rica em frutas e verduras', priority: 'medium' },
    { id: 'rec-005', text: 'Retorno para consulta em 30 dias', priority: 'medium' },
    { id: 'rec-006', text: 'Evitar consumo de alcool e tabaco', priority: 'low' },
];

/**
 * Returns a badge status color based on diagnosis severity.
 */
const getSeverityStatus = (severity: 'mild' | 'moderate' | 'severe'): 'success' | 'warning' | 'error' => {
    if (severity === 'mild') {
        return 'success';
    }
    if (severity === 'moderate') {
        return 'warning';
    }
    return 'error';
};

/**
 * Returns a priority color token for recommendation indicators.
 */
const getPriorityColor = (priority: 'high' | 'medium' | 'low'): string => {
    if (priority === 'high') {
        return colors.semantic.error;
    }
    if (priority === 'medium') {
        return colors.semantic.warning;
    }
    return colors.semantic.success;
};

/**
 * VisitSummary screen displays a comprehensive summary after a consultation,
 * including doctor info, diagnoses, clinical notes, recommendations,
 * and action buttons for prescriptions, follow-up, and lab orders.
 *
 * Part of the Care Now journey (orange theme).
 */
const VisitSummary: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<CareStackParamList>>();
    const route = useRoute<RouteProp<CareStackParamList, 'CareVisitSummary'>>();
    const { t } = useTranslation();

    const appointmentId = route.params?.visitId ?? 'apt-001';
    const doctorName = 'Dr. Carlos Mendes';

    const [expandedDiagnosis, setExpandedDiagnosis] = useState<string | null>(null);

    const handleViewPrescriptions = useCallback(() => {
        navigation.navigate(ROUTES.CARE_VISIT_PRESCRIPTIONS, { appointmentId });
    }, [navigation, appointmentId]);

    const handleScheduleFollowUp = useCallback(() => {
        navigation.navigate(ROUTES.CARE_VISIT_FOLLOW_UP, { appointmentId, doctorName });
    }, [navigation, appointmentId, doctorName]);

    const handleViewLabOrders = useCallback(() => {
        navigation.navigate(ROUTES.CARE_VISIT_LAB_ORDERS, { appointmentId });
    }, [navigation, appointmentId]);

    const handleShareSummary = useCallback(async () => {
        try {
            await Share.share({
                message: t('journeys.care.visit.summary.shareMessage', {
                    doctor: doctorName,
                    date: '21/02/2026',
                }),
            });
        } catch {
            Alert.alert(
                t('journeys.care.visit.summary.shareErrorTitle'),
                t('journeys.care.visit.summary.shareErrorMessage')
            );
        }
    }, [t, doctorName]);

    const toggleDiagnosis = useCallback((diagId: string) => {
        setExpandedDiagnosis((prev) => (prev === diagId ? null : diagId));
    }, []);

    return (
        <View style={styles.root}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Screen title */}
                <Text variant="heading" journey="care" testID="visit-summary-title">
                    {t('journeys.care.visit.summary.title')}
                </Text>

                {/* Doctor info card */}
                <Card journey="care" elevation="md">
                    <View style={styles.doctorRow}>
                        <View style={styles.doctorInfo}>
                            <Text fontWeight="semiBold" fontSize="heading-md" journey="care" testID="doctor-name">
                                {doctorName}
                            </Text>
                            <Text fontSize="text-sm" color={colors.neutral.gray600}>
                                {t('journeys.care.visit.summary.specialty')}
                            </Text>
                        </View>
                        <Badge journey="care" size="sm" testID="visit-type-badge">
                            {t('journeys.care.visit.summary.presential')}
                        </Badge>
                    </View>
                    <View style={styles.dateRow}>
                        <Text fontSize="text-sm" color={colors.neutral.gray600}>
                            {t('journeys.care.visit.summary.date')}
                        </Text>
                        <Text fontSize="text-sm" fontWeight="medium" testID="visit-date">
                            21/02/2026 - 14:30
                        </Text>
                    </View>
                    <View style={styles.dateRow}>
                        <Text fontSize="text-sm" color={colors.neutral.gray600}>
                            {t('journeys.care.visit.summary.appointmentId')}
                        </Text>
                        <Text fontSize="text-sm" fontWeight="medium" testID="appointment-id">
                            {appointmentId}
                        </Text>
                    </View>
                </Card>

                {/* Diagnoses section */}
                <View style={styles.section}>
                    <Text variant="heading" fontSize="heading-md" journey="care" testID="diagnosis-heading">
                        {t('journeys.care.visit.summary.diagnosisTitle')}
                    </Text>
                    {MOCK_DIAGNOSES.map((diag) => (
                        <TouchableOpacity
                            key={diag.id}
                            onPress={() => toggleDiagnosis(diag.id)}
                            activeOpacity={0.7}
                            testID={`diagnosis-item-${diag.id}`}
                            accessibilityLabel={t('journeys.care.visit.summary.diagnosisAccessibility', {
                                condition: diag.condition,
                            })}
                            accessibilityRole="button"
                        >
                            <Card journey="care" elevation="sm">
                                <View style={styles.diagnosisHeader}>
                                    <View style={styles.diagnosisTitle}>
                                        <Text fontWeight="semiBold" fontSize="text-md" journey="care">
                                            {diag.condition}
                                        </Text>
                                        <Badge
                                            variant="status"
                                            status={getSeverityStatus(diag.severity)}
                                            size="sm"
                                            testID={`severity-badge-${diag.id}`}
                                        >
                                            {t(`journeys.care.visit.summary.severity.${diag.severity}`)}
                                        </Badge>
                                    </View>
                                    <Text fontSize="text-sm" color={colors.neutral.gray500}>
                                        ICD: {diag.icdCode}
                                    </Text>
                                </View>
                                {expandedDiagnosis === diag.id && (
                                    <View style={styles.diagnosisNotes}>
                                        <Text fontSize="text-sm" color={colors.neutral.gray700}>
                                            {diag.notes}
                                        </Text>
                                    </View>
                                )}
                            </Card>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Clinical notes section */}
                <View style={styles.section}>
                    <Text variant="heading" fontSize="heading-md" journey="care" testID="notes-heading">
                        {t('journeys.care.visit.summary.clinicalNotesTitle')}
                    </Text>
                    <Card journey="care" elevation="sm">
                        <Text fontSize="text-sm" color={colors.neutral.gray700} testID="clinical-notes">
                            {MOCK_CLINICAL_NOTES}
                        </Text>
                    </Card>
                </View>

                {/* Recommendations section */}
                <View style={styles.section}>
                    <Text variant="heading" fontSize="heading-md" journey="care" testID="recommendations-heading">
                        {t('journeys.care.visit.summary.recommendationsTitle')}
                    </Text>
                    <Card journey="care" elevation="sm">
                        {MOCK_RECOMMENDATIONS.map((rec) => (
                            <View key={rec.id} style={styles.recommendationRow}>
                                <View
                                    style={[styles.priorityDot, { backgroundColor: getPriorityColor(rec.priority) }]}
                                />
                                <Text
                                    fontSize="text-sm"
                                    color={colors.neutral.gray700}
                                    testID={`recommendation-${rec.id}`}
                                >
                                    {rec.text}
                                </Text>
                            </View>
                        ))}
                    </Card>
                </View>

                {/* Action buttons */}
                <View style={styles.actionsSection}>
                    <Button
                        onPress={handleViewPrescriptions}
                        journey="care"
                        accessibilityLabel={t('journeys.care.visit.summary.viewPrescriptions')}
                        testID="view-prescriptions-button"
                    >
                        {t('journeys.care.visit.summary.viewPrescriptions')}
                    </Button>

                    <Button
                        variant="secondary"
                        onPress={handleScheduleFollowUp}
                        journey="care"
                        accessibilityLabel={t('journeys.care.visit.summary.scheduleFollowUp')}
                        testID="schedule-follow-up-button"
                    >
                        {t('journeys.care.visit.summary.scheduleFollowUp')}
                    </Button>

                    <Button
                        variant="secondary"
                        onPress={handleViewLabOrders}
                        journey="care"
                        accessibilityLabel={t('journeys.care.visit.summary.viewLabOrders')}
                        testID="view-lab-orders-button"
                    >
                        {t('journeys.care.visit.summary.viewLabOrders')}
                    </Button>
                </View>

                {/* Share / Download */}
                <View style={styles.shareSection}>
                    <TouchableOpacity
                        onPress={handleShareSummary}
                        style={styles.shareButton}
                        testID="share-summary-button"
                        accessibilityLabel={t('journeys.care.visit.summary.shareSummary')}
                        accessibilityRole="button"
                    >
                        <Text fontSize="text-sm" fontWeight="medium" color={colors.journeys.care.primary}>
                            {t('journeys.care.visit.summary.shareSummary')}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Disclaimer */}
                <Text variant="caption" color={colors.neutral.gray500} testID="visit-summary-disclaimer">
                    {t('journeys.care.visit.summary.disclaimer')}
                </Text>
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
    doctorRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacingValues.sm,
    },
    doctorInfo: {
        flex: 1,
        gap: spacingValues['3xs'],
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacingValues['3xs'],
        borderTopWidth: 1,
        borderTopColor: colors.neutral.gray300,
    },
    section: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
    diagnosisHeader: {
        gap: spacingValues['3xs'],
    },
    diagnosisTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    diagnosisNotes: {
        marginTop: spacingValues.sm,
        paddingTop: spacingValues.sm,
        borderTopWidth: 1,
        borderTopColor: colors.neutral.gray300,
    },
    recommendationRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacingValues.xs,
        paddingVertical: spacingValues['3xs'],
    },
    priorityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 6,
    },
    actionsSection: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
    shareSection: {
        marginTop: spacingValues.lg,
        alignItems: 'center',
    },
    shareButton: {
        paddingVertical: spacingValues.sm,
        paddingHorizontal: spacingValues.xl,
    },
});

export { VisitSummary };
export default VisitSummary;
