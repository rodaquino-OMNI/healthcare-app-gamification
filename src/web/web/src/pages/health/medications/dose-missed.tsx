import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Badge } from 'src/web/design-system/src/components/Badge/Badge';
import Input from 'src/web/design-system/src/components/Input/Input';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import { WEB_HEALTH_ROUTES } from 'src/web/shared/constants/routes';

/** Missed dose reason options */
const MISSED_REASONS = [
  { id: 'forgot', label: 'I forgot' },
  { id: 'side_effects', label: 'Side effects' },
  { id: 'ran_out', label: 'Ran out of medication' },
  { id: 'other', label: 'Other reason' },
];

/**
 * Dose missed form page. Allows users to log a missed dose with reason,
 * and optionally reschedule or take the dose immediately.
 */
const MedicationDoseMissedPage: React.FC = () => {
  const router = useRouter();
  const { name, dosage, scheduledTime } = router.query;

  const medicationName = (name as string) || 'Medication';
  const medicationDosage = (dosage as string) || '';
  const scheduled = (scheduledTime as string) || '';

  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleTime, setRescheduleTime] = useState('');

  const handleSkip = () => {
    // In a real app, persist the skip record via API
    router.push(WEB_HEALTH_ROUTES.MEDICATIONS);
  };

  const handleTakeNow = () => {
    router.push({
      pathname: '/health/medications/dose-taken',
      query: { name: medicationName, dosage: medicationDosage, scheduledTime: scheduled },
    });
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
      <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
        Log Missed Dose
      </Text>
      <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
        Record why you missed this dose
      </Text>

      {/* Medication Info */}
      <Card journey="health" elevation="md" padding="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Text fontWeight="semiBold" fontSize="xl">{medicationName}</Text>
            {scheduled && (
              <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing.xs }}>
                Scheduled: {scheduled}
              </Text>
            )}
          </Box>
          {medicationDosage && (
            <Badge variant="status" status="info">{medicationDosage}</Badge>
          )}
        </Box>
      </Card>

      {/* Reason Selector */}
      <Card journey="health" elevation="sm" padding="lg" style={{ marginTop: spacing.md }}>
        <Text fontWeight="medium" fontSize="lg" style={{ marginBottom: spacing.md }}>
          Why did you miss this dose?
        </Text>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
          {MISSED_REASONS.map((reason) => {
            const isSelected = selectedReason === reason.id;
            return (
              <button
                key={reason.id}
                onClick={() => setSelectedReason(reason.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  padding: spacing.md,
                  borderRadius: 8,
                  border: isSelected
                    ? `2px solid ${colors.journeys.health.primary}`
                    : `1px solid ${colors.neutral.gray300}`,
                  backgroundColor: isSelected
                    ? colors.journeys.health.background
                    : colors.neutral.white,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                aria-label={reason.label}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    border: isSelected
                      ? `2px solid ${colors.journeys.health.primary}`
                      : `2px solid ${colors.neutral.gray400}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isSelected && (
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: colors.journeys.health.primary,
                      }}
                    />
                  )}
                </div>
                <Text
                  fontSize="md"
                  fontWeight={isSelected ? 'medium' : 'regular'}
                  color={isSelected ? colors.journeys.health.primary : colors.neutral.gray900}
                >
                  {reason.label}
                </Text>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Reschedule Option */}
      <Card journey="health" elevation="sm" padding="lg" style={{ marginTop: spacing.md }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          style={{ cursor: 'pointer' }}
          onClick={() => setShowReschedule(!showReschedule)}
        >
          <Text fontWeight="medium" fontSize="md">Reschedule this dose</Text>
          <Text fontSize="md" color={colors.journeys.health.primary}>
            {showReschedule ? '-' : '+'}
          </Text>
        </Box>
        {showReschedule && (
          <Box style={{ marginTop: spacing.md }}>
            <Input
              label="Reschedule Time"
              value={rescheduleTime}
              onChange={(e) => setRescheduleTime(e.target.value)}
              placeholder="HH:MM"
              journey="health"
              testID="reschedule-time-input"
            />
          </Box>
        )}
      </Card>

      {/* Action Buttons */}
      <Box display="flex" justifyContent="space-between" style={{ marginTop: spacing['2xl'] }}>
        <Button
          variant="secondary"
          journey="health"
          onPress={handleSkip}
          accessibilityLabel="Skip this dose"
        >
          Skip This Dose
        </Button>
        <Button
          journey="health"
          onPress={handleTakeNow}
          accessibilityLabel="Take now instead"
        >
          Take Now Instead
        </Button>
      </Box>
    </div>
  );
};

export default MedicationDoseMissedPage;
