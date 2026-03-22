import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';

import { ROUTES } from '@constants/routes';

import type { CareStackParamList } from '../../navigation/types';

interface SavedDoctor {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    nextAvailable: string;
    saved: boolean;
}

const MOCK_SAVED: SavedDoctor[] = [
    {
        id: 'doc-001',
        name: 'Dra. Ana Carolina Silva',
        specialty: 'Cardiologia',
        rating: 4.9,
        nextAvailable: '05 Mar, 09:00',
        saved: true,
    },
    {
        id: 'doc-002',
        name: 'Dr. Ricardo Mendes',
        specialty: 'Dermatologia',
        rating: 4.7,
        nextAvailable: '06 Mar, 14:00',
        saved: true,
    },
    {
        id: 'doc-003',
        name: 'Dra. Juliana Costa',
        specialty: 'Pediatria',
        rating: 4.8,
        nextAvailable: '07 Mar, 10:30',
        saved: true,
    },
    {
        id: 'doc-004',
        name: 'Dr. Fernando Alves',
        specialty: 'Ortopedia',
        rating: 4.6,
        nextAvailable: '08 Mar, 11:00',
        saved: true,
    },
    {
        id: 'doc-005',
        name: 'Dra. Beatriz Santos',
        specialty: 'Ginecologia',
        rating: 4.8,
        nextAvailable: '09 Mar, 16:00',
        saved: true,
    },
];

const getInitials = (name: string): string => {
    const parts = name.replace(/Dr[a]?\.\s*/i, '').split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
};

const renderStarsText = (rating: number): string => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '\u2605'.repeat(full) + (half ? '\u2606' : '') + '\u2606'.repeat(empty);
};

export const SavedDoctors: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<CareStackParamList>>();
    const { t } = useTranslation();
    const [doctors, setDoctors] = useState<SavedDoctor[]>(MOCK_SAVED);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDoctors = useMemo(() => {
        if (!searchQuery.trim()) {
            return doctors.filter((d) => d.saved);
        }
        const query = searchQuery.toLowerCase();
        return doctors.filter((d) => d.saved && d.name.toLowerCase().includes(query));
    }, [doctors, searchQuery]);

    const handleToggleSave = useCallback((doctorId: string) => {
        setDoctors((prev) => prev.map((d) => (d.id === doctorId ? { ...d, saved: !d.saved } : d)));
    }, []);

    const handleBookNow = useCallback(
        (doctorId: string) => {
            navigation.navigate(ROUTES.CARE_DOCTOR_AVAILABILITY, { doctorId });
        },
        [navigation]
    );

    const handleFindDoctors = useCallback(() => {
        navigation.navigate(ROUTES.CARE_DOCTOR_SEARCH);
    }, [navigation]);

    const renderItem = useCallback(
        ({ item }: { item: SavedDoctor }) => (
            <Card journey="care" elevation="sm">
                <View style={styles.cardRow}>
                    <View style={styles.avatar} testID={`avatar-${item.id}`}>
                        <Text fontSize="md" fontWeight="bold" color={colors.neutral.white}>
                            {getInitials(item.name)}
                        </Text>
                    </View>
                    <View style={styles.doctorInfo}>
                        <View style={styles.nameRow}>
                            <Text
                                fontSize="md"
                                fontWeight="bold"
                                color={colors.journeys.care.text}
                                style={styles.nameText}
                            >
                                {item.name}
                            </Text>
                            <TouchableOpacity
                                onPress={() => handleToggleSave(item.id)}
                                accessibilityLabel={t('consultation.savedDoctors.unsave')}
                                accessibilityRole="button"
                                testID={`unsave-${item.id}`}
                            >
                                <Text fontSize="lg" color={colors.journeys.care.primary}>
                                    {item.saved ? '\u2665' : '\u2661'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Badge journey="care" size="sm">
                            {item.specialty}
                        </Badge>
                        <View style={styles.ratingRow}>
                            <Text fontSize="sm" color={colors.journeys.care.primary}>
                                {renderStarsText(item.rating)} {item.rating}
                            </Text>
                        </View>
                        <Text fontSize="sm" color={colors.neutral.gray500}>
                            {t('consultation.savedDoctors.nextAvailable')}: {item.nextAvailable}
                        </Text>
                        <View style={styles.bookRow}>
                            <Button
                                journey="care"
                                variant="primary"
                                size="sm"
                                onPress={() => handleBookNow(item.id)}
                                accessibilityLabel={`${t('consultation.savedDoctors.bookNow')} ${item.name}`}
                                testID={`book-${item.id}`}
                            >
                                {t('consultation.savedDoctors.bookNow')}
                            </Button>
                        </View>
                    </View>
                </View>
            </Card>
        ),
        [handleToggleSave, handleBookNow, t]
    );

    const renderEmpty = useCallback(
        () => (
            <View style={styles.emptyState}>
                <Text fontSize="md" color={colors.neutral.gray500} textAlign="center">
                    {t('consultation.savedDoctors.empty')}
                </Text>
                <View style={styles.emptyAction}>
                    <Button
                        journey="care"
                        variant="primary"
                        onPress={handleFindDoctors}
                        accessibilityLabel={t('consultation.savedDoctors.findDoctors')}
                        testID="find-doctors-button"
                    >
                        {t('consultation.savedDoctors.findDoctors')}
                    </Button>
                </View>
            </View>
        ),
        [handleFindDoctors, t]
    );

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    testID="back-button"
                    accessibilityRole="button"
                    accessibilityLabel={t('common.back')}
                >
                    <Text fontSize="lg">{'<-'}</Text>
                </TouchableOpacity>
                <Text fontSize="lg" fontWeight="bold" color={colors.journeys.care.text}>
                    {t('consultation.savedDoctors.title')}
                </Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder={t('consultation.savedDoctors.searchPlaceholder')}
                    placeholderTextColor={colors.neutral.gray500}
                    accessibilityLabel={t('consultation.savedDoctors.searchPlaceholder')}
                    testID="search-input"
                />
            </View>

            <FlatList
                data={filteredDoctors}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmpty}
                testID="saved-doctors-list"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.journeys.care.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacingValues.md,
        paddingTop: spacingValues.lg,
        paddingBottom: spacingValues.sm,
    },
    searchContainer: { paddingHorizontal: spacingValues.md, paddingBottom: spacingValues.sm },
    searchInput: {
        borderWidth: 1,
        borderColor: colors.neutral.gray300,
        borderRadius: spacingValues.xs,
        paddingVertical: spacingValues.xs,
        paddingHorizontal: spacingValues.sm,
        color: colors.journeys.care.text,
        fontSize: 14,
    },
    listContent: {
        padding: spacingValues.md,
        paddingBottom: spacingValues['3xl'],
        gap: spacingValues.sm,
    },
    cardRow: { flexDirection: 'row', gap: spacingValues.sm },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.journeys.care.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    doctorInfo: { flex: 1, gap: spacingValues['3xs'] },
    nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    nameText: { flex: 1 },
    ratingRow: { marginTop: spacingValues['3xs'] },
    bookRow: { marginTop: spacingValues.xs, alignItems: 'flex-start' },
    emptyState: { alignItems: 'center', paddingVertical: spacingValues['5xl'], gap: spacingValues.sm },
    emptyAction: { marginTop: spacingValues.sm },
});

export default SavedDoctors;
