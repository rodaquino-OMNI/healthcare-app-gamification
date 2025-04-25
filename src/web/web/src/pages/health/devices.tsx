import React from 'react'; // React v18.0+
import { MOBILE_HEALTH_ROUTES } from 'src/web/shared/constants/routes.ts';
import { useDevices } from 'src/web/mobile/src/hooks/useDevices.ts';
import { DeviceCard } from 'src/web/design-system/src/components/index.ts';
import HealthLayout from 'src/web/web/src/layouts/HealthLayout.tsx';
import { useAuth } from 'src/web/web/src/hooks/useAuth.ts';
import { HealthMetric } from 'src/web/shared/types/health.types.ts';

/**
 * Displays the list of connected devices and allows connecting new ones.
 * @returns {JSX.Element} The rendered component.
 */
const Devices: React.FC = () => {
  // LD1: Retrieves the user ID from the authentication context using the `useAuth` hook.
  const { session } = useAuth();
  const userId = session?.accessToken ? useAuth().getUserFromToken(session.accessToken)?.sub : undefined;

  // LD1: Fetches the list of connected devices using the `useDevices` hook.
  const { devices, loading, error, connect } = useDevices();

  // LD1: Renders a list of `DeviceCard` components for each connected device.
  // LD1: Provides a button to connect a new device.
  return (
    <HealthLayout>
      <h1>Connected Devices</h1>
      {loading && <p>Loading devices...</p>}
      {error && <p>Error: {error.message}</p>}
      {devices && devices.length > 0 ? (
        devices.map((device) => (
          <DeviceCard key={device.id} device={device} />
        ))
      ) : (
        <p>No devices connected.</p>
      )}
      <button>Connect New Device</button>
    </HealthLayout>
  );
};

// LD1: Exports the Devices page component.
export { Devices };