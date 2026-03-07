import React from 'react';
import { useForm } from 'react-hook-form'; // react-hook-form 7.0+
import { yupResolver } from '@hookform/resolvers/yup'; // @hookform/resolvers 3.0+
import { useMutation } from '@apollo/client'; // @apollo/client 3.7.17
import { HealthMetricType } from 'shared/types/health.types';
import Input from 'design-system/components/Input/Input';
import { Select } from 'design-system/components/Select/Select';
import { useAuth } from '@/hooks/useAuth';
import { claimValidationSchema } from 'shared/utils/validation';
import { CREATE_HEALTH_METRIC } from 'shared/graphql/mutations/health.mutations';
import { GET_HEALTH_METRICS } from 'shared/graphql/queries/health.queries';

/**
 * A form component for creating and updating health metrics.
 */
export const HealthMetricForm: React.FC = () => {
    // Initialize the form state using React Hook Form and Yup for validation.
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(claimValidationSchema),
    });

    // Retrieve the current user's ID using the useAuth hook.
    const { session } = useAuth();
    const userId = session?.user?.id;

    // Define the onSubmit function to handle form submission.
    const onSubmit = async (data: Record<string, unknown>) => {
        if (!userId) {
            console.error('User ID is not available.');
            return;
        }

        // Execute the CREATE_HEALTH_METRIC mutation to create a new health metric.
        createHealthMetric({
            variables: {
                recordId: userId, // Assuming recordId is the same as userId
                createMetricDto: {
                    type: data.procedureType,
                    value: parseFloat(data.amount),
                    timestamp: new Date().toISOString(),
                    unit: 'units', // Replace with actual unit
                    source: 'manual',
                },
            },
            refetchQueries: [{ query: GET_HEALTH_METRICS, variables: { userId } }],
        });
    };

    // Define the CREATE_HEALTH_METRIC mutation using the useMutation hook.
    const [createHealthMetric] = useMutation(gql(CREATE_HEALTH_METRIC));

    // Define options for the Select component
    const healthMetricOptions = Object.values(HealthMetricType).map((type) => ({
        label: type,
        value: type,
    }));

    // Render the form with input fields for metric type, value, and timestamp.
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <Select
                    label="Metric Type"
                    options={healthMetricOptions}
                    {...register('procedureType')}
                    aria-label="Select metric type"
                />
                {errors.procedureType && <span>{errors.procedureType.message}</span>}
            </div>

            <div>
                <Input
                    type="number"
                    placeholder="Metric Value"
                    {...register('amount')}
                    aria-label="Enter metric value"
                />
                {errors.amount && <span>{errors.amount.message}</span>}
            </div>

            <button type="submit">Submit</button>
        </form>
    );
};
