import { Card } from 'design-system/components/Card/Card';
import React, { useEffect, useState } from 'react';
import { HealthMetric, HealthMetricType, Appointment, Claim } from 'shared/types/index';
import { formatJourneyDate } from 'shared/utils/date';

import { LoadingIndicator } from '@/components/shared/LoadingIndicator';
import { JOURNEY_CONFIG } from '@/constants/journeys';
import { useAuth } from '@/hooks/useAuth';

/**
 * Represents a single recent activity item.
 */
interface ActivityItem {
    id: string;
    journey: string;
    description: string;
    timestamp: Date;
}

/**
 * Displays a list of recent user activities.
 */
export const RecentActivityWidget: React.FC = () => {
    const { session } = useAuth();
    const [loading, setLoading] = useState(true);
    const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);

    useEffect(() => {
        if (!session) {
            setLoading(false);
            return;
        }

        const fetchActivities = (): void => {
            setLoading(true);
            try {
                const mockHealthMetrics: HealthMetric[] = [
                    {
                        id: '1',
                        userId: session.userId ?? '',
                        type: HealthMetricType.HEART_RATE,
                        value: 72,
                        unit: 'bpm',
                        timestamp: new Date().toISOString(),
                        source: 'Wearable',
                    },
                ];

                const mockAppointments: Appointment[] = [
                    {
                        id: '101',
                        providerId: 'doc1',
                        userId: session.userId ?? '',
                        dateTime: new Date(Date.now() + 86400000).toISOString(),
                        type: 'telemedicine',
                        status: 'upcoming',
                        reason: 'Follow-up',
                        notes: 'Discuss recent lab results',
                    },
                ];

                const mockClaims: Claim[] = [
                    {
                        id: '201',
                        planId: 'plan1',
                        type: 'medical',
                        amount: 150.0,
                        status: 'pending',
                        submittedAt: new Date().toISOString(),
                        documents: [],
                    },
                ];

                const activities: ActivityItem[] = [
                    ...mockHealthMetrics.map((metric) => ({
                        id: metric.id,
                        journey: JOURNEY_CONFIG.HEALTH.id,
                        description: `Recorded ${metric.type}: ${metric.value} ${metric.unit}`,
                        timestamp: new Date(metric.timestamp),
                    })),
                    ...mockAppointments.map((appointment) => ({
                        id: appointment.id,
                        journey: JOURNEY_CONFIG.CARE.id,
                        description: `Appointment scheduled for ${formatJourneyDate(
                            appointment.dateTime,
                            JOURNEY_CONFIG.CARE.id
                        )}`,
                        timestamp: new Date(appointment.dateTime),
                    })),
                    ...mockClaims.map((claim) => ({
                        id: claim.id,
                        journey: JOURNEY_CONFIG.PLAN.id,
                        description: `Claim submitted for $${claim.amount}`,
                        timestamp: new Date(claim.submittedAt),
                    })),
                ];

                activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

                setRecentActivities(activities);
            } catch (_error) {
                // Error handling: display error message to the user
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [session]);

    if (!session) {
        return null;
    }

    if (loading) {
        return (
            <Card>
                <LoadingIndicator text="Loading recent activities..." />
            </Card>
        );
    }

    if (recentActivities.length === 0) {
        return <Card>No recent activity.</Card>;
    }

    return (
        <Card>
            <h3>Recent Activities</h3>
            <ul>
                {recentActivities.map((activity) => (
                    <li key={activity.id}>
                        {activity.description} - {formatJourneyDate(activity.timestamp, activity.journey)}
                    </li>
                ))}
            </ul>
        </Card>
    );
};
