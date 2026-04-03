import React from 'react';
import { Modal as RNModal, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

import type { ModalProps } from './Modal';
import { colors } from '../../tokens/colors';
import { nativeShadow } from '../../utils/native-shadows';

const spacingValues = {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
};
const borderRadiusValues = { '2xl': 20, xl: 24 };

export const Modal: React.FC<ModalProps> = ({
    visible,
    onClose,
    title,
    children,
    journey = 'health',
    variant = 'center',
}) => {
    const isBottom = variant === 'bottomSheet';
    const titleColor = colors.journeys[journey].text;

    return (
        <RNModal
            visible={visible}
            transparent
            animationType={isBottom ? 'slide' : 'fade'}
            onRequestClose={onClose}
            testID="modal"
        >
            <TouchableWithoutFeedback onPress={onClose} testID="modal-overlay">
                <View style={[styles.overlay, isBottom && styles.overlayBottom]}>
                    <TouchableWithoutFeedback>
                        <View
                            style={[isBottom ? styles.bottomSheet : styles.center, nativeShadow('xl')]}
                            testID="modal-content"
                        >
                            <View style={styles.header}>
                                {title ? (
                                    <Text style={[styles.title, { color: titleColor }]} testID="modal-title">
                                        {title}
                                    </Text>
                                ) : (
                                    <View />
                                )}
                                <Pressable
                                    onPress={onClose}
                                    accessibilityLabel="Close modal"
                                    accessibilityRole="button"
                                    hitSlop={8}
                                    testID="modal-close"
                                >
                                    <Text style={styles.closeIcon}>✕</Text>
                                </Pressable>
                            </View>
                            <View>{children}</View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </RNModal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayBottom: {
        justifyContent: 'flex-end',
    },
    center: {
        width: '80%',
        backgroundColor: colors.neutral.white,
        borderRadius: borderRadiusValues['2xl'],
        padding: spacingValues.md,
    },
    bottomSheet: {
        width: '100%',
        backgroundColor: colors.neutral.white,
        borderTopLeftRadius: borderRadiusValues.xl,
        borderTopRightRadius: borderRadiusValues.xl,
        padding: spacingValues.md,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacingValues.md,
    },
    title: { fontSize: 18, fontWeight: '500' },
    closeIcon: { fontSize: 20, padding: spacingValues.xs },
});
