import React from 'react';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { Card } from '../../components/Card/Card';
import Text from '../../primitives/Text/Text';
import { Stack } from '../../primitives/Stack/Stack';
import { Benefit } from '../../../shared/types/plan.types';

/**
 * Interface defining the props for the BenefitCard component
 */
export interface BenefitCardProps {
  /**
   * The benefit to display in the card
   */
  benefit: Benefit;
  
  /**
   * Optional callback function when card is pressed/clicked
   */
  onPress?: () => void;
}

/**
 * A component that displays information about a specific insurance benefit.
 * Part of the Plan journey, this card provides a consistent UI for showcasing 
 * benefit details with journey-specific styling.
 * 
 * @example
 * // Basic usage
 * <BenefitCard benefit={benefitData} />
 * 
 * @example
 * // Interactive card with click handler
 * <BenefitCard 
 *   benefit={benefitData} 
 *   onPress={() => showBenefitDetails(benefitData.id)}
 * />
 */
export const BenefitCard: React.FC<BenefitCardProps> = ({ 
  benefit,
  onPress
}) => {
  const { type, description, limitations, usage } = benefit;
  
  // Create accessible label for the card
  const accessibilityLabel = `Benefit: ${type}. ${description}${limitations ? `. Limitations: ${limitations}` : ''}${usage ? `. Usage: ${usage}` : ''}`;
  
  return (
    <Card 
      journey="plan" 
      elevation="sm"
      onPress={onPress}
      interactive={!!onPress}
      accessibilityLabel={accessibilityLabel}
    >
      <Stack spacing="sm">
        <Text 
          fontSize="xl"
          fontWeight="medium"
        >
          {type}
        </Text>
        <Text fontSize="md">
          {description}
        </Text>
        
        {limitations && (
          <Text 
            fontSize="sm" 
            color={colors.neutral.gray600}
          >
            Limitations: {limitations}
          </Text>
        )}
        
        {usage && (
          <Text 
            fontSize="sm" 
            color={colors.neutral.gray600}
          >
            Usage: {usage}
          </Text>
        )}
      </Stack>
    </Card>
  );
};