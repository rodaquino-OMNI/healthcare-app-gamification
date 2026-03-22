import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';

import { ROUTES } from '../../constants/routes';
import type { HealthStackParamList } from '../../navigation/types';

/**
 * Route params for MedicationAddConfirmation screen.
 */
type AddConfirmationRouteParams = {
    MedicationAddConfirmation: {
        medicationName?: string;
        dosage?: string;
    };
};

/**
 * MedicationAddConfirmation displays a success screen after adding a medication.
 * Shows the medication name and dosage, with CTAs for reminders and list.
 */
export const MedicationAddConfirmation: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<HealthStackParamList>>();
    const { t } = useTranslation();
    const route = useRoute<RouteProp<AddConfirmationRouteParams, 'MedicationAddConfirmation'>>();

    const medicationName = route.params?.medicationName ?? t('medication.addConfirmation.defaultName');
    const dosage = route.params?.dosage ?? '';

    const handleSetUpReminders = useCallback(() => {
        navigation.navigate(ROUTES.HEALTH_MEDICATION_REMINDER, {
            medicationName,
            medicationDosage: dosage,
        });
    }, [navigation, medicationName, dosage]);

    const handleBackToMedications = useCallback(() => {
        navigation.navigate(ROUTES.HEALTH_MEDICATION_LIST);
    }, [navigation]);

    return (
        <View style={styles.container}>
            {/* Success Content */}
            <View style={styles.content}>
                {/* Checkmark Icon */}
                <View style={styles.checkmarkContainer}>
                    <View style={styles.checkmarkCircle}>
                        <Text fontSize="3xl" color={colors.neutral.white} textAlign="center">
                            {'\u2713'}
                        </Text>
                    </View>
                </View>

                <Text variant="heading" fontSize="heading-xl" journey="health" textAlign="center">
                    {t('medication.addConfirmation.title')}
                </Text>

                {/* Medication Details Card */}
                <Card journey="health" elevation="sm" padding="md" style={styles.detailCard}>
                    <Text fontWeight="semiBold" fontSize="lg" textAlign="center">
                        {medicationName}
                    </Text>
                    {dosage ? (
                        <Text fontSize="md" color={colors.neutral.gray600} textAlign="center" style={styles.dosageText}>
                            {dosage}
                        </Text>
                    ) : null}
                </Card>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <Button
                        variant="primary"
                        journey="health"
                        onPress={handleSetUpReminders}
                        accessibilityLabel={t('medication.addConfirmation.setUpReminders')}
                        testID="set-up-reminders-button"
                    >
                        {t('medication.addConfirmation.setUpReminders')}
                    </Button>

                    <View style={styles.buttonSpacer} />

                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={handleBackToMedications}
                        accessibilityLabel={t('medication.addConfirmation.backToList')}
                        testID="back-to-medications-button"
                    >
                        {t('medication.addConfirmation.backToList')}
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
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacingValues.xl,
    },
    checkmarkContainer: {
        marginBottom: spacingValues.xl,
    },
    checkmarkCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.semantic.success,
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailCard: {
        marginTop: spacingValues.xl,
        width: '100%',
        maxWidth: 320,
    },
    dosageText: {
        marginTop: spacingValues.xs,
    },
    actionsContainer: {
        marginTop: spacingValues['2xl'],
        width: '100%',
        maxWidth: 320,
    },
    buttonSpacer: {
        height: spacingValues.sm,
    },
});

export default MedicationAddConfirmation;
