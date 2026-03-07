import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Tabs } from 'src/web/design-system/src/components/Tabs/Tabs';
import { Badge } from 'src/web/design-system/src/components/Badge/Badge';
import Input from 'src/web/design-system/src/components/Input/Input';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import { WEB_HEALTH_ROUTES } from 'src/web/shared/constants/routes';

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
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredMedications = MOCK_MEDICATIONS.filter((med) =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeMeds = filteredMedications.filter((m) => m.status === 'active');
    const completedMeds = filteredMedications.filter((m) => m.status === 'completed');

    const handleAddMedication = () => {
        router.push(WEB_HEALTH_ROUTES.MEDICATION_ADD);
    };

    const handleViewDetail = (id: string) => {
        router.push(`/health/medications/${id}`);
    };

    const renderMedicationCard = (med: Medication) => (
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
                    onChange={(e) => setSearchTerm(e.target.value)}
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

export default MedicationsPage;
