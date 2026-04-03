import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '../../primitives/Icon/Icon';
import { Text } from '../../primitives/Text/Text';
import { borderRadiusValues } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { sizingValues } from '../../tokens/sizing';
import { spacingValues } from '../../tokens/spacing';
import { nativeShadow } from '../../utils/native-shadows';

interface DeviceCardProps {
    deviceName: string;
    deviceType: string;
    lastSync: string;
    status: string;
    onPress?: () => void;
}

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

export const DeviceCard: React.FC<DeviceCardProps> = ({ deviceName, deviceType, lastSync, status, onPress }) => {
    const isConnected = status.toLowerCase() === 'connected';
    const deviceIconName = getDeviceIconName(deviceType);
    const iconColor = isConnected ? colors.semantic.success : colors.neutral.gray400;
    const statusColor = isConnected ? colors.semantic.success : colors.semantic.error;

    return (
        <Pressable
            onPress={onPress}
            accessibilityLabel={`${deviceName}, ${deviceType}, ${status}, Last synced ${lastSync}`}
            accessibilityRole="button"
            style={styles.touchable}
        >
            <View style={styles.card}>
                <View style={styles.row}>
                    <View style={styles.iconContainer}>
                        <Icon name={deviceIconName} size={sizingValues.icon.md} color={iconColor} />
                    </View>
                    <View style={styles.content}>
                        <Text fontWeight="medium" color="gray900">
                            {deviceName}
                        </Text>
                        <Text fontSize="sm" color="gray600" style={styles.deviceType}>
                            {deviceType}
                        </Text>
                        <View style={styles.statusRow}>
                            <Text fontSize="sm" color="gray600">
                                Last sync: {lastSync}
                            </Text>
                            <Text fontSize="sm" fontWeight="medium" color={statusColor}>
                                {status}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    touchable: {
        width: '100%',
    },
    card: {
        backgroundColor: colors.neutral.white,
        borderWidth: 1,
        borderColor: colors.neutral.gray300,
        borderLeftWidth: 4,
        borderLeftColor: colors.journeys.health.primary,
        borderRadius: borderRadiusValues.md,
        padding: spacingValues.md,
        ...nativeShadow('sm'),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: spacingValues.md,
    },
    content: {
        flex: 1,
    },
    deviceType: {
        marginBottom: spacingValues.xs,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
