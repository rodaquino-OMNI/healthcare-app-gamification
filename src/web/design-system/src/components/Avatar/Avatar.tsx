import React, { useState } from 'react';
import { AvatarContainer, AvatarImage, AvatarFallback } from './Avatar.styles';
import { Icon } from '../../primitives/Icon/Icon';
import { Text } from '../../primitives/Text/Text';

/**
 * Props for the Avatar component
 */
export interface AvatarProps {
  /**
   * Image source URL for the avatar
   */
  src?: string;
  
  /**
   * Alternative text for the image
   */
  alt?: string;
  
  /**
   * User's name (used for generating initials and aria-label)
   */
  name?: string;
  
  /**
   * Size of the avatar in pixels or CSS units
   * @default '40px'
   */
  size?: string;
  
  /**
   * Journey context for styling (health, care, plan)
   */
  journey?: 'health' | 'care' | 'plan';
  
  /**
   * Flag to force showing fallback even when image is available
   * @default false
   */
  showFallback?: boolean;
  
  /**
   * Type of fallback to show
   * @default 'initials'
   */
  fallbackType?: 'initials' | 'icon';
  
  /**
   * Callback for image loading errors
   */
  onImageError?: () => void;
  
  /**
   * Test ID for testing purposes
   */
  testID?: string;
}

/**
 * Extracts initials from a user's name
 * @param name The full name to extract initials from
 * @returns The extracted initials (up to 2 characters)
 */
const getInitials = (name?: string): string => {
  if (!name) return '';
  
  const nameParts = name.trim().split(' ');
  const firstInitial = nameParts[0] ? nameParts[0][0] : '';
  const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : '';
  
  return (firstInitial + lastInitial).toUpperCase();
};

/**
 * Avatar component for displaying user profile images with fallback to initials or icon.
 * Supports journey-specific styling and various sizes.
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = '40px',
  journey,
  showFallback = false,
  fallbackType = 'initials',
  onImageError,
  testID,
}) => {
  const [hasError, setHasError] = useState(false);
  
  // Handle image loading errors
  const handleImageError = () => {
    setHasError(true);
    if (onImageError) {
      onImageError();
    }
  };
  
  // Generate initials from name
  const initials = getInitials(name);
  
  // Determine if we should show the fallback
  const shouldShowFallback = showFallback || hasError || !src;
  
  // Get the background color based on journey
  const getBackgroundColor = () => {
    if (!journey) return undefined;
    
    const journeyColors = {
      health: '#0ACF83', // Health journey primary color
      care: '#FF8C42',   // Care journey primary color
      plan: '#3A86FF',   // Plan journey primary color
    };
    
    return journeyColors[journey];
  };
  
  const backgroundColor = getBackgroundColor();
  
  return (
    <AvatarContainer 
      size={size} 
      style={backgroundColor ? { backgroundColor } : undefined}
      data-testid={testID || 'avatar'}
      aria-label={alt || (name ? `Avatar for ${name}` : 'User avatar')}
    >
      {!shouldShowFallback && src ? (
        <AvatarImage 
          src={src} 
          alt={alt || (name ? `Avatar for ${name}` : 'User avatar')} 
          onError={handleImageError}
        />
      ) : (
        <AvatarFallback size={size}>
          {fallbackType === 'initials' && initials ? (
            <Text 
              color="white" 
              fontWeight="medium"
              aria-hidden="true"
              testID="avatar-initials"
            >
              {initials}
            </Text>
          ) : (
            <Icon 
              name="profile" 
              size={`calc(${size} / 2)`} 
              color="white"
              aria-hidden="true"
            />
          )}
        </AvatarFallback>
      )}
    </AvatarContainer>
  );
};