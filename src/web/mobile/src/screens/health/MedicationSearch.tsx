import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Button } from '@austa/design-system/src/components/Button/Button';
import Input from '@austa/design-system/src/components/Input/Input';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, FlatList, StyleSheet, Alert, ListRenderItemInfo } from 'react-native';

import { ROUTES } from '../../constants/routes';
import type { HealthStackParamList } from '../../navigation/types';

/**
 * Medication database entry used for search autocomplete
 */
interface MedicationDBEntry {
    id: string;
    name: string;
    commonDosage: string;
    drugClass: string;
}

/**
 * Mock medication database for search
 */
const MEDICATIONS_DB: MedicationDBEntry[] = [
    { id: '1', name: 'Acetaminophen', commonDosage: '500mg', drugClass: 'Analgesic' },
    { id: '2', name: 'Ibuprofen', commonDosage: '200mg', drugClass: 'NSAID' },
    { id: '3', name: 'Amoxicillin', commonDosage: '500mg', drugClass: 'Antibiotic' },
    { id: '4', name: 'Metformin', commonDosage: '500mg', drugClass: 'Antidiabetic' },
    { id: '5', name: 'Lisinopril', commonDosage: '10mg', drugClass: 'ACE Inhibitor' },
    { id: '6', name: 'Atorvastatin', commonDosage: '20mg', drugClass: 'Statin' },
    { id: '7', name: 'Omeprazole', commonDosage: '20mg', drugClass: 'PPI' },
    { id: '8', name: 'Levothyroxine', commonDosage: '50mcg', drugClass: 'Thyroid' },
    { id: '9', name: 'Amlodipine', commonDosage: '5mg', drugClass: 'CCB' },
    { id: '10', name: 'Metoprolol', commonDosage: '25mg', drugClass: 'Beta Blocker' },
    { id: '11', name: 'Losartan', commonDosage: '50mg', drugClass: 'ARB' },
    { id: '12', name: 'Sertraline', commonDosage: '50mg', drugClass: 'SSRI' },
];

/**
 * MedicationSearch screen provides a searchable medication database.
 * Selecting a result navigates back to MedicationAdd with the name pre-filled.
 */
const MedicationSearch: React.FC = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<HealthStackParamList>>();
    const [searchQuery, setSearchQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState<string[]>(['Metformin', 'Lisinopril']);

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) {
            return [];
        }
        const query = searchQuery.toLowerCase();
        return MEDICATIONS_DB.filter(
            (med) => med.name.toLowerCase().includes(query) || med.drugClass.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);

    const handleSelectMedication = useCallback(
        (medication: MedicationDBEntry) => {
            // Add to recent searches if not already present
            setRecentSearches((prev) => {
                const filtered = prev.filter((s) => s !== medication.name);
                return [medication.name, ...filtered].slice(0, 5);
            });

            navigation.navigate(ROUTES.HEALTH_MEDICATION_ADD);
        },
        [navigation]
    );

    const handleRecentSearch = useCallback((name: string) => {
        setSearchQuery(name);
    }, []);

    const handleScanBarcode = useCallback(() => {
        Alert.alert(t('journeys.care.medications.scanBarcode'), t('journeys.care.medications.scanBarcodeHint'));
    }, []);

    const renderSearchResult = useCallback(
        ({ item }: ListRenderItemInfo<MedicationDBEntry>) => (
            <Touchable
                onPress={() => handleSelectMedication(item)}
                accessibilityLabel={`Select ${item.name}, ${item.commonDosage}, ${item.drugClass}`}
                accessibilityHint="Selects this medication and returns to the add form"
                testID={`search-result-${item.id}`}
                journey="health"
            >
                <View style={styles.resultItem}>
                    <View style={styles.resultInfo}>
                        <Text fontWeight="medium" fontSize="md">
                            {item.name}
                        </Text>
                        <Text fontSize="sm" color={colors.neutral.gray600}>
                            {item.commonDosage}
                        </Text>
                    </View>
                    <Badge variant="status" status="neutral" accessibilityLabel={`Drug class: ${item.drugClass}`}>
                        {item.drugClass}
                    </Badge>
                </View>
            </Touchable>
        ),
        [handleSelectMedication]
    );

    const resultKeyExtractor = useCallback((item: MedicationDBEntry) => item.id, []);

    const showRecentSearches = searchQuery.trim().length === 0 && recentSearches.length > 0;
    const showNoResults = searchQuery.trim().length > 0 && searchResults.length === 0;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Touchable
                    onPress={() => navigation.goBack()}
                    accessibilityLabel="Go back"
                    accessibilityRole="button"
                    testID="back-button"
                >
                    <Text fontSize="lg" color={colors.journeys.health.primary}>
                        {t('common.buttons.back')}
                    </Text>
                </Touchable>
                <Text variant="heading" journey="health">
                    {t('journeys.care.medications.search')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <Input
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder={t('common.placeholders.search')}
                    journey="health"
                    aria-label="Search medications"
                    testID="medication-search-input"
                    type="search"
                />
            </View>

            {/* Scan Barcode Button */}
            <View style={styles.scanContainer}>
                <Button
                    variant="secondary"
                    journey="health"
                    onPress={handleScanBarcode}
                    icon="camera"
                    accessibilityLabel="Scan medication barcode"
                >
                    {t('journeys.care.medications.scanBarcode')}
                </Button>
            </View>

            {/* Recent Searches */}
            {showRecentSearches && (
                <View style={styles.sectionContainer}>
                    <Text fontSize="sm" fontWeight="semiBold" color={colors.neutral.gray600}>
                        {t('journeys.care.medications.recentSearches')}
                    </Text>
                    <View style={styles.recentList}>
                        {recentSearches.map((name, index) => (
                            <Touchable
                                key={`recent-${index}`}
                                onPress={() => handleRecentSearch(name)}
                                accessibilityLabel={`Recent search: ${name}`}
                                testID={`recent-search-${index}`}
                                style={styles.recentItem}
                            >
                                <Text fontSize="md" color={colors.journeys.health.primary}>
                                    {name}
                                </Text>
                            </Touchable>
                        ))}
                    </View>
                </View>
            )}

            {/* Search Results */}
            {searchQuery.trim().length > 0 && (
                <FlatList
                    data={searchResults}
                    renderItem={renderSearchResult}
                    keyExtractor={resultKeyExtractor}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    testID="search-results-list"
                    ListEmptyComponent={
                        showNoResults ? (
                            <View style={styles.emptyState}>
                                <Text fontSize="md" color={colors.neutral.gray500} textAlign="center">
                                    {t('journeys.care.medications.noResults', { query: searchQuery })}
                                </Text>
                                <Text fontSize="sm" color={colors.neutral.gray500} textAlign="center">
                                    {t('journeys.care.medications.noResultsHint')}
                                </Text>
                            </View>
                        ) : null
                    }
                />
            )}
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
    scanContainer: {
        paddingHorizontal: spacingValues.md,
        paddingBottom: spacingValues.md,
    },
    sectionContainer: {
        paddingHorizontal: spacingValues.md,
        paddingBottom: spacingValues.sm,
    },
    recentList: {
        marginTop: spacingValues.xs,
    },
    recentItem: {
        paddingVertical: spacingValues.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.gray200,
    },
    listContent: {
        paddingHorizontal: spacingValues.md,
        paddingBottom: spacingValues['3xl'],
    },
    resultItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacingValues.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.gray200,
    },
    resultInfo: {
        flex: 1,
        marginRight: spacingValues.sm,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacingValues['3xl'],
        gap: spacingValues.xs,
    },
});

export default MedicationSearch;
