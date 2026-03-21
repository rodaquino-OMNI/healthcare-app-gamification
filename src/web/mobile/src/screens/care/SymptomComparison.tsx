import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useRoute, RouteProp } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView } from 'react-native';

interface CheckData {
    id: string;
    date: string;
    symptoms: string[];
    regions: string[];
    overallSeverity: number;
    conditions: Array<{
        name: string;
        probability: number;
        severity: 'low' | 'medium' | 'high';
    }>;
}

type SymptomComparisonRouteParams = {
    checkId1?: string;
    checkId2?: string;
};

const MOCK_CHECK_A: CheckData = {
    id: 'check-1',
    date: '2026-02-20',
    symptoms: ['Headache', 'Neck Stiffness', 'Light Sensitivity'],
    regions: ['Head - Frontal', 'Neck'],
    overallSeverity: 4,
    conditions: [
        { name: 'Tension Headache', probability: 72, severity: 'low' },
        { name: 'Migraine', probability: 45, severity: 'medium' },
        { name: 'Cervical Strain', probability: 30, severity: 'low' },
    ],
};

const MOCK_CHECK_B: CheckData = {
    id: 'check-2',
    date: '2026-02-18',
    symptoms: ['Sore Throat', 'Runny Nose', 'Cough', 'Low Fever'],
    regions: ['Throat', 'Chest'],
    overallSeverity: 5,
    conditions: [
        { name: 'Common Cold', probability: 68, severity: 'low' },
        { name: 'Influenza', probability: 35, severity: 'medium' },
        { name: 'Strep Throat', probability: 20, severity: 'medium' },
    ],
};

type ChangeStatus = 'improved' | 'worsened' | 'same' | 'new' | 'resolved';

const getChangeColor = (status: ChangeStatus): string => {
    switch (status) {
        case 'improved':
        case 'resolved':
            return colors.semantic.success;
        case 'worsened':
        case 'new':
            return colors.semantic.error;
        case 'same':
            return colors.neutral.gray500;
    }
};

const getChangeBadgeStatus = (status: ChangeStatus): 'success' | 'warning' | 'error' => {
    switch (status) {
        case 'improved':
        case 'resolved':
            return 'success';
        case 'worsened':
        case 'new':
            return 'error';
        case 'same':
            return 'warning';
    }
};

const getSeverityBadgeStatus = (severity: number): 'success' | 'warning' | 'error' => {
    if (severity <= 3) {
        return 'success';
    }
    if (severity <= 6) {
        return 'warning';
    }
    return 'error';
};

const getSeverityLabel = (severity: number): string => {
    if (severity <= 3) {
        return 'Low';
    }
    if (severity <= 6) {
        return 'Moderate';
    }
    return 'High';
};

const compareSeverity = (a: number, b: number): ChangeStatus => {
    if (a < b) {
        return 'improved';
    }
    if (a > b) {
        return 'worsened';
    }
    return 'same';
};

const getConclusion = (checkA: CheckData, checkB: CheckData): string => {
    const severityChange = checkA.overallSeverity - checkB.overallSeverity;
    const symptomsA = new Set(checkA.symptoms);
    const symptomsB = new Set(checkB.symptoms);
    const newSymptoms = checkA.symptoms.filter((s) => !symptomsB.has(s));
    const resolvedSymptoms = checkB.symptoms.filter((s) => !symptomsA.has(s));

    const parts: string[] = [];

    if (severityChange < 0) {
        parts.push(`Overall severity improved by ${Math.abs(severityChange)} points.`);
    } else if (severityChange > 0) {
        parts.push(`Overall severity increased by ${severityChange} points.`);
    } else {
        parts.push('Overall severity remained the same.');
    }

    if (newSymptoms.length > 0) {
        parts.push(`${newSymptoms.length} new symptom(s) appeared.`);
    }
    if (resolvedSymptoms.length > 0) {
        parts.push(`${resolvedSymptoms.length} symptom(s) resolved.`);
    }

    return parts.join(' ');
};

/**
 * Compare two symptom checks side-by-side.
 * Shows differences in symptoms, severity, conditions, and body regions.
 */
