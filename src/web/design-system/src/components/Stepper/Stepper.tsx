import React from 'react';
import styled from 'styled-components';

import { borderRadius } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';

export interface StepItem {
    label: string;
    description?: string;
}

export interface StepperProps {
    steps: StepItem[];
    activeStep: number;
    orientation?: 'horizontal' | 'vertical';
    journey?: 'health' | 'care' | 'plan';
    onStepPress?: (index: number) => void;
    accessibilityLabel?: string;
}

const getJourneyColor = (journey?: string): string => {
    if (journey && colors.journeys[journey as keyof typeof colors.journeys]) {
        return colors.journeys[journey as keyof typeof colors.journeys].primary;
    }
    return colors.brand.primary;
};

const StepperContainer = styled.div<{ orientation: string }>`
    display: flex;
    flex-direction: ${(props) => (props.orientation === 'vertical' ? 'column' : 'row')};
    align-items: ${(props) => (props.orientation === 'vertical' ? 'flex-start' : 'center')};
    gap: ${spacing.xs};
`;

const StepWrapper = styled.div<{ orientation: string }>`
    display: flex;
    flex-direction: ${(props) => (props.orientation === 'vertical' ? 'row' : 'column')};
    align-items: center;
    gap: ${spacing.xs};
    flex: ${(props) => (props.orientation === 'horizontal' ? 1 : 'none')};
`;

const StepCircle = styled.button<{ status: 'completed' | 'active' | 'pending'; journey?: string }>`
    width: ${spacing['2xl']};
    height: ${spacing['2xl']};
    border-radius: ${borderRadius.full};
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.sm};
    font-weight: ${typography.fontWeight.semiBold};
    border: 2px solid
        ${(props) => {
            if (props.status === 'completed' || props.status === 'active') {
                return getJourneyColor(props.journey);
            }
            return colors.neutral.gray300;
        }};
    background-color: ${(props) => {
        if (props.status === 'completed') {
            return getJourneyColor(props.journey);
        }
        return colors.neutral.white;
    }};
    color: ${(props) => {
        if (props.status === 'completed') {
            return colors.neutral.white;
        }
        if (props.status === 'active') {
            return getJourneyColor(props.journey);
        }
        return colors.neutral.gray500;
    }};
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    padding: 0;

    &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px ${(props) => getJourneyColor(props.journey)}40;
    }
`;

const StepLabel = styled.span<{ isActive: boolean }>`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.xs};
    font-weight: ${(props) => (props.isActive ? typography.fontWeight.semiBold : typography.fontWeight.regular)};
    color: ${(props) => (props.isActive ? colors.neutral.gray900 : colors.neutral.gray600)};
    text-align: center;
`;

const StepDescription = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.xs};
    color: ${colors.neutral.gray500};
    text-align: center;
`;

const StepConnector = styled.div<{ completed: boolean; orientation: string; journey?: string }>`
    background-color: ${(props) => (props.completed ? getJourneyColor(props.journey) : colors.neutral.gray300)};
    ${(props) =>
        props.orientation === 'vertical'
            ? `width: 2px; height: ${spacing.xl}; margin-left: 15px;`
            : `height: 2px; flex: 1;`}
    transition: background-color 0.2s ease-in-out;
`;

export const Stepper: React.FC<StepperProps> = ({
    steps,
    activeStep,
    orientation = 'horizontal',
    journey,
    onStepPress,
    accessibilityLabel = 'Progress stepper',
}) => {
    const getStepStatus = (index: number): 'completed' | 'active' | 'pending' => {
        if (index < activeStep) {
            return 'completed';
        }
        if (index === activeStep) {
            return 'active';
        }
        return 'pending';
    };

    return (
        <StepperContainer orientation={orientation} role="list" aria-label={accessibilityLabel} data-testid="stepper">
            {steps.map((step, index) => {
                const status = getStepStatus(index);
                return (
                    <React.Fragment key={`step-${index}`}>
                        <StepWrapper orientation={orientation} role="listitem" data-testid={`step-${index}`}>
                            <StepCircle
                                status={status}
                                journey={journey}
                                onClick={() => onStepPress?.(index)}
                                aria-label={`Step ${index + 1}: ${step.label}`}
                                data-testid={`step-circle-${index}`}
                            >
                                {status === 'completed' ? '✓' : index + 1}
                            </StepCircle>
                            <StepLabel isActive={status === 'active'} data-testid={`step-label-${index}`}>
                                {step.label}
                            </StepLabel>
                            {step.description && <StepDescription>{step.description}</StepDescription>}
                        </StepWrapper>
                        {index < steps.length - 1 && (
                            <StepConnector
                                completed={index < activeStep}
                                orientation={orientation}
                                journey={journey}
                                aria-hidden="true"
                                data-testid={`step-connector-${index}`}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </StepperContainer>
    );
};
