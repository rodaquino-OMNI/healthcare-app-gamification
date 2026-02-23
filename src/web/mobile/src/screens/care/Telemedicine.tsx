import React, { useState, useEffect } from 'react'; // ^18.0.0
import { useNavigation } from '@react-navigation/native'; // 6.1.7
import { View, Text } from 'react-native'; // 0.71.0
import { useTranslation } from 'react-i18next';

import { useTelemedicineSession } from '@hooks/useTelemedicine';
import { JourneyHeader } from '@components/shared/JourneyHeader';
import { Button } from '@design-system/components/Button/Button';
import LoadingIndicator from '@components/shared/LoadingIndicator';
import ErrorState from '@components/shared/ErrorState';

/**
 * A React component that provides the UI for accessing telemedicine services.
 *
 * @returns The rendered Telemedicine component.
 */
export const Telemedicine: React.FC = () => {
  const { t } = useTranslation();
  // LD1: Uses the `useTelemedicineSession` hook to manage the state and logic for the telemedicine session.
  const { session: telemedicineSession, loading, error, createSession } = useTelemedicineSession();

  // LD1: Uses the `useNavigation` hook to get the navigation object.
  const navigation = useNavigation();

  // S1: Added a local state to store providerId
  const [providerId, setProviderId] = useState<string | null>(null);

  // S1: useEffect hook to set a default providerId. In a real application, this would likely come from a selection process.
  useEffect(() => {
    // S1: Setting a default providerId for demonstration purposes.
    // S1: Replace this with actual logic to determine the providerId.
    setProviderId('default-provider-id');
  }, []);

  // LD1: Renders a `JourneyHeader` component with a back button.
  return (
    <View>
      <JourneyHeader
        title={t('journeys.care.telemedicine.title')}
        showBackButton
      />

      {/* LD1: If `loading` is true, renders a `LoadingIndicator` component. */}
      {loading && <LoadingIndicator label={t('journeys.care.telemedicine.initializing')} />}

      {/* LD1: If `error` is not null, renders an `ErrorState` component with the error message. */}
      {error && <ErrorState message={error.message} />}

      {/* LD1: If `telemedicineSession` is null, renders a `Button` component that calls the `createSession` function when pressed. */}
      {!telemedicineSession && providerId && (
        <Button
          onPress={() => createSession(providerId)}
          accessibilityLabel={t('journeys.care.telemedicine.startSession')}
        >
          {t('journeys.care.telemedicine.startSession')}
        </Button>
      )}

      {/* LD1: If `telemedicineSession` is not null, renders a `Text` component with the telemedicine session details. */}
      {telemedicineSession && (
        <Text>
          {t('journeys.care.telemedicine.sessionDetails', { id: telemedicineSession.id })}
        </Text>
      )}
    </View>
  );
};