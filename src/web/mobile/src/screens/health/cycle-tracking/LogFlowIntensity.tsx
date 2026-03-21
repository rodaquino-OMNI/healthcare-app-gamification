import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';

/**
 * Flow intensity level.
 */
type FlowIntensity = 'light' | 'medium' | 'heavy';

interface FlowConfig {
    id: FlowIntensity;
    labelKey: string;
    descriptionKey: string;
    dropletCount: number;
    dropletSize: number;
}

const FLOW_CONFIGS: FlowConfig[] = [
    {
        id: 'light',
        labelKey: 'journeys.health.cycle.flow.light',
        descriptionKey: 'journeys.health.cycle.flow.lightDesc',
        dropletCount: 1,
        dropletSize: 20,
    },
    {
        id: 'medium',
        labelKey: 'journeys.health.cycle.flow.medium',
        descriptionKey: 'journeys.health.cycle.flow.mediumDesc',
        dropletCount: 2,
        dropletSize: 24,
    },
    {
        id: 'heavy',
        labelKey: 'journeys.health.cycle.flow.heavy',
        descriptionKey: 'journeys.health.cycle.flow.heavyDesc',
        dropletCount: 3,
        dropletSize: 28,
    },
];

/**
 * Format today's date.
 */
const getTodayFormatted = (): string => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

/**
 * LogFlowIntensity provides a visual selector for flow intensity
 * with scaled droplet icons and quick date logging.
 */
export const LogFlowIntensity: React.FC = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();

    const [selectedFlow, setSelectedFlow] = useState<FlowIntensity>('medium');
    const [logDate] = useState(getTodayFormatted);

    const handleSave = useCallback(() => {
        Alert.alert(
            t('journeys.health.cycle.logFlow.savedTitle'),
            t('journeys.health.cycle.logFlow.savedMessage', { intensity: selectedFlow }),
            [{ text: t('common.buttons.ok'), onPress: () => navigation.goBack() }]
        );
    }, [navigation, selectedFlow, t]);

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
                    {t('journeys.health.cycle.logFlow.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Date Display */}
                <Card journey="health" elevation="sm" padding="md">
                    <View style={styles.dateRow}>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {t('journeys.health.cycle.logFlow.date')}
                        </Text>
                        <Text fontSize="md" fontWeight="semiBold">
                            {logDate}
                        </Text>
                    </View>
                </Card>

                {/* Flow Intensity Selector */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.cycle.logFlow.selectIntensity')}
                    </Text>

                    {FLOW_CONFIGS.map((config) => {
                        const isSelected = selectedFlow === config.id;
                        return (
                            <Touchable
                                key={config.id}
                                onPress={() => setSelectedFlow(config.id)}
                                accessibilityLabel={t(config.labelKey)}
                                accessibilityRole="button"
                                testID={`flow-option-${config.id}`}
                            >
                                <Card journey="health" elevation="sm" padding="md">
                                    <View style={styles.flowRow}>
                                        {/* Radio indicator */}
                                        <View style={styles.radioOuter}>
                                            {isSelected && <View style={styles.radioInner} />}
                                        </View>

                                        {/* Droplet icons */}
                                        <View style={styles.dropletContainer}>
                                            {Array.from({ length: config.dropletCount }, (_, i) => (
                                                <View
                                                    key={`drop-${config.id}-${i}`}
                                                    style={[
                                                        styles.droplet,
                                                        {
                                                            width: config.dropletSize,
                                                            height: config.dropletSize + 4,
                                                            borderRadius: config.dropletSize / 2,
                                                            backgroundColor: isSelected
                                                                ? colors.semantic.error
                                                                : colors.gray[30],
                                                        },
                                                    ]}
                                                />
                                            ))}
                                        </View>

                                        {/* Label and description */}
                                        <View style={styles.flowContent}>
                                            <Text
                                                fontSize="md"
                                                fontWeight={isSelected ? 'semiBold' : 'medium'}
                                                color={isSelected ? colors.semantic.error : colors.gray[60]}
                                            >
                                                {t(config.labelKey)}
                                            </Text>
                                            <Text fontSize="sm" color={colors.gray[50]}>
                                                {t(config.descriptionKey)}
                                            </Text>
                                        </View>
                                    </View>
                                </Card>
                            </Touchable>
                        );
                    })}
                </View>

                {/* Visual Summary */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.cycle.logFlow.summary')}
                    </Text>
                    <Card journey="health" elevation="md" padding="md">
                        <View style={styles.summaryContainer}>
                            <View style={styles.summaryDroplets}>
                                {Array.from(
                                    { length: FLOW_CONFIGS.find((c) => c.id === selectedFlow)?.dropletCount ?? 0 },
                                    (_, i) => (
                                        <View
                                            key={`summary-drop-${i}`}
                                            style={[styles.summaryDroplet, { backgroundColor: colors.semantic.error }]}
                                        />
                                    )
                                )}
                            </View>
                            <Text fontSize="lg" fontWeight="bold" color={colors.semantic.error}>
                                {t(
                                    FLOW_CONFIGS.find((c) => c.id === selectedFlow)?.labelKey ??
                                        'journeys.health.cycle.flow.medium'
                                )}
                            </Text>
                            <Text fontSize="sm" color={colors.gray[50]} textAlign="center">
                                {logDate}
                            </Text>
                        </View>
                    </Card>
                </View>

                {/* Save Button */}
                <View style={styles.actionsContainer}>
                    <Button
                        journey="health"
                        onPress={handleSave}
                        accessibilityLabel={t('journeys.health.cycle.logFlow.save')}
                        testID="save-button"
                    >
                        {t('journeys.health.cycle.logFlow.save')}
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
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionContainer: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
    flowRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: colors.journeys.health.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacingValues.sm,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.journeys.health.primary,
    },
    dropletContainer: {
        flexDirection: 'row',
        gap: spacingValues['3xs'],
        marginRight: spacingValues.sm,
        minWidth: 80,
        justifyContent: 'center',
    },
    droplet: {
        borderTopLeftRadius: 0,
    },
    flowContent: {
        flex: 1,
        gap: spacingValues['4xs'],
    },
    summaryContainer: {
        alignItems: 'center',
        gap: spacingValues.xs,
    },
    summaryDroplets: {
        flexDirection: 'row',
        gap: spacingValues.xs,
    },
    summaryDroplet: {
        width: 32,
        height: 40,
        borderRadius: 16,
    },
    actionsContainer: {
        marginTop: spacingValues['2xl'],
    },
});

export default LogFlowIntensity;
