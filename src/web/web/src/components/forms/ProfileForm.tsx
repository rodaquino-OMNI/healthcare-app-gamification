import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useContext } from 'react';

import Input from 'src/web/design-system/src/components/Input/Input';
import Button from 'src/web/design-system/src/components/Button/Button';
import { isValidCPF } from 'src/web/shared/utils/validation';
import { useAuth } from 'src/web/web/src/hooks/useAuth';
import { AuthContext } from 'src/web/web/src/context/AuthContext';

// Create a validation schema specifically for profile updates
const profileUpdateSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email format' }),
  phone: z.string().optional(),
  cpf: z.string().min(1, { message: 'CPF is required' })
    .refine((cpf) => isValidCPF(cpf), { message: 'Invalid CPF format' }),
});

// Interface for form data
type ProfileFormData = z.infer<typeof profileUpdateSchema>;

export const ProfileForm: React.FC = () => {
  const { getProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize the form with React Hook Form
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      cpf: ''
    }
  });

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        
        // Reset form with profile data
        reset({
          name: profileData.name || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          cpf: profileData.cpf || ''
        });
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
        setError('Failed to load profile data');
      }
    };

    fetchProfile();
  }, [getProfile, reset]);

  // Handle form submission
  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // In a real implementation, this would call an API to update the profile
      // For now, we'll simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Profile data to update:', data);
      setSuccess(true);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="name">Name</label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              value={field.value}
              onChange={(e) => field.onChange(e)}
              placeholder="Your name"
              aria-label="Name"
              journey="health"
            />
          )}
        />
        {errors.name && <div style={{ color: 'red' }}>{errors.name.message}</div>}
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="email">Email</label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              value={field.value}
              onChange={(e) => field.onChange(e)}
              placeholder="Your email"
              aria-label="Email"
              type="email"
              journey="health"
            />
          )}
        />
        {errors.email && <div style={{ color: 'red' }}>{errors.email.message}</div>}
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="phone">Phone Number</label>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <Input
              value={field.value}
              onChange={(e) => field.onChange(e)}
              placeholder="Your phone number"
              aria-label="Phone Number"
              journey="health"
            />
          )}
        />
        {errors.phone && <div style={{ color: 'red' }}>{errors.phone.message}</div>}
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="cpf">CPF</label>
        <Controller
          name="cpf"
          control={control}
          render={({ field }) => (
            <Input
              value={field.value}
              onChange={(e) => field.onChange(e)}
              placeholder="Your CPF"
              aria-label="CPF"
              journey="health"
            />
          )}
        />
        {errors.cpf && <div style={{ color: 'red' }}>{errors.cpf.message}</div>}
      </div>
      
      {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '16px' }}>Profile updated successfully!</div>}
      
      <Button
        onPress={() => handleSubmit(onSubmit)()}
        disabled={loading}
        loading={loading}
        journey="health"
      >
        Update Profile
      </Button>
    </form>
  );
};

export default ProfileForm;