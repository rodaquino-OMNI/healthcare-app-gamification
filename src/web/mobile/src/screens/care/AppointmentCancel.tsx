import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';

import { ROUTES } from '@constants/routes';

interface RouteParams {
    appointmentId: string;
}

const MOCK_APPOINTMENT = {
    doctorName: 'Dra. Ana Carolina Silva',
    specialty: 'Cardiologia',
    date: '05 Mar 2026',
    time: '09:00',
    type: 'in-person',
};

const REASON_KEYS = [
    'consultation.cancel.scheduleConflict',
    'consultation.cancel.anotherDoctor',
    'consultation.cancel.feelingBetter',
    'consultation.cancel.financial',
    'consultation.cancel.other',
];

export const AppointmentCancel: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { t } = useTranslation();
    const { appointmentId } = route.params as RouteParams;

    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [details, setDetails] = useState('');
    const [policyAccepted, setPolicyAccepted] = useState(false);

    const canCancel = selectedReason !== null && policyAccepted;

    const handleCancel = useCallback(() => {
        Alert.alert(t('consultation.cancel.title'), t('consultation.cancel.cancelAppointment'), [
            { text: t('consultation.cancel.keepAppointment'), style: 'cancel' },
            {
                text: t('consultation.cancel.cancelAppointment'),
                style: 'destructive',
                onPress: () => {
                    navigation.navigate(ROUTES.CARE_APPOINTMENT_CANCELLED, {
                        appointmentId,
                        refundAmount: 'R$ 350,00',
                    });
                },
            },
        ]);
    }, [navigation, appointmentId, t]);

    const handleKeep = useCallback(() => {
        navigation.goBack();
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
                    {t('consultation.cancel.title')}
                </Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                <Card journey="care" elevation="sm">
                    <Text fontSize="md" fontWeight="bold" color={colors.journeys.care.text}>
                        {MOCK_APPOINTMENT.doctorName}
                    </Text>
                    <Badge journey="care" size="sm">
                        {MOCK_APPOINTMENT.specialty}
                    </Badge>
                    <View style={styles.detailRow}>
                        <Text fontSize="sm" color={colors.neutral.gray700}>
                            {MOCK_APPOINTMENT.date} - {MOCK_APPOINTMENT.time}
                        </Text>
                    </View>
                    <Badge journey="care" size="sm">
                        {MOCK_APPOINTMENT.type === 'telemedicine'
                            ? t('consultation.appointmentsList.telemedicine')
                            : t('consultation.appointmentsList.inPerson')}
                    </Badge>
                </Card>

                <Card journey="care" elevation="sm">
                    <View style={styles.warningCard}>
                        <Text fontSize="md" fontWeight="bold" color={colors.journeys.care.text}>
                            {t('consultation.cancel.policy')}
                        </Text>
                        <View style={styles.policyItem}>
                            <Badge variant="status" status="success" size="sm">
                                24h+
                            </Badge>
                            <Text fontSize="sm" color={colors.journeys.care.text}>
                                {t('consultation.cancel.fullRefund')}
                            </Text>
                        </View>
                        <View style={styles.policyItem}>
                            <Badge variant="status" status="warning" size="sm">
                                12-24h
                            </Badge>
                            <Text fontSize="sm" color={colors.journeys.care.text}>
                                {t('consultation.cancel.halfRefund')}
                            </Text>
                        </View>
                        <View style={styles.policyItem}>
                            <Badge variant="status" status="error" size="sm">
                                {'<12h'}
                            </Badge>
                            <Text fontSize="sm" color={colors.journeys.care.text}>
                                {t('consultation.cancel.noRefund')}
                            </Text>
                        </View>
                    </View>
                </Card>

                <Text fontSize="md" fontWeight="bold" color={colors.journeys.care.text} style={styles.sectionTitle}>
                    {t('consultation.cancel.reason')}
                </Text>
                {REASON_KEYS.map((key) => {
                    const isSelected = selectedReason === key;
                    return (
                        <TouchableOpacity
                            key={key}
                            style={[styles.reasonOption, isSelected && styles.reasonOptionSelected]}
                            onPress={() => setSelectedReason(key)}
                            accessibilityLabel={t(key)}
                            accessibilityRole="radio"
                            accessibilityState={{ checked: isSelected }}
                            testID={`reason-${key}`}
                        >
                            <View style={[styles.radio, isSelected && styles.radioSelected]} />
                            <Text
                                fontSize="sm"
                                color={isSelected ? colors.journeys.care.primary : colors.journeys.care.text}
                            >
                                {t(key)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}

                <TextInput
                    style={styles.detailsInput}
                    value={details}
                    onChangeText={setDetails}
                    placeholder={t('consultation.cancel.details')}
                    placeholderTextColor={colors.neutral.gray500}
                    multiline
                    numberOfLines={3}
                    accessibilityLabel={t('consultation.cancel.details')}
                    testID="details-input"
                />

                <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => setPolicyAccepted(!policyAccepted)}
                    accessibilityLabel={t('consultation.cancel.understand')}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: policyAccepted }}
                    testID="policy-checkbox"
                >
                    <View style={[styles.checkbox, policyAccepted && styles.checkboxChecked]}>
                        {policyAccepted && (
                            <Text fontSize="sm" color={colors.neutral.white}>
                                {'V'}
                            </Text>
                        )}
                    </View>
                    <Text fontSize="sm" color={colors.journeys.care.text} style={styles.checkboxLabel}>
                        {t('consultation.cancel.understand')}
                    </Text>
                </TouchableOpacity>

                <View style={styles.actions}>
                    <Button
                        journey="care"
                        variant="primary"
                        onPress={handleCancel}
                        disabled={!canCancel}
                        accessibilityLabel={t('consultation.cancel.cancelAppointment')}
                        testID="cancel-appointment-button"
                    >
                        {t('consultation.cancel.cancelAppointment')}
                    </Button>
                    <View style={styles.actionGap} />
                    <Button
                        journey="care"
                        variant="secondary"
                        onPress={handleKeep}
                        accessibilityLabel={t('consultation.cancel.keepAppointment')}
                        testID="keep-appointment-button"
                    >
                        {t('consultation.cancel.keepAppointment')}
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
    scrollContent: { padding: spacingValues.md, paddingBottom: spacingValues['3xl'], gap: spacingValues.sm },
    detailRow: { marginTop: spacingValues['3xs'] },
    warningCard: { gap: spacingValues.xs },
    policyItem: { flexDirection: 'row', alignItems: 'center', gap: spacingValues.xs },
    sectionTitle: { marginTop: spacingValues.xs },
    reasonOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues.sm,
        paddingVertical: spacingValues.sm,
        paddingHorizontal: spacingValues.md,
        borderRadius: spacingValues.xs,
        borderWidth: 1,
        borderColor: colors.neutral.gray300,
    },
    reasonOptionSelected: { borderColor: colors.journeys.care.primary },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.neutral.gray300,
    },
    radioSelected: { borderColor: colors.journeys.care.primary, backgroundColor: colors.journeys.care.primary },
    detailsInput: {
        borderWidth: 1,
        borderColor: colors.neutral.gray300,
        borderRadius: spacingValues.xs,
        padding: spacingValues.sm,
        minHeight: 80,
        textAlignVertical: 'top',
        color: colors.journeys.care.text,
        fontSize: 14,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues.sm,
        paddingVertical: spacingValues.xs,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: colors.neutral.gray300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: { backgroundColor: colors.journeys.care.primary, borderColor: colors.journeys.care.primary },
    checkboxLabel: { flex: 1 },
    actions: { marginTop: spacingValues.md },
    actionGap: { height: spacingValues.sm },
});

export default AppointmentCancel;
