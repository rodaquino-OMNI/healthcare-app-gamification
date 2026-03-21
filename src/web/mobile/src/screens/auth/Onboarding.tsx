/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { borderRadius } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { sizing } from '@design-system/tokens/sizing';
import { spacing, spacingValues } from '@design-system/tokens/spacing';
import { typography } from '@design-system/tokens/typography';
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import styled from 'styled-components/native';

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
        titleKey: 'onboarding.steps.trackHealth.title',
        descriptionKey: 'onboarding.steps.trackHealth.description',
        color: colors.journeys.health.primary,
    },
    {
        titleKey: 'onboarding.steps.earnRewards.title',
        descriptionKey: 'onboarding.steps.earnRewards.description',
        color: colors.brand.secondary,
    },
    {
        titleKey: 'onboarding.steps.managePlan.title',
        descriptionKey: 'onboarding.steps.managePlan.description',
        color: colors.journeys.plan.primary,
    },
    {
        titleKey: 'onboarding.steps.virtualCare.title',
        descriptionKey: 'onboarding.steps.virtualCare.description',
        color: colors.journeys.care.primary,
    },
    {
        titleKey: 'onboarding.steps.joinCommunity.title',
        descriptionKey: 'onboarding.steps.joinCommunity.description',
        color: colors.journeys.community.primary,
    },
] as const;

// --- Styled components ---

const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background.default};
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
    color: ${({ theme }) => theme.colors.text.muted};
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
    color: ${({ theme }) => theme.colors.text.default};
    text-align: center;
    margin-bottom: ${spacing.sm};
`;

const StepDescription = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.regular};
    color: ${({ theme }) => theme.colors.text.muted};
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
    background-color: ${({ theme }) => theme.colors.background.subtle};
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
    background-color: ${(props) => (props.active ? colors.brand.primary : props.theme.colors.border.default)};
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
    color: ${({ theme }) => theme.colors.text.onBrand};
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
    const { t } = useTranslation();
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
        [currentStep]
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
                    accessibilityLabel={t('onboarding.skip')}
                    accessibilityRole="button"
                    testID="onboarding-skip"
                >
                    <SkipText>{t('onboarding.skip')}</SkipText>
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
                        <StepTitle>{t(step.titleKey)}</StepTitle>
                        <StepDescription>{t(step.descriptionKey)}</StepDescription>
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
                            accessibilityLabel={t('onboarding.stepIndicator', {
                                current: index + 1,
                                total: TOTAL_STEPS,
                            })}
                        />
                    ))}
                </DotsRow>

                <NextButton
                    bgColor={colors.brand.primary}
                    onPress={handleNext}
                    accessibilityLabel={isLastStep ? t('onboarding.getStarted') : t('common.buttons.next')}
                    accessibilityRole="button"
                    testID="onboarding-next"
                >
                    <NextButtonText>
                        {isLastStep ? t('onboarding.getStarted') : t('common.buttons.next')}
                    </NextButtonText>
                </NextButton>
            </BottomSection>
        </Container>
    );
}
