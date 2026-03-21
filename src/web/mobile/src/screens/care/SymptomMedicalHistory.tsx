/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import type { Theme } from '@design-system/themes/base.theme';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useTheme } from 'styled-components/native';

import { ROUTES } from '@constants/routes';

interface MedicalHistoryItem {
    id: string;
    type: 'condition' | 'surgery' | 'allergy';
    nameKey: string;
    dateLabel: string;
    isRelevant: boolean;
}

/**
 * Mock medical history items. In production these would come
 * from the user's electronic health record.
 */
const MOCK_MEDICAL_HISTORY: MedicalHistoryItem[] = [
    { id: 'mh1', type: 'condition', nameKey: 'hypertension', dateLabel: '2021', isRelevant: false },
    { id: 'mh2', type: 'condition', nameKey: 'type2Diabetes', dateLabel: '2019', isRelevant: false },
    { id: 'mh3', type: 'condition', nameKey: 'asthma', dateLabel: '2015', isRelevant: false },
    { id: 'mh4', type: 'surgery', nameKey: 'appendectomy', dateLabel: '2018', isRelevant: false },
    { id: 'mh5', type: 'surgery', nameKey: 'kneeArthroscopy', dateLabel: '2022', isRelevant: false },
    { id: 'mh6', type: 'allergy', nameKey: 'penicillin', dateLabel: '2010', isRelevant: false },
    { id: 'mh7', type: 'allergy', nameKey: 'latex', dateLabel: '2016', isRelevant: false },
    { id: 'mh8', type: 'allergy', nameKey: 'shellfish', dateLabel: '2012', isRelevant: false },
];

const getTypeIcon = (type: MedicalHistoryItem['type']): string => {
    switch (type) {
        case 'condition':
            return '\u{2764}\u{FE0F}';
        case 'surgery':
            return '\u{1FA7A}';
        case 'allergy':
            return '\u{26A0}\u{FE0F}';
    }
};

type SymptomMedicalHistoryRouteParams = {
    symptoms: Array<{ id: string; name: string }>;
    description: string;
    regions: Array<{ id: string; label: string }>;
    photos: Array<{ id: string; uri: string }>;
};

/**
 * Medical history screen that pulls relevant medical history for AI context.
 * Users can mark relevant conditions, surgeries, and allergies, and add new ones.
 */
