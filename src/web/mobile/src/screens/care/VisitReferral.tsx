import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import { ROUTES } from '@constants/routes';

import type { CareStackParamList } from '../../navigation/types';

/**
 * Urgency level type for referrals.
 */
type UrgencyLevel = 'routine' | 'urgent' | 'emergent';

/**
 * Referral data structure.
 */
interface ReferralData {
    id: string;
    referringDoctor: {
        name: string;
        specialty: string;
        crm: string;
    };
    specialist: {
        name: string;
        specialty: string;
        clinic: string;
        address: string;
        phone: string;
    };
    reason: string;
    clinicalNotes: string;
    urgency: UrgencyLevel;
    validUntil: string;
    createdAt: string;
    diagnosis: string;
    icdCode: string;
}

/** Mock referral data. */
const MOCK_REFERRAL: ReferralData = {
    id: 'ref-001',
    referringDoctor: {
        name: 'Dr. Carlos Mendes',
        specialty: 'Clinica Geral',
        crm: 'CRM/SP 123456',
    },
    specialist: {
        name: 'Dra. Patricia Lima',
        specialty: 'Cardiologia',
        clinic: 'Instituto do Coracao - InCor',
        address: 'Av. Dr. Eneas de Carvalho Aguiar, 44 - Pinheiros',
        phone: '(11) 2661-5000',
    },
    reason:
        'Avaliacao cardiologica para investigacao de hipertensao arterial resistente ao tratamento. ' +
        'Paciente em uso de Losartana 50mg + Hidroclorotiazida 25mg sem controle adequado.',
    clinicalNotes:
        'PA em consultorio: 150/95 mmHg. MAPA solicitado previamente com media de 24h: 145/92 mmHg. ' +
        'ECG: ritmo sinusal, sem alteracoes. Ecocardiograma pendente.',
    urgency: 'urgent',
    validUntil: '23/03/2026',
    createdAt: '21/02/2026',
    diagnosis: 'Hipertensao Arterial Resistente',
    icdCode: 'I10',
};

/**
 * Returns a badge status color based on urgency level.
 */
const getUrgencyStatus = (urgency: UrgencyLevel): 'success' | 'warning' | 'error' => {
    if (urgency === 'routine') {
        return 'success';
    }
    if (urgency === 'urgent') {
        return 'warning';
    }
    return 'error';
};

/**
 * Returns the remaining validity days from a date string.
 */
const getRemainingDays = (validUntil: string): number => {
    const [day, month, year] = validUntil.split('/').map(Number);
    const expiryDate = new Date(year, month - 1, day);
    const today = new Date();
    const diffMs = expiryDate.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
};

/**
 * VisitReferral screen displays specialist referral details from a
 * consultation, including referring doctor info, specialist details,
 * reason for referral, urgency, and validity period.
 *
 * Part of the Care Now journey (orange theme).
 */
