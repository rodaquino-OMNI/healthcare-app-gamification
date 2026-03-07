import React, { useCallback } from 'react'; // react ^18.0.0
import { useRouter } from 'next/router'; // next/router latest
import { useForm } from 'react-hook-form'; // react-hook-form 7.0+
import { yupResolver } from '@hookform/resolvers/yup'; // @hookform/resolvers/yup latest
import * as yup from 'yup'; // yup latest

import { Appointment } from 'shared/types/care.types';
import { API_BASE_URL } from 'shared/constants/index';
import { useAppointments } from '@/hooks/useAppointments';
import { useJourney } from '@/context/JourneyContext';
import { Input, Select, Button, DatePicker } from 'design-system/components';

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
    reason: string;
}

/**
 * Defines the validation schema for the appointment form using Yup.
 */
const appointmentValidationSchema: yup.ObjectSchema<AppointmentFormValues> = yup.object().shape({
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
    const onSubmit = async (data: AppointmentFormValues) => {
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Redirect to a confirmation page or display a success message
        alert(`Appointment booked with ${data.provider} on ${data.date?.toLocaleDateString()} at ${data.time}`);
        router.push('/care/appointments');
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
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Uses design system components for input fields and buttons. */}
            <Input
                label="Provider"
                placeholder="Enter provider name"
                {...register('provider')}
                error={errors.provider?.message}
            />

            <DatePicker
                label="Date"
                placeholder="Select date"
                dateFormat="MM/dd/yyyy"
                {...register('date')}
                error={errors.date?.message}
            />

            <Select label="Time" options={timeOptions} placeholder="Select time" {...register('time')} />

            <Input
                label="Reason"
                placeholder="Enter reason for appointment"
                {...register('reason')}
                error={errors.reason?.message}
            />

            {/* Handles form submission and API interaction. */}
            <Button type="submit" journey={currentJourney}>
                Book Appointment
            </Button>
        </form>
    );
};
