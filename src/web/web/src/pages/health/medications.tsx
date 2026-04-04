import { Badge } from 'design-system/components/Badge/Badge';
import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Input } from 'design-system/components/Input/Input';
import { Tabs } from 'design-system/components/Tabs/Tabs';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WEB_HEALTH_ROUTES } from 'shared/constants/routes';

import { useMedications } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

/** Medication data type */
interface Medication {
    id: string;
    name: string;
    dosage: string;
    schedule: string;
    status: 'active' | 'completed';
    adherence: boolean;
    refillDate?: string;
}

/** Mock medication data */
const MOCK_MEDICATIONS: Medication[] = [
    {
        id: '1',
        name: 'Losartan',
        dosage: '50mg',
        schedule: 'Once daily, morning',
        status: 'active',
        adherence: true,
        refillDate: '2026-03-15',
    },
    {
        id: '2',
        name: 'Metformin',
        dosage: '500mg',
        schedule: 'Twice daily with meals',
        status: 'active',
        adherence: true,
        refillDate: '2026-03-01',
    },
    {
        id: '3',
        name: 'Omeprazole',
        dosage: '20mg',
        schedule: 'Once daily before breakfast',
        status: 'active',
        adherence: false,
        refillDate: '2026-02-28',
    },
    {
        id: '4',
        name: 'Amoxicillin',
        dosage: '500mg',
        schedule: '3 times daily for 10 days',
        status: 'completed',
        adherence: true,
    },
    { id: '5', name: 'Prednisone', dosage: '10mg', schedule: 'Tapering course', status: 'completed', adherence: true },
];

/**
 * Medication list page with tab navigation for Active and Completed medications.
 * Includes search functionality and links to add/view individual medications.
 */
const MedicationsPage: React.FC = () => {
    const { t } = useTranslation();
    const { medications, loading, error, refetch } = useMedications();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    if (loading) {
        return (
            <div style={{ padding: '24px' }}>
                <p>{t('common.loading')}</p>
            </div>
        );
    }
    if (error) {
        return (
            <div style={{ padding: '24px' }}>
                <p>
                    {t('common.error')} <button onClick={refetch}>Retry</button>
                </p>
            </div>
        );
    }

    void medications;

    const filteredMedications = MOCK_MEDICATIONS.filter((med) =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeMeds = filteredMedications.filter((m) => m.status === 'active');
    const completedMeds = filteredMedications.filter((m) => m.status === 'completed');

    const handleAddMedication = (): void => {
        void router.push(WEB_HEALTH_ROUTES.MEDICATION_ADD);
    };

    const handleViewDetail = (id: string): void => {
        void router.push(`/health/medications/${id}`);
    };

    const renderMedicationCard = (med: Medication): React.ReactNode => (
        <Card
            key={med.id}
            journey="health"
            elevation="sm"
            interactive
            onPress={() => handleViewDetail(med.id)}
            padding="md"
            accessibilityLabel={`${med.name} ${med.dosage}, ${med.schedule}`}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Box display="flex" alignItems="center" style={{ gap: spacing.xs }}>
                        <Text fontWeight="bold" fontSize="md">
                            {med.name}
                        </Text>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {med.dosage}
                        </Text>
                    </Box>
                    <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing['3xs'] }}>
                        {med.schedule}
                    </Text>
                    {med.refillDate && (
                        <Text fontSize="xs" color={colors.gray[40]} style={{ marginTop: spacing['3xs'] }}>
                            Refill by: {med.refillDate}
                        </Text>
                    )}
                </Box>
                <Badge variant="status" status={med.adherence ? 'success' : 'warning'}>
                    {med.adherence ? 'On track' : 'Missed'}
                </Badge>
            </Box>
        </Card>
    );

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                    Medications
                </Text>
                <Button
                    journey="health"
                    size="sm"
                    onPress={handleAddMedication}
                    icon="plus"
                    accessibilityLabel="Add a new medication"
                >
                    Add Medication
                </Button>
            </Box>

            <Box style={{ marginTop: spacing.md, marginBottom: spacing.md }}>
                <Input
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    placeholder="Search medications..."
                    journey="health"
                    aria-label="Search medications"
                    testID="medication-search"
                />
            </Box>

            <Tabs journey="health" defaultTab={0}>
                <Tabs.TabList>
                    <Tabs.Tab label={`Active (${activeMeds.length})`} />
                    <Tabs.Tab label={`Completed (${completedMeds.length})`} />
                </Tabs.TabList>

                <Tabs.Panel index={0}>
                    {activeMeds.length === 0 ? (
                        <Box style={{ textAlign: 'center', padding: spacing.xl }}>
                            <Text color={colors.gray[50]}>
                                {searchTerm ? 'No active medications match your search.' : 'No active medications.'}
                            </Text>
                        </Box>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                            {activeMeds.map(renderMedicationCard)}
                        </div>
                    )}
                </Tabs.Panel>

                <Tabs.Panel index={1}>
                    {completedMeds.length === 0 ? (
                        <Box style={{ textAlign: 'center', padding: spacing.xl }}>
                            <Text color={colors.gray[50]}>
                                {searchTerm
                                    ? 'No completed medications match your search.'
                                    : 'No completed medications.'}
                            </Text>
                        </Box>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                            {completedMeds.map(renderMedicationCard)}
                        </div>
                    )}
                </Tabs.Panel>
            </Tabs>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default MedicationsPage;
