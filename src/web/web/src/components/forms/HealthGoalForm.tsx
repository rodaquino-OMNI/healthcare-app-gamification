import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'design-system/components/Button/Button';
import { DatePicker } from 'design-system/components/DatePicker/DatePicker';
import { Input } from 'design-system/components/Input/Input';
import { Select } from 'design-system/components/Select/Select';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
 * Validation schema for health goal form fields using Zod.
 */
const healthGoalSchema = z
    .object({
        type: z.string().min(1, 'Goal type is required'),
        target: z.number({ required_error: 'Target value is required' }).positive('Target must be positive'),
        startDate: z.coerce.date({ required_error: 'Start date is required' }).nullable(),
        endDate: z.coerce.date({ required_error: 'End date is required' }).nullable(),
    })
    .refine(
        (data) => {
            if (data.startDate && data.endDate) {
                return data.endDate >= data.startDate;
            }
            return true;
        },
        { message: 'End date must be after start date', path: ['endDate'] }
    );

const healthGoalResolver = zodResolver(healthGoalSchema);

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
        // 2. Defines a validation schema using Zod to ensure the form data is valid.
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
