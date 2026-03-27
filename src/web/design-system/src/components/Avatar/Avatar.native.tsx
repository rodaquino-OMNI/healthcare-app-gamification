import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';

import { Icon } from '../../primitives/Icon/Icon.native';
import { Text } from '../../primitives/Text/Text.native';
import { colors } from '../../tokens/colors';
import { sizingValues } from '../../tokens/sizing';

export interface AvatarProps {
    src?: string;
    alt?: string;
    name?: string;
    size?: string;
    journey?: 'health' | 'care' | 'plan';
    showFallback?: boolean;
    fallbackType?: 'initials' | 'icon';
    onImageError?: () => void;
    testID?: string;
    sizePreset?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const getInitials = (name?: string): string => {
    if (!name) {
        return '';
    }
    const parts = name.trim().split(' ');
    const first = parts[0] ? parts[0][0] : '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
};

const Avatar: React.FC<AvatarProps> = ({
    src,
    alt,
    name,
    size = '40',
    journey,
    showFallback = false,
    fallbackType = 'initials',
    onImageError,
    testID,
    sizePreset,
}) => {
    const [hasError, setHasError] = useState(false);

    const numericSize: number = sizePreset ? sizingValues.component[sizePreset] : parseInt(size, 10);

    const shouldShowFallback = showFallback || hasError || !src;

    const backgroundColor = journey ? colors.journeys[journey].primary : colors.neutral.gray300;

    const handleImageError = (): void => {
        setHasError(true);
        onImageError?.();
    };

    const containerStyle = {
        width: numericSize,
        height: numericSize,
        borderRadius: numericSize / 2,
        backgroundColor,
    };

    const accessibilityLabel = alt || (name ? `Avatar for ${name}` : 'User avatar');

    return (
        <View
            style={[styles.container, containerStyle]}
            accessibilityLabel={accessibilityLabel}
            testID={testID || 'avatar'}
        >
            {!shouldShowFallback && src ? (
                <Image
                    source={{ uri: src }}
                    style={styles.image}
                    resizeMode="cover"
                    onError={handleImageError}
                    accessibilityLabel={accessibilityLabel}
                />
            ) : fallbackType === 'initials' && getInitials(name) ? (
                <Text
                    color={colors.neutral.white}
                    fontWeight="500"
                    style={{ fontSize: numericSize / 3 }}
                    testID="avatar-initials"
                >
                    {getInitials(name)}
                </Text>
            ) : (
                <Icon name="user-single" size={Math.round(numericSize / 2)} color={colors.neutral.white} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

export { Avatar };
export default Avatar;
