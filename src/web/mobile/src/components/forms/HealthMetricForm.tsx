import { Button } from '@design-system/components/Button/Button';
import { Input } from '@design-system/components/Input';
import { Select } from '@design-system/components/Select/Select';
import { zodResolver } from '@hookform/resolvers/zod';
import { HealthMetricType } from '@shared/types/health.types';
import { useForm, type Resolver } from 'react-hook-form'; // ^7.0.0
import { z } from 'zod';

import { createHealthMetric, CreateMetricInput } from '@api/health';
import { useJourney } from '@context/JourneyContext';
import { useHealthMetrics } from '@hooks/useHealthMetrics';

/** Shape of the health metric form fields. */
type HealthMetricFormData = {
    value: number;
    unit: string;
    timestamp: string;
    type: string;
};

// Static validation schema — defined once outside component to avoid recreation per render
const healthMetricSchema = z.object({
    value: z.number({ required_error: 'Value is required' }).positive('Value must be positive'),
    unit: z.string().min(1, 'Unit is required'),
    timestamp: z.string().min(1, 'Timestamp is required'),
    type: z.enum(Object.values(HealthMetricType) as [string, ...string[]], { required_error: 'Type is required' }),
});

// Static options array — defined once outside component
const METRIC_TYPE_OPTIONS = Object.values(HealthMetricType).map((type) => ({
    label: type,
    value: type,
}));

/**
 * Component for adding a new health metric.
 * @returns {JSX.Element} The rendered form.
 */
export const HealthMetricForm: React.FC = () => {
    // Access the current journey context
    const { journey: _journey } = useJourney();

    // Initialize the form using React Hook Form with the Zod resolver
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<HealthMetricFormData>({
        resolver: zodResolver(healthMetricSchema) as Resolver<HealthMetricFormData>,
    });

    // Access the useHealthMetrics hook to refetch data after submission
    const { refetch } = useHealthMetrics('', null, null, []);

    // Use static options defined outside component
    const metricTypeOptions = METRIC_TYPE_OPTIONS;

    // Handle form submission to create a new health metric
    const onSubmit = async (data: HealthMetricFormData): Promise<void> => {
        try {
            const metricInput: CreateMetricInput = {
                type: data.type,
                value: data.value,
                unit: data.unit,
                timestamp: data.timestamp || undefined,
            };
            // Create a new health metric using the createHealthMetric API function
            await createHealthMetric('your_record_id', metricInput); // Replace 'your_record_id' with the actual record ID

            // Refetch health metrics to update the UI
            await refetch();

            // Reset the form
            reset();
        } catch (error) {
            console.error('Error creating health metric:', error);
            // Handle error appropriately (e.g., display an error message)
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Input field for metric value */}
            <Input label="Value" placeholder="Enter value" type="number" value="" {...register('value')} />
            {errors.value && <span>{errors.value.message as string}</span>}

            {/* Input field for metric unit */}
            <Input label="Unit" placeholder="Enter unit" type="text" value="" {...register('unit')} />
            {errors.unit && <span>{errors.unit.message as string}</span>}

            {/* Input field for metric timestamp */}
            <Input label="Timestamp" placeholder="Enter timestamp" type="datetime-local" {...register('timestamp')} />
            {errors.timestamp && <span>{errors.timestamp.message as string}</span>}

            {/* Select component for choosing the metric type */}
            <Select
                label="Metric Type"
                options={metricTypeOptions}
                value="" // Set initial value to empty string
                onChange={(value) => {
                    // Manually trigger the change event for the 'type' field
                    const event = {
                        target: {
                            name: 'type',
                            value: value,
                        },
                    };
                    register('type').onChange(event);
                }}
            />
            {errors.type && <span>{errors.type.message as string}</span>}

            {/* Button component to submit the form */}
            <Button type="submit">Add Metric</Button>
        </form>
    );
};
