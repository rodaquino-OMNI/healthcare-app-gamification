import React, { useState, useCallback } from 'react'; // React v18.2.0
import { View, StyleSheet } from 'react-native'; // React Native version 0.71+
import { useForm } from 'react-hook-form'; // React Hook Form version 7.49.3
import { yupResolver } from '@hookform/resolvers/yup'; // @hookform/resolvers version 3.3.4
import * as yup from 'yup'; // Yup version 1.3.2
import { useNavigation } from '@react-navigation/native'; // @react-navigation/native version 6.1.9

import { HealthMetricType } from '@shared/types/health.types';
import { createHealthMetric } from '@api/health';
import { useHealthMetrics } from '@hooks/useHealthMetrics';
import { useAuth } from '@hooks/useAuth';
import { Input } from '@design-system/components/Input';
import { Button } from '@design-system/components/Button/Button';
import { useJourney } from '@context/JourneyContext';
import { userValidationSchema } from '@shared/utils/validation';
import { useTranslation } from 'react-i18next';
import { JourneyHeader } from '@components/shared/JourneyHeader';
import ErrorState from '@components/shared/ErrorState';
import LoadingIndicator from '@components/shared/LoadingIndicator';

/**
 * Props for the AddMetricScreen component
 */
interface AddMetricScreenProps {
  // No specific props are defined for this screen
}

/**
 * Renders a form for adding a new health metric.
 * @returns The rendered AddMetricScreen component.
 */
export const AddMetricScreen: React.FC<AddMetricScreenProps> = () => {
  const { t } = useTranslation();
  // LD1: Uses the useJourney hook to get the current journey.
  const { journey } = useJourney();
  // LD1: Uses the useNavigation hook to get the navigation object.
  const navigation = useNavigation();
  // LD1: Uses the useAuth hook to get the authenticated user information.
  const { session, getUserFromToken } = useAuth();

  // LD1: Defines a form schema using Yup for validation.
  const schema = yup.object({
    type: yup.string().required(t('common.validation.required')),
    value: yup.number().required(t('common.validation.required')),
    timestamp: yup.string().required(t('common.validation.required')),
  });

  // LD1: Uses the useForm hook to manage the form state and validation.
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema as any),
    defaultValues: {
      type: '',
      value: '',
      timestamp: new Date().toISOString(),
    },
  });

  // LD1: Defines a submit handler that calls the createHealthMetric API function.
  const onSubmit = async (data: any) => {
    try {
      // Get the user ID from the JWT token in the authentication session
      if (!session?.accessToken) {
        throw new Error(t('common.errors.default'));
      }

      const user = getUserFromToken(session.accessToken);
      if (!user?.id) {
        throw new Error(t('common.errors.default'));
      }

      // Call the createHealthMetric API function with the user's ID
      // LD1: API integration with createHealthMetric
      // IE1: The createHealthMetric function requires recordId (userId) and createMetricDto as input.
      //      The recordId is now dynamically fetched from the user's JWT token.
      //      The createMetricDto is constructed from the form data.
      await createHealthMetric(user.id, data);

      // Reset the form
      reset();

      // Navigate back to the health dashboard
      navigation.goBack();
    } catch (error) {
      // Handle errors
      console.error('Error creating health metric:', error);
    }
  };

  // LD1: Renders a form with input fields for metric type, value, and timestamp.
  // LD1: Renders a submit button that triggers the form submission.
  return (
    <View>
      {/* LD1: Reusable header component with journey-specific styling. */}
      <JourneyHeader title={t('journeys.health.metrics.add')} showBackButton />
      {/* LD1: Reusable input component from the design system. */}
      <Input
        placeholder={t('journeys.health.metrics.type')}
        value=""
        onChange={() => {}}
        aria-label="Metric Type"
      />
      {/* LD1: Reusable input component from the design system. */}
      <Input
        placeholder={t('journeys.health.metrics.value')}
        value=""
        onChange={() => {}}
        aria-label="Metric Value"
      />
      {/* LD1: Reusable input component from the design system. */}
      <Input
        placeholder={t('common.labels.time')}
        value=""
        onChange={() => {}}
        aria-label="Timestamp"
      />
      {/* LD1: Reusable button component from the design system. */}
      <Button onPress={handleSubmit(onSubmit)}>{t('journeys.health.metrics.add')}</Button>
    </View>
  );
};