const VisitReferral: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<CareStackParamList>>();
    const route = useRoute<RouteProp<CareStackParamList, 'CareVisitReferral'>>();
    const { t } = useTranslation();

    const _appointmentId = route.params?.visitId ?? 'apt-001';
    const _referralId = 'ref-001';

    const referral = MOCK_REFERRAL;
    const remainingDays = getRemainingDays(referral.validUntil);

    const handleBookWithSpecialist = useCallback(() => {
        navigation.navigate(ROUTES.CARE_DOCTOR_SEARCH);
    }, [navigation]);

    const handleViewSpecialistProfile = useCallback(() => {
        navigation.navigate(ROUTES.CARE_DOCTOR_PROFILE, {
            doctorId: 'specialist-001',
        });
    }, [navigation]);

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    return (
        <View style={styles.root}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Title and urgency */}
                <View style={styles.titleRow}>
                    <Text variant="heading" journey="care" testID="referral-title">
                        {t('journeys.care.visit.referral.title')}
                    </Text>
                    <Badge
                        variant="status"
                        status={getUrgencyStatus(referral.urgency)}
                        size="md"
                        testID="urgency-badge"
                        accessibilityLabel={t('journeys.care.visit.referral.urgencyAccessibility', {
                            level: t(`journeys.care.visit.referral.urgencyLevel.${referral.urgency}`),
                        })}
                    >
                        {t(`journeys.care.visit.referral.urgencyLevel.${referral.urgency}`)}
                    </Badge>
                </View>

                {/* Validity warning */}
                <View style={[styles.validityBanner, remainingDays <= 7 && styles.validityBannerUrgent]}>
                    <Text
                        fontSize="text-sm"
                        fontWeight="medium"
                        color={remainingDays <= 7 ? colors.semantic.error : colors.journeys.care.text}
                        testID="validity-text"
                    >
                        {t('journeys.care.visit.referral.validUntil', {
                            date: referral.validUntil,
                            days: remainingDays,
                        })}
                    </Text>
                </View>

                {/* Referring doctor info */}
                <View style={styles.section}>
                    <Text variant="heading" fontSize="heading-md" journey="care" testID="referring-doctor-heading">
                        {t('journeys.care.visit.referral.referringDoctor')}
                    </Text>
                    <Card journey="care" elevation="sm">
                        <Text fontWeight="semiBold" fontSize="text-md" journey="care" testID="referring-doctor-name">
                            {referral.referringDoctor.name}
                        </Text>
                        <Text fontSize="text-sm" color={colors.neutral.gray600}>
                            {referral.referringDoctor.specialty}
                        </Text>
                        <Text fontSize="text-sm" color={colors.neutral.gray500}>
                            {referral.referringDoctor.crm}
                        </Text>
                    </Card>
                </View>

                {/* Specialist info card */}
                <View style={styles.section}>
                    <Text variant="heading" fontSize="heading-md" journey="care" testID="specialist-heading">
                        {t('journeys.care.visit.referral.specialist')}
                    </Text>
                    <Card journey="care" elevation="md">
                        <Text fontWeight="semiBold" fontSize="heading-md" journey="care" testID="specialist-name">
                            {referral.specialist.name}
                        </Text>
                        <Badge journey="care" size="sm" testID="specialist-specialty-badge">
                            {referral.specialist.specialty}
                        </Badge>
                        <View style={styles.specialistDetails}>
                            <View style={styles.detailRow}>
                                <Text fontSize="text-sm" color={colors.neutral.gray600}>
                                    {t('journeys.care.visit.referral.clinic')}
                                </Text>
                                <Text fontSize="text-sm" fontWeight="medium" testID="specialist-clinic">
                                    {referral.specialist.clinic}
                                </Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text fontSize="text-sm" color={colors.neutral.gray600}>
                                    {t('journeys.care.visit.referral.address')}
                                </Text>
                                <Text fontSize="text-sm" color={colors.neutral.gray700} testID="specialist-address">
                                    {referral.specialist.address}
                                </Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text fontSize="text-sm" color={colors.neutral.gray600}>
                                    {t('journeys.care.visit.referral.phone')}
                                </Text>
                                <Text fontSize="text-sm" fontWeight="medium" testID="specialist-phone">
                                    {referral.specialist.phone}
                                </Text>
                            </View>
                        </View>
                    </Card>
                </View>

                {/* Diagnosis info */}
                <View style={styles.section}>
                    <Text variant="heading" fontSize="heading-md" journey="care" testID="diagnosis-heading">
                        {t('journeys.care.visit.referral.diagnosis')}
                    </Text>
                    <Card journey="care" elevation="sm">
                        <View style={styles.diagnosisRow}>
                            <Text fontWeight="semiBold" fontSize="text-md" journey="care" testID="diagnosis-name">
                                {referral.diagnosis}
                            </Text>
                            <Text fontSize="text-sm" color={colors.neutral.gray500}>
                                ICD: {referral.icdCode}
                            </Text>
                        </View>
                    </Card>
                </View>

                {/* Referral reason */}
                <View style={styles.section}>
                    <Text variant="heading" fontSize="heading-md" journey="care" testID="reason-heading">
                        {t('journeys.care.visit.referral.reasonTitle')}
                    </Text>
                    <Card journey="care" elevation="sm">
                        <Text fontSize="text-sm" color={colors.neutral.gray700} testID="referral-reason">
                            {referral.reason}
                        </Text>
                    </Card>
                </View>

                {/* Clinical notes */}
                <View style={styles.section}>
                    <Text variant="heading" fontSize="heading-md" journey="care" testID="clinical-notes-heading">
                        {t('journeys.care.visit.referral.clinicalNotes')}
                    </Text>
                    <Card journey="care" elevation="sm">
                        <Text fontSize="text-sm" color={colors.neutral.gray700} testID="clinical-notes">
                            {referral.clinicalNotes}
                        </Text>
                    </Card>
                </View>

                {/* Action buttons */}
                <View style={styles.actionsSection}>
                    <Button
                        onPress={handleBookWithSpecialist}
                        journey="care"
                        accessibilityLabel={t('journeys.care.visit.referral.bookWithSpecialist')}
                        testID="book-specialist-button"
                    >
                        {t('journeys.care.visit.referral.bookWithSpecialist')}
                    </Button>

                    <Button
                        variant="secondary"
                        onPress={handleViewSpecialistProfile}
                        journey="care"
                        accessibilityLabel={t('journeys.care.visit.referral.viewSpecialistProfile')}
                        testID="view-specialist-profile-button"
                    >
                        {t('journeys.care.visit.referral.viewSpecialistProfile')}
                    </Button>

                    <TouchableOpacity
                        onPress={handleGoBack}
                        style={styles.backButton}
                        testID="back-button"
                        accessibilityLabel={t('journeys.care.visit.referral.goBack')}
                        accessibilityRole="button"
                    >
                        <Text fontSize="text-sm" fontWeight="medium" color={colors.neutral.gray600}>
                            {t('journeys.care.visit.referral.goBack')}
                        </Text>
                    </TouchableOpacity>
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
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    validityBanner: {
        marginTop: spacingValues.sm,
        padding: spacingValues.sm,
        backgroundColor: colors.neutral.gray100,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: colors.journeys.care.primary,
    },
    validityBannerUrgent: {
        backgroundColor: colors.semantic.errorBg,
        borderLeftColor: colors.semantic.error,
    },
    section: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
    specialistDetails: {
        marginTop: spacingValues.sm,
        gap: spacingValues.xs,
    },
    detailRow: {
        gap: spacingValues['3xs'],
    },
    diagnosisRow: {
        gap: spacingValues['3xs'],
    },
    actionsSection: {
        marginTop: spacingValues['2xl'],
        gap: spacingValues.sm,
    },
    backButton: {
        alignItems: 'center',
        paddingVertical: spacingValues.sm,
    },
});

export { VisitReferral };
export default VisitReferral;
