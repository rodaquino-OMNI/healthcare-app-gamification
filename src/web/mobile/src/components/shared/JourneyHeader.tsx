import { Icon } from '@design-system/primitives/Icon';
import { Text } from '@design-system/primitives/Text';
import { colors } from '@design-system/tokens/colors';
import { useNavigation } from '@react-navigation/native';
import { JOURNEY_NAMES, JOURNEY_COLORS } from '@shared/constants/journeys';
import React from 'react';
import { TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components';

import { useJourney } from '../../hooks/useJourney';

const JOURNEY_ICONS: Record<string, string> = {
    health: 'heart',
    care: 'medical',
    plan: 'card',
};

/**
 * Props for the JourneyHeader component
 */
export interface JourneyHeaderProps {
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
  padding-top: ${(props) => props.insets.top + 10}px;
  padding-bottom: 10px;
  background-color: ${(props) => (props.transparent ? 'transparent' : props.backgroundColor)};
  shadow-color: #000;
  shadow-opacity: ${(props) => (props.transparent ? 0 : 0.1)};
  shadow-offset: { width: 0, height: 2 };
  shadow-radius: 4;
  elevation: ${(props) => (props.transparent ? 0 : 3)};
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
    gap: 8px;
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
}): React.ReactElement => {
    const { journey } = useJourney();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    // Determine the journey-specific color, name, and icon
    const journeyKey = journey;
    const journeyColor = JOURNEY_COLORS[journeyKey];
    const journeyName = title || JOURNEY_NAMES[journeyKey as keyof typeof JOURNEY_NAMES];
    const journeyIcon = JOURNEY_ICONS[journey];

    // Set status bar style based on platform
    if (Platform.OS === 'ios') {
        StatusBar.setBarStyle('dark-content', true);
    } else if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(transparent ? 'transparent' : journeyColor);
        StatusBar.setBarStyle('light-content');
    }

    // Handle back button press
    const handleBackPress = (): void => {
        if (onBackPress) {
            onBackPress();
        } else {
            navigation.goBack();
        }
    };

    return (
        <HeaderContainer backgroundColor={journeyColor} transparent={transparent} insets={insets}>
            <TitleContainer>
                {showBackButton && (
                    <BackButton onPress={handleBackPress} accessibilityLabel="Go back" accessibilityRole="button">
                        <Icon name="arrow-back" size="24px" color={transparent ? journeyColor : colors.gray[0]} />
                    </BackButton>
                )}
                <Icon
                    name={journeyIcon}
                    size="24px"
                    color={transparent ? journeyColor : colors.gray[0]}
                    aria-hidden={true}
                />
                <Text fontSize="xl" fontWeight="medium" color={transparent ? journeyColor : colors.gray[0]}>
                    {journeyName}
                </Text>
            </TitleContainer>

            {rightActions && <ActionsContainer>{rightActions}</ActionsContainer>}
        </HeaderContainer>
    );
};
