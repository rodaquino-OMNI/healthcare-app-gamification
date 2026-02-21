import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import { WEB_CARE_ROUTES } from 'src/web/shared/constants/routes';
import { CareLayout } from 'src/web/web/src/layouts/CareLayout';
import { JourneyHeader } from 'src/web/web/src/components/shared/JourneyHeader';

/** Date entry for the calendar view */
interface CalendarDate {
  date: string;
  dayOfWeek: string;
  dayNumber: number;
  available: boolean;
}

/** Time slot for a given date */
interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  type: 'presencial' | 'telemedicina';
}

const MOCK_DATES: CalendarDate[] = [
  { date: '2026-02-23', dayOfWeek: 'Seg', dayNumber: 23, available: true },
  { date: '2026-02-24', dayOfWeek: 'Ter', dayNumber: 24, available: true },
  { date: '2026-02-25', dayOfWeek: 'Qua', dayNumber: 25, available: false },
  { date: '2026-02-26', dayOfWeek: 'Qui', dayNumber: 26, available: true },
  { date: '2026-02-27', dayOfWeek: 'Sex', dayNumber: 27, available: true },
  { date: '2026-03-02', dayOfWeek: 'Seg', dayNumber: 2, available: true },
  { date: '2026-03-03', dayOfWeek: 'Ter', dayNumber: 3, available: true },
];

const MOCK_TIME_SLOTS: TimeSlot[] = [
  { id: '1', time: '08:00', available: true, type: 'presencial' },
  { id: '2', time: '09:00', available: true, type: 'presencial' },
  { id: '3', time: '10:00', available: false, type: 'presencial' },
  { id: '4', time: '11:00', available: true, type: 'telemedicina' },
  { id: '5', time: '14:00', available: true, type: 'presencial' },
  { id: '6', time: '15:00', available: true, type: 'telemedicina' },
  { id: '7', time: '16:00', available: true, type: 'presencial' },
  { id: '8', time: '17:00', available: false, type: 'presencial' },
];

/**
 * Doctor availability page showing a calendar with available time slots.
 * Users select a date and time to proceed with booking.
 */
const DoctorAvailabilityPage: React.FC = () => {
  const router = useRouter();
  const { doctorId } = router.query;
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedDate && selectedSlot) {
      const slot = MOCK_TIME_SLOTS.find((s) => s.id === selectedSlot);
      router.push({
        pathname: WEB_CARE_ROUTES.BOOKING_CONFIRMATION,
        query: {
          doctorId: doctorId as string,
          date: selectedDate,
          time: slot?.time,
          type: slot?.type,
        },
      });
    }
  };

  return (
    <CareLayout>
      <JourneyHeader title="Horarios Disponiveis" />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: spacing.xl }}>
        {/* Doctor info summary */}
        <Card journey="care" elevation="sm">
          <Box padding="md" display="flex" justifyContent="space-between" alignItems="center">
            <div>
              <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                Dra. Ana Silva
              </Text>
              <Text fontSize="sm" color={colors.journeys.care.primary}>
                Cardiologia
              </Text>
            </div>
            <Text fontSize="sm" color={colors.gray[50]}>
              Fevereiro / Marco 2026
            </Text>
          </Box>
        </Card>

        {/* Date selector */}
        <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text} style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
          Selecione uma data
        </Text>
        <div style={{ display: 'flex', gap: spacing.sm, overflowX: 'auto', paddingBottom: spacing.sm }}>
          {MOCK_DATES.map((dateEntry) => (
            <button
              key={dateEntry.date}
              onClick={() => {
                if (dateEntry.available) {
                  setSelectedDate(dateEntry.date);
                  setSelectedSlot(null);
                }
              }}
              disabled={!dateEntry.available}
              style={{
                minWidth: '72px',
                padding: spacing.sm,
                borderRadius: '12px',
                border: `2px solid ${
                  selectedDate === dateEntry.date
                    ? colors.journeys.care.primary
                    : dateEntry.available
                    ? colors.neutral.gray300
                    : colors.neutral.gray200
                }`,
                backgroundColor: selectedDate === dateEntry.date
                  ? colors.journeys.care.background
                  : 'transparent',
                cursor: dateEntry.available ? 'pointer' : 'not-allowed',
                opacity: dateEntry.available ? 1 : 0.4,
                textAlign: 'center',
              }}
              aria-label={`${dateEntry.dayOfWeek} dia ${dateEntry.dayNumber}${!dateEntry.available ? ', indisponivel' : ''}`}
              aria-pressed={selectedDate === dateEntry.date}
            >
              <Text fontSize="xs" color={colors.gray[50]}>{dateEntry.dayOfWeek}</Text>
              <Text
                fontSize="lg"
                fontWeight={selectedDate === dateEntry.date ? 'bold' : 'medium'}
                color={selectedDate === dateEntry.date ? colors.journeys.care.primary : colors.journeys.care.text}
              >
                {dateEntry.dayNumber}
              </Text>
            </button>
          ))}
        </div>

        {/* Time slots */}
        {selectedDate && (
          <>
            <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text} style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
              Horarios disponiveis
            </Text>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: spacing.sm }}>
              {MOCK_TIME_SLOTS.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => slot.available && setSelectedSlot(slot.id)}
                  disabled={!slot.available}
                  style={{
                    padding: spacing.sm,
                    borderRadius: '8px',
                    border: `2px solid ${
                      selectedSlot === slot.id
                        ? colors.journeys.care.primary
                        : slot.available
                        ? colors.neutral.gray300
                        : colors.neutral.gray200
                    }`,
                    backgroundColor: selectedSlot === slot.id
                      ? colors.journeys.care.background
                      : 'transparent',
                    cursor: slot.available ? 'pointer' : 'not-allowed',
                    opacity: slot.available ? 1 : 0.4,
                    textAlign: 'center',
                  }}
                  aria-label={`${slot.time} - ${slot.type}${!slot.available ? ', indisponivel' : ''}`}
                  aria-pressed={selectedSlot === slot.id}
                >
                  <Text
                    fontSize="md"
                    fontWeight={selectedSlot === slot.id ? 'bold' : 'medium'}
                    color={selectedSlot === slot.id ? colors.journeys.care.primary : colors.journeys.care.text}
                  >
                    {slot.time}
                  </Text>
                  <Text fontSize="xs" color={colors.gray[50]} style={{ marginTop: '2px' }}>
                    {slot.type === 'presencial' ? 'Presencial' : 'Telemedicina'}
                  </Text>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Confirm button */}
        <Box display="flex" justifyContent="flex-end" style={{ marginTop: spacing['2xl'] }}>
          <Button
            journey="care"
            onPress={handleConfirm}
            disabled={!selectedDate || !selectedSlot}
            accessibilityLabel="Confirmar horario selecionado"
          >
            Confirmar Horario
          </Button>
        </Box>
      </div>
    </CareLayout>
  );
};

export default DoctorAvailabilityPage;
