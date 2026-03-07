import React from 'react'; // React v18.0+
import { useQuery } from '@apollo/client'; // @apollo/client v3.0+
import { useRouter } from 'next/router'; // next/router v13.0+
import { useAuth } from '@auth/react'; // @auth/react v1.0+
import CareLayout from 'src/web/web/src/layouts/CareLayout.tsx';
import { Card } from 'src/web/design-system/src/components/Card/Card.tsx';
import { Button } from 'src/web/design-system/src/components/Button/Button.tsx';
import { GET_TREATMENT_PLANS } from 'src/web/shared/graphql/queries/care.queries.ts';
import { TreatmentPlan } from 'src/web/shared/types/care.types.ts';
import { formatDate } from 'src/web/mobile/src/utils/format.ts';

/**
 * Renders the Treatment Plans screen, fetching and displaying a list of treatment plans for the user.
 * @returns {JSX.Element} The rendered Treatment Plans screen.
 */
const TreatmentPlans: React.FC = () => {
    // Access the user ID using the useAuth hook.
    const { session } = useAuth();
    const userId = session?.user.id;

    // Execute the GET_TREATMENT_PLANS GraphQL query using the useQuery hook, passing the user ID as a variable.
    const { loading, error, data } = useQuery(GET_TREATMENT_PLANS, {
        variables: { userId },
        skip: !userId, // Skip the query if the user ID is not available.
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

    // If the data is successfully fetched, map over the treatmentPlans array and render a Card component for each treatment plan.
    const treatmentPlans: TreatmentPlan[] = data?.getTreatmentPlans || [];

    return (
        <CareLayout>
            <div>
                {treatmentPlans.map((plan) => (
                    <Card key={plan.id} elevation="sm" margin="sm">
                        <div>
                            {/* Each Card component displays the treatment plan name, description, start date, end date, and progress. */}
                            <h3>{plan.name}</h3>
                            <p>{plan.description}</p>
                            <p>Start Date: {formatDate(plan.startDate)}</p>
                            <p>End Date: {formatDate(plan.endDate)}</p>
                            <p>Progress: {plan.progress}%</p>
                            {/* A Button component is included to allow the user to view the treatment plan details (navigation is not yet implemented). */}
                            <Button onPress={() => router.push(`/care/treatment-plans/${plan.id}`)}>
                                View Details
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </CareLayout>
    );
};

// Exports the TreatmentPlans component for use in the application.
export { TreatmentPlans };
