import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

import Icon from '../../primitives/Icon/Icon.native';
import Text from '../../primitives/Text/Text.native';
import { borderRadiusValues } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { sizingValues } from '../../tokens/sizing';
import { spacingValues } from '../../tokens/spacing';

/**
 * Props for the DeviceCard component.
 */
export interface DeviceCardProps {
    /** The name of the device */
    deviceName: string;
    /** The type of the device (e.g., 'Smartwatch', 'Heart Rate Monitor') */
    deviceType: string;
    /** When the device last synced, in a human-readable format (e.g., '5 minutes ago') */
    lastSync: string;
    /** The status of the device (e.g., 'Connected', 'Disconnected') */
    status: string;
    /** Callback function when the card is pressed */
    onPress?: () => void;
}

/**
 * Determines which icon name to use based on the device type string.
 */
const getDeviceIconName = (deviceType: string): string => {
    const type = deviceType.toLowerCase();
    if (type.includes('watch') || type.includes('band')) {
        return 'steps';
    }
    if (type.includes('scale')) {
        return 'weight';
    }
    if (type.includes('heart') || type.includes('pulse')) {
        return 'heart';
    }
    if (type.includes('glucose')) {
        return 'glucose';
    }
    if (type.includes('blood pressure')) {
        return 'pulse';
    }
    if (type.includes('sleep')) {
        return 'sleep';
    }
    return 'heart-outline';
};

/**
 * DeviceCard displays information about a connected health device.
 * Used in the Health Journey to show connected wearable devices and their sync status.
 */
const DeviceCard: React.FC<DeviceCardProps> = ({ deviceName, deviceType, lastSync, status, onPress }) => {
    const isConnected = status.toLowerCase() === 'connected';
    const iconName = getDeviceIconName(deviceType);
    const iconColor = isConnected ? colors.semantic.success : colors.neutral.gray500;
    const statusColor = isConnected ? colors.semantic.success : colors.semantic.error;

    return (
        <Pressable
            onPress={onPress}
            accessibilityLabel={`${deviceName}, ${deviceType}, ${status}, Last synced ${lastSync}`}
            accessibilityRole="button"
            testID="device-card"
            style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
        >
            <View style={styles.card}>
                <View style={styles.row}>
                    <View style={styles.iconWrapper}>
                        <Icon
                            name={iconName as Parameters<typeof Icon>[0]['name']}
                            size={sizingValues.icon.md}
                            color={iconColor}
                        />
                    </View>
                    <View style={styles.content}>
                        <Text style={styles.deviceName}>{deviceName}</Text>
                        <Text style={styles.deviceType}>{deviceType}</Text>
                        <View style={styles.metaRow}>
                            <Text style={styles.lastSync}>Last sync: {lastSync}</Text>
                            <Text style={[styles.status, { color: statusColor }]}>{status}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    pressable: {
        width: '100%',
    },
    pressed: {
        opacity: 0.95,
    },
    card: {
        backgroundColor: colors.neutral.white,
        borderWidth: 1,
        borderColor: colors.neutral.gray300,
        borderLeftWidth: 4,
        borderLeftColor: colors.journeys.health.primary,
        borderRadius: borderRadiusValues.md,
        padding: spacingValues.md,
        // Android elevation
        elevation: 2,
        // iOS shadow
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconWrapper: {
        marginRight: spacingValues.md,
    },
    content: {
        flex: 1,
    },
    deviceName: {
        fontWeight: '600',
        color: colors.neutral.gray900,
        fontSize: 16,
    },
    deviceType: {
        color: colors.neutral.gray600,
        fontSize: 14,
        marginBottom: spacingValues.xs,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lastSync: {
        color: colors.neutral.gray600,
        fontSize: 14,
    },
    status: {
        fontSize: 14,
        fontWeight: '500',
    },
});

export { DeviceCard };
export default DeviceCard;