const SymptomMedicalHistory: React.FC = () => {
    const { t } = useTranslation();
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<{ params: SymptomMedicalHistoryRouteParams }, 'params'>>();
    const { symptoms = [], description = '', regions = [], photos = [] } = route.params || {};

    const [historyItems, setHistoryItems] = useState<MedicalHistoryItem[]>(MOCK_MEDICAL_HISTORY);
    const [newCondition, setNewCondition] = useState('');

    const toggleRelevance = (itemId: string) => {
        setHistoryItems((prev) =>
            prev.map((item) => (item.id === itemId ? { ...item, isRelevant: !item.isRelevant } : item))
        );
    };

    const handleAddCondition = (): void => {
        if (newCondition.trim().length === 0) {
            return;
        }

        const newItem: MedicalHistoryItem = {
            id: `custom-${Date.now()}`,
            type: 'condition',
            nameKey: newCondition.trim(),
            dateLabel: new Date().getFullYear().toString(),
            isRelevant: true,
        };
        setHistoryItems((prev) => [...prev, newItem]);
        setNewCondition('');
    };

    const handleContinue = (): void => {
        const relevantHistory = historyItems
            .filter((item) => item.isRelevant)
            .map((item) => ({
                id: item.id,
                type: item.type,
                name: item.nameKey.startsWith('custom-')
                    ? item.nameKey
                    : t(`journeys.care.symptomChecker.medicalHistory.items.${item.nameKey}`),
            }));

        navigation.navigate(ROUTES.CARE_SYMPTOM_MEDICATION_CONTEXT, {
            symptoms,
            description,
            regions,
            photos,
            medicalHistory: relevantHistory,
        });
    };

    const handleBack = (): void => {
        navigation.goBack();
    };

    const relevantCount = historyItems.filter((item) => item.isRelevant).length;

    const groupedItems = {
        condition: historyItems.filter((i) => i.type === 'condition'),
        surgery: historyItems.filter((i) => i.type === 'surgery'),
        allergy: historyItems.filter((i) => i.type === 'allergy'),
    };

    const renderGroup = (
        type: MedicalHistoryItem['type'],
        items: MedicalHistoryItem[],
        titleKey: string
    ): React.ReactElement | null => (
        <View style={styles.groupSection} key={type}>
            <Text variant="body" fontWeight="semiBold" journey="care" testID={`group-title-${type}`}>
                {getTypeIcon(type)} {t(`journeys.care.symptomChecker.medicalHistory.${titleKey}`)}
            </Text>
            {items.map((item) => (
                <Touchable
                    key={item.id}
                    onPress={() => toggleRelevance(item.id)}
                    style={[styles.historyItem, item.isRelevant && styles.historyItemRelevant] as any}
                    accessibilityLabel={`${item.id.startsWith('custom-') ? item.nameKey : t(`journeys.care.symptomChecker.medicalHistory.items.${item.nameKey}`)}, ${item.dateLabel}${item.isRelevant ? `, ${t('journeys.care.symptomChecker.medicalHistory.relevant')}` : ''}`}
                    accessibilityRole="button"
                    testID={`history-item-${item.id}`}
                >
                    <View style={styles.historyItemContent}>
                        <View style={styles.historyItemText}>
                            <Text
                                fontSize="text-sm"
                                fontWeight="medium"
                                color={item.isRelevant ? colors.neutral.white : colors.journeys.care.text}
                            >
                                {item.id.startsWith('custom-')
                                    ? item.nameKey
                                    : t(`journeys.care.symptomChecker.medicalHistory.items.${item.nameKey}`)}
                            </Text>
                            <Text
                                fontSize="text-xs"
                                color={item.isRelevant ? colors.neutral.gray200 : colors.neutral.gray600}
                            >
                                {item.dateLabel}
                            </Text>
                        </View>
                        <View style={[styles.checkbox, item.isRelevant && styles.checkboxChecked] as any}>
                            {item.isRelevant && (
                                <Text fontSize="text-xs" color={colors.neutral.white}>
                                    {'\u2713'}
                                </Text>
                            )}
                        </View>
                    </View>
                </Touchable>
            ))}
        </View>
    );

    return (
        <View style={styles.root}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <Text variant="heading" journey="care" testID="medical-history-title">
                    {t('journeys.care.symptomChecker.medicalHistory.title')}
                </Text>

                <Text variant="body" journey="care" testID="medical-history-subtitle">
                    {t('journeys.care.symptomChecker.medicalHistory.subtitle')}
                </Text>

                {relevantCount > 0 && (
                    <Text variant="caption" color={colors.journeys.care.primary} testID="relevant-count">
                        {t('journeys.care.symptomChecker.medicalHistory.relevantCount', { count: relevantCount })}
                    </Text>
                )}

                <Card journey="care" elevation="sm">
                    {renderGroup('condition', groupedItems.condition, 'conditions')}
                    {renderGroup('surgery', groupedItems.surgery, 'surgeries')}
                    {renderGroup('allergy', groupedItems.allergy, 'allergies')}
                </Card>

                <Card journey="care" elevation="sm">
                    <Text variant="body" fontWeight="semiBold" journey="care">
                        {t('journeys.care.symptomChecker.medicalHistory.addNew')}
                    </Text>
                    <View style={styles.addRow}>
                        <TextInput
                            style={styles.textInput}
                            value={newCondition}
                            onChangeText={setNewCondition}
                            placeholder={t('journeys.care.symptomChecker.medicalHistory.addPlaceholder')}
                            placeholderTextColor={colors.neutral.gray400}
                            accessibilityLabel={t('journeys.care.symptomChecker.medicalHistory.addPlaceholder')}
                            testID="add-condition-input"
                        />
                        <Button
                            variant="secondary"
                            onPress={handleAddCondition}
                            journey="care"
                            disabled={newCondition.trim().length === 0}
                            accessibilityLabel={t('journeys.care.symptomChecker.medicalHistory.addButton')}
                            testID="add-condition-button"
                        >
                            {t('journeys.care.symptomChecker.medicalHistory.addButton')}
                        </Button>
                    </View>
                </Card>

                <View style={styles.buttonRow}>
                    <Button
                        variant="secondary"
                        onPress={handleBack}
                        journey="care"
                        accessibilityLabel={t('journeys.care.symptomChecker.medicalHistory.back')}
                        testID="back-button"
                    >
                        {t('journeys.care.symptomChecker.medicalHistory.back')}
                    </Button>
                    <Button
                        onPress={handleContinue}
                        journey="care"
                        accessibilityLabel={t('journeys.care.symptomChecker.medicalHistory.continue')}
                        testID="continue-button"
                    >
                        {t('journeys.care.symptomChecker.medicalHistory.continue')}
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
};

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: colors.journeys.care.background,
        },
        scrollView: {
            flex: 1,
        },
        scrollContent: {
            padding: spacingValues.md,
            paddingBottom: spacingValues['3xl'],
        },
        groupSection: {
            marginBottom: spacingValues.md,
        },
        historyItem: {
            paddingVertical: spacingValues.sm,
            paddingHorizontal: spacingValues.sm,
            marginTop: spacingValues.xs,
            borderRadius: spacingValues.xs,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            backgroundColor: theme.colors.background.default,
        },
        historyItemRelevant: {
            backgroundColor: colors.journeys.care.primary,
            borderColor: colors.journeys.care.accent,
        },
        historyItemContent: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        historyItemText: {
            flex: 1,
            gap: spacingValues['3xs'],
        },
        checkbox: {
            width: spacingValues.lg,
            height: spacingValues.lg,
            borderRadius: spacingValues['3xs'],
            borderWidth: 2,
            borderColor: colors.neutral.gray400,
            justifyContent: 'center',
            alignItems: 'center',
        },
        checkboxChecked: {
            backgroundColor: colors.journeys.care.accent,
            borderColor: colors.journeys.care.accent,
        },
        addRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacingValues.sm,
            marginTop: spacingValues.sm,
        },
        textInput: {
            flex: 1,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            borderRadius: spacingValues.xs,
            paddingVertical: spacingValues.sm,
            paddingHorizontal: spacingValues.sm,
            fontSize: 14,
            color: colors.journeys.care.text,
            backgroundColor: theme.colors.background.default,
        },
        buttonRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: spacingValues.xl,
            gap: spacingValues.md,
        },
    });

export { SymptomMedicalHistory };
export default SymptomMedicalHistory;
