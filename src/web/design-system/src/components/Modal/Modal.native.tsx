import React from 'react';
import { Modal as RNModal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Box } from '../../primitives/Box/Box.native';
import { Icon } from '../../primitives/Icon/Icon.native';
import { Text } from '../../primitives/Text/Text.native';
import { Touchable } from '../../primitives/Touchable/Touchable.native';
import { borderRadiusValues } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { spacingValues } from '../../tokens/spacing';

export interface ModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    journey?: 'health' | 'care' | 'plan';
    variant?: 'center' | 'bottomSheet';
}

const journeyTitleColor = (journey: 'health' | 'care' | 'plan'): string => {
    return colors.journeys[journey].primary;
};

const Modal: React.FC<ModalProps> = ({ visible, onClose, title, children, journey = 'health', variant = 'center' }) => {
    const isBottomSheet = variant === 'bottomSheet';

    return (
        <RNModal
            visible={visible}
            transparent
            animationType={isBottomSheet ? 'slide' : 'fade'}
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose} testID="modal-overlay">
                <Pressable
                    style={[styles.content, isBottomSheet ? styles.bottomSheetContent : styles.centerContent]}
                    onPress={() => undefined}
                    testID="modal-content"
                >
                    <View style={styles.header}>
                        {title ? (
                            <Text style={[styles.title, { color: journeyTitleColor(journey) }]}>{title}</Text>
                        ) : (
                            <View />
                        )}
                        <Touchable
                            onPress={onClose}
                            accessibilityLabel="Close modal"
                            accessibilityRole="button"
                            testID="modal-close-button"
                        >
                            <Box padding="xs">
                                <Icon name="close-x" size={20} color={colors.neutral.gray700} />
                            </Box>
                        </Touchable>
                    </View>

                    {isBottomSheet ? (
                        <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
                    ) : (
                        <Box>{children}</Box>
                    )}
                </Pressable>
            </Pressable>
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
    content: {
        backgroundColor: colors.neutral.white,
        padding: spacingValues.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 25,
        elevation: 10,
    },
    centerContent: {
        width: '80%',
        borderRadius: borderRadiusValues['2xl'],
    },
    bottomSheetContent: {
        width: '100%',
        borderTopLeftRadius: borderRadiusValues.xl,
        borderTopRightRadius: borderRadiusValues.xl,
        maxHeight: '80%',
        position: 'absolute',
        bottom: 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacingValues.md,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
});

export { Modal };
export default Modal;
