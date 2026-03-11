import { Badge } from 'design-system/components/Badge/Badge';
import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState, useMemo } from 'react';
import { WEB_HEALTH_ROUTES } from 'shared/constants/routes';

import { useMedications } from '@/hooks';

/** Dose slot for a single medication time */
interface DoseSlot {
    id: string;
    medicationName: string;
    dosage: string;
    time: string;
    status: 'taken' | 'missed' | 'pending';
}

/** Day entry in the weekly calendar */
interface CalendarDay {
    key: string;
    label: string;
    dateNum: number;
    fullDate: string;
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const generateWeekDays = (): CalendarDay[] => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return {
            key: `day-${i}`,
            label: DAY_LABELS[date.getDay()],
            dateNum: date.getDate(),
            fullDate: `${yyyy}-${mm}-${dd}`,
        };
    });
};

const buildMockSchedule = (days: CalendarDay[]): Record<string, DoseSlot[]> => {
    const schedule: Record<string, DoseSlot[]> = {};
    days.forEach((day, idx) => {
        schedule[day.fullDate] = [
            {
                id: `${day.fullDate}-1`,
                medicationName: 'Metformin',
                dosage: '500mg',
                time: '08:00 AM',
                status: idx < 4 ? 'taken' : idx === 4 ? 'missed' : 'pending',
            },
            {
                id: `${day.fullDate}-2`,
                medicationName: 'Lisinopril',
                dosage: '10mg',
                time: '08:00 AM',
                status: idx < 5 ? 'taken' : 'pending',
            },
            {
                id: `${day.fullDate}-3`,
                medicationName: 'Metformin',
                dosage: '500mg',
                time: '02:00 PM',
                status: idx < 3 ? 'taken' : 'pending',
            },
            {
                id: `${day.fullDate}-4`,
                medicationName: 'Atorvastatin',
                dosage: '20mg',
                time: '08:00 PM',
                status: idx < 2 ? 'taken' : idx === 2 ? 'missed' : 'pending',
            },
        ];
    });
    return schedule;
};

const STATUS_CONFIG: Record<DoseSlot['status'], { badge: 'success' | 'error' | 'warning'; label: string }> = {
    taken: { badge: 'success', label: 'Taken' },
    missed: { badge: 'error', label: 'Missed' },
    pending: { badge: 'warning', label: 'Pending' },
};

/**
 * Calendar page showing a weekly view of medication dose schedule.
 */
const MedicationCalendarPage: React.FC = () => {
    const { medications, loading, error, refetch } = useMedications();
    const router = useRouter();
    const weekDays = useMemo(() => generateWeekDays(), []);
    const mockSchedule = useMemo(() => buildMockSchedule(weekDays), [weekDays]);
    const todayStr = useMemo(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }, []);
    const [selectedDate, setSelectedDate] = useState(todayStr);

    if (loading) {
        return (
            <div style={{ padding: '24px' }}>
                <p>Loading...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div style={{ padding: '24px' }}>
                <p>
                    Error loading data. <button onClick={refetch}>Retry</button>
                </p>
            </div>
        );
    }

    void medications;

    const doses = mockSchedule[selectedDate] ?? [];

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                Medication Calendar
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Weekly dose schedule overview
            </Text>

            {/* Week Strip */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.xl }}>
                {weekDays.map((day) => {
                    const isSelected = day.fullDate === selectedDate;
                    const isToday = day.fullDate === todayStr;
                    return (
                        <button
                            key={day.key}
                            onClick={() => setSelectedDate(day.fullDate)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 60,
                                height: 72,
                                borderRadius: 12,
                                border: isSelected
                                    ? `2px solid ${colors.journeys.health.primary}`
                                    : `1px solid ${colors.neutral.gray300}`,
                                backgroundColor: isSelected ? colors.journeys.health.primary : colors.neutral.white,
                                cursor: 'pointer',
                                padding: spacing.xs,
                            }}
                            aria-label={`${day.label} ${day.dateNum}${isToday ? ', today' : ''}`}
                        >
                            <Text fontSize="xs" color={isSelected ? colors.neutral.white : colors.gray[50]}>
                                {day.label}
                            </Text>
                            <Text
                                fontSize="lg"
                                fontWeight={isToday ? 'bold' : 'medium'}
                                color={isSelected ? colors.neutral.white : colors.neutral.gray900}
                            >
                                {day.dateNum}
                            </Text>
                        </button>
                    );
                })}
            </div>

            {/* Dose List */}
            {doses.length === 0 ? (
                <Card journey="health" elevation="sm" padding="lg">
                    <Text fontSize="md" color={colors.gray[50]} style={{ textAlign: 'center' }}>
                        No doses scheduled for this day
                    </Text>
                </Card>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                    {doses.map((dose) => {
                        const config = STATUS_CONFIG[dose.status];
                        return (
                            <Card key={dose.id} journey="health" elevation="sm" padding="md">
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box display="flex" alignItems="center" style={{ gap: spacing.md }}>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="semiBold"
                                            color={colors.journeys.health.primary}
                                            style={{ width: 80 }}
                                        >
                                            {dose.time}
                                        </Text>
                                        <Box>
                                            <Text fontWeight="medium" fontSize="md">
                                                {dose.medicationName}
                                            </Text>
                                            <Text fontSize="sm" color={colors.gray[50]}>
                                                {dose.dosage}
                                            </Text>
                                        </Box>
                                    </Box>
                                    <Badge variant="status" status={config.badge}>
                                        {config.label}
                                    </Badge>
                                </Box>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* View Monthly */}
            <Box display="flex" justifyContent="center" style={{ marginTop: spacing['2xl'] }}>
                <Button
                    variant="secondary"
                    journey="health"
                    onPress={() => void router.push(WEB_HEALTH_ROUTES.MEDICATIONS)}
                    accessibilityLabel="View monthly calendar"
                >
                    View Monthly
                </Button>
            </Box>
        </div>
    );
};

export default MedicationCalendarPage;
