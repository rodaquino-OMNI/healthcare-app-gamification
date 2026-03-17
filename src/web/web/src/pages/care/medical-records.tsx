import { Badge } from 'design-system/components/Badge/Badge';
import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState } from 'react';

import { useMedicalRecords } from '@/hooks';
import type { RecordType } from '@/hooks/useMedicalRecords';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

type FilterTab = 'all' | 'visit' | 'lab' | 'prescription';

const FILTER_TABS: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'visit', label: 'Visit Notes' },
    { key: 'lab', label: 'Lab Results' },
    { key: 'prescription', label: 'Prescriptions' },
];

const getTypeBadge = (type: RecordType): { status: 'info' | 'success' | 'warning'; label: string } => {
    switch (type) {
        case 'visit':
            return { status: 'info', label: 'Visit' };
        case 'lab':
            return { status: 'success', label: 'Lab' };
        case 'prescription':
            return { status: 'warning', label: 'Rx' };
        case 'imaging':
            return { status: 'info', label: 'Imaging' };
        default:
            return { status: 'info', label: 'Other' };
    }
};

/** Medical records page with filter tabs and downloadable record list. */
const MedicalRecordsPage: React.FC = () => {
    const router = useRouter();
    const { records, isLoading, error } = useMedicalRecords();
    const [activeTab, setActiveTab] = useState<FilterTab>('all');

    if (isLoading) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.gray[50]}>
                    Loading medical records...
                </Text>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.semantic.error}>
                    Failed to load medical records.
                </Text>
            </div>
        );
    }

    const filteredRecords = activeTab === 'all' ? records : records.filter((r) => r.type === activeTab);

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                Medical Records
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}>
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

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing.md,
                    marginBottom: spacing.xl,
                }}
            >
                {filteredRecords.map((record) => {
                    const badge = getTypeBadge(record.type);
                    return (
                        <Card key={record.id} journey="care" elevation="sm" padding="lg">
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                style={{ marginBottom: spacing.xs }}
                            >
                                <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                                    {record.title}
                                </Text>
                                <Badge variant="status" status={badge.status}>
                                    {badge.label}
                                </Badge>
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

export const getServerSideProps = () => ({ props: {} });

export default MedicalRecordsPage;
