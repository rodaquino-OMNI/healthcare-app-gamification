/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { Card } from '@design-system/components/Card/Card';
import { colors } from '@design-system/tokens/colors';
import React, { useState, useEffect } from 'react'; // react v18.0.0
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, FlatList } from 'react-native'; // react-native v0.71.0

import { getMedicalHistory, HealthMetric } from '@api/health';
import { JourneyHeader } from '@components/shared/JourneyHeader';
import { useJourney } from '@context/JourneyContext';
import { formatDate } from '@utils/date';

/**
 * MedicalHistory Component:
 * Displays the user's medical history timeline, fetching data and rendering it in a chronological order.
 * It includes filtering options and handles empty state scenarios.
 */
const MedicalHistory = () => {
    const { t } = useTranslation();
    // State variables for managing medical history data and loading state
    const [medicalHistory, setMedicalHistory] = useState<HealthMetric[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { _journey } = useJourney();

    // Fetch medical history data using the useHealthMetrics hook
    // const { data, error } = useHealthMetrics(userId, null, null, []);

    // useEffect hook to fetch medical history data when the component mounts
    useEffect(() => {
        // Async function to fetch medical history
        const fetchHistory = async () => {
            try {
                // Simulate fetching medical history data (replace with actual API call)
                const history = await getMedicalHistory('user-123');
                setMedicalHistory(history);
            } catch (error) {
                console.error('Failed to fetch medical history:', error);
                // Handle error appropriately (e.g., display error message)
            } finally {
                setLoading(false);
            }
        };

        // Call the fetchHistory function
        fetchHistory();
    }, []);

    // Render item for the FlatList
    const renderItem = ({ item }: { item: HealthMetric }): React.ReactElement | null => (
        <Card style={styles.card}>
            <View style={styles.eventContainer}>
                <View style={styles.eventDetails}>
                    <Text style={styles.eventTitle}>{item.type}</Text>
                    <Text style={styles.eventDate}>{formatDate(new Date(item.timestamp), 'MMMM dd, yyyy')}</Text>
                    <Text style={styles.eventDescription}>{`${item.value} ${item.unit}`}</Text>
                </View>
            </View>
        </Card>
    );

    // Key extractor for FlatList
    const keyExtractor = (item: HealthMetric) => item.id;

    // Render the component
    return (
        <View style={styles.container}>
            <JourneyHeader title={t('journeys.health.history.title')} showBackButton={true} />
            {loading ? (
                <Text>{t('journeys.health.history.loading')}</Text>
            ) : medicalHistory.length > 0 ? (
                <FlatList data={medicalHistory} renderItem={renderItem} keyExtractor={keyExtractor} />
            ) : (
                <Text>{t('journeys.health.history.empty')}</Text>
            )}
        </View>
    );
};

// Styles for the component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.journeys.health.background,
    },
    card: {
        padding: 10,
        margin: 10,
    },
    eventContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eventDetails: {
        marginLeft: 10,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    eventDate: {
        fontSize: 14,
        color: 'gray',
    },
    eventDescription: {
        fontSize: 14,
    },
});

export default MedicalHistory;
