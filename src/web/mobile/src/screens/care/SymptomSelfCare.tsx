/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView } from 'react-native';

import { ROUTES } from '@constants/routes';

interface SelfCareCategory {
    id: string;
    title: string;
    badgeStatus: 'success' | 'warning' | 'error' | 'info' | 'neutral';
    badgeLabel: string;
    items: string[];
}

const getSelfCareCategories = (t: (key: string, opts?: any) => string): SelfCareCategory[] => [
    {
        id: 'rest',
        title: t('journeys.care.symptomChecker.selfCare.rest.title', { defaultValue: 'Rest & Recovery' }),
        badgeStatus: 'success',
        badgeLabel: t('journeys.care.symptomChecker.selfCare.rest.badge', { defaultValue: 'Essential' }),
        items: [
            t('journeys.care.symptomChecker.selfCare.rest.item1', {
                defaultValue: 'Get 7-9 hours of sleep each night',
            }),
            t('journeys.care.symptomChecker.selfCare.rest.item2', {
                defaultValue: 'Avoid strenuous physical activity until symptoms improve',
            }),
            t('journeys.care.symptomChecker.selfCare.rest.item3', {
                defaultValue: 'Take short naps if feeling fatigued during the day',
            }),
            t('journeys.care.symptomChecker.selfCare.rest.item4', {
                defaultValue: 'Elevate your head while sleeping if congested',
            }),
        ],
    },
    {
        id: 'hydration',
        title: t('journeys.care.symptomChecker.selfCare.hydration.title', { defaultValue: 'Hydration' }),
        badgeStatus: 'info',
        badgeLabel: t('journeys.care.symptomChecker.selfCare.hydration.badge', { defaultValue: 'Important' }),
        items: [
            t('journeys.care.symptomChecker.selfCare.hydration.item1', {
                defaultValue: 'Drink at least 8 glasses (2L) of water daily',
            }),
            t('journeys.care.symptomChecker.selfCare.hydration.item2', {
                defaultValue: 'Include warm beverages such as herbal tea or broth',
            }),
            t('journeys.care.symptomChecker.selfCare.hydration.item3', {
                defaultValue: 'Avoid caffeinated and alcoholic beverages',
            }),
            t('journeys.care.symptomChecker.selfCare.hydration.item4', {
                defaultValue: 'Use oral rehydration solutions if experiencing vomiting or diarrhea',
            }),
        ],
    },
    {
        id: 'otc',
        title: t('journeys.care.symptomChecker.selfCare.otc.title', { defaultValue: 'OTC Medications' }),
        badgeStatus: 'warning',
        badgeLabel: t('journeys.care.symptomChecker.selfCare.otc.badge', { defaultValue: 'As Needed' }),
        items: [
            t('journeys.care.symptomChecker.selfCare.otc.item1', {
                defaultValue: 'Acetaminophen (Tylenol) for pain and fever relief',
            }),
            t('journeys.care.symptomChecker.selfCare.otc.item2', {
                defaultValue: 'Ibuprofen (Advil/Motrin) for inflammation and pain',
            }),
            t('journeys.care.symptomChecker.selfCare.otc.item3', {
                defaultValue: 'Antihistamines for allergy-related symptoms',
            }),
            t('journeys.care.symptomChecker.selfCare.otc.item4', {
                defaultValue: 'Always follow dosage instructions on the label',
            }),
        ],
    },
    {
        id: 'monitoring',
        title: t('journeys.care.symptomChecker.selfCare.monitoring.title', { defaultValue: 'Monitoring' }),
        badgeStatus: 'neutral',
        badgeLabel: t('journeys.care.symptomChecker.selfCare.monitoring.badge', { defaultValue: 'Ongoing' }),
        items: [
            t('journeys.care.symptomChecker.selfCare.monitoring.item1', {
                defaultValue: 'Track your symptoms daily and note any changes',
            }),
            t('journeys.care.symptomChecker.selfCare.monitoring.item2', {
                defaultValue: 'Take your temperature twice daily',
            }),
            t('journeys.care.symptomChecker.selfCare.monitoring.item3', {
                defaultValue: 'Record any new symptoms that develop',
            }),
            t('journeys.care.symptomChecker.selfCare.monitoring.item4', {
                defaultValue: 'Note what makes symptoms better or worse',
            }),
        ],
    },
    {
        id: 'seek-help',
        title: t('journeys.care.symptomChecker.selfCare.seekHelp.title', { defaultValue: 'When to Seek Help' }),
        badgeStatus: 'error',
        badgeLabel: t('journeys.care.symptomChecker.selfCare.seekHelp.badge', { defaultValue: 'Urgent' }),
        items: [
            t('journeys.care.symptomChecker.selfCare.seekHelp.item1', {
                defaultValue: 'Fever above 39.4\u00b0C (103\u00b0F) that does not respond to medication',
            }),
            t('journeys.care.symptomChecker.selfCare.seekHelp.item2', {
                defaultValue: 'Difficulty breathing or chest pain',
            }),
            t('journeys.care.symptomChecker.selfCare.seekHelp.item3', {
                defaultValue: 'Symptoms worsening significantly after 48 hours',
            }),
            t('journeys.care.symptomChecker.selfCare.seekHelp.item4', {
                defaultValue: 'Inability to keep fluids down for more than 24 hours',
            }),
            t('journeys.care.symptomChecker.selfCare.seekHelp.item5', {
                defaultValue: 'Confusion, severe dizziness, or loss of consciousness',
            }),
        ],
    },
];

