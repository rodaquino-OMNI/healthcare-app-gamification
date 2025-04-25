import React from 'react';
import { TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components';

import { Box } from '../../../design-system/src/primitives/Box';
import { Text } from '../../../design-system/src/primitives/Text';
import { Icon } from '../../../design-system/src/primitives/Icon';
import { useJourney } from '../../hooks/useJourney';
import { JOURNEY_NAMES, JOURNEY_COLORS, JOURNEY_ICONS } from '../../../shared/constants/journeys';

/**
 * Props for the JourneyHeader component
 */
interface JourneyHeaderProps {
  /**
   * Optional custom title to override the journey name
   */
  title?: string;
  
  /**
   * Whether to show a back button in the header
   * @default false
   */
  showBackButton?: boolean;
  
  /**
   * Custom handler for back button press, defaults to navigation.goBack()
   */
  onBackPress?: () => void;
  
  /**
   * Optional components to render on the right side of the header
   */
  rightActions?: React.ReactNode;
  
  /**
   * Whether the header should have a transparent background
   * @default false
   */
  transparent?: boolean;
}

/**
 * Container for the header with journey-specific styling
 */
const HeaderContainer = styled.div<{
  backgroundColor: string;
  transparent?: boolean;
  insets: { top: number; right: number; bottom: number; left: number };
}>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 16px;
  padding-top: ${props => props.insets.top + 10}px;
  padding-bottom: 10px;
  background-color: ${props => props.transparent ? 'transparent' : props.backgroundColor};
  shadow-color: #000;
  shadow-opacity: ${props => props.transparent ? 0 : 0.1};
  shadow-offset: { width: 0, height: 2 };
  shadow-radius: 4;
  elevation: ${props => props.transparent ? 0 : 3};
`;

/**
 * Styled back button component
 */
const BackButton = styled(TouchableOpacity)`
  padding: 8px;
  margin-right: 8px;
`;

/**
 * Container for the title with journey icon
 */
const TitleContainer = styled.div`
  flex-direction: row;
  align-items: center;
`;

/**
 * Container for right-aligned action buttons
 */
const ActionsContainer = styled.div`
  flex-direction: row;
  align-items: center;
`;

/**
 * A component that renders a journey-specific header with appropriate styling,
 * title, and navigation options.
 */
export const JourneyHeader: React.FC<JourneyHeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  rightActions,
  transparent = false,
}) => {
  const { journey } = useJourney();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  // Determine the journey-specific color, name, and icon
  const journeyColor = JOURNEY_COLORS[journey.toUpperCase()];
  const journeyName = title || JOURNEY_NAMES[journey.toUpperCase()];
  const journeyIcon = JOURNEY_ICONS[journey.toUpperCase()];
  
  // Set status bar style based on platform
  if (Platform.OS === 'ios') {
    StatusBar.setBarStyle('dark-content', true);
  } else if (Platform.OS === 'android') {
    StatusBar.setBackgroundColor(transparent ? 'transparent' : journeyColor);
    StatusBar.setBarStyle('light-content');
  }
  
  // Handle back button press
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };
  
  return (
    <HeaderContainer 
      backgroundColor={journeyColor}
      transparent={transparent}
      insets={insets}
    >
      <TitleContainer>
        {showBackButton && (
          <BackButton 
            onPress={handleBackPress}
            accessibilityLabel="Go back"
          >
            <Icon 
              name="arrow-back" 
              size="24px" 
              color={transparent ? journeyColor : '#FFFFFF'}
            />
          </BackButton>
        )}
        <Icon 
          name={journeyIcon} 
          size="24px" 
          color={transparent ? journeyColor : '#FFFFFF'} 
          aria-hidden="true"
          style={{ marginRight: '8px' }}
        />
        <Text 
          fontSize="xl" 
          fontWeight="medium" 
          color={transparent ? journeyColor : '#FFFFFF'}
        >
          {journeyName}
        </Text>
      </TitleContainer>
      
      {rightActions && (
        <ActionsContainer>
          {rightActions}
        </ActionsContainer>
      )}
    </HeaderContainer>
  );
};