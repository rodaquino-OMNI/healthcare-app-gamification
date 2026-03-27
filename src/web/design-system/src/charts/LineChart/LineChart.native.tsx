import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme, VictoryScatter, VictoryLabel } from 'victory-native';

import type { LineChartProps } from './LineChart';
import { Box } from '../../primitives/Box/Box.native';
import { Text } from '../../primitives/Text/Text.native';
import { colors, typography } from '../../tokens/index';

// Local utility — mirrors the web version's useJourneyColor helper
const useJourneyColor = (journey?: string): (typeof colors.journeys)[keyof typeof colors.journeys] => {
    const key = journey && ['health', 'care', 'plan'].includes(journey) ? journey : 'health';
    return colors.journeys[key as keyof typeof colors.journeys];
};

const CHART_HEIGHT = 300;
const CHART_PADDING = { top: 20, bottom: 50, left: 60, right: 20 };

const styles = StyleSheet.create({
    container: {
        minHeight: 200,
        width: '100%',
        backgroundColor: colors.neutral.white,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        padding: 8,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    emptyContainer: {
        minHeight: 200,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
});

/**
 * React Native LineChart component.
 * Uses victory-native (same API as victory) with react-native-svg rendering.
 * Tooltips are omitted — VictoryVoronoiContainer/VictoryTooltip are web-only.
 */
export const LineChart: React.FC<LineChartProps> = ({
    data,
    xAxisKey,
    yAxisKey,
    xAxisLabel,
    yAxisLabel,
    lineColor,
    journey = 'health',
}) => {
    const journeyColor = useJourneyColor(journey);
    const chartColor = lineColor || journeyColor?.primary || colors.journeys[journey].primary;

    // Empty state
    if (!data || data.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text color="gray600" textAlign="center">
                    No data available
                </Text>
            </View>
        );
    }

    // Format data for Victory
    const formattedData = data.map((item: Record<string, unknown>) => ({
        x: item[xAxisKey] as Date | string | number,
        y: item[yAxisKey] as number,
    }));

    const isDateXAxis = formattedData.length > 0 && formattedData[0].x instanceof Date;

    const formatDate = (date: Date | string | number): string => {
        if (date instanceof Date) {
            return date.toLocaleDateString();
        }
        return String(date);
    };

    const axisStyle = {
        axis: { stroke: colors.neutral.gray300 },
        tickLabels: {
            fill: colors.neutral.gray700,
            fontSize: 12,
            fontFamily: typography.fontFamily.body,
            padding: 5,
        },
        grid: {
            stroke: colors.neutral.gray200,
            strokeDasharray: '4, 4',
        },
    };

    return (
        <View
            style={styles.container}
            accessibilityLabel={`Line chart showing ${yAxisLabel || 'data'} over ${xAxisLabel || 'time'}`}
        >
            {(xAxisLabel || yAxisLabel) && (
                <Box style={styles.labelRow}>
                    {yAxisLabel && (
                        <Text fontSize="sm" color="gray600">
                            {yAxisLabel}
                        </Text>
                    )}
                    {xAxisLabel && (
                        <Text fontSize="sm" color="gray600">
                            {xAxisLabel}
                        </Text>
                    )}
                </Box>
            )}

            <VictoryChart
                theme={VictoryTheme.material}
                padding={CHART_PADDING}
                domainPadding={{ x: [20, 20], y: [20, 20] }}
                height={CHART_HEIGHT}
            >
                {/* Y Axis */}
                <VictoryAxis
                    dependentAxis
                    style={axisStyle}
                    tickFormat={(t: string | number) => String(t)}
                    axisLabelComponent={<VictoryLabel dy={-40} />}
                    label={yAxisLabel}
                />

                {/* X Axis */}
                <VictoryAxis
                    style={axisStyle}
                    tickFormat={isDateXAxis ? formatDate : undefined}
                    axisLabelComponent={<VictoryLabel dy={30} />}
                    label={xAxisLabel}
                />

                {/* Data Line */}
                <VictoryLine
                    data={formattedData}
                    style={{
                        data: {
                            stroke: chartColor,
                            strokeWidth: 2,
                        },
                    }}
                    animate={{
                        duration: 500,
                        onLoad: { duration: 500 },
                    }}
                />

                {/* Data Points */}
                <VictoryScatter
                    data={formattedData}
                    size={4}
                    style={{
                        data: {
                            fill: colors.neutral.white,
                            stroke: chartColor,
                            strokeWidth: 2,
                        },
                    }}
                />
            </VictoryChart>
        </View>
    );
};

export { LineChart as default };
export type { LineChartProps };
