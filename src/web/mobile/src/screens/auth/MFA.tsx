import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native'; // v6.0.0
import { useAuth } from '../../hooks/useAuth';
import { Input } from 'src/web/design-system/src/components/Input/Input';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { LoadingIndicator } from '../../components/shared/LoadingIndicator';

/**
 * MFA screen component that handles multi-factor authentication verification
 * This screen allows users to enter a verification code they received via SMS or email
 * to complete the authentication process.
 */
export const MFAScreen: React.FC = () => {
  // State for the verification code input
  const [code, setCode] = useState('');
  // State to track form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get navigation object for routing
  const navigation = useNavigation();
  // Get the MFA verification function from auth context
  const { handleMfaVerification } = useAuth();
  
  /**
   * Handles the verification code submission
   * Attempts to verify the code with the temporary token
   */
  const handleSubmit = async () => {
    // Don't submit if code is empty
    if (!code.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Get the temporary token from navigation params
      // Note: The actual method to access route params depends on the
      // React Navigation version and implementation
      const route = navigation.getState().routes[navigation.getState().index];
      const tempToken = route.params?.tempToken;
      
      // Call the MFA verification function from auth context
      await handleMfaVerification(code, tempToken);
      // Navigation after successful verification is handled by the auth context
    } catch (error) {
      // Log error and reset submission state on failure
      console.error('MFA verification failed:', error);
      setIsSubmitting(false);
    }
  };
  
  /**
   * Handle input change events
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };
  
  return (
    <div>
      <h2>Verification Required</h2>
      <p>Please enter the verification code sent to your device to complete the login process.</p>
      
      <Input
        value={code}
        onChange={handleInputChange}
        placeholder="Enter verification code"
        type="text"
        aria-label="Verification code"
        journey="health"
        testID="mfa-code-input"
      />
      
      {isSubmitting ? (
        <LoadingIndicator 
          journey="health" 
          size="md" 
          label="Verifying..." 
        />
      ) : (
        <Button
          onPress={handleSubmit}
          journey="health"
          variant="primary"
          disabled={!code.trim()}
          accessibilityLabel="Verify code"
        >
          Verify
        </Button>
      )}
    </div>
  );
};

export default MFAScreen;