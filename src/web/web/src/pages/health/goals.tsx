import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import React, { useState } from 'react'; // react 18.0+
import { HealthGoal } from 'shared/types/health.types';

import { HealthGoalForm } from '@/components/forms/HealthGoalForm';
import { JourneyHeader } from '@/components/shared/JourneyHeader';
import { useAuth, useHealthMetrics } from '@/hooks';

/**
 * Renders the Health Goals page, displaying a list of current goals and providing
 * functionality to add new goals or modify existing ones.
 * @returns {JSX.Element} The rendered Health Goals page.
 */
const HealthGoalsPage: React.FC = () => {
    // LD1: Retrieves the user ID from the authentication context using the useAuth hook.
    const { session } = useAuth();
    const userId = session?.user?.id || '';

    // LD1: Fetches health goals using the useHealthMetrics hook.
    const { metrics: goals, loading: _loading, error: _error, refetch: _refetch } = useHealthMetrics(userId, ['goal']);

    // LD1: Manages the state for displaying the HealthGoalForm using the useState hook.
    const [addGoal, setAddGoal] = useState(false);

    // LD1: Renders a JourneyHeader component with the title 'Minhas Metas'.
    return (
        <div>
            <JourneyHeader title="Minhas Metas" />

            {/* LD1: Renders a list of HealthGoal components, displaying each goal's details. */}
            {goals?.map((goal: HealthGoal) => (
                <Card key={goal.id}>
                    {goal.type} - {goal.target}
                </Card>
            ))}

            {/* LD1: Renders a Button component to allow the user to add a new health goal. */}
            <Button onPress={() => setAddGoal(true)}>Add Goal</Button>

            {/* LD1: Renders a HealthGoalForm when 'addGoal' is true,
                allowing the user to create a new goal. */}
            {addGoal && <HealthGoalForm />}
        </div>
    );
};

export default HealthGoalsPage;
