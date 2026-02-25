import React from 'react';
import { Box } from '../../primitives/Box';
import { Stack } from '../../primitives/Stack';
import { Text } from '../../primitives/Text';
import { Icon } from '../../primitives/Icon';
import { Button } from '../../components/Button';
import { colors } from '../../tokens/colors';
import { sizing } from '../../tokens/sizing';

/**
 * Props for the ProviderCard component
 */
export interface ProviderCardProps {
  /**
   * Provider object containing provider details.
   */
  provider: {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    reviewCount: number;
    location?: {
      name: string;
      distance?: number;
    };
    availability?: {
      date: string;
      times: string[];
    }[];
    isCoveredByInsurance?: boolean;
    isTelemedicineAvailable?: boolean;
  };
  
  /**
   * Callback function to execute when the card is pressed.
   */
  onPress?: () => void;
}

/**
 * ProviderCard component for displaying healthcare provider information in the Care Journey.
 * 
 * This component presents essential provider details in a consistent card format with
 * appropriate styling for the Care Journey theme. It includes provider name, specialty,
 * rating, location, availability, and insurance coverage information.
 */
export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onPress }) => {
  // Get Care Journey specific colors directly from tokens
  const careColors = colors.journeys.care;

  // Render star rating
  const renderRating = () => {
    // Create filled stars based on rating
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const starColor = i < provider.rating ? careColors.primary : colors.neutral.gray400;
      stars.push(<Icon key={i} name="star" color={starColor} size={sizing.icon.xs} aria-hidden="true" />);
    }
    
    return (
      <Stack direction="row" spacing="xs" align="center">
        {stars}
        <Text color={colors.neutral.gray600} fontSize="sm">
          ({provider.reviewCount} avaliações)
        </Text>
      </Stack>
    );
  };
  
  return (
    <Box
      padding="lg"
      backgroundColor="white"
      borderRadius="md"
      boxShadow="md"
      borderLeft={`4px solid ${careColors.primary}`}
      aria-label={`Prestador: ${provider.name}, ${provider.specialty}`}
    >
      <Stack spacing="md">
        {/* Provider name, specialty and rating */}
        <Stack spacing="xs">
          <Text fontSize="lg" fontWeight="bold">
            {provider.name}
          </Text>
          <Text color={colors.neutral.gray700}>
            {provider.specialty}
          </Text>
          {provider.rating > 0 && renderRating()}
        </Stack>
        
        {/* Divider for visual separation */}
        <Box
          height="1px"
          backgroundColor={colors.neutral.gray200}
          marginTop="md"
          marginBottom="md"
          aria-hidden={true}
        />
        
        {/* Provider details with icons */}
        <Stack spacing="md">
          {/* Location information */}
          {provider.location && (
            <Stack direction="row" spacing="sm" align="center">
              <Icon 
                name="clinic" 
                color={careColors.primary} 
                size={sizing.icon.sm}
                aria-hidden="true" 
              />
              <Text>
                {provider.location.name}
                {provider.location.distance !== undefined && ` - ${provider.location.distance}km`}
              </Text>
            </Stack>
          )}
          
          {/* Availability information */}
          {provider.availability && provider.availability.length > 0 && (
            <Stack direction="row" spacing="sm" align="flex-start">
              <Icon 
                name="calendar" 
                color={careColors.primary} 
                size={sizing.icon.sm}
                aria-hidden="true" 
              />
              <Text>
                {provider.availability[0].date}: {provider.availability[0].times.join(', ')}
              </Text>
            </Stack>
          )}
          
          {/* Telemedicine availability */}
          {provider.isTelemedicineAvailable && (
            <Stack direction="row" spacing="sm" align="center">
              <Icon 
                name="video" 
                color={careColors.primary} 
                size={sizing.icon.sm}
                aria-hidden="true" 
              />
              <Text>Telemedicina disponível</Text>
            </Stack>
          )}
          
          {/* Insurance coverage */}
          {provider.isCoveredByInsurance !== undefined && (
            <Stack direction="row" spacing="sm" align="center">
              <Icon 
                name="money" 
                color={careColors.primary} 
                size={sizing.icon.sm}
                aria-hidden="true" 
              />
              <Text>
                {provider.isCoveredByInsurance 
                  ? 'Coberto pelo seu plano' 
                  : 'Não coberto pelo seu plano'}
              </Text>
            </Stack>
          )}
        </Stack>
        
        {/* Action button */}
        <Box marginTop="lg">
          <Button 
            variant="primary" 
            journey="care" 
            onPress={onPress}
            accessibilityLabel={`Agendar consulta com ${provider.name}`}
          >
            Agendar Consulta
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};