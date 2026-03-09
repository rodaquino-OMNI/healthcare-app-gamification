import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Input } from 'design-system/components/Input/Input';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState, useMemo } from 'react';
import { WEB_HEALTH_ROUTES } from 'shared/constants/routes';

/**
 * Pharmacy data model
 */
interface Pharmacy {
    id: string;
    name: string;
    address: string;
    distance: string;
    phone: string;
    isOpen: boolean;
    hours: string;
}

/**
 * Mock pharmacies for development
 */
const MOCK_PHARMACIES: Pharmacy[] = [
    {
        id: '1',
        name: 'Drogaria Sao Paulo',
        address: 'Av. Paulista, 1578 - Bela Vista',
        distance: '0.3 km',
        phone: '(11) 3456-7890',
        isOpen: true,
        hours: '07:00 - 22:00',
    },
    {
        id: '2',
        name: 'Droga Raia',
        address: 'R. Augusta, 2340 - Consolacao',
        distance: '0.8 km',
        phone: '(11) 3210-4567',
        isOpen: true,
        hours: '08:00 - 21:00',
    },
    {
        id: '3',
        name: 'Farmacia Pague Menos',
        address: 'R. Haddock Lobo, 595 - Cerqueira Cesar',
        distance: '1.2 km',
        phone: '(11) 3789-0123',
        isOpen: false,
        hours: '08:00 - 20:00',
    },
    {
        id: '4',
        name: 'Drogasil',
        address: 'R. Oscar Freire, 710 - Jardins',
        distance: '1.5 km',
        phone: '(11) 3654-3210',
        isOpen: true,
        hours: '07:00 - 23:00',
    },
    {
        id: '5',
        name: 'Farmacia Panvel',
        address: 'Al. Santos, 1150 - Cerqueira Cesar',
        distance: '2.1 km',
        phone: '(11) 3098-7654',
        isOpen: false,
        hours: '09:00 - 19:00',
    },
];

/**
 * Pharmacy locator page with searchable list of nearby pharmacies.
 * Mirrors the mobile MedicationPharmacyLocator screen.
 */
const PharmacyLocatorPage: React.FC = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPharmacies = useMemo(() => {
        if (!searchQuery.trim()) {
            return MOCK_PHARMACIES;
        }
        const query = searchQuery.toLowerCase();
        return MOCK_PHARMACIES.filter(
            (p) => p.name.toLowerCase().includes(query) || p.address.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    const handleGetDirections = (pharmacy: Pharmacy): void => {
        window.alert(`Opening directions to ${pharmacy.name}`);
    };

    const handleCall = (pharmacy: Pharmacy): void => {
        window.location.href = `tel:${pharmacy.phone.replace(/[^\d+]/g, '')}`;
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Box display="flex" style={{ alignItems: 'center', marginBottom: spacing.xl }}>
                <button
                    onClick={() => void router.push(WEB_HEALTH_ROUTES.MEDICATIONS)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: colors.journeys.health.primary,
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 500,
                        padding: 0,
                    }}
                >
                    Back
                </button>
            </Box>

            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                Find Nearby Pharmacies
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Locate pharmacies near you for prescription pickup and refills.
            </Text>

            {/* Search */}
            <Box style={{ marginBottom: spacing.xl }}>
                <Input
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    placeholder="Search by pharmacy name or address..."
                    journey="health"
                    testID="pharmacy-search-input"
                />
            </Box>

            {/* Map Placeholder */}
            <div
                style={{
                    height: '200px',
                    borderRadius: '12px',
                    backgroundColor: colors.gray[10],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: spacing.xs,
                    marginBottom: spacing.xl,
                }}
            >
                <Text fontSize="xl" color={colors.gray[40]}>
                    Map View
                </Text>
                <Text fontSize="sm" color={colors.gray[30]}>
                    Interactive map coming soon
                </Text>
            </div>

            {/* Pharmacy List */}
            {filteredPharmacies.length === 0 ? (
                <Box style={{ textAlign: 'center', padding: spacing['3xl'] }}>
                    <Text fontSize="lg" color={colors.gray[40]}>
                        No pharmacies found matching your search.
                    </Text>
                </Box>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                    {filteredPharmacies.map((pharmacy) => (
                        <Card key={pharmacy.id} journey="health" elevation="sm" padding="md">
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                style={{ alignItems: 'flex-start', marginBottom: spacing.sm }}
                            >
                                <div>
                                    <Text fontWeight="semiBold" fontSize="lg">
                                        {pharmacy.name}
                                    </Text>
                                    <Text fontSize="sm" color={colors.gray[50]}>
                                        {pharmacy.address}
                                    </Text>
                                    <Text fontSize="xs" color={colors.gray[40]}>
                                        {pharmacy.distance} | {pharmacy.hours}
                                    </Text>
                                </div>
                                <span
                                    style={{
                                        padding: `${spacing['3xs']} ${spacing.xs}`,
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: pharmacy.isOpen ? colors.semantic.success : colors.semantic.error,
                                        backgroundColor: pharmacy.isOpen
                                            ? colors.semantic.successBg
                                            : colors.semantic.errorBg,
                                    }}
                                >
                                    {pharmacy.isOpen ? 'Open' : 'Closed'}
                                </span>
                            </Box>
                            <Box display="flex" style={{ gap: spacing.sm }}>
                                <Button
                                    variant="secondary"
                                    journey="health"
                                    onPress={() => handleGetDirections(pharmacy)}
                                    accessibilityLabel={`Get directions to ${pharmacy.name}`}
                                >
                                    Get Directions
                                </Button>
                                <Button
                                    variant="secondary"
                                    journey="health"
                                    onPress={() => handleCall(pharmacy)}
                                    accessibilityLabel={`Call ${pharmacy.name}`}
                                >
                                    Call
                                </Button>
                            </Box>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PharmacyLocatorPage;
