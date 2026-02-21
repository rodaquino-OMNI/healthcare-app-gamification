import React, { useEffect, useRef, useState } from 'react';
import { Animated, ActivityIndicator, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing, spacingValues } from '../../../../design-system/src/tokens/spacing';
import { ROUTES } from '../../constants/routes';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Auto-advance delay in milliseconds before navigating to Onboarding.
 */
const AUTO_ADVANCE_DELAY = 3000;

/**
 * Full-screen gradient container using brand colors.
 * Since React Native does not support CSS gradients natively,
 * we layer two absolutely-positioned views to approximate the effect.
 */
const GradientBackground = styled.View`
  flex: 1;
  background-color: ${colors.brand.primary};
  align-items: center;
  justify-content: center;
`;

const GradientOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50%;
  background-color: ${colors.brand.secondary};
  opacity: 0.3;
`;

const ContentContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-horizontal: ${spacing['2xl']};
`;

const LogoContainer = styled.View`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: ${colors.neutral.white};
  align-items: center;
  justify-content: center;
  margin-bottom: ${spacing['2xl']};
`;

const LogoText = styled.Text`
  font-family: ${typography.fontFamily.logo};
  font-size: ${typography.fontSize['display-md']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.brand.primary};
`;

const TaglineText = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-lg']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.white};
  text-align: center;
  margin-bottom: ${spacing.xs};
`;

const SubtaglineText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.regular};
  color: ${colors.neutral.white};
  opacity: 0.85;
  text-align: center;
`;

const LoaderContainer = styled.View`
  position: absolute;
  bottom: ${spacing['5xl']};
  align-items: center;
`;

/**
 * WelcomeSplashScreen displays an animated branded splash when the app launches.
 *
 * Behaviour:
 * - First-time users see the full fade-in + scale animation (duration ~800ms).
 * - Returning users see a quick 300ms fade-in (variant controlled via route param).
 * - After AUTO_ADVANCE_DELAY the screen navigates to the Onboarding screen.
 * - The timer is cleaned up on unmount to prevent memory leaks.
 */
export default function WelcomeSplashScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const [isFirstTime] = useState<boolean>(() => {
    // In a real implementation this would read from AsyncStorage.
    // Default to first-time for now.
    try {
      const route = navigation.getState()?.routes?.find(
        (r: any) => r.name === ROUTES.AUTH_WELCOME,
      );
      return (route?.params as any)?.isFirstTime !== false;
    } catch {
      return true;
    }
  });

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(isFirstTime ? 0.8 : 1)).current;

  useEffect(() => {
    // Determine animation duration based on variant
    const animDuration = isFirstTime ? 800 : 300;

    const animations = [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: animDuration,
        useNativeDriver: true,
      }),
    ];

    if (isFirstTime) {
      animations.push(
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: animDuration,
          useNativeDriver: true,
        }),
      );
    }

    Animated.parallel(animations).start();

    // Auto-advance timer
    const timer = setTimeout(() => {
      navigation.replace(ROUTES.AUTH_ONBOARDING);
    }, AUTO_ADVANCE_DELAY);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, isFirstTime, navigation]);

  return (
    <GradientBackground>
      <GradientOverlay />
      <Animated.View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          width: '100%',
        }}
      >
        <ContentContainer>
          <LogoContainer>
            <LogoText>A</LogoText>
          </LogoContainer>
          <TaglineText>AUSTA</TaglineText>
          <SubtaglineText>{t('auth.welcome.subtagline')}</SubtaglineText>
        </ContentContainer>
      </Animated.View>

      <LoaderContainer>
        <ActivityIndicator
          size="small"
          color={colors.neutral.white}
          testID="welcome-loader"
        />
      </LoaderContainer>
    </GradientBackground>
  );
}
