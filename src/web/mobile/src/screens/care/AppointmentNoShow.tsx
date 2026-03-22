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

const MOCK_NOSHOW = {
    doctorName: 'Dr. Ricardo Mendes',
    specialty: 'Dermatologia',
    date: '08 Mar 2026',
    time: '14:00',
};

export const AppointmentNoShow: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<CareStackParamList>>();
    const route = useRoute<RouteProp<CareStackParamList, 'CareAppointmentNoShow'>>();
    const { t } = useTranslation();
    const { appointmentId } = route.params ?? {};

    const handleReschedule = useCallback(() => {
        navigation.navigate(ROUTES.CARE_APPOINTMENT_RESCHEDULE, {
            appointmentId: appointmentId ?? '',
            doctorId: 'doc-002',
        });
    }, [navigation, appointmentId]);

    const handleContactSupport = useCallback(() => {
        navigation.navigate(ROUTES.CARE_DASHBOARD);
    }, [navigation]);

    const handleBackToAppointments = useCallback(() => {
        navigation.navigate(ROUTES.CARE_APPOINTMENTS_LIST);
    }, [navigation]);

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    testID="back-button"
                    accessibilityRole="button"
                    accessibilityLabel={t('common.back')}
                >
                    <Text fontSize="lg">{'<-'}</Text>
                </TouchableOpacity>
                <Text fontSize="lg" fontWeight="bold" color={colors.journeys.care.text}>
                    {t('consultation.noShow.title')}
                </Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                <View style={styles.iconContainer}>
                    <View style={styles.warningCircle}>
                        <Text fontSize="xl" fontWeight="bold" color={colors.neutral.white}>
                            !
                        </Text>
                    </View>
                    <Text fontSize="xl" fontWeight="bold" color={colors.journeys.care.text} textAlign="center">
                        {t('consultation.noShow.title')}
                    </Text>
                    <Text fontSize="sm" color={colors.neutral.gray500} textAlign="center">
                        {t('consultation.noShow.warning')}
                    </Text>
                </View>

                <Card journey="care" elevation="sm">
                    <Text fontSize="md" fontWeight="bold" color={colors.journeys.care.text}>
                        {MOCK_NOSHOW.doctorName}
                    </Text>
                    <Text fontSize="sm" color={colors.neutral.gray500}>
                        {MOCK_NOSHOW.specialty}
                    </Text>
                    <View style={styles.detailRow}>
                        <Text fontSize="sm" color={colors.neutral.gray700}>
                            {MOCK_NOSHOW.date} - {MOCK_NOSHOW.time}
                        </Text>
                    </View>
                </Card>

                <Card journey="care" elevation="sm">
                    <View style={styles.feeCard}>
                        <Text fontSize="md" fontWeight="bold" color={colors.journeys.care.text}>
                            {t('consultation.noShow.feeWarning')}
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color={colors.journeys.care.primary}>
                            {t('consultation.noShow.feeAmount')}
                        </Text>
                    </View>
                </Card>

                <View style={styles.policyBox}>
                    <Text fontSize="sm" color={colors.journeys.care.text}>
                        {t('consultation.noShow.policyInfo')}
                    </Text>
                </View>

                <View style={styles.actions}>
                    <Button
                        journey="care"
                        variant="primary"
                        onPress={handleReschedule}
                        accessibilityLabel={t('consultation.noShow.rescheduleNow')}
                        testID="reschedule-button"
                    >
                        {t('consultation.noShow.rescheduleNow')}
                    </Button>
                    <View style={styles.actionGap} />
                    <Button
                        journey="care"
                        variant="secondary"
                        onPress={handleContactSupport}
                        accessibilityLabel={t('consultation.noShow.contactSupport')}
                        testID="contact-support-button"
                    >
                        {t('consultation.noShow.contactSupport')}
                    </Button>
                    <View style={styles.actionGap} />
                    <Button
                        journey="care"
                        variant="tertiary"
                        onPress={handleBackToAppointments}
                        accessibilityLabel={t('consultation.noShow.backToAppointments')}
                        testID="back-to-appointments-button"
                    >
                        {t('consultation.noShow.backToAppointments')}
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.journeys.care.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacingValues.md,
        paddingTop: spacingValues.lg,
        paddingBottom: spacingValues.sm,
    },
    scroll: { flex: 1 },
    scrollContent: { padding: spacingValues.md, paddingBottom: spacingValues['3xl'], gap: spacingValues.md },
    iconContainer: {
        alignItems: 'center',
        paddingVertical: spacingValues.lg,
        gap: spacingValues.xs,
    },
    warningCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: colors.journeys.care.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailRow: { marginTop: spacingValues['3xs'] },
    feeCard: {
        alignItems: 'center',
        gap: spacingValues.xs,
        paddingVertical: spacingValues.xs,
    },
    policyBox: {
        backgroundColor: colors.journeys.care.primary + '15',
        borderRadius: spacingValues.xs,
        padding: spacingValues.sm,
        borderLeftWidth: 3,
        borderLeftColor: colors.journeys.care.primary,
    },
    actions: { marginTop: spacingValues.sm },
    actionGap: { height: spacingValues.sm },
});

export default AppointmentNoShow;
