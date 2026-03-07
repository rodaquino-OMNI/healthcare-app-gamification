import React, { useState } from 'react'; // react 18.0+
import { useRouter } from 'next/router'; // next/router 13.0+
import { useQuery } from '@apollo/client'; // 3.7.17

import { HealthGoal } from 'src/web/shared/types/health.types';
import { useAuth } from 'src/web/web/src/hooks/useAuth.ts';
import { HealthGoalForm } from 'src/web/mobile/src/components/forms/HealthGoalForm.tsx';
import { Card } from 'src/web/design-system/src/components/Card/Card.tsx';
import { Button } from 'src/web/design-system/src/components/Button/Button.tsx';
import { GET_HEALTH_GOALS } from 'src/web/shared/graphql/queries/health.queries.ts';
import { CREATE_HEALTH_METRIC } from 'src/web/shared/graphql/mutations/health.mutations.ts';
import { WEB_HEALTH_ROUTES } from 'src/web/shared/constants/routes.ts';
import { useHealthMetrics } from 'src/web/web/src/hooks/useHealthMetrics.ts';
import { JourneyHeader } from 'src/web/web/src/components/shared/JourneyHeader.tsx';

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
