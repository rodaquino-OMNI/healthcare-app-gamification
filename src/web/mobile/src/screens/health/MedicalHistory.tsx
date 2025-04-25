import React, { useState, useEffect } from 'react'; // react v18.0.0
import { View, StyleSheet, FlatList } from 'react-native'; // react-native v0.71.0

import { MedicalEvent } from 'src/web/mobile/src/types/index';
import { ROUTES } from 'src/web/mobile/src/constants/routes';
import { useHealthMetrics } from 'src/web/mobile/src/hooks/useHealthMetrics';
import { getMedicalHistory } from 'src/web/mobile/src/api/health';
import { JourneyHeader } from 'src/web/mobile/src/components/shared/JourneyHeader';
import { Card, CardProps } from 'src/web/design-system/src/components/Card/Card';
import { useJourney } from 'src/web/mobile/src/context/JourneyContext';
import { formatDate } from 'src/web/mobile/src/utils/date';

/**
 * MedicalHistory Component:
 * Displays the user's medical history timeline, fetching data and rendering it in a chronological order.
 * It includes filtering options and handles empty state scenarios.
 */
const MedicalHistory = () => {
  // State variables for managing medical history data and loading state
  const [medicalHistory, setMedicalHistory] = useState<MedicalEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { journey } = useJourney();

  // Fetch medical history data using the useHealthMetrics hook
  // const { data, error } = useHealthMetrics(userId, null, null, []);

  // useEffect hook to fetch medical history data when the component mounts
  useEffect(() => {
    // Async function to fetch medical history
    const fetchHistory = async () => {
      try {
        // Simulate fetching medical history data (replace with actual API call)
        const history = await getMedicalHistory('user-123', [], null, null);
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
  const renderItem = ({ item }: { item: MedicalEvent }) => (
    <Card style={styles.card}>
      <View style={styles.eventContainer}>
        <View style={styles.eventDetails}>
          <Text style={styles.eventTitle}>{item.type}</Text>
          <Text style={styles.eventDate}>{formatDate(new Date(item.date), 'MMMM dd, yyyy')}</Text>
          <Text style={styles.eventDescription}>{item.description}</Text>
        </View>
      </View>
    </Card>
  );

  // Key extractor for FlatList
  const keyExtractor = (item: MedicalEvent) => item.id;

  // Render the component
  return (
    <View style={styles.container}>
      <JourneyHeader title="Medical History" showBackButton={true} />
      {loading ? (
        <Text>Loading medical history...</Text>
      ) : medicalHistory.length > 0 ? (
        <FlatList
          data={medicalHistory}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      ) : (
        <Text>No medical history available.</Text>
      )}
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
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