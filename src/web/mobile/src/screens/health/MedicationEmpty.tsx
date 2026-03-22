import { Button } from '@austa/design-system/src/components/Button/Button';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';

import { ROUTES } from '../../constants/routes';
import type { HealthStackParamList } from '../../navigation/types';

/**
 * MedicationEmpty displays an empty state when the user has no medications.
 * Provides a clear CTA to add their first medication.
 */
export const MedicationEmpty: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<HealthStackParamList>>();
    const { t } = useTranslation();

    const handleAddMedication = useCallback(() => {
        navigation.navigate(ROUTES.HEALTH_MEDICATION_ADD);
    }, [navigation]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Touchable
                    onPress={() => navigation.goBack()}
                    accessibilityLabel={t('common.buttons.back')}
                    accessibilityRole="button"
                    testID="back-button"
                >
                    <Text fontSize="lg" color={colors.journeys.health.primary}>
                        {t('common.buttons.back')}
                    </Text>
                </Touchable>
                <Text variant="heading" journey="health">
                    {t('medication.empty.header')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Empty State Content */}
            <View style={styles.content}>
                {/* Pill Icon Placeholder */}
                <View style={styles.iconContainer}>
                    <View style={styles.iconCircle}>
                        <Text fontSize="3xl" textAlign="center">
                            {'\uD83D\uDC8A'}
                        </Text>
                    </View>
                </View>

                <Text variant="heading" fontSize="heading-xl" journey="health" textAlign="center">
                    {t('medication.empty.title')}
                </Text>

                <Text fontSize="md" color={colors.neutral.gray600} textAlign="center" style={styles.subtitle}>
                    {t('medication.empty.subtitle')}
                </Text>

                <View style={styles.ctaContainer}>
                    <Button
                        variant="primary"
                        journey="health"
                        onPress={handleAddMedication}
                        accessibilityLabel={t('medication.empty.addButton')}
                        testID="add-medication-button"
                    >
                        {t('medication.empty.addButton')}
                    </Button>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.journeys.health.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacingValues.md,
        paddingTop: spacingValues['3xl'],
        paddingBottom: spacingValues.sm,
    },
    headerSpacer: {
        width: 40,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacingValues.xl,
    },
    iconContainer: {
        marginBottom: spacingValues.xl,
    },
    iconCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: colors.journeys.health.background,
        borderWidth: 2,
        borderColor: colors.journeys.health.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    subtitle: {
        marginTop: spacingValues.sm,
        maxWidth: 280,
    },
    ctaContainer: {
        marginTop: spacingValues['2xl'],
        width: '100%',
        maxWidth: 300,
    },
});

export default MedicationEmpty;
