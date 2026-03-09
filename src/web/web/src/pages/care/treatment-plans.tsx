import { useQuery } from '@apollo/client'; // @apollo/client v3.0+
import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { useRouter } from 'next/router'; // next/router v13.0+
import React from 'react'; // React v18.0+
import { GET_TREATMENT_PLANS } from 'shared/graphql/queries/care.queries';
import { TreatmentPlan } from 'shared/types/care.types';

import { useAuth } from '@/hooks/useAuth';
import { CareLayout } from '@/layouts/CareLayout';
import { formatDate } from '@/utils/format';

/**
 * Renders the Treatment Plans screen, fetching and displaying a list of treatment plans for the user.
 * @returns {JSX.Element} The rendered Treatment Plans screen.
 */
const TreatmentPlans: React.FC = () => {
    // Access the user ID using the useAuth hook.
    const { session } = useAuth();
    const userId = session?.user?.id;

    // Execute the GET_TREATMENT_PLANS query.
    const { loading, error, data } = useQuery<{
        getTreatmentPlans: TreatmentPlan[];
    }>(GET_TREATMENT_PLANS, {
        variables: { userId },
        skip: !userId,
    });

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

    // Map the fetched treatment plans for rendering.
    const treatmentPlans: TreatmentPlan[] = data?.getTreatmentPlans ?? [];

    return (
        <CareLayout>
            <div>
                {treatmentPlans.map((plan) => (
                    <Card key={plan.id} elevation="sm" margin="sm">
                        <div>
                            {/* Each Card displays the treatment plan name, description,
                                start date, end date, and progress. */}
                            <h3>{plan.name}</h3>
                            <p>{plan.description}</p>
                            <p>Start Date: {formatDate(plan.startDate)}</p>
                            <p>End Date: {plan.endDate ? formatDate(plan.endDate) : 'Ongoing'}</p>
                            <p>Progress: {plan.progress}%</p>
                            {/* A Button to view treatment plan details
                                (navigation is not yet implemented). */}
                            <Button onPress={() => void router.push(`/care/treatment-plans/${plan.id}`)}>
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
