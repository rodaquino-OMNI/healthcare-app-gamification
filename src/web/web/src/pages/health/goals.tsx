import React, { useState } from 'react'; // react 18.0+
import { useRouter } from 'next/router'; // next/router 13.0+
import { useQuery } from '@apollo/client'; // 3.7.17

import { HealthGoal } from 'shared/types/health.types';
import { useAuth } from '@/hooks/useAuth';
import { HealthGoalForm } from '@/components/forms/HealthGoalForm';
import { Card } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { GET_HEALTH_GOALS } from 'shared/graphql/queries/health.queries';
import { CREATE_HEALTH_METRIC } from 'shared/graphql/mutations/health.mutations';
import { WEB_HEALTH_ROUTES } from 'shared/constants/routes';
import { useHealthMetrics } from '@/hooks/useHealthMetrics';
import { JourneyHeader } from '@/components/shared/JourneyHeader';

/**
 * Renders the Health Goals page, displaying a list of current goals and providing functionality to add new goals or modify existing ones.
 * @returns {JSX.Element} The rendered Health Goals page.
 */
const HealthGoalsPage: React.FC = () => {
    // LD1: Retrieves the user ID from the authentication context using the useAuth hook.
    const { session } = useAuth();
    const userId = session?.user.id;

    // LD1: Fetches the list of health goals for the user using the GET_HEALTH_GOALS GraphQL query and the useQuery hook.
    const { loading, error, data } = useQuery(GET_HEALTH_GOALS, {
        variables: { userId },
        skip: !userId,
    });

    // LD1: Manages the state for displaying the HealthGoalForm using the useState hook.
    const [addGoal, setAddGoal] = useState(false);

    // LD1: Renders a JourneyHeader component with the title 'Minhas Metas'.
    return (
        <div>
            <JourneyHeader title="Minhas Metas" />

            {/* LD1: Renders a list of HealthGoal components, displaying each goal's details. */}
            {data?.getHealthGoals?.map((goal: HealthGoal) => (
                <Card key={goal.id}>
                    {goal.type} - {goal.target}
                </Card>
            ))}

            {/* LD1: Renders a Button component to allow the user to add a new health goal. */}
            <Button onPress={() => setAddGoal(true)}>Add Goal</Button>

            {/* LD1: Renders a HealthGoalForm component when the 'addGoal' state is true, allowing the user to create a new goal. */}
            {addGoal && <HealthGoalForm />}
        </div>
    );
};

export default HealthGoalsPage;
