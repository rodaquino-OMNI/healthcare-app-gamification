import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from 'design-system/components/Input/Input';
import { Select } from 'design-system/components/Select/Select';
import React from 'react';
import { useForm } from 'react-hook-form';
import { CREATE_HEALTH_METRIC } from 'shared/graphql/mutations/health.mutations';
import { GET_HEALTH_METRICS } from 'shared/graphql/queries/health.queries';
import { HealthMetricType } from 'shared/types/health.types';
import { claimValidationSchema } from 'shared/utils/validation';

import { useAuth } from '@/hooks/useAuth';

/**
 * A form component for creating and updating health metrics.
 */
export const HealthMetricForm: React.FC = () => {
    // Initialize the form state using React Hook Form and Zod for validation.
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(claimValidationSchema),
    });

    // Retrieve the current user's ID using the useAuth hook.
    const { session } = useAuth();
    const userId = session?.user?.id;

    // Define the CREATE_HEALTH_METRIC mutation using the useMutation hook.
    const [createHealthMetric] = useMutation(CREATE_HEALTH_METRIC);

    // Define the onSubmit function to handle form submission.
    const onSubmit = (data: Record<string, unknown>): void => {
        if (!userId) {
            return;
        }

        // Execute the CREATE_HEALTH_METRIC mutation to create a new health metric.
        void createHealthMetric({
            variables: {
                recordId: userId,
                createMetricDto: {
                    type: String(data.procedureType),
                    value: parseFloat(String(data.amount)),
                    timestamp: new Date().toISOString(),
                    unit: 'units',
                    source: 'manual',
                },
            },
            refetchQueries: [{ query: GET_HEALTH_METRICS, variables: { userId } }],
        });
    };

    // Define options for the Select component
    const healthMetricOptions = Object.values(HealthMetricType).map((type) => ({
        label: type,
        value: type,
    }));

    // Render the form with input fields for metric type, value, and timestamp.
    return (
        <form
            onSubmit={(e) => {
                void handleSubmit(onSubmit)(e);
            }}
        >
            <div>
                <Select
                    label="Metric Type"
                    options={healthMetricOptions}
                    value=""
                    onChange={() => {}}
                    aria-label="Select metric type"
                />
                {errors.procedureType && <span>{String(errors.procedureType.message ?? '')}</span>}
            </div>

            <div>
                <Input
                    type="number"
                    placeholder="Metric Value"
                    {...register('amount')}
                    aria-label="Enter metric value"
                />
                {errors.amount && <span>{String(errors.amount.message ?? '')}</span>}
            </div>

            <button type="submit">Submit</button>
        </form>
    );
};
