import React, { useEffect, useState } from 'react'; // React v18.0.0
import { formatJourneyDate } from 'shared/utils/date';
import { LoadingIndicator } from '@/components/shared/LoadingIndicator';
import { Card, CardProps } from 'design-system/components/Card/Card';
import { useAuth } from '@/hooks/useAuth';
import { JOURNEY_CONFIG } from '@/constants/journeys';
import { HealthMetric, Appointment, Claim } from 'shared/types/index';
import { getHealthMetrics } from '@/api/index';

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
 * This widget provides a quick overview of the user's engagement with the AUSTA SuperApp and encourages continued interaction.
 */
export const RecentActivityWidget: React.FC = () => {
    // LD1: Retrieves the authentication session using the useAuth hook.
    const { session } = useAuth();
    // LD1: useState hook to manage the loading state of the component
    const [loading, setLoading] = useState(true);
    // LD1: useState hook to manage the recent activities
    const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);

    // LD1: If there is no session, returns null.
    if (!session) {
        return null;
    }

    // LD1: useEffect hook to fetch recent activities when the component mounts
    useEffect(() => {
        const fetchActivities = async () => {
            setLoading(true);
            try {
                // LD1: Fetches recent activities using the getRecentActivities function (implementation not provided).
                // LD1: Mock data for demonstration purposes
                const mockHealthMetrics: HealthMetric[] = [
                    {
                        id: '1',
                        userId: session.userId,
                        type: 'HEART_RATE',
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
                        userId: session.userId,
                        dateTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                        type: 'Telemedicine',
                        status: 'Scheduled',
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
                        userId: session.userId,
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

                // LD1: Sort activities by timestamp in descending order
                activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

                // LD1: Set the recent activities state with the fetched and sorted activities
                setRecentActivities(activities);
            } catch (error) {
                console.error('Failed to fetch recent activities:', error);
                // LD2: Implement error handling, such as displaying an error message to the user
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [session]);

    // LD1: Displays a loading indicator while fetching activities.
    if (loading) {
        return (
            <Card>
                <LoadingIndicator text="Loading recent activities..." />
            </Card>
        );
    }

    // LD1: Returns an empty state if there are no activities.
    if (recentActivities.length === 0) {
        return <Card>No recent activity.</Card>;
    }

    return (
        <Card>
            <h3>Recent Activities</h3>
            <ul>
                {recentActivities.map((activity) => (
                    <li key={activity.id}>
                        {/* LD1: Maps the activities to a list of Card components, displaying the activity description, timestamp, and icon. */}
                        {activity.description} - {formatJourneyDate(activity.timestamp, activity.journey)}
                    </li>
                ))}
            </ul>
        </Card>
    );
};