const SymptomComparison: React.FC = () => {
    const _route = useRoute<RouteProp<{ params: SymptomComparisonRouteParams }, 'params'>>();
    const { t } = useTranslation();

    const checkA = MOCK_CHECK_A;
    const checkB = MOCK_CHECK_B;

    const severityChange = compareSeverity(checkA.overallSeverity, checkB.overallSeverity);
    const conclusion = getConclusion(checkA, checkB);

    const allSymptoms = Array.from(new Set([...checkA.symptoms, ...checkB.symptoms]));

    const _allRegions = Array.from(new Set([...checkA.regions, ...checkB.regions]));

    const getSymptomStatus = (symptom: string): ChangeStatus => {
        const inA = checkA.symptoms.includes(symptom);
        const inB = checkB.symptoms.includes(symptom);
        if (inA && !inB) {
            return 'new';
        }
        if (!inA && inB) {
            return 'resolved';
        }
        return 'same';
    };

    return (
        <View style={styles.root}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <Text variant="heading" journey="care" testID="comparison-title">
                    {t('journeys.care.symptomChecker.comparison.title')}
                </Text>

                {/* Date headers */}
                <View style={styles.dateHeaders}>
                    <View style={styles.dateColumn}>
                        <Text fontSize="text-sm" color={colors.neutral.gray600}>
                            {t('journeys.care.symptomChecker.comparison.recent')}
                        </Text>
                        <Text fontSize="heading-md" fontWeight="semiBold" journey="care" testID="date-a">
                            {checkA.date}
                        </Text>
                    </View>
                    <View style={styles.vsContainer}>
                        <Text fontSize="text-sm" fontWeight="bold" color={colors.neutral.gray500}>
                            {t('journeys.care.symptomChecker.comparison.vs')}
                        </Text>
                    </View>
                    <View style={[styles.dateColumn, styles.dateColumnRight]}>
                        <Text fontSize="text-sm" color={colors.neutral.gray600}>
                            {t('journeys.care.symptomChecker.comparison.previous')}
                        </Text>
                        <Text fontSize="heading-md" fontWeight="semiBold" journey="care" testID="date-b">
                            {checkB.date}
                        </Text>
                    </View>
                </View>

                {/* Severity comparison */}
                <Card journey="care" elevation="md">
                    <View style={styles.comparisonHeader}>
                        <Text variant="body" fontWeight="semiBold" journey="care">
                            {t('journeys.care.symptomChecker.comparison.severity')}
                        </Text>
                        <Badge
                            variant="status"
                            status={getChangeBadgeStatus(severityChange)}
                            testID="severity-change-badge"
                            accessibilityLabel={`${t('journeys.care.symptomChecker.comparison.severity')}: ${severityChange}`}
                        >
                            {severityChange.charAt(0).toUpperCase() + severityChange.slice(1)}
                        </Badge>
                    </View>
                    <View style={styles.comparisonRow}>
                        <View style={styles.comparisonValue}>
                            <Badge
                                variant="status"
                                status={getSeverityBadgeStatus(checkA.overallSeverity)}
                                testID="severity-a"
                                accessibilityLabel={`${t('journeys.care.symptomChecker.comparison.recent')}: ${checkA.overallSeverity}/10`}
                            >
                                {checkA.overallSeverity}/10
                            </Badge>
                            <Text fontSize="text-xs" color={colors.neutral.gray600}>
                                {getSeverityLabel(checkA.overallSeverity)}
                            </Text>
                        </View>
                        <Text
                            fontSize="heading-md"
                            color={getChangeColor(severityChange)}
                            fontWeight="bold"
                            testID="severity-arrow"
                        >
                            {severityChange === 'improved'
                                ? '\u2193'
                                : severityChange === 'worsened'
                                  ? '\u2191'
                                  : '\u2194'}
                        </Text>
                        <View style={[styles.comparisonValue, styles.comparisonValueRight]}>
                            <Badge
                                variant="status"
                                status={getSeverityBadgeStatus(checkB.overallSeverity)}
                                testID="severity-b"
                                accessibilityLabel={`${t('journeys.care.symptomChecker.comparison.previous')}: ${checkB.overallSeverity}/10`}
                            >
                                {checkB.overallSeverity}/10
                            </Badge>
                            <Text fontSize="text-xs" color={colors.neutral.gray600}>
                                {getSeverityLabel(checkB.overallSeverity)}
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Symptoms comparison */}
                <Card journey="care" elevation="sm">
                    <Text variant="body" fontWeight="semiBold" journey="care">
                        {t('journeys.care.symptomChecker.comparison.symptoms')}
                    </Text>
                    {allSymptoms.map((symptom, index) => {
                        const status = getSymptomStatus(symptom);
                        return (
                            <View key={`sym-${index}`} style={styles.symptomRow}>
                                <Text
                                    variant="body"
                                    journey="care"
                                    color={getChangeColor(status)}
                                    testID={`symptom-${index}`}
                                >
                                    {symptom}
                                </Text>
                                <Badge
                                    variant="status"
                                    status={getChangeBadgeStatus(status)}
                                    testID={`symptom-status-${index}`}
                                    accessibilityLabel={`${symptom}: ${status}`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </Badge>
                            </View>
                        );
                    })}
                </Card>

                {/* Body regions comparison */}
                <Card journey="care" elevation="sm">
                    <Text variant="body" fontWeight="semiBold" journey="care">
                        {t('journeys.care.symptomChecker.comparison.bodyRegions')}
                    </Text>
                    <View style={styles.regionComparison}>
                        <View style={styles.regionColumn}>
                            <Text fontSize="text-xs" fontWeight="semiBold" color={colors.neutral.gray600}>
                                {checkA.date}
                            </Text>
                            {checkA.regions.map((region, index) => (
                                <Text
                                    key={`ra-${index}`}
                                    fontSize="text-sm"
                                    journey="care"
                                    testID={`region-a-${index}`}
                                >
                                    {'\u2022'} {region}
                                </Text>
                            ))}
                        </View>
                        <View style={styles.regionDivider} />
                        <View style={styles.regionColumn}>
                            <Text fontSize="text-xs" fontWeight="semiBold" color={colors.neutral.gray600}>
                                {checkB.date}
                            </Text>
                            {checkB.regions.map((region, index) => (
                                <Text
                                    key={`rb-${index}`}
                                    fontSize="text-sm"
                                    journey="care"
                                    testID={`region-b-${index}`}
                                >
                                    {'\u2022'} {region}
                                </Text>
                            ))}
                        </View>
                    </View>
                </Card>

                {/* Conditions comparison */}
                <Card journey="care" elevation="sm">
                    <Text variant="body" fontWeight="semiBold" journey="care">
                        {t('journeys.care.symptomChecker.comparison.conditions')}
                    </Text>
                    <View style={styles.conditionsComparison}>
                        <View style={styles.conditionColumn}>
                            <Text fontSize="text-xs" fontWeight="semiBold" color={colors.neutral.gray600}>
                                {checkA.date}
                            </Text>
                            {checkA.conditions.map((c, index) => (
                                <Text
                                    key={`ca-${index}`}
                                    fontSize="text-sm"
                                    journey="care"
                                    testID={`condition-a-${index}`}
                                >
                                    {c.name} ({c.probability}%)
                                </Text>
                            ))}
                        </View>
                        <View style={styles.regionDivider} />
                        <View style={styles.conditionColumn}>
                            <Text fontSize="text-xs" fontWeight="semiBold" color={colors.neutral.gray600}>
                                {checkB.date}
                            </Text>
                            {checkB.conditions.map((c, index) => (
                                <Text
                                    key={`cb-${index}`}
                                    fontSize="text-sm"
                                    journey="care"
                                    testID={`condition-b-${index}`}
                                >
                                    {c.name} ({c.probability}%)
                                </Text>
                            ))}
                        </View>
                    </View>
                </Card>

                {/* Conclusion card */}
                <Card journey="care" elevation="md" borderColor={getChangeColor(severityChange)}>
                    <Text variant="body" fontWeight="semiBold" journey="care">
                        {t('journeys.care.symptomChecker.comparison.conclusion')}
                    </Text>
                    <Text variant="body" journey="care" testID="conclusion-text">
                        {conclusion}
                    </Text>
                    <Text variant="caption" color={colors.neutral.gray600} style={styles.disclaimer}>
                        {t('journeys.care.symptomChecker.comparison.disclaimer')}
                    </Text>
                </Card>
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
    dateHeaders: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacingValues.sm,
    },
    dateColumn: {
        flex: 1,
    },
    dateColumnRight: {
        alignItems: 'flex-end',
    },
    vsContainer: {
        paddingHorizontal: spacingValues.sm,
    },
    comparisonHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacingValues.sm,
    },
    comparisonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    comparisonValue: {
        alignItems: 'flex-start',
        gap: spacingValues['4xs'],
    },
    comparisonValueRight: {
        alignItems: 'flex-end',
    },
    symptomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacingValues['3xs'],
    },
    regionComparison: {
        flexDirection: 'row',
        marginTop: spacingValues.sm,
    },
    regionColumn: {
        flex: 1,
        gap: spacingValues['4xs'],
    },
    regionDivider: {
        width: 1,
        backgroundColor: colors.neutral.gray300,
        marginHorizontal: spacingValues.sm,
    },
    conditionsComparison: {
        flexDirection: 'row',
        marginTop: spacingValues.sm,
    },
    conditionColumn: {
        flex: 1,
        gap: spacingValues['4xs'],
    },
    disclaimer: {
        marginTop: spacingValues.sm,
    },
});

export { SymptomComparison };
export default SymptomComparison;
