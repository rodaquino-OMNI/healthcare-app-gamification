import styled from 'styled-components'; // styled-components v6.1.8

/**
 * Container for the input field and label
 */
export const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    width: 100%;
`;

/**
 * Label for the input field
 */
export const InputLabel = styled.label`
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.neutral.gray700};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

interface InputFieldProps {
    journey?: 'health' | 'care' | 'plan';
}

/**
 * The actual input field
 */
export const InputField = styled.input<InputFieldProps>`
    padding: ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    border: 1px solid ${({ theme }) => theme.colors.neutral.gray300};
    outline: none;
    color: ${({ theme }) => theme.colors.neutral.gray700};
    width: 100%;
    box-sizing: border-box;

    &:focus {
        border-color: ${({ theme }) => theme.colors.brand.primary};
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.brand.primary}25;
    }

    &:disabled {
        background-color: ${({ theme }) => theme.colors.neutral.gray100};
        cursor: not-allowed;
    }

    &::placeholder {
        color: ${({ theme }) => theme.colors.neutral.gray500};
    }
`;
