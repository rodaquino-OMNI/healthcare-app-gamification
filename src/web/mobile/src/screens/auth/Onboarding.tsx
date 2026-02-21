import React, { useRef, useState, useCallback } from 'react';
import {
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing, spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadius } from '../../../../design-system/src/tokens/borderRadius';
import { sizing, sizingValues } from '../../../../design-system/src/tokens/sizing';
import { ROUTES } from '../../constants/routes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Total number of onboarding steps.
 */
const TOTAL_STEPS = 5;

/**
 * Content for each onboarding step.
 */
const STEPS = [
  {
    title: 'Track Your Health',
    description:
      'Monitor vital signs, steps, sleep, and nutrition all in one place. Connect your wearable devices for real-time insights.',
    color: colors.journeys.health.primary,
  },
  {
    title: 'Earn Rewards',
    description:
      'Complete health challenges, earn XP, and unlock achievements. Stay motivated with gamified wellness goals.',
    color: colors.brand.secondary,
  },
  {
    title: 'Manage Your Plan',
    description:
      'View coverage details, submit claims, and simulate costs. Your insurance plan at your fingertips.',
    color: colors.journeys.plan.primary,
  },
  {
    title: 'Virtual Care',
    description:
      'Book appointments and consult with healthcare providers via video. Quality care from anywhere.',
    color: colors.journeys.care.primary,
  },
  {
    title: 'Join the Community',
    description:
      'Connect with others on similar health journeys. Share tips, celebrate milestones, and grow together.',
    color: colors.journeys.community.primary,
  },
] as const;

// --- Styled components ---

const Container = styled.View`
  flex: 1;
  background-color: ${colors.neutral.white};
`;

const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  padding-horizontal: ${spacing.lg};
  padding-top: ${spacing['3xl']};
`;

const SkipButton = styled.TouchableOpacity`
  padding-vertical: ${spacing.xs};
  padding-horizontal: ${spacing.md};
`;

const SkipText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.gray[50]};
`;

const SlideContainer = styled.View`
  width: ${SCREEN_WIDTH}px;
  align-items: center;
  padding-horizontal: ${spacing['2xl']};
  padding-top: ${spacing['3xl']};
`;

const IllustrationBox = styled.View<{ bgColor: string }>`
  width: ${SCREEN_WIDTH * 0.65}px;
  height: ${SCREEN_WIDTH * 0.65}px;
  border-radius: ${borderRadius.xl};
  background-color: ${(props) => props.bgColor};
  opacity: 0.15;
  margin-bottom: ${spacing['2xl']};
`;

const StepTitle = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.gray[70]};
  text-align: center;
  margin-bottom: ${spacing.sm};
`;

const StepDescription = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.regular};
  color: ${colors.gray[50]};
  text-align: center;
  line-height: ${spacingValues.xl}px;
`;

const BottomSection = styled.View`
  padding-horizontal: ${spacing['2xl']};
  padding-bottom: ${spacing['3xl']};
  align-items: center;
`;

const ProgressBarTrack = styled.View`
  width: 100%;
  height: 4px;
  background-color: ${colors.gray[10]};
  border-radius: ${borderRadius.full};
  margin-bottom: ${spacing.lg};
  overflow: hidden;
`;

const ProgressBarFill = styled.View<{ widthPercent: number }>`
  height: 100%;
  width: ${(props) => props.widthPercent}%;
  background-color: ${colors.brand.primary};
  border-radius: ${borderRadius.full};
`;

const DotsRow = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: ${spacing.xl};
`;

const Dot = styled.View<{ active: boolean }>`
  width: ${(props) => (props.active ? '24px' : '8px')};
  height: 8px;
  border-radius: ${borderRadius.full};
  background-color: ${(props) =>
    props.active ? colors.brand.primary : colors.gray[20]};
  margin-horizontal: ${spacing['3xs']};
`;

const NextButton = styled.TouchableOpacity<{ bgColor: string }>`
  width: 100%;
  height: ${sizing.component.lg};
  background-color: ${(props) => props.bgColor};
  border-radius: ${borderRadius.md};
  align-items: center;
  justify-content: center;
`;

const NextButtonText = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['text-lg']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.white};
`;

// --- Component ---

/**
 * OnboardingScreen presents a 5-step horizontal carousel introducing key app features.
 *
 * Features:
 * - Horizontally swipeable ScrollView with paging
 * - Step indicator dots (active dot is wider for emphasis)
 * - ProgressBar track showing overall progress
 * - "Skip" button in the header to jump directly to WelcomeCTA
 * - "Next" / "Get Started" button at the bottom
 */
export default function OnboardingScreen() {
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const isLastStep = currentStep === TOTAL_STEPS - 1;
  const progressPercent = ((currentStep + 1) / TOTAL_STEPS) * 100;

  /**
   * Update step index when user scrolls to a new page.
   */
  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const page = Math.round(offsetX / SCREEN_WIDTH);
      if (page !== currentStep && page >= 0 && page < TOTAL_STEPS) {
        setCurrentStep(page);
      }
    },
    [currentStep],
  );

  /**
   * Advance to next step or navigate to WelcomeCTA on the last step.
   */
  const handleNext = useCallback(() => {
    if (isLastStep) {
      navigation.replace(ROUTES.AUTH_WELCOME_CTA);
    } else {
      const nextStep = currentStep + 1;
      scrollRef.current?.scrollTo({
        x: nextStep * SCREEN_WIDTH,
        animated: true,
      });
      setCurrentStep(nextStep);
    }
  }, [currentStep, isLastStep, navigation]);

  /**
   * Skip directly to WelcomeCTA.
   */
  const handleSkip = useCallback(() => {
    navigation.replace(ROUTES.AUTH_WELCOME_CTA);
  }, [navigation]);

  return (
    <Container>
      {/* Header with Skip button */}
      <HeaderRow>
        <SkipButton
          onPress={handleSkip}
          accessibilityLabel="Skip onboarding"
          accessibilityRole="button"
          testID="onboarding-skip"
        >
          <SkipText>Skip</SkipText>
        </SkipButton>
      </HeaderRow>

      {/* Carousel */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        testID="onboarding-carousel"
      >
        {STEPS.map((step, index) => (
          <SlideContainer key={`step-${index}`}>
            <IllustrationBox bgColor={step.color} />
            <StepTitle>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </SlideContainer>
        ))}
      </ScrollView>

      {/* Bottom section: progress, dots, next button */}
      <BottomSection>
        <ProgressBarTrack>
          <ProgressBarFill widthPercent={progressPercent} />
        </ProgressBarTrack>

        <DotsRow>
          {STEPS.map((_, index) => (
            <Dot
              key={`dot-${index}`}
              active={index === currentStep}
              accessibilityLabel={`Step ${index + 1} of ${TOTAL_STEPS}`}
            />
          ))}
        </DotsRow>

        <NextButton
          bgColor={colors.brand.primary}
          onPress={handleNext}
          accessibilityLabel={isLastStep ? 'Get Started' : 'Next step'}
          accessibilityRole="button"
          testID="onboarding-next"
        >
          <NextButtonText>
            {isLastStep ? 'Get Started' : 'Next'}
          </NextButtonText>
        </NextButton>
      </BottomSection>
    </Container>
  );
}
