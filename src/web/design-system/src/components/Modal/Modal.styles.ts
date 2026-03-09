import styled from 'styled-components';

import { Box } from '../../primitives/Box';
import { animation, spacing, shadows, mediaQueries, colors } from '../../tokens';

// Styled component for the modal backdrop that covers the entire screen with a semi-transparent background
export const ModalBackdrop = styled(Box)<{ visible?: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition:
        opacity ${animation.duration.normal} ${animation.easing.easeInOut},
        visibility ${animation.duration.normal} ${animation.easing.easeInOut};

    ${({ visible }) =>
        visible &&
        `
    opacity: 1;
    visibility: visible;
  `}
`;

// Styled component for the modal container with appropriate styling and animations
export const ModalContainer = styled(Box)<{ visible?: boolean }>`
    background-color: white;
    border-radius: md;
    box-shadow: ${shadows.lg};
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    transform: translateY(20px);
    opacity: 0;
    transition:
        transform ${animation.duration.normal} ${animation.easing.easeOut},
        opacity ${animation.duration.normal} ${animation.easing.easeOut};

    ${({ visible }) =>
        visible &&
        `
    transform: translateY(0);
    opacity: 1;
  `}

    @media ${mediaQueries.sm} {
        width: 80%;
    }

    @media ${mediaQueries.md} {
        width: 70%;
    }

    @media ${mediaQueries.lg} {
        width: 60%;
    }
`;

// Styled component for the modal header section containing the title
export const ModalHeader = styled(Box)`
    padding: ${spacing.md} ${spacing.lg};
    border-bottom: 1px solid ${colors.neutral.gray200};
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

// Styled component for the modal content section
export const ModalContent = styled(Box)`
    padding: ${spacing.lg};
    overflow-y: auto;
`;

// Styled component for the modal actions section containing buttons
export const ModalActions = styled(Box)`
    padding: ${spacing.md} ${spacing.lg};
    border-top: 1px solid ${colors.neutral.gray200};
    display: flex;
    justify-content: flex-end;
    gap: ${spacing.sm};
`;
