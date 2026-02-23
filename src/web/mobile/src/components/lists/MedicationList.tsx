import React, { useState } from 'react';
import { Card } from '@design-system/components/Card/Card';
import { formatDate } from '@utils/date';
import { LoadingIndicator } from '@components/shared/LoadingIndicator';
import EmptyState from '@components/shared/EmptyState';
import { JOURNEY_IDS } from '@shared/constants/journeys';

// Define the Medication interface
interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  notes?: string;
}

/**
 * Displays a list of medications for a user, allowing them to track and manage their medication schedule.
 */
export const MedicationList: React.FC = () => {
  // Sample medication data - in a real implementation, this would come from an API
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Aspirin',
      dosage: '100mg',
      frequency: 'Once daily',
      startDate: '2023-04-01T00:00:00Z',
      endDate: '2023-10-01T00:00:00Z',
      notes: 'Take with food'
    },
    {
      id: '2',
      name: 'Vitamin D',
      dosage: '1000IU',
      frequency: 'Once daily',
      startDate: '2023-03-15T00:00:00Z',
      notes: 'Take with breakfast'
    },
    {
      id: '3',
      name: 'Atenolol',
      dosage: '50mg',
      frequency: 'Twice daily',
      startDate: '2023-02-10T00:00:00Z',
      endDate: '2023-08-10T00:00:00Z',
      notes: 'Take morning and evening'
    }
  ]);
  
  // Loading state - would be triggered during API calls
  const [isLoading, setIsLoading] = useState(false);

  // If medications are loading, display a LoadingIndicator
  if (isLoading) {
    return <LoadingIndicator journey={JOURNEY_IDS.CARE as 'health' | 'care' | 'plan'} label="Loading medications..." />;
  }

  // If there are no medications, display an EmptyState
  if (medications.length === 0) {
    return (
      <EmptyState
        icon="pill"
        title="No medications found"
        description="You don't have any medications added yet. Adding your medications helps us track your treatment plan and remind you when to take them."
        actionLabel="Add Medication"
        onAction={() => {/* Navigation logic would go here */}}
        journey={JOURNEY_IDS.CARE as 'health' | 'care' | 'plan'}
      />
    );
  }

  // If there are medications, map over the list and render a Card for each
  return (
    <div className="medication-list">
      {medications.map(medication => {
        const startDateFormatted = formatDate(new Date(medication.startDate), 'dd/MM/yyyy');
        const endDateFormatted = medication.endDate 
          ? formatDate(new Date(medication.endDate), 'dd/MM/yyyy') 
          : 'Ongoing';
        
        return (
          <Card
            key={medication.id}
            journey={JOURNEY_IDS.CARE as 'health' | 'care' | 'plan'}
            elevation="sm"
            margin="md"
            padding="md"
            interactive
            accessibilityLabel={`Medication: ${medication.name}, ${medication.dosage}, ${medication.frequency}`}
          >
            <div className="medication-card-content">
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                {medication.name}
              </h3>
              <p style={{ fontSize: '16px', marginBottom: '4px' }}>
                {medication.dosage}
              </p>
              <p style={{ fontSize: '16px', marginBottom: '8px', color: '#616161' }}>
                {medication.frequency}
              </p>
              <p style={{ fontSize: '14px', color: '#757575', marginBottom: '4px' }}>
                {startDateFormatted} - {endDateFormatted}
              </p>
              {medication.notes && (
                <p style={{ fontSize: '14px', color: '#757575', fontStyle: 'italic' }}>
                  {medication.notes}
                </p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};