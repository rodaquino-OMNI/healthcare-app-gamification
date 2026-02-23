import React from 'react'; // Version 18.0.0
import { useForm } from 'react-hook-form'; // 7.0+
import { yupResolver } from '@hookform/resolvers'; // latest
import { useNavigation } from '@react-navigation/native'; // latest

import { ClaimType } from '@shared/types/plan.types';
import { JOURNEY_NAMES } from '@shared/constants/index';
import { claimValidationSchema } from '@shared/utils/validation';
import { useClaims } from '@hooks/useClaims';
import { submitClaim } from '@api/plan';
import Input, { InputProps } from '@design-system/components/Input/Input';
import DatePicker from '@design-system/components/DatePicker/DatePicker';
import { Select, SelectProps } from '@design-system/components/Select/Select';
import { Button } from '@design-system/components/Button/Button';
import { useJourney } from '@hooks/useJourney';

/**
 * A React component that renders a form for submitting insurance claims.
 *
 * @returns The rendered claim submission form.
 */
export const ClaimForm: React.FC = () => {
  // Uses the `useJourney` hook to get the current journey.
  const { journey } = useJourney();

  // Uses the `useForm` hook to manage the form state and validation, integrating with `claimValidationSchema` for validation rules.
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
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

  // Defines the `handleSubmit` function to handle form submission, calling the `submitClaim` API function and displaying success or error messages.
  const onSubmit = async (data: any) => {
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

  // Renders the form with input fields for procedure type, date, provider, and amount, using the `Input`, `DatePicker`, and `Select` components from the design system.
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Procedure Type:
        <Select
          label="Procedure Type"
          options={procedureTypeOptions}
          value=""
          {...register('procedureType')}
        />
      </label>
      <label>
        Date of Service:
        <DatePicker {...register('date')} />
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