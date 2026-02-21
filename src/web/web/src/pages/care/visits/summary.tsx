import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Badge } from 'src/web/design-system/src/components/Badge/Badge';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

const MOCK_VISIT = {
  doctor: 'Dr. Maria Santos',
  specialty: 'General Practitioner',
  date: 'Feb 21, 2026',
  type: 'Telemedicine',
};

const MOCK_DIAGNOSIS = {
  primary: 'Tension-type headache',
  code: 'G44.2',
  severity: 'Mild',
};

const RECOMMENDATIONS = [
  'Maintain regular sleep schedule (7-8 hours)',
  'Stay hydrated - at least 8 glasses of water daily',
  'Reduce screen time and take breaks every 30 minutes',
  'Over-the-counter pain relief as prescribed',
  'Follow-up visit in 2 weeks if symptoms persist',
];

/** Visit summary page showing diagnosis, notes, and post-visit actions. */
const VisitSummaryPage: React.FC = () => {
  const router = useRouter();

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
      <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
        Visit Summary
      </Text>
      <Text
        fontSize="md"
        color={colors.gray[50]}
        style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}
      >
        {MOCK_VISIT.date} - {MOCK_VISIT.type}
      </Text>

      <Card journey="care" elevation="md" padding="lg" style={{ marginBottom: spacing.lg }}>
        <Box display="flex" alignItems="center" style={{ gap: spacing.md }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: colors.journeys.care.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text fontSize="md" fontWeight="bold" color={colors.neutral.white}>MS</Text>
          </div>
          <div>
            <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>{MOCK_VISIT.doctor}</Text>
            <Text fontSize="sm" color={colors.gray[50]}>{MOCK_VISIT.specialty}</Text>
          </div>
        </Box>
      </Card>

      <Card journey="care" elevation="md" padding="lg" style={{ marginBottom: spacing.lg }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: spacing.sm }}>
          <Text fontWeight="bold" fontSize="lg" color={colors.journeys.care.text}>Diagnosis</Text>
          <Badge variant="status" status="success">{MOCK_DIAGNOSIS.severity}</Badge>
        </Box>
        <Text fontSize="md" fontWeight="medium" color={colors.journeys.care.text}>
          {MOCK_DIAGNOSIS.primary}
        </Text>
        <Text fontSize="sm" color={colors.gray[40]} style={{ marginTop: spacing['3xs'] }}>
          ICD-10: {MOCK_DIAGNOSIS.code}
        </Text>
      </Card>

      <Card journey="care" elevation="sm" padding="lg" style={{ marginBottom: spacing.lg }}>
        <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text} style={{ marginBottom: spacing.sm }}>
          Clinical Notes
        </Text>
        <Text fontSize="sm" color={colors.gray[60]}>
          Patient presents with recurrent tension-type headaches over the past 3 days,
          primarily in the afternoon. No visual disturbances, nausea, or neurological
          symptoms reported. Vitals within normal range. Recommended lifestyle
          adjustments and over-the-counter analgesics.
        </Text>
      </Card>

      <Card journey="care" elevation="sm" padding="lg" style={{ marginBottom: spacing.xl }}>
        <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text} style={{ marginBottom: spacing.sm }}>
          Recommendations
        </Text>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
          {RECOMMENDATIONS.map((rec, idx) => (
            <Box key={idx} display="flex" style={{ gap: spacing.xs }}>
              <Text fontSize="sm" color={colors.journeys.care.primary}>{'•'}</Text>
              <Text fontSize="sm" color={colors.gray[60]}>{rec}</Text>
            </Box>
          ))}
        </div>
      </Card>

      <div style={{ display: 'flex', gap: spacing.sm }}>
        <Button
          journey="care"
          onPress={() => router.push('/care/visits/prescriptions')}
          accessibilityLabel="View prescriptions"
          data-testid="summary-prescriptions-btn"
        >
          View Prescriptions
        </Button>
        <Button
          variant="secondary"
          journey="care"
          onPress={() => router.push('/care/visits/follow-up')}
          accessibilityLabel="Schedule follow-up"
          data-testid="summary-followup-btn"
        >
          Schedule Follow-Up
        </Button>
      </div>

      <Box display="flex" justifyContent="center" style={{ marginTop: spacing.lg }}>
        <Button
          variant="tertiary"
          journey="care"
          onPress={() => router.push('/care')}
          accessibilityLabel="Back to care"
          data-testid="summary-back-btn"
        >
          Back to Care
        </Button>
      </Box>
    </div>
  );
};

export default VisitSummaryPage;
