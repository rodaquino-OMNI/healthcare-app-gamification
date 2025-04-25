import React from 'react'; // Version 18.0.0
import { useForm } from 'react-hook-form'; // 7.0+
import { yupResolver } from '@hookform/resolvers'; // latest
import { useNavigation } from '@react-navigation/native'; // latest

import { ClaimType } from 'src/web/shared/types/plan.types';
import { JOURNEY_NAMES } from 'src/web/shared/constants/index';
import { claimValidationSchema } from 'src/web/shared/utils/validation';
import { useClaims } from 'src/web/mobile/src/hooks/useClaims';
import { submitClaim } from 'src/web/mobile/src/api/plan';
import Input, { InputProps } from 'src/web/design-system/src/components/Input/Input.tsx';
import DatePicker from 'src/web/design-system/src/components/DatePicker/DatePicker.tsx';
import { Select, SelectProps } from 'src/web/design-system/src/components/Select/Select.tsx';
import Button, { ButtonProps } from 'src/web/design-system/src/components/Button/Button.tsx';
import { useJourneyContext } from 'src/web/mobile/src/context/JourneyContext.tsx';

/**
 * A React component that renders a form for submitting insurance claims.
 *
 * @returns The rendered claim submission form.
 */
export const ClaimForm: React.FC = () => {
  // Uses the `useJourneyContext` hook to get the current journey.
  const { journey } = useJourneyContext();

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
      navigation.navigate('ClaimConfirmation', { claimId: result.id });
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
          options={procedureTypeOptions}
          {...register('procedureType')}
        />
      </label>
      <label>
        Date of Service:
        <DatePicker {...register('date')} />
      </label>
      <label>
        Provider:
        <Input {...register('provider')} />
      </label>
      <label>
        Amount:
        <Input {...register('amount')} />
      </label>
      {/* Renders a submit button that triggers the `handleSubmit` function. */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Claim'}
      </Button>
    </form>
  );
};