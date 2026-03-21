import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';

interface RouteParams {
    appointmentId: string;
    doctorId: string;
}

const MOCK_DOCTOR: Record<string, { name: string; specialty: string }> = {
    'doc-001': { name: 'Dra. Ana Carolina Silva', specialty: 'Cardiologia' },
    'doc-002': { name: 'Dr. Ricardo Mendes', specialty: 'Dermatologia' },
};

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

const REASON_KEYS = [
    'consultation.reschedule.scheduleConflict',
    'consultation.reschedule.feelingBetter',
    'consultation.reschedule.differentTime',
    'consultation.reschedule.other',
];

const getDaysInMonth = (year: number, month: number): number => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number): number => new Date(year, month, 1).getDay();

export const AppointmentReschedule: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { t } = useTranslation();
    const { _appointmentId, doctorId } = route.params as RouteParams;

    const doctor = MOCK_DOCTOR[doctorId] || { name: 'Dr. Medico', specialty: 'Especialidade' };
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [notes, setNotes] = useState('');

    const daysInMonth = useMemo(() => getDaysInMonth(currentYear, currentMonth), [currentYear, currentMonth]);
    const firstDay = useMemo(() => getFirstDayOfMonth(currentYear, currentMonth), [currentYear, currentMonth]);
    const today = now.getDate();

    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const dayLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    const calendarDays = useMemo(() => {
        const cells: (number | null)[] = [];
        for (let i = 0; i < firstDay; i++) {
            cells.push(null);
        }
        for (let d = 1; d <= daysInMonth; d++) {
            cells.push(d);
        }
        return cells;
    }, [firstDay, daysInMonth]);

    const canConfirm = selectedDay !== null && selectedTime !== null && selectedReason !== null;

    const handleConfirm = useCallback(() => {
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
                    {t('consultation.reschedule.title')}
                </Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                <Card journey="care" elevation="sm">
                    <Text fontSize="sm" color={colors.neutral.gray500}>
                        {t('consultation.reschedule.currentAppointment')}
                    </Text>
                    <Text fontSize="md" fontWeight="bold" color={colors.journeys.care.text}>
                        {doctor.name}
                    </Text>
                    <Badge journey="care" size="sm">
                        {doctor.specialty}
                    </Badge>
                </Card>

                <Text fontSize="md" fontWeight="bold" color={colors.journeys.care.text} style={styles.sectionTitle}>
                    {t('consultation.reschedule.selectDate')}
                </Text>
                <Card journey="care" elevation="sm">
                    <Text fontSize="md" fontWeight="bold" color={colors.journeys.care.text} textAlign="center">
                        {monthNames[currentMonth]} {currentYear}
                    </Text>
                    <View style={styles.dayLabelsRow}>
                        {dayLabels.map((lbl, i) => (
                            <View key={`lbl-${i}`} style={styles.dayCell}>
                                <Text fontSize="sm" fontWeight="bold" color={colors.neutral.gray500}>
                                    {lbl}
                                </Text>
                            </View>
                        ))}
                    </View>
                    <View style={styles.calendarGrid}>
                        {calendarDays.map((day, idx) => {
                            const isPast = day !== null && day < today;
                            const isSelected = day === selectedDay;
                            return (
                                <TouchableOpacity
                                    key={`day-${idx}`}
                                    style={[
                                        styles.dayCell,
                                        isSelected && styles.daySelected,
                                        isPast && styles.dayDisabled,
                                    ]}
                                    onPress={() => {
                                        if (day && !isPast) {
                                            setSelectedDay(day);
                                        }
                                    }}
                                    disabled={!day || isPast}
                                    accessibilityLabel={
                                        day ? `${t('consultation.reschedule.selectDate')} ${day}` : undefined
                                    }
                                    accessibilityRole="button"
                                    testID={day ? `day-${day}` : `empty-${idx}`}
                                >
                                    {day && (
                                        <Text
                                            fontSize="sm"
                                            color={
                                                isSelected
                                                    ? colors.neutral.white
                                                    : isPast
                                                      ? colors.neutral.gray300
                                                      : colors.journeys.care.text
                                            }
                                        >
                                            {day}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Card>

                <Text fontSize="md" fontWeight="bold" color={colors.journeys.care.text} style={styles.sectionTitle}>
                    {t('consultation.reschedule.selectTime')}
                </Text>
                <View style={styles.timeSlotsRow}>
                    {TIME_SLOTS.map((slot) => {
                        const isSelected = slot === selectedTime;
                        return (
                            <TouchableOpacity
                                key={slot}
                                style={[styles.timeSlot, isSelected && styles.timeSlotSelected]}
                                onPress={() => setSelectedTime(slot)}
                                accessibilityLabel={`${t('consultation.reschedule.selectTime')} ${slot}`}
                                accessibilityRole="button"
                                testID={`time-${slot}`}
                            >
                                <Text
                                    fontSize="sm"
                                    fontWeight={isSelected ? 'bold' : 'regular'}
                                    color={isSelected ? colors.neutral.white : colors.journeys.care.primary}
                                >
                                    {slot}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <Text fontSize="md" fontWeight="bold" color={colors.journeys.care.text} style={styles.sectionTitle}>
                    {t('consultation.reschedule.reason')}
                </Text>
                <View style={styles.reasonRow}>
                    {REASON_KEYS.map((key) => {
                        const isSelected = selectedReason === key;
                        return (
                            <TouchableOpacity
                                key={key}
                                style={[styles.reasonChip, isSelected && styles.reasonChipSelected]}
                                onPress={() => setSelectedReason(key)}
                                accessibilityLabel={t(key)}
                                accessibilityRole="button"
                                testID={`reason-${key}`}
                            >
                                <Text
                                    fontSize="sm"
                                    color={isSelected ? colors.neutral.white : colors.journeys.care.primary}
                                >
                                    {t(key)}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <TextInput
                    style={styles.notesInput}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder={t('consultation.reschedule.notes')}
                    placeholderTextColor={colors.neutral.gray500}
                    multiline
                    numberOfLines={3}
                    accessibilityLabel={t('consultation.reschedule.notes')}
                    testID="notes-input"
                />

                <View style={styles.warningBox}>
                    <Text fontSize="sm" color={colors.journeys.care.text}>
                        {t('consultation.reschedule.policyWarning')}
                    </Text>
                </View>

                <Button
                    journey="care"
                    variant="primary"
                    onPress={handleConfirm}
                    disabled={!canConfirm}
                    accessibilityLabel={t('consultation.reschedule.confirm')}
                    testID="confirm-reschedule-button"
                >
                    {t('consultation.reschedule.confirm')}
                </Button>
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
    sectionTitle: { marginTop: spacingValues.sm },
    dayLabelsRow: { flexDirection: 'row', marginTop: spacingValues.xs },
    calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    dayCell: {
        width: '14.28%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: spacingValues.xs,
    },
    daySelected: { backgroundColor: colors.journeys.care.primary, borderRadius: spacingValues.xl },
    dayDisabled: { opacity: 0.3 },
    timeSlotsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacingValues.xs },
    timeSlot: {
        paddingVertical: spacingValues.xs,
        paddingHorizontal: spacingValues.md,
        borderRadius: spacingValues.xl,
        borderWidth: 1,
        borderColor: colors.journeys.care.primary,
    },
    timeSlotSelected: { backgroundColor: colors.journeys.care.primary },
    reasonRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacingValues.xs },
    reasonChip: {
        paddingVertical: spacingValues.xs,
        paddingHorizontal: spacingValues.sm,
        borderRadius: spacingValues.xl,
        borderWidth: 1,
        borderColor: colors.journeys.care.primary,
    },
    reasonChipSelected: { backgroundColor: colors.journeys.care.primary },
    notesInput: {
        borderWidth: 1,
        borderColor: colors.neutral.gray300,
        borderRadius: spacingValues.xs,
        padding: spacingValues.sm,
        minHeight: 80,
        textAlignVertical: 'top',
        color: colors.journeys.care.text,
        fontSize: 14,
    },
    warningBox: {
        backgroundColor: colors.journeys.care.primary + '15',
        borderRadius: spacingValues.xs,
        padding: spacingValues.sm,
        borderLeftWidth: 3,
        borderLeftColor: colors.journeys.care.primary,
    },
});

export default AppointmentReschedule;
