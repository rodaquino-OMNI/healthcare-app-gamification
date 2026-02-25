import React, { useState } from 'react'; // react v18.2.0
import { View } from 'react-native';
import { JourneyHeader, JourneyHeaderProps } from '@components/shared/JourneyHeader';
import { useJourney } from '@hooks/useJourney';
import { useDevices } from '@hooks/useDevices';
import { DeviceConnection as DeviceConnectionType } from '@shared/types/health.types';
import { Card, CardProps } from '@design-system/components/Card/Card';
import { Button, ButtonProps } from '@design-system/components/Button/Button';
import { DeviceCard } from '@design-system/health/DeviceCard/DeviceCard';
import { useTranslation } from 'react-i18next';
import LoadingIndicator from '@components/shared/LoadingIndicator';
import ErrorState from '@components/shared/ErrorState';

/**
 * Renders the DeviceConnection screen, allowing users to connect and manage their wearable devices.
 *
 * @returns {JSX.Element} The rendered DeviceConnection screen.
 */
export const DeviceConnection: React.FC = () => {
  const { t } = useTranslation();
  // LD1: Retrieves the current journey using the `useJourney` hook.
  const { journey } = useJourney();

  // LD1: Retrieves the connected devices, loading state, and error state using the `useDevices` hook.
  const { devices, isLoading, error, connect } = useDevices();

  // LD1: Sets up local state for managing the new device type.
  const [newDevice, setNewDevice] = useState<string>('');

  // LD1: Renders a `JourneyHeader` with the title 'Dispositivos Conectados' and a back button.
  return (
    <View>
      <JourneyHeader title={t('journeys.health.devices.title')} showBackButton />

      {/* LD1: Conditionally renders a `LoadingIndicator` if the data is still loading. */}
      {isLoading && <LoadingIndicator />}

      {/* LD1: Conditionally renders an `ErrorState` if there was an error fetching the data. */}
      {error && <ErrorState message={t('common.errors.default')} />}

      {/* LD1: Renders a list of `DeviceCard` components for each connected device. */}
      {devices &&
        devices.map((device) => (
          <DeviceCard
            key={device.id}
            deviceName={device.deviceId}
            deviceType={device.deviceType}
            lastSync={device.lastSync}
            status={device.status}
          />
        ))}

      {/* LD1: Renders a `Button` to allow users to connect a new device. */}
      <Button onPress={() => console.log('Connect new device')} journey={journey as 'health' | 'care' | 'plan'}>
        {t('journeys.health.devices.connectNew')}
      </Button>
    </View>
  );
};