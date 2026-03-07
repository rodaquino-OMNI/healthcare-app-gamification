import styled from 'styled-components';

export const RadioButtonContainer = styled.div<{
    disabled?: boolean;
    journey?: string;
}>`
    display: flex;
    align-items: center;
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
    margin-bottom: ${({ theme }) => theme.spacing?.xs || '8px'};
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
            ${({ theme, journey }) => {
                if (journey && theme.colors?.journeys?.[journey]?.primary) {
                    return theme.colors.journeys[journey].primary;
                }
                return theme.colors?.neutral?.gray600 || '#757575';
            }};
        margin-right: ${({ theme }) => theme.spacing?.xs || '8px'};
        transition: all 0.2s ease-in-out;
        box-sizing: border-box;
    }

    &:checked + label::before {
        border-width: 6px;
        background-color: white;
    }

    &:focus + label::before {
        box-shadow: 0 0 0 2px
            ${({ theme, journey }) => {
                const color =
                    journey && theme.colors?.journeys?.[journey]?.primary
                        ? theme.colors.journeys[journey].primary
                        : theme.colors?.neutral?.gray600 || '#757575';
                return `${color}40`; // 40 is hex for 25% opacity
            }};
    }

    &:disabled + label::before {
        border-color: ${({ theme }) => theme.colors?.neutral?.gray400 || '#BDBDBD'};
        background-color: ${({ theme }) => theme.colors?.neutral?.gray200 || '#EEEEEE'};
    }

    &:hover:not(:disabled) + label::before {
        border-color: ${({ theme, journey }) => {
            if (journey && theme.colors?.journeys?.[journey]?.secondary) {
                return theme.colors.journeys[journey].secondary;
            }
            return theme.colors?.neutral?.gray800 || '#424242';
        }};
    }
`;

export const RadioButtonLabel = styled.label<{
    disabled?: boolean;
}>`
    display: flex;
    align-items: center;
    font-family: ${({ theme }) => theme.typography?.fontFamily?.base || 'Roboto, sans-serif'};
    font-size: ${({ theme }) => theme.typography?.fontSize?.md || '16px'};
    line-height: ${({ theme }) => theme.typography?.lineHeight?.base || 1.5};
    color: ${({ theme, disabled }) =>
        disabled ? theme.colors?.neutral?.gray600 || '#757575' : theme.colors?.neutral?.gray900 || '#212121'};
    user-select: none;
`;
