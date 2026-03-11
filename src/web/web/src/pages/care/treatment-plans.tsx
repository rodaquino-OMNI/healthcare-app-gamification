import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { useRouter } from 'next/router'; // next/router v13.0+
import React from 'react'; // React v18.0+

import { useAppointments } from '@/hooks/useAppointments';
import { CareLayout } from '@/layouts/CareLayout';
import { formatDate } from '@/utils/format';

/**
 * Renders the Treatment Plans screen, fetching and displaying a list of treatment plans for the user.
 * @returns {JSX.Element} The rendered Treatment Plans screen.
 */
const TreatmentPlans: React.FC = () => {
    const { appointments, loading, error } = useAppointments();

    // Access the Next.js router for navigation.
    const router = useRouter();

    // Handle loading state: display a loading indicator while the data is being fetched.
    if (loading) {
        return (
            <CareLayout>
                <div>Loading treatment plans...</div>
            </CareLayout>
        );
    }

    // Handle error state: display a simple error message if there is an issue fetching the data.
    if (error) {
        return (
            <CareLayout>
                <div>Error fetching treatment plans.</div>
            </CareLayout>
        );
    }

    return (
        <CareLayout>
            <div>
                {appointments.map((appointment) => (
                    <Card key={appointment.id} elevation="sm" margin="sm">
                        <div>
                            <h3>{appointment.reason ?? 'Appointment'}</h3>
                            <p>{appointment.notes ?? ''}</p>
                            <p>Date: {formatDate(appointment.dateTime)}</p>
                            <p>Type: {appointment.type}</p>
                            <p>Status: {appointment.status}</p>
                            <Button onPress={() => void router.push(`/care/treatment-plans/${appointment.id}`)}>
                                View Details
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </CareLayout>
    );
};

export default TreatmentPlans;