type SymptomSelfCareRouteParams = {
    conditions: any[];
    overallSeverity: number;
};

/**
 * Self-care instructions screen with categorized tips.
 * Users can check off acknowledged tips and set follow-up reminders.
 */
const SymptomSelfCare: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<{ params: SymptomSelfCareRouteParams }, 'params'>>();
    const { t } = useTranslation();
    const { conditions = [], overallSeverity = 5 } = route.params || {};

    const categories = getSelfCareCategories(t as (key: string, opts?: any) => string);

    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

    const toggleItem = (categoryId: string, itemIndex: number) => {
        const key = `${categoryId}-${itemIndex}`;
        setCheckedItems((prev) => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    const handleSetReminder = (): void => {
        navigation.navigate(ROUTES.CARE_SYMPTOM_FOLLOW_UP, {
            conditions,
            overallSeverity,
        });
    };

    const handleSaveReport = (): void => {
        navigation.navigate(ROUTES.CARE_SYMPTOM_SAVE_REPORT, {
            conditions,
            overallSeverity,
            acknowledgedTips: Array.from(checkedItems),
        });
    };

    const handleBack = (): void => {
        navigation.goBack();
    };

    return (
        <View style={styles.root}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <Text variant="heading" journey="care" testID="self-care-title">
                    {t('journeys.care.symptomChecker.selfCare.title', { defaultValue: 'Self-Care Guide' })}
                </Text>

                <Text variant="body" journey="care">
                    {t('journeys.care.symptomChecker.selfCare.description', {
                        defaultValue:
                            'Follow these recommendations to help manage your symptoms at home. Check off items as you complete them.',
                    })}
                </Text>

                {categories.map((category) => (
                    <Card key={category.id} journey="care" elevation="sm">
                        <View style={styles.categoryHeader}>
                            <Text
                                fontSize="heading-md"
                                fontWeight="semiBold"
                                journey="care"
                                testID={`category-title-${category.id}`}
                            >
                                {category.title}
                            </Text>
                            <Badge
                                variant="status"
                                status={category.badgeStatus}
                                testID={`category-badge-${category.id}`}
                                accessibilityLabel={`${category.title} - ${category.badgeLabel}`}
                            >
                                {category.badgeLabel}
                            </Badge>
                        </View>

                        <View style={styles.itemList}>
                            {category.items.map((item, idx) => {
                                const itemKey = `${category.id}-${idx}`;
                                const isChecked = checkedItems.has(itemKey);

                                return (
                                    <Touchable
                                        key={idx}
                                        onPress={() => toggleItem(category.id, idx)}
                                        accessibilityLabel={`${isChecked ? 'Uncheck' : 'Check'}: ${item}`}
                                        accessibilityRole="checkbox"
                                        testID={`self-care-item-${category.id}-${idx}`}
                                    >
                                        <View style={styles.checkboxRow}>
                                            <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                                                {isChecked && (
                                                    <Text
                                                        fontSize="text-xs"
                                                        fontWeight="bold"
                                                        color={colors.neutral.white}
                                                        textAlign="center"
                                                    >
                                                        {'\u2713'}
                                                    </Text>
                                                )}
                                            </View>
                                            <Text
                                                variant="body"
                                                fontSize="text-sm"
                                                journey="care"
                                                color={isChecked ? colors.neutral.gray500 : undefined}
                                            >
                                                {item}
                                            </Text>
                                        </View>
                                    </Touchable>
                                );
                            })}
                        </View>
                    </Card>
                ))}

                <View style={styles.actionButtons}>
                    <Button
                        variant="secondary"
                        onPress={handleSetReminder}
                        journey="care"
                        accessibilityLabel={t('journeys.care.symptomChecker.selfCare.setReminder', {
                            defaultValue: 'Set a follow-up reminder',
                        })}
                        testID="set-reminder-button"
                    >
                        {t('journeys.care.symptomChecker.selfCare.reminderButton', {
                            defaultValue: 'Set Follow-Up Reminder',
                        })}
                    </Button>
                    <Button
                        onPress={handleSaveReport}
                        journey="care"
                        accessibilityLabel={t('journeys.care.symptomChecker.selfCare.saveReport', {
                            defaultValue: 'Save your symptom report',
                        })}
                        testID="save-report-button"
                    >
                        {t('journeys.care.symptomChecker.selfCare.saveButton', {
                            defaultValue: 'Save Report',
                        })}
                    </Button>
                </View>

                <View style={styles.backContainer}>
                    <Button
                        variant="secondary"
                        onPress={handleBack}
                        journey="care"
                        accessibilityLabel={t('journeys.care.symptomChecker.selfCare.back', {
                            defaultValue: 'Go back to conditions list',
                        })}
                        testID="back-button"
                    >
                        {t('journeys.care.symptomChecker.selfCare.backButton', { defaultValue: 'Back' })}
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
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
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacingValues.sm,
    },
    itemList: {
        gap: spacingValues.xs,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacingValues.sm,
        paddingVertical: spacingValues['3xs'],
    },
    checkbox: {
        width: spacingValues.lg,
        height: spacingValues.lg,
        borderRadius: spacingValues['3xs'],
        borderWidth: 2,
        borderColor: colors.neutral.gray400,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },
    checkboxChecked: {
        backgroundColor: colors.semantic.success,
        borderColor: colors.semantic.success,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacingValues.xl,
        gap: spacingValues.md,
    },
    backContainer: {
        marginTop: spacingValues.md,
        alignItems: 'center',
    },
});

export { SymptomSelfCare };
export default SymptomSelfCare;
