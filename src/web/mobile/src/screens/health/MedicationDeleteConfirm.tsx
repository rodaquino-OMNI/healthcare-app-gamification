import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../constants/routes';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

/**
 * Route params for the MedicationDeleteConfirm screen.
 */
type DeleteConfirmRouteParams = {
  MedicationDeleteConfirm: {
    medicationId?: string;
    medicationName?: string;
  };
};

/**
 * MedicationDeleteConfirm displays a confirmation screen before deleting
 * a medication, with cancel and delete actions.
 */
export const MedicationDeleteConfirm: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const route = useRoute<RouteProp<DeleteConfirmRouteParams, 'MedicationDeleteConfirm'>>();

  const medicationName = route.params?.medicationName ?? t('medication.deleteConfirm.defaultName');

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleDelete = useCallback(() => {
    // In production, call API to delete the medication
    navigation.navigate(ROUTES.HEALTH_MEDICATION_LIST);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Touchable
          onPress={handleCancel}
          accessibilityLabel={t('common.buttons.back')}
          accessibilityRole="button"
          testID="back-button"
        >
          <Text fontSize="lg" color={colors.journeys.health.primary}>
            {t('common.buttons.back')}
          </Text>
        </Touchable>
        <Text variant="heading" journey="health">
          {t('medication.deleteConfirm.header')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Confirmation Content */}
      <View style={styles.content}>
        {/* Warning Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.warningCircle}>
            <Text fontSize="3xl" color={colors.semantic.error} textAlign="center">
              {'\u26A0'}
            </Text>
          </View>
        </View>

        <Text
          variant="heading"
          fontSize="heading-xl"
          textAlign="center"
          color={colors.neutral.gray900}
        >
          {t('medication.deleteConfirm.title', { medication: medicationName })}
        </Text>

        <Card journey="health" elevation="sm" padding="md" style={styles.warningCard}>
          <Text fontSize="md" color={colors.neutral.gray700} textAlign="center">
            {t('medication.deleteConfirm.warning')}
          </Text>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            variant="secondary"
            journey="health"
            onPress={handleCancel}
            accessibilityLabel={t('common.buttons.cancel')}
            testID="cancel-delete-button"
          >
            {t('common.buttons.cancel')}
          </Button>

          <View style={styles.buttonSpacer} />

          <Touchable
            onPress={handleDelete}
            accessibilityLabel={t('medication.deleteConfirm.deleteButton')}
            accessibilityRole="button"
            testID="confirm-delete-button"
            style={styles.deleteButton}
          >
            <Text
              fontSize="md"
              fontWeight="semiBold"
              color={colors.neutral.white}
              textAlign="center"
            >
              {t('medication.deleteConfirm.deleteButton')}
            </Text>
          </Touchable>
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
  warningCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.neutral.white,
    borderWidth: 3,
    borderColor: colors.semantic.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningCard: {
    marginTop: spacingValues.lg,
    width: '100%',
    maxWidth: 320,
  },
  actionsContainer: {
    marginTop: spacingValues['2xl'],
    width: '100%',
    maxWidth: 320,
  },
  buttonSpacer: {
    height: spacingValues.sm,
  },
  deleteButton: {
    paddingVertical: spacingValues.md,
    paddingHorizontal: spacingValues.xl,
    borderRadius: 8,
    backgroundColor: colors.semantic.error,
    alignItems: 'center',
  },
});

export default MedicationDeleteConfirm;
