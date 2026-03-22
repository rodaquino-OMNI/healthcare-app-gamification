import { Button } from '@design-system/components/Button/Button';
import { DeviceCard } from '@design-system/health/DeviceCard/DeviceCard';
import React, { useState } from 'react'; // react v18.2.0
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import ErrorState from '@components/shared/ErrorState';
import { JourneyHeader } from '@components/shared/JourneyHeader';
import LoadingIndicator from '@components/shared/LoadingIndicator';
import { useDevices } from '@hooks/useDevices';
import { useJourney } from '@hooks/useJourney';

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
    const { devices, isLoading, error, connect: _connect } = useDevices();

    // LD1: Sets up local state for managing the new device type.
    const [_newDevice, _setNewDevice] = useState<string>('');

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
                devices.map((device) => {
                    const id: string = String(device.id);
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- DeviceConnection props resolved via typed DeviceConnectionType
                    const deviceName: string = device.deviceId;
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- DeviceConnection props resolved via typed DeviceConnectionType
                    const deviceType: string = device.deviceType;
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- DeviceConnection props resolved via typed DeviceConnectionType
                    const lastSync: string = device.lastSync;
                    const status: string = String(device.status);
                    return (
                        <DeviceCard
                            key={id}
                            deviceName={deviceName}
                            deviceType={deviceType}
                            lastSync={lastSync}
                            status={status}
                        />
                    );
                })}

            {/* LD1: Renders a `Button` to allow users to connect a new device. */}
            <Button onPress={() => undefined} journey={journey as 'health' | 'care' | 'plan'}>
                {t('journeys.health.devices.connectNew')}
            </Button>
        </View>
    );
};
