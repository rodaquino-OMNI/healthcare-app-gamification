import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, FlatList, StyleSheet, TextInput, ListRenderItemInfo, Alert, Linking } from 'react-native';

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
 * MedicationPharmacyLocator displays a map placeholder and a searchable list
 * of nearby pharmacies with contact and navigation actions.
 */
export const MedicationPharmacyLocator: React.FC = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
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

    const handleGetDirections = useCallback(
        (pharmacy: Pharmacy) => {
            Alert.alert(
                t('medication.pharmacyLocator.directionsTitle'),
                t('medication.pharmacyLocator.directionsMessage', { name: pharmacy.name })
            );
        },
        [t]
    );

    const handleCall = useCallback(
        (pharmacy: Pharmacy) => {
            const phoneUrl = `tel:${pharmacy.phone.replace(/[^\d+]/g, '')}`;
            Linking.canOpenURL(phoneUrl).then((supported) => {
                if (supported) {
                    Linking.openURL(phoneUrl);
                } else {
                    Alert.alert(t('medication.pharmacyLocator.callTitle'), pharmacy.phone);
                }
            });
        },
        [t]
    );

    const renderPharmacyItem = useCallback(
        ({ item }: ListRenderItemInfo<Pharmacy>) => (
            <Card journey="health" elevation="sm" padding="md">
                <View style={styles.pharmacyHeader}>
                    <View style={styles.pharmacyInfo}>
                        <Text fontWeight="semiBold" fontSize="lg">
                            {item.name}
                        </Text>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {item.address}
                        </Text>
                        <Text fontSize="xs" color={colors.gray[40]}>
                            {item.distance} | {item.hours}
                        </Text>
                    </View>
                    <Badge
                        variant="status"
                        status={item.isOpen ? 'success' : 'error'}
                        accessibilityLabel={
                            item.isOpen ? t('medication.pharmacyLocator.open') : t('medication.pharmacyLocator.closed')
                        }
                    >
                        {item.isOpen ? t('medication.pharmacyLocator.open') : t('medication.pharmacyLocator.closed')}
                    </Badge>
                </View>
                <View style={styles.pharmacyActions}>
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={() => handleGetDirections(item)}
                        accessibilityLabel={t('medication.pharmacyLocator.getDirections')}
                        testID={`directions-button-${item.id}`}
                    >
                        {t('medication.pharmacyLocator.getDirections')}
                    </Button>
                    <View style={styles.actionSpacer} />
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={() => handleCall(item)}
                        accessibilityLabel={t('medication.pharmacyLocator.call')}
                        testID={`call-button-${item.id}`}
                    >
                        {t('medication.pharmacyLocator.call')}
                    </Button>
                </View>
            </Card>
        ),
        [handleGetDirections, handleCall, t]
    );

    const keyExtractor = useCallback((item: Pharmacy) => item.id, []);

    const renderEmptyState = useCallback(
        () => (
            <View style={styles.emptyState}>
                <Text fontSize="lg" color={colors.gray[40]} textAlign="center">
                    {t('medication.pharmacyLocator.noResults')}
                </Text>
            </View>
        ),
        [t]
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Touchable
                    onPress={() => navigation.goBack()}
                    accessibilityLabel={t('medication.back')}
                    accessibilityRole="button"
                    testID="back-button"
                >
                    <Text fontSize="lg" color={colors.journeys.health.primary}>
                        {t('medication.back')}
                    </Text>
                </Touchable>
                <Text variant="heading" journey="health">
                    {t('medication.pharmacyLocator.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder={t('medication.pharmacyLocator.searchPlaceholder')}
                    placeholderTextColor={colors.gray[40]}
                    testID="pharmacy-search-input"
                    accessibilityLabel={t('medication.pharmacyLocator.searchPlaceholder')}
                />
            </View>

            {/* Map Placeholder */}
            <View style={styles.mapPlaceholder}>
                <Text fontSize="xl" color={colors.gray[40]} textAlign="center">
                    {t('medication.pharmacyLocator.mapView')}
                </Text>
                <Text fontSize="sm" color={colors.gray[30]} textAlign="center">
                    {t('medication.pharmacyLocator.mapComingSoon')}
                </Text>
            </View>

            {/* Pharmacy List */}
            <FlatList
                data={filteredPharmacies}
                renderItem={renderPharmacyItem}
                keyExtractor={keyExtractor}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
                testID="pharmacy-list"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.journeys.health.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacingValues.md,
        paddingTop: spacingValues['3xl'],
        paddingBottom: spacingValues.sm,
    },
    headerSpacer: {
        width: 40,
    },
    searchContainer: {
        paddingHorizontal: spacingValues.md,
        paddingBottom: spacingValues.sm,
    },
    searchInput: {
        height: 44,
        borderWidth: 1,
        borderColor: colors.gray[20],
        borderRadius: 8,
        paddingHorizontal: spacingValues.sm,
        fontSize: 16,
        color: colors.gray[70],
        backgroundColor: colors.gray[0],
    },
    mapPlaceholder: {
        height: 180,
        marginHorizontal: spacingValues.md,
        marginBottom: spacingValues.sm,
        borderRadius: 12,
        backgroundColor: colors.gray[10],
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacingValues.xs,
    },
    listContent: {
        paddingHorizontal: spacingValues.md,
        paddingBottom: spacingValues['3xl'],
        gap: spacingValues.sm,
    },
    pharmacyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacingValues.sm,
    },
    pharmacyInfo: {
        flex: 1,
        marginRight: spacingValues.sm,
        gap: spacingValues['4xs'],
    },
    pharmacyActions: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    actionSpacer: {
        width: spacingValues.sm,
    },
    emptyState: {
        paddingVertical: spacingValues['5xl'],
        alignItems: 'center',
    },
});

export default MedicationPharmacyLocator;
