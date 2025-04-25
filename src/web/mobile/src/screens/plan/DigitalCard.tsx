import React, { useState, useEffect } from 'react'; // v18.0.0
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native'; // v6.0.0
import { StackNavigationProp } from '@react-navigation/stack';
import { Card, Button } from 'src/web/design-system/src/components/Card/Card';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { useJourney } from 'src/web/mobile/src/context/JourneyContext';
import { useAuth } from 'src/web/mobile/src/hooks/useAuth';
import { getDigitalCard } from 'src/web/mobile/src/api/plan';
import { MOBILE_PLAN_ROUTES } from 'src/web/shared/constants/routes';

/**
 * Type definition for the route parameters.
 */
type RootStackParamList = {
  DigitalCard: { planId: string };
};

/**
 * Type definition for the navigation props.
 */
type DigitalCardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'DigitalCard'
>;

/**
 * Type definition for the route props.
 */
type DigitalCardScreenRouteProp = RouteProp<RootStackParamList, 'DigitalCard'>;

/**
 * Renders the Digital Insurance Card screen.
 *
 * @returns The rendered DigitalCardScreen component.
 */
export const DigitalCardScreen: React.FC = () => {
  // Retrieves the planId from the route parameters.
  const { params } = useRoute<DigitalCardScreenRouteProp>();
  const { planId } = params;

  // Uses the useAuth hook to check if the user is authenticated.
  const { isAuthenticated } = useAuth();

  // Uses the useNavigation hook to get the navigation object.
  const navigation = useNavigation<DigitalCardScreenNavigationProp>();

  // Uses useState to manage the cardData state.
  const [cardData, setCardData] = useState<{ cardImageUrl: string; cardData: object } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Uses the useJourney hook to apply journey-specific theming.
  const { journey } = useJourney();

  // Uses useEffect to fetch the digital card data when the component mounts.
  useEffect(() => {
    if (isAuthenticated && planId) {
      setLoading(true);
      getDigitalCard(planId)
        .then(data => setCardData(data))
        .catch(error => console.error('Failed to load digital card:', error))
        .finally(() => setLoading(false));
    } else {
      // If not authenticated, navigate to the login screen.
      navigation.navigate(MOBILE_PLAN_ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, planId, navigation]);

  // Displays a loading indicator while fetching data.
  if (loading) {
    return (
      <Card journey={journey}>
        <Text>Loading digital card...</Text>
      </Card>
    );
  }

  // Renders the Card component with the digital card image and details.
  return (
    <Card journey={journey} accessibilityLabel="Digital Insurance Card">
      {cardData && (
        <>
          <Text>Digital Insurance Card</Text>
          <Text>Image URL: {cardData.cardImageUrl}</Text>
          <Text>Card Data: {JSON.stringify(cardData.cardData)}</Text>
          {/* Provides buttons for sharing and downloading the card. */}
          <Button onPress={() => {}} journey={journey}>
            Share Card
          </Button>
          <Button onPress={() => {}} journey={journey}>
            Download Card
          </Button>
        </>
      )}
    </Card>
  );
};