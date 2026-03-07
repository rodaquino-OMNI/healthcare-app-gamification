import React, { useCallback } from 'react';
import styled from 'styled-components';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';
import { borderRadius } from '../../tokens/borderRadius';
import { shadows } from '../../tokens/shadows';

export interface SliderProps {
    min?: number;
    max?: number;
    step?: number;
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    showValue?: boolean;
    journey?: 'health' | 'care' | 'plan';
    accessibilityLabel?: string;
}

const getJourneyColor = (journey?: string) => {
    if (journey && colors.journeys[journey as keyof typeof colors.journeys]) {
        return colors.journeys[journey as keyof typeof colors.journeys].primary;
    }
    return colors.brand.primary;
};

const SliderContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${spacing.xs};
    width: 100%;
`;

const SliderTrack = styled.div`
    position: relative;
    width: 100%;
    height: ${spacing['3xs']};
    background-color: ${colors.neutral.gray300};
    border-radius: ${borderRadius.full};
`;

const SliderFill = styled.div<{ percentage: number; journey?: string }>`
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${(props) => props.percentage}%;
    background-color: ${(props) => getJourneyColor(props.journey)};
    border-radius: ${borderRadius.full};
    transition: width 0.1s ease-out;
`;

const SliderInput = styled.input`
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 100%;
    height: ${spacing.lg};
    margin: 0;
    opacity: 0;
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    z-index: 2;
`;

const SliderThumb = styled.div<{ percentage: number; journey?: string; disabled?: boolean }>`
    position: absolute;
    top: 50%;
    left: ${(props) => props.percentage}%;
    transform: translate(-50%, -50%);
    width: ${spacing.lg};
    height: ${spacing.lg};
    background-color: ${(props) => (props.disabled ? colors.neutral.gray500 : getJourneyColor(props.journey))};
    border: 2px solid ${colors.neutral.white};
    border-radius: ${borderRadius.full};
    box-shadow: ${shadows.sm};
    pointer-events: none;
    transition: left 0.1s ease-out;
`;

const ValueLabel = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.sm};
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.neutral.gray700};
    text-align: center;
`;

export const Slider: React.FC<SliderProps> = ({
    min = 0,
    max = 100,
    step = 1,
    value,
    onChange,
    disabled = false,
    showValue = false,
    journey,
    accessibilityLabel = 'Slider',
}) => {
    const percentage = ((value - min) / (max - min)) * 100;

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(Number(e.target.value));
        },
        [onChange]
    );

    return (
        <SliderContainer data-testid="slider">
            <SliderTrack data-testid="slider-track">
                <SliderFill percentage={percentage} journey={journey} data-testid="slider-fill" />
                <SliderThumb percentage={percentage} journey={journey} disabled={disabled} data-testid="slider-thumb" />
                <SliderInput
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    aria-label={accessibilityLabel}
                    aria-valuenow={value}
                    aria-valuemin={min}
                    aria-valuemax={max}
                    data-testid="slider-input"
                />
            </SliderTrack>
            {showValue && <ValueLabel data-testid="slider-value">{value}</ValueLabel>}
        </SliderContainer>
    );
};
