import React from 'react';
import { useForm } from 'react-hook-form'; // 7.0+
import { yupResolver } from '@hookform/resolvers/yup'; // latest
import { z } from 'zod'; // latest
import { ClaimType } from 'src/web/shared/types/plan.types';
import { claimValidationSchema } from 'src/web/shared/utils/validation';
import { useClaims } from 'src/web/web/src/hooks/useClaims';
import { useJourneyContext } from 'src/web/web/src/context/JourneyContext.tsx';
import { Button } from 'src/web/design-system/src/components/index';
import Input from 'src/web/design-system/src/components/index';
import { Select } from 'src/web/design-system/src/components/index';
import { useRouter } from 'next/router'; // 13.0+
import { MOBILE_PLAN_ROUTES } from 'src/web/shared/constants/routes';
import { useMutation } from '@apollo/client'; // 3.7.17
import { SUBMIT_CLAIM } from 'src/web/shared/graphql/mutations/plan.mutations';

/**
 * A React component that renders a form for submitting insurance claims.
 * @returns {JSX.Element} The rendered form.
 */
export const ClaimForm: React.FC = () => {
    // Retrieves the journey context using `useJourneyContext`.
    const { currentJourney } = useJourneyContext();

    // Initializes the form using `useForm` with default values and the `claimValidationSchema` for validation.
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
    } = useForm({
        defaultValues: {
            procedureType: '',
            date: '',
            provider: '',
            amount: '',
        },
        resolver: yupResolver(claimValidationSchema),
    });

    // Defines the `handleSubmit` function to handle form submission:
    const { submitClaim, submitting, submitError } = useClaims();
    const router = useRouter();

    const procedureTypeOptions = [
        { label: 'Medical', value: 'medical' },
        { label: 'Dental', value: 'dental' },
        { label: 'Vision', value: 'vision' },
        { label: 'Prescription', value: 'prescription' },
        { label: 'Other', value: 'other' },
    ];

    const onSubmit = async (data: any) => {
        try {
            // Calls the `submitClaim` function from the `useClaims` hook to submit the claim data to the backend.
            const result = await submitClaim({
                planId: 'your_plan_id', // Replace with actual plan ID
                type: data.procedureType,
                procedureCode: 'procedure_code', // Replace with actual procedure code
                providerName: data.provider,
                serviceDate: data.date,
                amount: parseFloat(data.amount),
                documents: [], // Implement file upload later
            });

            // Displays a success or error toast message based on the result.
            if (result) {
                // Navigates to the claim confirmation screen on success.
                router.push(MOBILE_PLAN_ROUTES.CLAIMS);
                alert('Claim submitted successfully!');
            } else {
                alert('Claim submission failed.');
            }
        } catch (error) {
            console.error('Claim submission error:', error);
            alert('An error occurred while submitting the claim.');
        }
    };

    // Renders the form with input fields for procedure type, date, provider, and amount.
    // Uses design system components for input fields and button.
    // Applies form validation and submission handling using React Hook Form.
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="procedureType">Procedure Type</label>
                <Select id="procedureType" options={procedureTypeOptions} {...register('procedureType')} />
                {errors.procedureType && <span>{errors.procedureType.message}</span>}
            </div>

            <div>
                <label htmlFor="date">Date</label>
                <Input type="date" id="date" {...register('date')} />
                {errors.date && <span>{errors.date.message}</span>}
            </div>

            <div>
                <label htmlFor="provider">Provider</label>
                <Input type="text" id="provider" {...register('provider')} />
                {errors.provider && <span>{errors.provider.message}</span>}
            </div>

            <div>
                <label htmlFor="amount">Amount</label>
                <Input type="number" id="amount" {...register('amount')} />
                {errors.amount && <span>{errors.amount.message}</span>}
            </div>

            {/* Renders a submit button that is disabled during submission or when the form is invalid. */}
            <Button type="submit" disabled={!isValid || isSubmitting}>
                Submit
            </Button>
        </form>
    );
};
