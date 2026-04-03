import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import type { AvatarProps } from './Avatar';
import { Icon } from '../../primitives/Icon/Icon';
import { colors } from '../../tokens/colors';
import { sizingValues } from '../../tokens/sizing';
import { parsePx } from '../../utils/native-shadows';

const getInitials = (name?: string): string => {
    if (!name) {
        return '';
    }
    const parts = name.trim().split(' ');
    const first = parts[0] ? parts[0][0] : '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
};

export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt,
    name,
    size = '40px',
    journey,
    showFallback = false,
    fallbackType = 'initials',
    onImageError,
    testID,
    sizePreset,
}) => {
    const [hasError, setHasError] = useState(false);

    const handleImageError = (): void => {
        setHasError(true);
        onImageError?.();
    };

    const initials = getInitials(name);
    const shouldShowFallback = showFallback || hasError || !src;

    const actualSize = sizePreset ? sizingValues.component[sizePreset] : parsePx(size);

    const bgColor = journey ? colors.journeys[journey].primary : colors.neutral.gray400;

    const containerStyle = [
        styles.container,
        {
            width: actualSize,
            height: actualSize,
            borderRadius: actualSize / 2,
            backgroundColor: bgColor,
        },
    ];

    const accessLabel = alt || (name ? `Avatar for ${name}` : 'User avatar');

    return (
        <View
            style={containerStyle}
            accessibilityLabel={accessLabel}
            accessibilityRole="image"
            testID={testID || 'avatar'}
        >
            {!shouldShowFallback && src ? (
                <Image
                    source={{ uri: src }}
                    style={{
                        width: actualSize,
                        height: actualSize,
                        borderRadius: actualSize / 2,
                    }}
                    onError={handleImageError}
                    accessibilityLabel={accessLabel}
                    testID="avatar-image"
                />
            ) : (
                <View style={styles.fallback}>
                    {fallbackType === 'initials' && initials ? (
                        <Text style={[styles.initials, { fontSize: actualSize * 0.4 }]} testID="avatar-initials">
                            {initials}
                        </Text>
                    ) : (
                        <Icon
                            name="profile"
                            size={Math.round(actualSize / 2)}
                            color={colors.neutral.white}
                            aria-hidden={true}
                        />
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    fallback: { alignItems: 'center', justifyContent: 'center' },
    initials: { color: colors.neutral.white, fontWeight: '500' },
});
