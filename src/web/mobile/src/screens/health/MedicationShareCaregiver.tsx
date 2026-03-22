import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';

import { ROUTES } from '../../constants/routes';
import type { HealthStackParamList } from '../../navigation/types';

/**
 * Share option definition
 */
interface ShareOption {
    id: string;
    labelKey: string;
    iconText: string;
    alertKey: string;
}

/**
 * What caregivers can see
 */
interface PermissionItem {
    id: string;
    textKey: string;
}

const SHARE_OPTIONS: ShareOption[] = [
    {
        id: 'link',
        labelKey: 'medication.shareCaregiver.shareViaLink',
        iconText: 'Link',
        alertKey: 'medication.shareCaregiver.linkCopied',
    },
    {
        id: 'email',
        labelKey: 'medication.shareCaregiver.shareViaEmail',
        iconText: 'Email',
        alertKey: 'medication.shareCaregiver.emailSharing',
    },
    {
        id: 'whatsapp',
        labelKey: 'medication.shareCaregiver.shareViaWhatsApp',
        iconText: 'WhatsApp',
        alertKey: 'medication.shareCaregiver.whatsappSharing',
    },
];

const PERMISSION_ITEMS: PermissionItem[] = [
    { id: '1', textKey: 'medication.shareCaregiver.permMedNames' },
    { id: '2', textKey: 'medication.shareCaregiver.permSchedules' },
    { id: '3', textKey: 'medication.shareCaregiver.permAdherence' },
    { id: '4', textKey: 'medication.shareCaregiver.permRefills' },
];

/** Mock count of active medications */
const ACTIVE_MEDICATION_COUNT = 4;

/**
 * MedicationShareCaregiver allows users to share their medication list
 * with caregivers via link, email, or WhatsApp, and manage access permissions.
 */
export const MedicationShareCaregiver: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<HealthStackParamList>>();
    const { t } = useTranslation();

    const handleShareOption = useCallback(
        (option: ShareOption) => {
            Alert.alert(t(option.labelKey), t(option.alertKey));
        },
        [t]
    );

    const handleManageAccess = useCallback(() => {
        navigation.navigate(ROUTES.HEALTH_MEDICATION_CAREGIVER_ACCESS);
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
                    {t('medication.shareCaregiver.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Medication Summary */}
                <Card journey="health" elevation="sm" padding="md">
                    <Text fontSize="sm" color={colors.gray[50]}>
                        {t('medication.shareCaregiver.activeMedications')}
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.primary}>
                        {ACTIVE_MEDICATION_COUNT}
                    </Text>
                    <Text fontSize="xs" color={colors.gray[40]}>
                        {t('medication.shareCaregiver.medicationsWillBeShared')}
                    </Text>
                </Card>

                {/* Share Options */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('medication.shareCaregiver.shareOptions')}
                    </Text>
                    {SHARE_OPTIONS.map((option) => (
                        <Touchable
                            key={option.id}
                            onPress={() => handleShareOption(option)}
                            accessibilityLabel={t(option.labelKey)}
                            accessibilityRole="button"
                            testID={`share-option-${option.id}`}
                        >
                            <Card journey="health" elevation="sm" padding="md">
                                <View style={styles.optionRow}>
                                    <View style={styles.optionIcon}>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="semiBold"
                                            color={colors.journeys.health.primary}
                                        >
                                            {option.iconText}
                                        </Text>
                                    </View>
                                    <Text fontSize="md" fontWeight="medium" style={styles.optionLabel}>
                                        {t(option.labelKey)}
                                    </Text>
                                    <Text fontSize="lg" color={colors.gray[40]}>
                                        {'>'}
                                    </Text>
                                </View>
                            </Card>
                        </Touchable>
                    ))}
                </View>

                {/* Permissions Info */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('medication.shareCaregiver.permissionsTitle')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <Text fontSize="sm" color={colors.gray[50]} style={styles.permDescription}>
                            {t('medication.shareCaregiver.permissionsDescription')}
                        </Text>
                        {PERMISSION_ITEMS.map((item) => (
                            <View key={item.id} style={styles.permRow}>
                                <View style={styles.permBullet} />
                                <Text fontSize="sm" color={colors.gray[60]}>
                                    {t(item.textKey)}
                                </Text>
                            </View>
                        ))}
                    </Card>
                </View>

                {/* Manage Access Button */}
                <View style={styles.manageAccessContainer}>
                    <Button
                        journey="health"
                        onPress={handleManageAccess}
                        accessibilityLabel={t('medication.shareCaregiver.manageAccess')}
                        testID="manage-access-button"
                    >
                        {t('medication.shareCaregiver.manageAccess')}
                    </Button>
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
    sectionContainer: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.journeys.health.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacingValues.sm,
    },
    optionLabel: {
        flex: 1,
    },
    permDescription: {
        marginBottom: spacingValues.sm,
    },
    permRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacingValues.xs,
    },
    permBullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.journeys.health.primary,
        marginRight: spacingValues.xs,
    },
    manageAccessContainer: {
        marginTop: spacingValues['2xl'],
    },
});

export default MedicationShareCaregiver;
