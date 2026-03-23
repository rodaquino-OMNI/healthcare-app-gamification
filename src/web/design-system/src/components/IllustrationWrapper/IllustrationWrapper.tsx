import React, { useState } from 'react';
import {
    Image,
    View,
    ActivityIndicator,
    Dimensions,
    StyleSheet,
    type ImageSourcePropType,
    type ImageStyle,
} from 'react-native';

import { colors } from '../../tokens/colors';

export interface IllustrationWrapperProps {
    /** Image source -- use require() for local PNGs or { uri: string } for remote */
    source: ImageSourcePropType;
    /** Accessibility label (required for a11y) */
    alt: string;
    /** Maximum width in pixels (default: 300) */
    maxWidth?: number;
    /** Aspect ratio width/height (default: 1) */
    aspectRatio?: number;
    /** Test ID for testing */
    testID?: string;
}

/**
 * Responsive wrapper for PNG illustrations.
 * Renders illustrations at consistent sizes with loading state and error fallback.
 */
export const IllustrationWrapper: React.FC<IllustrationWrapperProps> = ({
    source,
    alt,
    maxWidth = 300,
    aspectRatio = 1,
    testID,
}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const screenWidth = Dimensions.get('window').width;
    const width = Math.min(maxWidth, screenWidth - 48);
    const height = width / aspectRatio;

    if (error) {
        return (
            <View
                style={[styles.fallback, { width, height, backgroundColor: colors.gray[5] }]}
                testID={testID ? `${testID}-fallback` : undefined}
                accessibilityLabel={alt}
            />
        );
    }

    return (
        <View style={[styles.container, { width, height }]} testID={testID}>
            {loading && (
                <View style={[styles.loader, { width, height }]}>
                    <ActivityIndicator size="small" color={colors.brand.primary} />
                </View>
            )}
            <Image
                source={source}
                style={[styles.image, { width, height } as ImageStyle]}
                resizeMode="contain"
                accessibilityLabel={alt}
                onLoadEnd={() => setLoading(false)}
                onError={() => {
                    setLoading(false);
                    setError(true);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        resizeMode: 'contain',
    },
    loader: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fallback: {
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
