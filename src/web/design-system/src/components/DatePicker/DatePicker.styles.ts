import styled, { DefaultTheme } from 'styled-components';

type JourneyKey = 'health' | 'care' | 'plan';

// Define the props that can be passed to the DatePicker components
interface DatePickerProps {
    journey?: JourneyKey;
}

interface DatePickerButtonProps extends DatePickerProps {
    selected?: boolean;
    disabled?: boolean;
    today?: boolean;
}

/**
 * Helper to safely get a journey color from the theme, with fallback to brand color
 */
const getJourneyThemeColor = (
    theme: DefaultTheme,
    journey: JourneyKey | undefined,
    colorKey: 'primary' | 'secondary'
): string => {
    if (journey && theme.colors.journeys[journey]) {
        return theme.colors.journeys[journey][colorKey];
    }
    return theme.colors.brand[colorKey];
};

// Main container for the DatePicker
export const DatePickerContainer = styled.div<DatePickerProps>`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 320px;
    background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.neutral.white};
    border-radius: ${({ theme }: { theme: DefaultTheme }) => theme.borderRadius.md};
    box-shadow: ${({ theme }: { theme: DefaultTheme }) => theme.shadows.md};
    overflow: hidden;
    border: 1px solid ${({ theme }: { theme: DefaultTheme }) => theme.colors.neutral.gray300};
    font-family: ${({ theme }: { theme: DefaultTheme }) => theme.typography.fontFamily.base};
`;

// Header of the DatePicker with month/year display and navigation
export const DatePickerHeader = styled.div<DatePickerProps>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${({ theme }: { theme: DefaultTheme }) => theme.spacing.md};
    background-color: ${({ theme, journey }: { theme: DefaultTheme; journey?: JourneyKey }) =>
        getJourneyThemeColor(theme, journey, 'primary')};
    color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.neutral.white};
    font-weight: ${({ theme }: { theme: DefaultTheme }) => theme.typography.fontWeight.medium};
    font-size: ${({ theme }: { theme: DefaultTheme }) => theme.typography.fontSize.lg};
`;

// Body of the DatePicker containing the calendar
export const DatePickerBody = styled.div<DatePickerProps>`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: ${({ theme }: { theme: DefaultTheme }) => theme.spacing.xs};
    padding: ${({ theme }: { theme: DefaultTheme }) => theme.spacing.md};
`;

// Footer of the DatePicker with action buttons
export const DatePickerFooter = styled.div<DatePickerProps>`
    display: flex;
    justify-content: flex-end;
    padding: ${({ theme }: { theme: DefaultTheme }) => theme.spacing.md};
    border-top: 1px solid ${({ theme }: { theme: DefaultTheme }) => theme.colors.neutral.gray300};
    gap: ${({ theme }: { theme: DefaultTheme }) => theme.spacing.md};
`;

// Button used in the DatePicker
export const DatePickerButton = styled.button<DatePickerButtonProps>`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 36px;
    height: 36px;
    border-radius: ${({ theme }: { theme: DefaultTheme }) => theme.borderRadius.full};
    border: none;
    cursor: pointer;
    font-size: ${({ theme }: { theme: DefaultTheme }) => theme.typography.fontSize.md};

    /* Default state */
    background-color: transparent;
    color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.neutral.gray800};

    /* Selected state */
    ${({ selected, theme, journey }: { selected?: boolean; theme: DefaultTheme; journey?: JourneyKey }) =>
        selected &&
        `
    background-color: ${getJourneyThemeColor(theme, journey, 'primary')};
    color: ${theme.colors.neutral.white};
  `}

    /* Today state */
  ${({
        today,
        selected,
        theme,
        journey,
    }: {
        today?: boolean;
        selected?: boolean;
        theme: DefaultTheme;
        journey?: JourneyKey;
    }) =>
        today &&
        !selected &&
        `
    border: 2px solid ${getJourneyThemeColor(theme, journey, 'primary')};
  `}

  /* Disabled state */
  ${({ disabled }: { disabled?: boolean }) =>
        disabled &&
        `
    opacity: 0.4;
    cursor: not-allowed;
  `}

  /* Hover state (when not disabled) */
  &:hover:not(:disabled) {
        background-color: ${({
            theme,
            selected,
            journey,
        }: {
            theme: DefaultTheme;
            selected?: boolean;
            journey?: JourneyKey;
        }) => (selected ? getJourneyThemeColor(theme, journey, 'secondary') : theme.colors.neutral.gray200)};
    }

    /* Focus state */
    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px
            ${({ theme, journey }: { theme: DefaultTheme; journey?: JourneyKey }) =>
                getJourneyThemeColor(theme, journey, 'primary')};
    }

    /* Transition for smooth state changes */
    transition: all 0.2s ease-in-out;
`;
