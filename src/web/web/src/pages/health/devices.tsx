import { DeviceCard } from 'design-system/components/index';
import React from 'react'; // React v18.0+
import { DeviceConnection } from 'shared/types/health.types';

import { useDevices } from '@/hooks/useDevices';
import HealthLayout from '@/layouts/HealthLayout';

/**
 * Displays the list of connected devices and allows connecting new ones.
 * @returns {JSX.Element} The rendered component.
 */
const Devices: React.FC = () => {
    // LD1: Retrieves the user ID from the authentication context using the `useAuth` hook.
    // LD1: Fetches the list of connected devices using the `useDevices` hook.
    const { data: devices, loading, error } = useDevices();

    // LD1: Renders a list of `DeviceCard` components for each connected device.
    // LD1: Provides a button to connect a new device.
    return (
        <HealthLayout>
            <h1>Connected Devices</h1>
            {loading && <p>Loading devices...</p>}
            {error && <p>Error: {error.message}</p>}
            {devices && devices.length > 0 ? (
                devices.map((device: DeviceConnection) => (
                    <DeviceCard
                        key={device.id}
                        deviceName={device.name ?? device.deviceType}
                        deviceType={device.type ?? device.deviceType}
                        lastSync={device.lastSync ?? ''}
                        status={device.connected ? 'Connected' : 'Disconnected'}
                    />
                ))
            ) : (
                <p>No devices connected.</p>
            )}
            <button>Connect New Device</button>
        </HealthLayout>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default Devices;
