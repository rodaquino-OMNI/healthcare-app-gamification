import { LineChart } from '@design-system/charts/LineChart/LineChart';
import { Card } from '@design-system/components/Card/Card';
import type { Theme } from '@design-system/themes/base.theme';
import { colors } from '@design-system/tokens/colors';
import { useRoute, useNavigation, type RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { useTheme } from 'styled-components/native';

import { JourneyHeader } from '../../components/shared/JourneyHeader';
import { useJourney } from '../../context/JourneyContext';
import { useAuth } from '../../hooks/useAuth';
import { useHealthMetrics } from '../../hooks/useHealthMetrics';
import type { HealthStackParamList } from '../../navigation/types';
import { formatHealthMetric } from '../../utils/format';

type JourneyKey = keyof typeof colors.journeys;

type MetricDetailNavigationProp = StackNavigationProp<HealthStackParamList, 'HealthMetricDetail'>;
type MetricDetailRouteProp = RouteProp<HealthStackParamList, 'HealthMetricDetail'>;

/**
 * Displays detailed information for a selected health metric.
 */
export const MetricDetailScreen: React.FC = () => {
    const { t } = useTranslation();
    const theme = useTheme() as Theme;

    // 1. Retrieves the route object using `useRoute` to access the `metricType` parameter.
    const route = useRoute<MetricDetailRouteProp>();
    const metricType = route.params?.metricType;

    // 2. Retrieves the navigation object using `useNavigation` for navigation purposes.
    const navigation = useNavigation<MetricDetailNavigationProp>();

    // 3. Retrieves the current journey using `useJourney` for theming.
    const { journey } = useJourney();

    // 4. Retrieves authenticated user info for API calls.
    const { session, getUserFromToken } = useAuth();

    // 5. Derive userId from authentication token.
    const userId = useMemo((): string => {
        if (!session?.accessToken) {
            return '';
        }
        try {
            const user = getUserFromToken(session.accessToken) as { id?: string } | null | undefined;
            if (user?.id) {
                return user.id;
            }
        } catch {
            // Token decode failed
        }
        return '';
    }, [session, getUserFromToken]);

    // 6. Defines state variables for the selected metric and time range.
    const [selectedMetric, setSelectedMetric] = useState<Record<string, unknown> | undefined>(undefined);
    const [_timeRange] = useState<Date[] | null>(null);

    // 7. Uses `useHealthMetrics` to fetch health metrics data.
    const { data, isLoading } = useHealthMetrics(
        userId,
        _timeRange ? _timeRange[0] : null,
        _timeRange ? _timeRange[1] : null,
        []
    );

    // 8. Filters the fetched health metrics to find the selected metric.
    useEffect(() => {
        if (data && metricType) {
            const found = data.find((metric) => metric.id === metricType);
            setSelectedMetric(found as unknown as Record<string, unknown> | undefined);
        }
    }, [data, metricType]);

    // Redirect to login if no session
    if (!session?.accessToken) {
        navigation.navigate('HealthMetricDetail', { metricType: '' });
        return null;
    }

    // Guard: if no metricType was provided via route params, show an error.
    if (!metricType) {
        return (
            <View style={{ flex: 1, backgroundColor: theme.colors.background.default }}>
                <JourneyHeader
                    title={t('journeys.health.metrics.title')}
                    showBackButton
                    onBackPress={() => navigation.goBack()}
                />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: theme.colors.text.muted, fontSize: 16 }}>
                        {t('journeys.health.metrics.noSelection')}
                    </Text>
                </View>
            </View>
        );
    }

    // If the selected metric is found, render metric details.
    if (selectedMetric) {
        const metricValue = selectedMetric as unknown as { type: string; value: number; unit: string };
        return (
            <View style={{ flex: 1, backgroundColor: colors.journeys[journey as JourneyKey].background }}>
                <JourneyHeader
                    title={metricValue.type}
                    showBackButton
                    onBackPress={() => navigation.navigate('HealthDashboard')}
                />

                <Card journey={journey as 'health' | 'care' | 'plan'}>
                    <Text style={{ color: colors.journeys[journey as JourneyKey].text }}>
                        {formatHealthMetric(metricValue.value, metricValue.unit)}
                    </Text>
                    <LineChart
                        data={(data || []) as unknown as Record<string, unknown>[]}
                        xAxisKey="timestamp"
                        yAxisKey="value"
                        xAxisLabel="Date"
                        yAxisLabel="Value"
                        journey={journey as 'health' | 'care' | 'plan'}
                    />
                </Card>
            </View>
        );
    }

    // Loading state.
    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: colors.journeys[journey as JourneyKey].background,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text style={{ color: theme.colors.text.muted }}>{t('journeys.health.metrics.loading')}</Text>
            </View>
        );
    }

    // If the selected metric is not found, render an error message.
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: theme.colors.background.default,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text style={{ color: theme.colors.text.muted, fontSize: 16 }}>
                {t('journeys.health.metrics.notFound')}
            </Text>
        </View>
    );
};

/**
 * Named export matching the HealthNavigator import `{ MetricDetail }`.
 */
export const MetricDetail = MetricDetailScreen;

export default MetricDetailScreen;
