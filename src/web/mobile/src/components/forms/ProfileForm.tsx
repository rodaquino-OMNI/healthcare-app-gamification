import React, { useState } from 'react';
import { useForm } from 'react-hook-form'; // v7.0.0
import { zodResolver } from '@hookform/resolvers/zod'; // v3.0.0
import { z } from 'zod'; // latest
import { Input, Button, FormContainer, FormField } from '@austa/design-system'; // latest
import { AuthSession } from '@austa/shared/types'; // latest
import { useAuth } from '@hooks/useAuth';

// Define the shape of our form data
type ProfileFormData = {
  name: string;
  email: string;
};

/**
 * A form component for editing user profile information.
 * Allows users to update their name and email.
 */
export const ProfileForm: React.FC = () => {
  const { session, getUserFromToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Get user data from the JWT token
  const user = session?.accessToken ? getUserFromToken(session.accessToken) : null;

  // Create a validation schema for profile updates (just name and email)
  // userValidationSchema is a ZodEffects (has .refine), so define a plain ZodObject for pick
  const profileSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email format' }),
  });
  
  // Initialize form with React Hook Form
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    }
  });

  // Handle form submission
  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    setUpdateSuccess(false);
    setUpdateError(null);

    try {
      // In a real implementation, this would be a call to the auth context's updateProfile method
      // or a direct API call to update the user's profile
      await updateUserProfile(data);
      setUpdateSuccess(true);
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Placeholder function for profile updates
  const updateUserProfile = async (data: ProfileFormData) => {
    // This would be replaced with a real implementation in a production environment
    console.log('Updating profile with:', data);
    
    // Simulate an API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simulate a successful update
        resolve();
      }, 1000);
    });
  };

  if (!user) {
    return (
      <FormContainer>
        <div className="error-message">
          You must be logged in to edit your profile
        </div>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <h2>Edit Profile</h2>
      
      {updateSuccess && (
        <div className="success-message">
          Profile updated successfully
        </div>
      )}
      
      {updateError && (
        <div className="error-message">
          {updateError}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Name"
          error={errors.name?.message}
        >
          <Input
            {...register('name')}
            placeholder="Your name"
            disabled={isSubmitting}
            aria-label="Name"
          />
        </FormField>
        
        <FormField
          label="Email"
          error={errors.email?.message}
        >
          <Input
            {...register('email')}
            type="email"
            placeholder="Your email"
            disabled={isSubmitting}
            aria-label="Email"
          />
        </FormField>
        
        <Button
          type="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          {isSubmitting ? 'Updating...' : 'Update Profile'}
        </Button>
      </form>
    </FormContainer>
  );
};