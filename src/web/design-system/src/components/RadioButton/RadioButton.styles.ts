import styled, { DefaultTheme } from 'styled-components';

/**
 * Helper to safely get a journey color from the theme
 */
const getRadioJourneyColor = (
    theme: DefaultTheme,
    journey: string | undefined,
    colorKey: 'primary' | 'secondary'
): string | undefined => {
    if (journey && (journey === 'health' || journey === 'care' || journey === 'plan')) {
        return theme.colors.journeys[journey][colorKey];
    }
    return undefined;
};

export const RadioButtonContainer = styled.div<{
    disabled?: boolean;
    journey?: string;
}>`
    display: flex;
    align-items: center;
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
    margin-bottom: ${({ theme }: { theme: DefaultTheme }) => theme.spacing.xs};
    position: relative;
`;

export const RadioButtonInput = styled.input.attrs({ type: 'radio' })<{
    journey?: string;
}>`
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    margin: 0;

    & + label::before {
        content: '';
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid
            ${({ theme, journey }: { theme: DefaultTheme; journey?: string }) =>
                getRadioJourneyColor(theme, journey, 'primary') || theme.colors.neutral.gray600};
        margin-right: ${({ theme }: { theme: DefaultTheme }) => theme.spacing.xs};
        transition: all 0.2s ease-in-out;
        box-sizing: border-box;
    }

    &:checked + label::before {
        border-width: 6px;
        background-color: white;
    }

    &:focus + label::before {
        box-shadow: 0 0 0 2px
            ${({ theme, journey }: { theme: DefaultTheme; journey?: string }) => {
                const color: string = getRadioJourneyColor(theme, journey, 'primary') || theme.colors.neutral.gray600;
                return `${color}40`; // 40 is hex for 25% opacity
            }};
    }

    &:disabled + label::before {
        border-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.neutral.gray400};
        background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.neutral.gray200};
    }

    &:hover:not(:disabled) + label::before {
        border-color: ${({ theme, journey }: { theme: DefaultTheme; journey?: string }) =>
            getRadioJourneyColor(theme, journey, 'secondary') || theme.colors.neutral.gray800};
    }
`;

export const RadioButtonLabel = styled.label<{
    disabled?: boolean;
}>`
    display: flex;
    align-items: center;
    font-family: ${({ theme }: { theme: DefaultTheme }) => theme.typography.fontFamily.base};
    font-size: ${({ theme }: { theme: DefaultTheme }) => theme.typography.fontSize.md};
    line-height: ${({ theme }: { theme: DefaultTheme }) => theme.typography.lineHeight.base};
    color: ${({ theme, disabled }: { theme: DefaultTheme; disabled?: boolean }) =>
        disabled ? theme.colors.neutral.gray600 : theme.colors.neutral.gray900};
    user-select: none;
`;
