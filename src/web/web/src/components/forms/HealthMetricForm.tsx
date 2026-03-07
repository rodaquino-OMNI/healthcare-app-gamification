import React, { useState } from 'react';
import { useForm } from 'react-hook-form'; // react-hook-form 7.0+
import { yupResolver } from '@hookform/resolvers/yup'; // @hookform/resolvers 3.0+
import { gql, useMutation } from '@apollo/client'; // @apollo/client 3.7.17
import {
    HealthMetricType,
    //HealthMetric, //Unused import
} from 'src/web/shared/types/health.types';
import Input from 'src/web/design-system/src/components/Input/Input';
import { Select } from 'src/web/design-system/src/components/Select/Select';
import { useAuth } from 'src/web/web/src/hooks/useAuth.ts';
import { formatHealthMetric } from 'src/web/shared/utils/format.ts';
import { JOURNEY_NAMES } from 'src/web/shared/constants/index.ts';
import { claimValidationSchema } from 'src/web/shared/utils/validation.ts';
import { CREATE_HEALTH_METRIC } from 'src/web/shared/graphql/mutations/health.mutations.ts';
import { GET_HEALTH_METRICS } from 'src/web/shared/graphql/queries/health.queries.ts';

/**
 * A form component for creating and updating health metrics.
 */
export const HealthMetricForm: React.FC = () => {
    // Initialize the form state using React Hook Form and Yup for validation.
    const {
        control,
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
    const onSubmit = async (data: any) => {
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
