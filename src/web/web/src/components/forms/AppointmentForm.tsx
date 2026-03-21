import { yupResolver } from '@hookform/resolvers/yup';
import { Input, Select, Button } from 'design-system/components';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useJourney } from '@/context/JourneyContext';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

/**
 * Interface defining the props for the AppointmentForm component.
 */
interface AppointmentFormProps {
    // No specific props for this component
}

/**
 * Defines the structure of the appointment form values.
 */
interface AppointmentFormValues {
    provider: string;
    date: Date | null;
    time: string;
    reason?: string;
}

/**
 * Defines the validation schema for the appointment form using Yup.
 */
const appointmentValidationSchema = yup.object().shape({
    provider: yup.string().required('Provider is required'),
    date: yup.date().required('Date is required').nullable(),
    time: yup.string().required('Time is required'),
    reason: yup.string().optional(),
});

/**
 * A form component for booking appointments.
 * @returns The rendered AppointmentForm component.
 */
export const AppointmentForm: React.FC<AppointmentFormProps> = () => {
    // Uses the `useForm` hook to manage form state and validation.
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AppointmentFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- yupResolver returns an untyped Resolver from @hookform/resolvers; the generic inference is lost at the library boundary
        resolver: yupResolver(appointmentValidationSchema),
        defaultValues: {
            provider: '',
            date: null,
            time: '',
            reason: '',
        },
    });

    // Retrieves the current journey from the `JourneyContext`.
    const { currentJourney } = useJourney();

    // Access the Next.js router
    const router = useRouter();

    // Mock appointment submission handler
    const onSubmit = async (data: AppointmentFormValues): Promise<void> => {
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Redirect to a confirmation page or display a success message
        alert(`Appointment booked with ${data.provider} on ${data.date?.toLocaleDateString()} at ${data.time}`);
        void router.push('/care/appointments');
    };

    // Define options for the time select
    const timeOptions = [
        { label: '9:00 AM', value: '09:00' },
        { label: '10:00 AM', value: '10:00' },
        { label: '11:00 AM', value: '11:00' },
        { label: '2:00 PM', value: '14:00' },
        { label: '3:00 PM', value: '15:00' },
        { label: '4:00 PM', value: '16:00' },
    ];

    // Renders a form with fields for provider, date, time, and reason.
    return (
        <form
            onSubmit={(e) => {
                void handleSubmit(onSubmit)(e);
            }}
        >
            {/* Uses design system components for input fields and buttons. */}
            <Input
                label="Provider"
                placeholder="Enter provider name"
                {...register('provider')}
                error={errors.provider?.message}
            />

            <Input
                label="Date"
                type="date"
                placeholder="Select date"
                {...register('date')}
                error={errors.date?.message}
            />

            <Select label="Time" options={timeOptions} placeholder="Select time" value="" onChange={() => {}} />

            <Input
                label="Reason"
                placeholder="Enter reason for appointment"
                {...register('reason')}
                error={errors.reason?.message}
            />

            {/* Handles form submission and API interaction. */}
            <Button
                type="submit"
                journey={
                    currentJourney === 'health' || currentJourney === 'care' || currentJourney === 'plan'
                        ? currentJourney
                        : undefined
                }
            >
                Book Appointment
            </Button>
        </form>
    );
};
