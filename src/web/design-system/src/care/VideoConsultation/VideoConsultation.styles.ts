import styled, { css } from 'styled-components';
import { Box } from '../../primitives/Box';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { borderRadius } from '../../tokens/borderRadius';

// Shared styles for video containers
const videoContainerStyles = css`
    overflow: hidden;
    background-color: ${colors.neutral.gray800};
    position: relative;
    border-radius: ${borderRadius.lg};
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

// Different button style variants for call controls
const buttonVariants = {
    primary: css`
        background-color: ${colors.journeys.care.primary};
        color: ${colors.neutral.white};

        &:hover {
            background-color: ${colors.journeys.care.secondary};
        }

        &:active {
            background-color: ${colors.journeys.care.accent};
        }
    `,
    danger: css`
        background-color: ${colors.semantic.error};
        color: ${colors.neutral.white};

        &:hover,
        &:active {
            background-color: #d32f2f;
        }
    `,
    muted: css`
        background-color: ${colors.semantic.error};
        color: ${colors.neutral.white};

        &:hover,
        &:active {
            background-color: #d32f2f;
        }
    `,
    unmuted: css`
        background-color: ${colors.journeys.care.primary};
        color: ${colors.neutral.white};

        &:hover {
            background-color: ${colors.journeys.care.secondary};
        }

        &:active {
            background-color: ${colors.journeys.care.accent};
        }
    `,
    disabled: css`
        background-color: ${colors.neutral.gray400};
        color: ${colors.neutral.gray600};
        cursor: not-allowed;

        &:hover,
        &:active {
            background-color: ${colors.neutral.gray400};
        }
    `,
};

// Main container for the video consultation interface
export const VideoContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: ${colors.neutral.gray900};
    position: relative;
    overflow: hidden;

    @media (min-width: 992px) {
        border-radius: ${borderRadius.xl};
        max-height: 80vh;
    }
`;

// Container for the remote video (provider)
export const RemoteVideoContainer = styled.div`
    ${videoContainerStyles}
    width: 100%;
    height: 100%;
    min-height: 60vh;
    flex: 1;
    z-index: 1;

    video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

// Container for the local video (user)
export const LocalVideoContainer = styled.div`
    ${videoContainerStyles}
    position: absolute;
    width: 30%;
    height: 25%;
    max-width: 180px;
    max-height: 150px;
    bottom: ${spacing.xl};
    right: ${spacing.xl};
    z-index: 10;
    border: 2px solid ${colors.neutral.white};

    video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: scaleX(-1); /* Mirror the local video */
    }
`;

// Container for the call control buttons
export const ControlsContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: ${spacing.md};
    background-color: rgba(0, 0, 0, 0.5);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    gap: ${spacing.md};
    z-index: 10;

    @media (min-width: 992px) {
        padding: ${spacing.xl};
        gap: ${spacing.xl};
    }
`;

// Individual call control button
export const CallButton = styled.button<{ variant?: keyof typeof buttonVariants }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    outline: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    ${(props) => buttonVariants[props.variant || 'primary']}

    &:focus-visible {
        box-shadow: 0 0 0 2px ${colors.journeys.care.accent};
    }

    @media (min-width: 992px) {
        width: 60px;
        height: 60px;
    }
`;

// Status indicator for connection status
export const StatusIndicator = styled.div<{ status: 'connecting' | 'connected' | 'reconnecting' | 'disconnected' }>`
    position: absolute;
    top: ${spacing.md};
    left: ${spacing.md};
    padding: ${spacing['3xs']} ${spacing.xs};
    border-radius: ${borderRadius.md};
    font-size: 12px;
    font-weight: 500;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: ${spacing['3xs']};

    ${(props) => {
        switch (props.status) {
            case 'connected':
                return css`
                    background-color: ${colors.semantic.success};
                    color: ${colors.neutral.white};
                `;
            case 'connecting':
                return css`
                    background-color: ${colors.journeys.care.primary};
                    color: ${colors.neutral.white};
                `;
            case 'reconnecting':
                return css`
                    background-color: ${colors.semantic.warning};
                    color: ${colors.neutral.gray900};
                `;
            case 'disconnected':
                return css`
                    background-color: ${colors.semantic.error};
                    color: ${colors.neutral.white};
                `;
            default:
                return '';
        }
    }}

    &::before {
        content: '';
        display: block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: currentColor;

        ${(props) =>
            props.status === 'connecting' || props.status === 'reconnecting'
                ? css`
                      animation: pulse 1.5s infinite;
                      @keyframes pulse {
                          0% {
                              opacity: 0.4;
                          }
                          50% {
                              opacity: 1;
                          }
                          100% {
                              opacity: 0.4;
                          }
                      }
                  `
                : ''}
    }
`;

// Container for provider information
export const ProviderInfoContainer = styled.div`
    position: absolute;
    top: ${spacing.md};
    right: ${spacing.md};
    padding: ${spacing.xs} ${spacing.md};
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: ${borderRadius.md};
    color: ${colors.neutral.white};
    z-index: 10;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: ${spacing.xs};

    img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
    }
`;

// Connection quality indicator
export const ConnectionQualityIndicator = styled.div<{ quality: 'excellent' | 'good' | 'fair' | 'poor' }>`
    display: flex;
    align-items: center;
    gap: ${spacing['3xs']};
    padding: ${spacing['3xs']} ${spacing.xs};
    border-radius: ${borderRadius.md};
    font-size: 12px;
    position: absolute;
    bottom: ${spacing.md};
    left: ${spacing.md};
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.5);
    color: ${colors.neutral.white};

    /* Visual bars for connection quality */
    .bars {
        display: flex;
        gap: 2px;
        align-items: flex-end;
        height: 12px;
    }

    .bar {
        width: 3px;
        background-color: currentColor;
        border-radius: 1px;
    }

    ${(props) => {
        switch (props.quality) {
            case 'excellent':
                return css`
                    color: ${colors.semantic.success};
                    .bar-1 {
                        height: 3px;
                    }
                    .bar-2 {
                        height: 6px;
                    }
                    .bar-3 {
                        height: 9px;
                    }
                    .bar-4 {
                        height: 12px;
                    }
                `;
            case 'good':
                return css`
                    color: ${colors.semantic.success};
                    .bar-1 {
                        height: 3px;
                    }
                    .bar-2 {
                        height: 6px;
                    }
                    .bar-3 {
                        height: 9px;
                    }
                    .bar-4 {
                        height: 3px;
                        opacity: 0.3;
                    }
                `;
            case 'fair':
                return css`
                    color: ${colors.semantic.warning};
                    .bar-1 {
                        height: 3px;
                    }
                    .bar-2 {
                        height: 6px;
                    }
                    .bar-3 {
                        height: 3px;
                        opacity: 0.3;
                    }
                    .bar-4 {
                        height: 3px;
                        opacity: 0.3;
                    }
                `;
            case 'poor':
                return css`
                    color: ${colors.semantic.error};
                    .bar-1 {
                        height: 3px;
                    }
                    .bar-2 {
                        height: 3px;
                        opacity: 0.3;
                    }
                    .bar-3 {
                        height: 3px;
                        opacity: 0.3;
                    }
                    .bar-4 {
                        height: 3px;
                        opacity: 0.3;
                    }
                `;
            default:
                return '';
        }
    }}
`;
