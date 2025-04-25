import React, { useState } from 'react'; // v18.2.0
import { useNavigation } from '@react-navigation/native'; // v6.1.9
import { StackNavigationProp } from '@react-navigation/stack'; // v6.3.20
import { yupResolver } from '@hookform/resolvers/yup'; // v3.3.4
import { useForm } from 'react-hook-form'; // v7.49.3

import { Button } from 'src/web/design-system/src/components/Button';
import Input from 'src/web/design-system/src/components/Input';
import Text from 'src/web/design-system/src/primitives/Text';
import Stack from 'src/web/design-system/src/primitives/Stack';
import { useAuth } from 'src/web/mobile/src/hooks/useAuth';
import { showToast, validationSchema } from 'src/web/mobile/src/utils';

/**
 * Type definition for the navigation properties of the ForgotPasswordScreen.
 */
type ForgotPasswordScreenProp = {
  navigation: StackNavigationProp<any, 'ForgotPassword'>;
};

/**
 * A screen component that allows users to request a password reset by entering their email address.
 *
 * @param {ForgotPasswordScreenProp} props - The navigation properties passed to the screen.
 * @returns {React.ReactElement} The rendered ForgotPasswordScreen component.
 */
export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProp> = ({ navigation }) => {
  // 1. Initializes the form using React Hook Form and Yup for validation.
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema.email),
  });

  // 2. Defines a state variable for the email input field.
  const [email, setEmail] = useState('');

  // 3. Defines the handleSubmit function to handle form submission.
  const { forgotPassword } = useAuth();

  const onSubmit = async () => {
    try {
      // Calls the forgotPassword function from the authentication context to send the password reset request.
      await forgotPassword(email);
      // Displays a success or error toast message based on the result of the forgotPassword function.
      showToast({
        type: 'success',
        message: 'A password reset link has been sent to your email address.',
      });
      navigation.goBack();
    } catch (error: any) {
      // Displays a success or error toast message based on the result of the forgotPassword function.
      showToast({
        type: 'error',
        message: error.message || 'Failed to send password reset email.',
      });
    }
  };

  // 4. Renders the UI with an email input field and submit button.
  return (
    <Stack spacing="md">
      <Text>Enter your email address to receive a password reset link.</Text>
      <Input
        placeholder="Email Address"
        value={email}
        onChange={(text) => setEmail(text.nativeEvent.text)}
        aria-label="Email Address"
        testID="email-input"
        type="email"
      />
      {errors.email && <Text color="red">{errors.email.message}</Text>}
      <Button onPress={handleSubmit(onSubmit)} testID="submit-button">
        Reset Password
      </Button>
    </Stack>
  );
};