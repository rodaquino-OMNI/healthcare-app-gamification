import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Benefit } from 'src/web/shared/types/plan.types';
import EmptyState from '../components/shared/EmptyState';
import ErrorState from '../components/shared/ErrorState';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import JourneyHeader from '../components/shared/JourneyHeader';
import { JOURNEY_IDS } from 'src/web/shared/constants/journeys';

/**
 * BenefitsScreen component displays a list of benefits available to the user
 * under their insurance plan. It handles loading, error, and empty states.
 */
const BenefitsScreen: React.FC = () => {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    // In a real app, this would be an API call to fetch benefits data
    const fetchBenefits = async () => {
      try {
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, this would be the API response
        // For demonstration, using an empty array to show the empty state
        setBenefits([]);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching benefits:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchBenefits();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1 }}>
        <JourneyHeader />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <LoadingIndicator journey="plan" label="Loading benefits..." />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1 }}>
        <JourneyHeader />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ErrorState
            icon="error"
            title="Unable to load benefits"
            description="There was a problem loading your benefits. Please try again later."
            actionLabel="Try Again"
            onAction={() => {
              setLoading(true);
              setError(false);
              // In a real app, this would retry the API call
              fetchBenefits();
            }}
            journey="plan"
          />
        </View>
      </View>
    );
  }

  if (benefits.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <JourneyHeader />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <EmptyState
            icon="card"
            title="No benefits available"
            description="You don't have any benefits available under your current plan."
            journey="plan"
          />
        </View>
      </View>
    );
  }

  // Render the benefits list
  return (
    <View style={{ flex: 1 }}>
      <JourneyHeader />
      <FlatList
        data={benefits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View 
            style={{
              backgroundColor: 'white',
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
              borderLeftWidth: 4,
              borderLeftColor: '#3A86FF', // Plan journey color
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View style={{ marginBottom: 8 }}>
              <View style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 4 }}>{item.type}</View>
              <View style={{ marginBottom: 8 }}>{item.description}</View>
              {item.limitations && (
                <View style={{ fontSize: 14, color: '#666' }}>
                  <View style={{ fontWeight: '500' }}>Limitations: </View>
                  {item.limitations}
                </View>
              )}
              {item.usage && (
                <View style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
                  <View style={{ fontWeight: '500' }}>Usage: </View>
                  {item.usage}
                </View>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default BenefitsScreen;