import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet, TextInput } from 'react-native';

import { ROUTES } from '../../constants/routes';
import type { HealthStackParamList } from '../../navigation/types';

/**
 * Confidence level for OCR field extraction
 */
type ConfidenceLevel = 'high' | 'medium' | 'low';

/**
 * Single extracted field from OCR
 */
interface ExtractedField {
    id: string;
    label: string;
    value: string;
    confidence: ConfidenceLevel;
}

/**
 * Map confidence level to Badge status
 */
const CONFIDENCE_STATUS: Record<ConfidenceLevel, 'success' | 'warning' | 'error'> = {
    high: 'success',
    medium: 'warning',
    low: 'error',
};

/**
 * Mock OCR-extracted data for development
 */
const INITIAL_FIELDS: ExtractedField[] = [
    {
        id: 'medication_name',
        label: 'medication.ocrReview.fieldMedName',
        value: 'Losartan Potassico',
        confidence: 'high',
    },
    {
        id: 'dosage',
        label: 'medication.ocrReview.fieldDosage',
        value: '50mg',
        confidence: 'high',
    },
    {
        id: 'frequency',
        label: 'medication.ocrReview.fieldFrequency',
        value: '1x ao dia',
        confidence: 'medium',
    },
    {
        id: 'doctor_name',
        label: 'medication.ocrReview.fieldDoctor',
        value: 'Dr. Carlos Silva',
        confidence: 'high',
    },
    {
        id: 'date',
        label: 'medication.ocrReview.fieldDate',
        value: '15/02/2026',
        confidence: 'low',
    },
];

/**
 * MedicationOCRReview displays OCR-extracted prescription data
 * for the user to review, edit, and confirm before adding a medication.
 */
export const MedicationOCRReview: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<HealthStackParamList>>();
    const { t } = useTranslation();
    const [fields, setFields] = useState<ExtractedField[]>(INITIAL_FIELDS);
    const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

    const handleFieldValueChange = useCallback((fieldId: string, newValue: string) => {
        setFields((prev) => prev.map((f) => (f.id === fieldId ? { ...f, value: newValue } : f)));
    }, []);

    const toggleEdit = useCallback((fieldId: string) => {
        setEditingFieldId((prev) => (prev === fieldId ? null : fieldId));
    }, []);

    const handleConfirm = useCallback(() => {
        navigation.navigate(ROUTES.HEALTH_MEDICATION_ADD);
    }, [navigation]);

    const handleRetake = useCallback(() => {
        navigation.navigate(ROUTES.HEALTH_MEDICATION_PRESCRIPTION_PHOTO);
    }, [navigation]);

    const getConfidenceLabel = useCallback(
        (confidence: ConfidenceLevel): string => {
            switch (confidence) {
                case 'high':
                    return t('medication.ocrReview.confidenceHigh');
                case 'medium':
                    return t('medication.ocrReview.confidenceMedium');
                case 'low':
                    return t('medication.ocrReview.confidenceLow');
                default:
                    return '';
            }
        },
        [t]
    );

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
                    {t('medication.ocrReview.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Description */}
                <Text fontSize="sm" color={colors.gray[50]} style={styles.description}>
                    {t('medication.ocrReview.description')}
                </Text>

                {/* Extracted Fields */}
                {fields.map((field) => (
                    <Card key={field.id} journey="health" elevation="sm" padding="md">
                        <View style={styles.fieldHeader}>
                            <Text fontSize="xs" color={colors.gray[50]} fontWeight="medium">
                                {t(field.label)}
                            </Text>
                            <Badge
                                variant="status"
                                status={CONFIDENCE_STATUS[field.confidence]}
                                accessibilityLabel={getConfidenceLabel(field.confidence)}
                            >
                                {getConfidenceLabel(field.confidence)}
                            </Badge>
                        </View>

                        {editingFieldId === field.id ? (
                            <TextInput
                                style={styles.editInput}
                                value={field.value}
                                onChangeText={(text) => handleFieldValueChange(field.id, text)}
                                autoFocus
                                testID={`edit-input-${field.id}`}
                                accessibilityLabel={t(field.label)}
                            />
                        ) : (
                            <Text fontSize="lg" fontWeight="semiBold" style={styles.fieldValue}>
                                {field.value}
                            </Text>
                        )}

                        <Touchable
                            onPress={() => toggleEdit(field.id)}
                            accessibilityLabel={
                                editingFieldId === field.id
                                    ? t('medication.ocrReview.done')
                                    : t('medication.ocrReview.edit')
                            }
                            accessibilityRole="button"
                            testID={`edit-toggle-${field.id}`}
                        >
                            <Text fontSize="sm" fontWeight="medium" color={colors.journeys.health.primary}>
                                {editingFieldId === field.id
                                    ? t('medication.ocrReview.done')
                                    : t('medication.ocrReview.edit')}
                            </Text>
                        </Touchable>
                    </Card>
                ))}

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <Button
                        journey="health"
                        onPress={handleConfirm}
                        accessibilityLabel={t('medication.ocrReview.confirmAdd')}
                        testID="confirm-add-button"
                    >
                        {t('medication.ocrReview.confirmAdd')}
                    </Button>
                    <View style={styles.buttonSpacer} />
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={handleRetake}
                        accessibilityLabel={t('medication.ocrReview.retakePhoto')}
                        testID="retake-photo-button"
                    >
                        {t('medication.ocrReview.retakePhoto')}
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
        gap: spacingValues.sm,
    },
    description: {
        marginBottom: spacingValues.xs,
    },
    fieldHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacingValues.xs,
    },
    fieldValue: {
        marginBottom: spacingValues.xs,
    },
    editInput: {
        height: 44,
        borderWidth: 1,
        borderColor: colors.journeys.health.primary,
        borderRadius: 8,
        paddingHorizontal: spacingValues.sm,
        fontSize: 16,
        color: colors.gray[70],
        backgroundColor: colors.gray[0],
        marginBottom: spacingValues.xs,
    },
    actionsContainer: {
        marginTop: spacingValues.lg,
    },
    buttonSpacer: {
        height: spacingValues.sm,
    },
});

export default MedicationOCRReview;
