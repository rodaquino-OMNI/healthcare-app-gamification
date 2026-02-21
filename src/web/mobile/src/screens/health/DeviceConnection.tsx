import React, { useState } from 'react'; // react v18.2.0
import { View } from 'react-native';
import { JourneyHeader, JourneyHeaderProps } from 'src/web/mobile/src/components/shared/JourneyHeader.tsx';
import { useJourney } from 'src/web/mobile/src/hooks/useJourney.ts';
import { useDevices } from 'src/web/mobile/src/hooks/useDevices.ts';
import { DeviceConnection } from 'src/web/shared/types/health.types.ts';
import { Card, CardProps } from 'src/web/design-system/src/components/Card/Card.tsx';
import { Button, ButtonProps } from 'src/web/design-system/src/components/Button/Button.tsx';
import { DeviceCard } from 'src/web/design-system/src/health/DeviceCard/DeviceCard.tsx';
import { useTranslation } from 'react-i18next';
import LoadingIndicator from 'src/web/mobile/src/components/shared/LoadingIndicator.tsx';
import ErrorState from 'src/web/mobile/src/components/shared/ErrorState.tsx';

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
  const { devices, loading, error, connect } = useDevices();

  // LD1: Sets up local state for managing the new device type.
  const [newDevice, setNewDevice] = useState<string>('');

  // LD1: Renders a `JourneyHeader` with the title 'Dispositivos Conectados' and a back button.
  return (
    <View>
      <JourneyHeader title={t('journeys.health.devices.title')} showBackButton />

      {/* LD1: Conditionally renders a `LoadingIndicator` if the data is still loading. */}
      {loading && <LoadingIndicator />}

      {/* LD1: Conditionally renders an `ErrorState` if there was an error fetching the data. */}
      {error && <ErrorState message={t('common.errors.default')} />}

      {/* LD1: Renders a list of `DeviceCard` components for each connected device. */}
      {devices &&
        devices.map((device) => (
          <DeviceCard
            key={device.id}
            deviceName={device.deviceName}
            deviceType={device.deviceType}
            lastSync={device.lastSync}
            status={device.status}
          />
        ))}

      {/* LD1: Renders a `Button` to allow users to connect a new device. */}
      <Button onPress={() => console.log('Connect new device')} journey={journey}>
        {t('journeys.health.devices.connectNew')}
      </Button>
    </View>
  );
};