import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Badge } from 'src/web/design-system/src/components/Badge/Badge';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

type RecordType = 'visit' | 'lab' | 'prescription' | 'imaging';
type FilterTab = 'all' | 'visit' | 'lab' | 'prescription';

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'visit', label: 'Visit Notes' },
  { key: 'lab', label: 'Lab Results' },
  { key: 'prescription', label: 'Prescriptions' },
];

interface MedicalRecord {
  id: string;
  type: RecordType;
  title: string;
  doctor: string;
  date: string;
  description: string;
}

const MOCK_RECORDS: MedicalRecord[] = [
  { id: 'r1', type: 'visit', title: 'Telemedicine Consultation', doctor: 'Dr. Maria Santos', date: 'Feb 21, 2026', description: 'Tension-type headache evaluation and treatment plan' },
  { id: 'r2', type: 'lab', title: 'Complete Blood Count (CBC)', doctor: 'LabCorp', date: 'Feb 15, 2026', description: 'All values within normal range' },
  { id: 'r3', type: 'prescription', title: 'Ibuprofen 400mg', doctor: 'Dr. Maria Santos', date: 'Feb 21, 2026', description: 'Every 8 hours for 7 days' },
  { id: 'r4', type: 'lab', title: 'Thyroid Panel (TSH)', doctor: 'Quest Diagnostics', date: 'Feb 10, 2026', description: 'TSH within normal range (2.1 mIU/L)' },
  { id: 'r5', type: 'visit', title: 'Annual Physical Exam', doctor: 'Dr. Carlos Mendes', date: 'Jan 15, 2026', description: 'Routine checkup - all clear' },
];

const getTypeBadge = (type: RecordType): { status: 'info' | 'success' | 'warning'; label: string } => {
  switch (type) {
    case 'visit': return { status: 'info', label: 'Visit' };
    case 'lab': return { status: 'success', label: 'Lab' };
    case 'prescription': return { status: 'warning', label: 'Rx' };
    case 'imaging': return { status: 'info', label: 'Imaging' };
    default: return { status: 'info', label: 'Other' };
  }
};

/** Medical records page with filter tabs and downloadable record list. */
const MedicalRecordsPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<FilterTab>('all');

  const filteredRecords = activeTab === 'all'
    ? MOCK_RECORDS
    : MOCK_RECORDS.filter((r) => r.type === activeTab);

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
      <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
        Medical Records
      </Text>
      <Text
        fontSize="md"
        color={colors.gray[50]}
        style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}
      >
        Access your complete medical history and documents.
      </Text>

      <Box display="flex" style={{ gap: spacing.xs, marginBottom: spacing.xl }}>
        {FILTER_TABS.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? 'primary' : 'tertiary'}
            journey="care"
            onPress={() => setActiveTab(tab.key)}
            accessibilityLabel={`Filter by ${tab.label}`}
            data-testid={`records-filter-${tab.key}-btn`}
          >
            {tab.label}
          </Button>
        ))}
      </Box>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, marginBottom: spacing.xl }}>
        {filteredRecords.map((record) => {
          const badge = getTypeBadge(record.type);
          return (
            <Card key={record.id} journey="care" elevation="sm" padding="lg">
              <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: spacing.xs }}>
                <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>{record.title}</Text>
                <Badge variant="status" status={badge.status}>{badge.label}</Badge>
              </Box>
              <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing['3xs'] }}>
                {record.doctor} - {record.date}
              </Text>
              <Text fontSize="sm" color={colors.gray[60]} style={{ marginBottom: spacing.sm }}>
                {record.description}
              </Text>
              <Button
                variant="tertiary"
                journey="care"
                onPress={() => {}}
                accessibilityLabel={`Download ${record.title}`}
                data-testid={`record-download-${record.id}-btn`}
              >
                Download
              </Button>
            </Card>
          );
        })}
      </div>

      <Box display="flex" justifyContent="space-between">
        <Button
          variant="secondary"
          journey="care"
          onPress={() => {}}
          accessibilityLabel="Download all records"
          data-testid="records-bulk-download-btn"
        >
          Download All
        </Button>
        <Button
          variant="tertiary"
          journey="care"
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          data-testid="records-back-btn"
        >
          Back
        </Button>
      </Box>
    </div>
  );
};

export default MedicalRecordsPage;
