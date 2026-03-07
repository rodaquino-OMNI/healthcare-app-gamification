import React from 'react';
import styled from 'styled-components';
import { Box } from '../../primitives/Box';
import { Text } from '../../primitives/Text';
import { Touchable } from '../../primitives/Touchable';
import { Icon } from '../../primitives/Icon';
// useJourneyTheme removed — using styled-components theme prop instead
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';
import { borderRadius } from '../../tokens/borderRadius';
import { sizing } from '../../tokens/sizing';

/**
 * Container for the device card
 */
const CardContainer = styled(Box)`
    width: 100%;
    background-color: ${(props) => props.theme.colors.neutral.white};
    border: 1px solid ${(props) => props.theme.colors.neutral.gray300};
    border-left: 4px solid ${(props) => props.theme.colors.journeys.health.primary};
    border-radius: ${(props) => props.theme.borderRadius.md};
    box-shadow: ${(props) => props.theme.shadows.sm};
`;

/**
 * Displays the name of the device
 */
const DeviceName = styled(Text)`
    font-weight: ${(props) => props.theme.typography.fontWeight.medium};
    color: ${(props) => props.theme.colors.neutral.gray900};
`;

/**
 * Displays the type of the device
 */
const DeviceType = styled(Text)`
    color: ${(props) => props.theme.colors.neutral.gray600};
    font-size: ${(props) => props.theme.typography.fontSize.sm};
    margin-bottom: ${(props) => props.theme.spacing.xs};
`;

/**
 * Displays the last sync time
 */
const LastSync = styled(Text)`
    color: ${(props) => props.theme.colors.neutral.gray600};
    font-size: ${(props) => props.theme.typography.fontSize.sm};
`;

/**
 * Displays the status of the device
 */
const Status = styled(Text)<{ connected: boolean }>`
    color: ${(props) => (props.connected ? props.theme.colors.semantic.success : props.theme.colors.semantic.error)};
    font-size: ${(props) => props.theme.typography.fontSize.sm};
    font-weight: ${(props) => props.theme.typography.fontWeight.medium};
`;

/**
 * Interface for DeviceCard props
 */
interface DeviceCardProps {
    /**
     * The name of the device
     */
    deviceName: string;

    /**
     * The type of the device (e.g., 'Smartwatch', 'Heart Rate Monitor')
     */
    deviceType: string;

    /**
     * When the device last synced, in a human-readable format (e.g., '5 minutes ago')
     */
    lastSync: string;

    /**
     * The status of the device (e.g., 'Connected', 'Disconnected')
     */
    status: string;

    /**
     * Callback function when the card is pressed
     */
    onPress?: () => void;
}

/**
 * DeviceCard component displays information about a connected health device
 * in a pressable card format with journey-specific styling.
 *
 * Used in the Health Journey to show connected wearable devices and their status.
 */
export const DeviceCard: React.FC<DeviceCardProps> = ({ deviceName, deviceType, lastSync, status, onPress }) => {
    const isConnected = status.toLowerCase() === 'connected';
    const deviceIconName = getDeviceIconName(deviceType);

    return (
        <Touchable
            onPress={onPress}
            journey="health"
            accessibilityLabel={`${deviceName}, ${deviceType}, ${status}, Last synced ${lastSync}`}
            fullWidth
        >
            <CardContainer padding="md">
                <Box display="flex" flexDirection="row" alignItems="center">
                    <Box marginRight="md">
                        <Icon
                            name={deviceIconName}
                            size={sizing.icon.md}
                            color={isConnected ? 'semantic.success' : 'neutral.gray400'}
                            aria-hidden={true}
                        />
                    </Box>

                    <Box flex="1">
                        <DeviceName>{deviceName}</DeviceName>
                        <DeviceType>{deviceType}</DeviceType>

                        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                            <LastSync>Last sync: {lastSync}</LastSync>
                            <Status connected={isConnected}>{status}</Status>
                        </Box>
                    </Box>
                </Box>
            </CardContainer>
        </Touchable>
    );
};

/**
 * Helper function to determine which icon to use based on the device type
 */
const getDeviceIconName = (deviceType: string): string => {
    const type = deviceType.toLowerCase();

    if (type.includes('watch') || type.includes('band')) return 'steps'; // Use steps icon for wearables
    if (type.includes('scale')) return 'weight';
    if (type.includes('heart') || type.includes('pulse')) return 'heart';
    if (type.includes('glucose')) return 'glucose';
    if (type.includes('blood pressure')) return 'pulse';
    if (type.includes('sleep')) return 'sleep';

    // Default icon
    return 'heart-outline'; // Use as a generic device icon
};
