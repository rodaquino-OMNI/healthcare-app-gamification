import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Badge } from 'src/web/design-system/src/components/Badge/Badge';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import { WEB_CARE_ROUTES } from 'src/web/shared/constants/routes';

interface SpecialtySuggestion {
  id: string;
  name: string;
  reason: string;
  urgency: 'routine' | 'soon';
}

const SUGGESTED_SPECIALTIES: SpecialtySuggestion[] = [
  { id: 'gp', name: 'General Practitioner', reason: 'Initial evaluation and referral if needed', urgency: 'routine' },
  { id: 'ent', name: 'Ear, Nose & Throat (ENT)', reason: 'Persistent sinus or throat symptoms', urgency: 'soon' },
  { id: 'allergist', name: 'Allergist', reason: 'If allergies are suspected as root cause', urgency: 'routine' },
];

/** Book appointment page with specialty suggestions based on the symptom check. */
const BookAppointmentPage: React.FC = () => {
  const router = useRouter();

  const handleBookSpecialty = (specialtyId: string) => {
    router.push({
      pathname: WEB_CARE_ROUTES.DOCTOR_SEARCH,
      query: { specialty: specialtyId },
    });
  };

  const handleTelemedicine = () => {
    router.push(WEB_CARE_ROUTES.TELEMEDICINE);
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
      <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
        Book an Appointment
      </Text>
      <Text
        fontSize="md"
        color={colors.gray[50]}
        style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}
      >
        Based on your symptom assessment, we suggest the following specialties.
      </Text>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        {SUGGESTED_SPECIALTIES.map((specialty) => (
          <Card key={specialty.id} journey="care" elevation="md" padding="lg">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              style={{ marginBottom: spacing.xs }}
            >
              <Text fontWeight="bold" fontSize="lg" color={colors.journeys.care.text}>
                {specialty.name}
              </Text>
              <Badge
                variant="status"
                status={specialty.urgency === 'soon' ? 'warning' : 'success'}
              >
                {specialty.urgency === 'soon' ? 'Recommended Soon' : 'Routine'}
              </Badge>
            </Box>
            <Text
              fontSize="sm"
              color={colors.gray[50]}
              style={{ marginBottom: spacing.md }}
            >
              {specialty.reason}
            </Text>
            <Button
              journey="care"
              onPress={() => handleBookSpecialty(specialty.id)}
              accessibilityLabel={`Search for ${specialty.name}`}
              data-testid={`book-${specialty.id}-btn`}
            >
              Find a Doctor
            </Button>
          </Card>
        ))}
      </div>

      <Card journey="care" elevation="sm" padding="lg" style={{ marginTop: spacing.xl }}>
        <Text fontWeight="medium" fontSize="md" style={{ marginBottom: spacing.xs }}>
          Prefer a virtual consultation?
        </Text>
        <Text
          fontSize="sm"
          color={colors.gray[50]}
          style={{ marginBottom: spacing.md }}
        >
          Connect with a doctor from home via video call.
        </Text>
        <Button
          variant="secondary"
          journey="care"
          onPress={handleTelemedicine}
          accessibilityLabel="Start telemedicine consultation"
          data-testid="book-telemedicine-btn"
        >
          Start Telemedicine
        </Button>
      </Card>

      <Box display="flex" justifyContent="center" style={{ marginTop: spacing['2xl'] }}>
        <Button
          variant="tertiary"
          journey="care"
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          data-testid="book-appointment-back-btn"
        >
          Back
        </Button>
      </Box>
    </div>
  );
};

export default BookAppointmentPage;
