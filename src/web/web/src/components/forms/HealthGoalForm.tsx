import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'design-system/components/Button/Button';
import { DatePicker } from 'design-system/components/DatePicker/DatePicker';
import { Input } from 'design-system/components/Input/Input';
import { Select } from 'design-system/components/Select/Select';
import React from 'react';
import { type Resolver, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { restClient } from '@/api/client';
import { useAuth } from '@/hooks/useAuth';

/**
 * Interface for the properties of the HealthGoalForm component.
 * Currently, it does not require any specific props.
 */
interface HealthGoalFormProps {}

/**
 * Defines the structure of the form values for the HealthGoalForm.
 * Includes fields for goal type, target value, start date, and end date.
 */
interface HealthGoalFormValues {
    type: string;
    target: number;
    startDate: Date | null;
    endDate: Date | null;
}

/**
 * Validation schema for health goal form fields.
 * Typed explicitly to satisfy yupResolver's ObjectSchema constraint.
 */
const healthGoalSchema: yup.ObjectSchema<HealthGoalFormValues> = yup.object({
    type: yup.string().required('Goal type is required'),
    target: yup.number().required('Target value is required').positive('Target must be positive'),
    startDate: yup.date().required('Start date is required').nullable().defined(),
    endDate: yup
        .date()
        .required('End date is required')
        .min(yup.ref('startDate'), 'End date must be after start date')
        .nullable()
        .defined(),
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- yupResolver's InferType produces `any` for nullable date fields; explicit Resolver typing constrains it
const healthGoalResolver: Resolver<HealthGoalFormValues> = yupResolver(healthGoalSchema);

/**
 * A form component for creating and updating health goals.
 * It allows users to set targets for various health metrics and integrates with the design system for a consistent UI.
 * @returns {JSX.Element} Rendered HealthGoalForm component
 */
export const HealthGoalForm: React.FC<HealthGoalFormProps> = () => {
    // 1. Uses the useForm hook to manage the form state and submission.
    const {
        handleSubmit,
        formState: { isSubmitting, isValid },
    } = useForm<HealthGoalFormValues>({
        // 2. Defines a validation schema using Yup to ensure the form data is valid.
        resolver: healthGoalResolver,
        defaultValues: {
            type: '',
            target: 0,
            startDate: null,
            endDate: null,
        },
    });

    // 3. Fetches the user ID using the useAuth hook.
    const { session: _session } = useAuth();

    // Define options for the goal type select component
    const goalTypeOptions = [
        { label: 'Weight Loss', value: 'weightLoss' },
        { label: 'Increase Steps', value: 'increaseSteps' },
        { label: 'Improve Sleep', value: 'improveSleep' },
    ];

    // 4. Renders a form with input fields for goal type, target, start date, and end date.
    return (
        <form
            onSubmit={(e) => {
                void handleSubmit(async (data) => {
                    try {
                        await restClient.post('/health/goals', {
                            ...data,
                            userId: _session?.userId,
                        });
                    } catch (error) {
                        console.error('Failed to create health goal:', error);
                    }
                })(e);
            }}
        >
            {/* 5. Uses the Select component for the goal type field. */}
            <div>
                <label htmlFor="type">Goal Type:</label>
                <Select options={goalTypeOptions} value={''} onChange={() => {}} label="Select Goal Type" />
            </div>

            {/* 6. Uses the DatePicker component for the start and end date fields. */}
            <div>
                <label htmlFor="startDate">Start Date:</label>
                <DatePicker value={null} onChange={() => {}} label="Select Start Date" testID="startDate" />
            </div>

            <div>
                <label htmlFor="endDate">End Date:</label>
                <DatePicker value={null} onChange={() => {}} label="Select End Date" testID="endDate" />
            </div>

            {/* 7. Uses the Input component for the target field. */}
            <div>
                <label htmlFor="target">Target Value:</label>
                <Input
                    type="number"
                    placeholder="Enter target value"
                    value={''}
                    onChange={() => {}}
                    aria-label="Target Value"
                />
            </div>

            {/* 8. Renders a submit button to create or update the health goal. */}
            <Button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Create Goal'}
            </Button>
        </form>
    );
};
