/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { Button } from '@design-system/components/Button/Button';
import Input from '@design-system/components/Input/Input';
import { Select } from '@design-system/components/Select/Select';
import type { Theme } from '@design-system/themes/base.theme';
import { borderRadiusValues } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { spacingValues } from '@design-system/tokens/spacing';
import { fontSizeValues } from '@design-system/tokens/typography';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useTheme } from 'styled-components/native';

/**
 * Deductible percentage options for the slider-style selector.
 */
const DEDUCTIBLE_OPTIONS = [0, 10, 20, 30, 40, 50];

/**
 * A screen component that allows users to simulate healthcare costs
 * based on insurance coverage within the Plan journey. Includes procedure
 * selection, provider input, deductible slider, and a tokenized result card.
 */
export const CostSimulatorScreen: React.FC = () => {
    const { t } = useTranslation();
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);
    const [procedureType, setProcedureType] = useState('');
    const [provider, setProvider] = useState('');
    const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
    const [deductiblePercent, setDeductiblePercent] = useState(20);

    const procedureOptions = [
        { label: t('journeys.plan.simulator.procedures.consultation'), value: 'consultation' },
        { label: t('journeys.plan.simulator.procedures.labTest'), value: 'labTest' },
        { label: t('journeys.plan.simulator.procedures.imaging'), value: 'imaging' },
        { label: t('journeys.plan.simulator.procedures.surgery'), value: 'surgery' },
        { label: t('journeys.plan.simulator.procedures.physicalTherapy'), value: 'physicalTherapy' },
    ];

    /**
     * Simulates the cost based on procedure type, provider, and deductible.
     * In production this would call an API for accurate estimates.
     */
    const handleSimulateCost = (): void => {
        if (!procedureType || !provider) {
            Alert.alert(t('common.validation.requiredFields'), t('common.validation.fillAllFields'));
            return;
        }

        let baseCost = 0;
        switch (procedureType) {
            case 'consultation':
                baseCost = 150;
                break;
            case 'labTest':
                baseCost = 200;
                break;
            case 'imaging':
                baseCost = 500;
                break;
            case 'surgery':
                baseCost = 3000;
                break;
            case 'physicalTherapy':
                baseCost = 100;
                break;
            default:
                baseCost = 0;
        }

        const coverageRate = (100 - deductiblePercent) / 100;
        const outOfPocket = baseCost * (1 - coverageRate);
        setEstimatedCost(Math.round(outOfPocket * 100) / 100);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>{t('journeys.plan.simulator.title')}</Text>
            <Text style={styles.subtitle}>{t('journeys.plan.simulator.subtitle')}</Text>

            {/* Form Card */}
            <View style={styles.formCard}>
                <View testID="plan-cost-procedure-input" style={styles.fieldContainer}>
                    <Select
                        label={t('journeys.plan.simulator.procedureType')}
                        options={procedureOptions}
                        value={procedureType}
                        onChange={(value) => setProcedureType(value as string)}
                        journey="plan"
                    />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>{t('journeys.plan.simulator.providerName')}</Text>
                    <Input
                        value={provider}
                        onChangeText={(text: string) => setProvider(text)}
                        placeholder={t('journeys.plan.simulator.providerPlaceholder')}
                        journey="plan"
                    />
                </View>

                {/* Deductible Selector */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>{t('journeys.plan.simulator.deductible')}</Text>
                    <View style={styles.sliderRow}>
                        {DEDUCTIBLE_OPTIONS.map((val) => (
                            <View
                                key={val}
                                style={[styles.sliderStep, deductiblePercent === val && styles.sliderStepActive]}
                                onTouchEnd={() => setDeductiblePercent(val)}
                                accessible
                                accessibilityLabel={`Franquia ${val}%`}
                                accessibilityRole="button"
                            >
                                <Text
                                    style={[
                                        styles.sliderStepText,
                                        deductiblePercent === val && styles.sliderStepTextActive,
                                    ]}
                                >
                                    {val}%
                                </Text>
                            </View>
                        ))}
                    </View>
                    <View style={styles.sliderTrack}>
                        <View
                            style={[
                                styles.sliderFill,
                                {
                                    width: `${
                                        (DEDUCTIBLE_OPTIONS.indexOf(deductiblePercent) /
                                            (DEDUCTIBLE_OPTIONS.length - 1)) *
                                        100
                                    }%`,
                                },
                            ]}
                        />
                    </View>
                </View>

                <Button testID="plan-cost-calculate" onPress={handleSimulateCost} journey="plan">
                    {t('journeys.plan.simulator.simulate')}
                </Button>
            </View>

            {/* Result Card */}
            {estimatedCost !== null && (
                <View testID="plan-cost-result" style={styles.resultCard}>
                    <Text style={styles.resultTitle}>{t('journeys.plan.simulator.estimatedCost')}</Text>
                    <Text style={styles.resultValue}>R$ {estimatedCost.toFixed(2)}</Text>
                    <Text style={styles.resultDescription}>{t('journeys.plan.simulator.resultDescription')}</Text>
                    <View style={styles.resultDivider} />
                    <View style={styles.resultMetaRow}>
                        <Text style={styles.resultMetaLabel}>{t('journeys.plan.simulator.coverageApplied')}</Text>
                        <Text style={styles.resultMetaValue}>{100 - deductiblePercent}%</Text>
                    </View>
                    <View style={styles.resultMetaRow}>
                        <Text style={styles.resultMetaLabel}>{t('journeys.plan.simulator.deductible')}</Text>
                        <Text style={styles.resultMetaValue}>{deductiblePercent}%</Text>
                    </View>
                </View>
            )}
        </ScrollView>
    );
};

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.journeys.plan.background,
        },
        scrollContent: {
            padding: spacingValues.md,
            gap: spacingValues.md,
        },
        title: {
            fontSize: fontSizeValues['2xl'],
            fontWeight: '700' as const,
            color: colors.journeys.plan.text,
        },
        subtitle: {
            fontSize: fontSizeValues.md,
            color: colors.gray[50],
            lineHeight: fontSizeValues.md * 1.5,
        },

        /* Form Card */
        formCard: {
            backgroundColor: theme.colors.background.default,
            borderRadius: borderRadiusValues.lg,
            padding: spacingValues.md,
            gap: spacingValues.md,
            shadowColor: colors.neutral.black,
            shadowOpacity: 0.08,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 6,
            elevation: 2,
        },
        fieldContainer: {
            gap: spacingValues.xs,
        },
        fieldLabel: {
            fontSize: fontSizeValues.sm,
            fontWeight: '500' as const,
            color: colors.gray[60],
        },

        /* Deductible Slider */
        sliderRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        sliderStep: {
            paddingVertical: spacingValues.xs,
            paddingHorizontal: spacingValues.sm,
            borderRadius: borderRadiusValues.full,
            backgroundColor: theme.colors.background.subtle,
        },
        sliderStepActive: {
            backgroundColor: colors.journeys.plan.primary,
        },
        sliderStepText: {
            fontSize: fontSizeValues.xs,
            fontWeight: '600' as const,
            color: colors.gray[50],
        },
        sliderStepTextActive: {
            color: colors.neutral.white,
        },
        sliderTrack: {
            height: 4,
            backgroundColor: theme.colors.border.default,
            borderRadius: borderRadiusValues.full,
            overflow: 'hidden',
        },
        sliderFill: {
            height: 4,
            backgroundColor: colors.journeys.plan.primary,
            borderRadius: borderRadiusValues.full,
        },

        /* Result Card */
        resultCard: {
            backgroundColor: theme.colors.background.default,
            borderRadius: borderRadiusValues.lg,
            padding: spacingValues.lg,
            alignItems: 'center',
            shadowColor: colors.neutral.black,
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 8,
            elevation: 3,
        },
        resultTitle: {
            fontSize: fontSizeValues.lg,
            fontWeight: '700' as const,
            color: colors.journeys.plan.text,
            marginBottom: spacingValues.xs,
        },
        resultValue: {
            fontSize: 28,
            fontWeight: '700' as const,
            color: colors.journeys.plan.primary,
            marginBottom: spacingValues.xs,
        },
        resultDescription: {
            fontSize: fontSizeValues.sm,
            color: colors.gray[50],
            textAlign: 'center',
        },
        resultDivider: {
            height: 1,
            backgroundColor: theme.colors.border.default,
            alignSelf: 'stretch',
            marginVertical: spacingValues.sm,
        },
        resultMetaRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignSelf: 'stretch',
            paddingVertical: spacingValues['3xs'],
        },
        resultMetaLabel: {
            fontSize: fontSizeValues.sm,
            color: colors.gray[50],
        },
        resultMetaValue: {
            fontSize: fontSizeValues.sm,
            fontWeight: '600' as const,
            color: colors.journeys.plan.text,
        },
    });

export default CostSimulatorScreen;
