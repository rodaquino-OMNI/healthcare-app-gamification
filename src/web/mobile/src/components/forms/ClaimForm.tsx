import { Button } from '@design-system/components/Button/Button';
import DatePicker from '@design-system/components/DatePicker/DatePicker';
import { Select } from '@design-system/components/Select/Select';
import { yupResolver } from '@hookform/resolvers'; // latest
import { useNavigation } from '@react-navigation/native'; // latest
import { claimValidationSchema } from '@shared/utils/validation';
import React from 'react'; // Version 18.0.0
import { useForm, Controller } from 'react-hook-form'; // 7.0+

import { submitClaim } from '@api/plan';
import { useJourney } from '@hooks/useJourney';

/**
 * A React component that renders a form for submitting insurance claims.
 *
 * @returns The rendered claim submission form.
 */
export const ClaimForm: React.FC = () => {
    // Uses the `useJourney` hook to get the current journey.
    const { _journey } = useJourney();

    // Uses the `useForm` hook to manage the form state and validation,
    // integrating with `claimValidationSchema` for validation rules.
    const {
        register,
        control,
        handleSubmit,
        formState: { _errors, isSubmitting, _isValid },
    } = useForm({
        resolver: yupResolver(claimValidationSchema),
        defaultValues: {
            procedureType: '',
            date: null,
            provider: '',
            amount: '',
        },
    });

    // Access the navigation object
    const navigation = useNavigation();

    // Define options for the procedure type select
    const procedureTypeOptions = [
        { label: 'Medical Consultation', value: 'medical' },
        { label: 'Dental Procedure', value: 'dental' },
        { label: 'Vision Care', value: 'vision' },
        { label: 'Prescription', value: 'prescription' },
        { label: 'Other', value: 'other' },
    ];

    // Defines the `handleSubmit` function to handle form submission,
    // calling the `submitClaim` API function and displaying success or error messages.
    const onSubmit = async (data: any): Promise<void> => {
        try {
            // Call the submitClaim API function
            const result = await submitClaim('your-plan-id', data);

            // Display success message
            alert('Claim submitted successfully!');

            // Navigate to confirmation screen
            (navigation as any).navigate('ClaimConfirmation', { claimId: result.id });
        } catch (error) {
            // Display error message
            alert('Claim submission failed. Please try again.');
        }
    };

    // Renders the form with input fields for procedure type, date, provider, and amount,
    // using the `Input`, `DatePicker`, and `Select` components from the design system.
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label>
                Procedure Type:
                <Controller
                    name="procedureType"
                    control={control}
                    render={({ field }) => (
                        <Select
                            label="Procedure Type"
                            options={procedureTypeOptions}
                            value={field.value ?? ''}
                            onChange={(val) => field.onChange(val)}
                        />
                    )}
                />
            </label>
            <label>
                Date of Service:
                <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            value={
                                field.value !== null && typeof (field.value as unknown) === 'object'
                                    ? (field.value as Date)
                                    : null
                            }
                            onChange={(date) => field.onChange(date)}
                        />
                    )}
                />
            </label>
            <label>
                Provider:
                <Input value="" {...register('provider')} />
            </label>
            <label>
                Amount:
                <Input value="" {...register('amount')} />
            </label>
            {/* Renders a submit button that triggers the `handleSubmit` function. */}
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Claim'}
            </Button>
        </form>
    );
};
