import { Input } from '@design-system/components/Input';
import { Text } from '@design-system/primitives/Text/Text';
import { colors } from '@design-system/tokens/colors';
import { spacingValues } from '@design-system/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import { JourneyHeader } from '@components/shared/JourneyHeader';
import { LoadingIndicator } from '@components/shared/LoadingIndicator';
import { ROUTES } from '@constants/routes';

import { SPECIALTIES_KEYS as SPECIALTIES, SpecialtyTabs, ControlsRow } from './DoctorSearchFilters';
import { Doctor, MOCK_DOCTORS, DoctorItem, MapPlaceholder } from './DoctorSearchList';
import type { CareStackParamList } from '../../navigation/types';

/**
 * DoctorSearch screen allows users to search for doctors by name or specialty,
 * filter by specialty tabs, sort results, and toggle between list and map views.
 *
 * Part of the Care Now journey (orange theme).
 */
const DoctorSearch: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<CareStackParamList>>();
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState(0);
    const [sortBy, setSortBy] = useState('relevancia');
    const [isMapView, setIsMapView] = useState(false);
    const [isLoading, _setIsLoading] = useState(false);

    /**
     * Filters doctors based on search query and selected specialty.
     */
    const getFilteredDoctors = useCallback((): Doctor[] => {
        let filtered = [...MOCK_DOCTORS];

        // Filter by specialty (index 0 = Todos = show all)
        if (selectedSpecialty > 0) {
            const specialty = SPECIALTIES[selectedSpecialty];
            filtered = filtered.filter((doc) => doc.specialty === specialty);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (doc) => doc.name.toLowerCase().includes(query) || doc.specialty.toLowerCase().includes(query)
            );
        }

        // Sort results
        switch (sortBy) {
            case 'avaliacao':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'distancia':
                filtered.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
                break;
            case 'preco':
                filtered.sort(
                    (a, b) => parseInt(a.price.replace(/\D/g, ''), 10) - parseInt(b.price.replace(/\D/g, ''), 10)
                );
                break;
            default:
                break;
        }

        return filtered;
    }, [searchQuery, selectedSpecialty, sortBy]);

    const filteredDoctors = getFilteredDoctors();

    /**
     * Navigates to the doctor profile screen.
     */
    const handleViewProfile = (doctorId: string): void => {
        navigation.navigate(ROUTES.CARE_DOCTOR_PROFILE, { doctorId });
    };

    /**
     * Navigates to the filters screen.
     */
    const handleOpenFilters = (): void => {
        navigation.navigate(ROUTES.CARE_DOCTOR_FILTERS);
    };

    return (
        <View style={styles.root}>
            <JourneyHeader
                title={t('journeys.care.doctorSearch.title')}
                showBackButton
                rightActions={
                    <TouchableOpacity
                        onPress={handleOpenFilters}
                        accessibilityLabel="Abrir filtros"
                        style={styles.filterButton}
                    >
                        <Text fontSize="md" color={colors.neutral.white} fontWeight="medium">
                            {t('journeys.care.doctorSearch.filters')}
                        </Text>
                    </TouchableOpacity>
                }
            />

            <View style={styles.searchContainer}>
                <Input
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder={t('journeys.care.doctorSearch.searchPlaceholder')}
                    journey="care"
                    type="search"
                    aria-label="Buscar por nome ou especialidade"
                    testID="doctor-search-input"
                />
            </View>

            {/* Specialty filter tabs (horizontal scroll) */}
            <SpecialtyTabs selectedSpecialty={selectedSpecialty} onSelect={setSelectedSpecialty} />

            {/* Sort and view toggle row */}
            <ControlsRow
                sortBy={sortBy}
                onSortChange={setSortBy}
                isMapView={isMapView}
                onToggleView={() => setIsMapView(!isMapView)}
            />

            {/* Results area */}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <LoadingIndicator journey="care" label={t('journeys.care.doctorSearch.searching')} />
                </View>
            ) : isMapView ? (
                <MapPlaceholder />
            ) : (
                <FlatList
                    data={filteredDoctors}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <DoctorItem item={item} onViewProfile={handleViewProfile} />}
                    contentContainerStyle={styles.listContent}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text fontSize="md" color={colors.neutral.gray500} textAlign="center">
                                {t('journeys.care.doctorSearch.noResults')}
                            </Text>
                            <Text fontSize="sm" color={colors.neutral.gray500} textAlign="center">
                                {t('journeys.care.doctorSearch.adjustSearch')}
                            </Text>
                        </View>
                    }
                    testID="doctor-results-list"
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.journeys.care.background,
    },
    searchContainer: {
        paddingHorizontal: spacingValues.md,
        paddingTop: spacingValues.md,
    },
    filterButton: {
        paddingVertical: spacingValues['3xs'],
        paddingHorizontal: spacingValues.sm,
        borderRadius: spacingValues.xs,
        borderWidth: 1,
        borderColor: colors.neutral.white,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: spacingValues['3xl'],
    },
    listContent: {
        padding: spacingValues.md,
        paddingBottom: spacingValues['3xl'],
    },
    separator: {
        height: spacingValues.sm,
    },
    emptyContainer: {
        paddingTop: spacingValues['3xl'],
        alignItems: 'center',
        gap: spacingValues.xs,
    },
});

export default DoctorSearch;
