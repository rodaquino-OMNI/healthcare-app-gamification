import React, { useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../constants/routes';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

/**
 * Tips for taking a good prescription photo
 */
const PHOTO_TIPS = [
  { id: '1', text: 'medication.prescriptionPhoto.tipLighting' },
  { id: '2', text: 'medication.prescriptionPhoto.tipFlat' },
  { id: '3', text: 'medication.prescriptionPhoto.tipVisible' },
  { id: '4', text: 'medication.prescriptionPhoto.tipFocus' },
  { id: '5', text: 'medication.prescriptionPhoto.tipShadows' },
];

/**
 * MedicationPrescriptionPhoto provides a camera capture placeholder
 * for prescription scanning with OCR. Includes tips for photo quality
 * and fallback to manual entry.
 */
export const MedicationPrescriptionPhoto: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const handleTakePhoto = useCallback(() => {
    Alert.alert(
      t('medication.prescriptionPhoto.cameraTitle'),
      t('medication.prescriptionPhoto.cameraMessage'),
      [
        { text: t('medication.prescriptionPhoto.ok') },
      ],
    );
  }, [t]);

  const handleChooseGallery = useCallback(() => {
    Alert.alert(
      t('medication.prescriptionPhoto.galleryTitle'),
      t('medication.prescriptionPhoto.galleryMessage'),
      [
        { text: t('medication.prescriptionPhoto.ok') },
      ],
    );
  }, [t]);

  const handleSkipManual = useCallback(() => {
    navigation.navigate(ROUTES.HEALTH_MEDICATION_ADD);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Touchable
          onPress={() => navigation.goBack()}
          accessibilityLabel={t('medication.back')}
          accessibilityRole="button"
          testID="back-button"
        >
          <Text fontSize="lg" color={colors.journeys.health.primary}>
            {t('medication.back')}
          </Text>
        </Touchable>
        <Text variant="heading" journey="health">
          {t('medication.prescriptionPhoto.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Camera Placeholder */}
        <Touchable
          onPress={handleTakePhoto}
          accessibilityLabel={t('medication.prescriptionPhoto.tapToCapture')}
          accessibilityRole="button"
          testID="camera-placeholder"
        >
          <View style={styles.cameraPlaceholder}>
            <Text fontSize="2xl" color={colors.gray[40]} textAlign="center">
              {t('medication.prescriptionPhoto.cameraIcon')}
            </Text>
            <Text fontSize="lg" color={colors.gray[50]} textAlign="center">
              {t('medication.prescriptionPhoto.tapToCapture')}
            </Text>
            <Text fontSize="sm" color={colors.gray[40]} textAlign="center">
              {t('medication.prescriptionPhoto.positionPrescription')}
            </Text>
          </View>
        </Touchable>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <Button
            journey="health"
            onPress={handleTakePhoto}
            accessibilityLabel={t('medication.prescriptionPhoto.takePhoto')}
            testID="take-photo-button"
          >
            {t('medication.prescriptionPhoto.takePhoto')}
          </Button>
          <View style={styles.buttonSpacer} />
          <Button
            variant="secondary"
            journey="health"
            onPress={handleChooseGallery}
            accessibilityLabel={t('medication.prescriptionPhoto.chooseGallery')}
            testID="choose-gallery-button"
          >
            {t('medication.prescriptionPhoto.chooseGallery')}
          </Button>
        </View>

        {/* Tips Section */}
        <Card journey="health" elevation="sm" padding="md">
          <Text fontWeight="semiBold" fontSize="lg" journey="health">
            {t('medication.prescriptionPhoto.tipsTitle')}
          </Text>
          <View style={styles.tipsList}>
            {PHOTO_TIPS.map((tip) => (
              <View key={tip.id} style={styles.tipRow}>
                <View style={styles.tipBullet} />
                <Text fontSize="sm" color={colors.gray[60]} style={styles.tipText}>
                  {t(tip.text)}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Skip Manual Entry */}
        <View style={styles.skipContainer}>
          <Touchable
            onPress={handleSkipManual}
            accessibilityLabel={t('medication.prescriptionPhoto.skipManual')}
            accessibilityRole="button"
            testID="skip-manual-button"
          >
            <Text
              fontSize="md"
              fontWeight="medium"
              color={colors.journeys.health.primary}
              textAlign="center"
            >
              {t('medication.prescriptionPhoto.skipManual')}
            </Text>
          </Touchable>
        </View>
      </ScrollView>
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
  scrollContent: {
    paddingHorizontal: spacingValues.md,
    paddingBottom: spacingValues['3xl'],
  },
  cameraPlaceholder: {
    height: 280,
    borderRadius: 16,
    backgroundColor: colors.gray[10],
    borderWidth: 2,
    borderColor: colors.gray[20],
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacingValues.xs,
    marginBottom: spacingValues.xl,
  },
  buttonsContainer: {
    marginBottom: spacingValues.xl,
  },
  buttonSpacer: {
    height: spacingValues.sm,
  },
  tipsList: {
    marginTop: spacingValues.sm,
    gap: spacingValues.xs,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.journeys.health.primary,
    marginTop: 7,
    marginRight: spacingValues.xs,
  },
  tipText: {
    flex: 1,
  },
  skipContainer: {
    marginTop: spacingValues.xl,
    paddingVertical: spacingValues.md,
    alignItems: 'center',
  },
});

export default MedicationPrescriptionPhoto;
