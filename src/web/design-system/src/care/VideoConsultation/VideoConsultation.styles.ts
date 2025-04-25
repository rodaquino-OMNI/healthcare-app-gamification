import styled, { css } from 'styled-components';
import { Box } from '../../primitives/Box';

// Shared styles for video containers
const videoContainerStyles = css`
  overflow: hidden;
  background-color: #424242; /* neutral.gray800 */
  position: relative;
  border-radius: 16px; /* spacing.md */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* shadows.md */
`;

// Different button style variants for call controls
const buttonVariants = {
  primary: css`
    background-color: #FF8C42; /* journeys.care.primary */
    color: #FFFFFF; /* neutral.white */
    
    &:hover {
      background-color: #F17C3A; /* journeys.care.secondary */
    }
    
    &:active {
      background-color: #E55A00; /* journeys.care.accent */
    }
  `,
  danger: css`
    background-color: #FF3B30; /* semantic.error */
    color: #FFFFFF; /* neutral.white */
    
    &:hover, &:active {
      background-color: #D32F2F;
    }
  `,
  muted: css`
    background-color: #FF3B30; /* semantic.error */
    color: #FFFFFF; /* neutral.white */
    
    &:hover, &:active {
      background-color: #D32F2F;
    }
  `,
  unmuted: css`
    background-color: #FF8C42; /* journeys.care.primary */
    color: #FFFFFF; /* neutral.white */
    
    &:hover {
      background-color: #F17C3A; /* journeys.care.secondary */
    }
    
    &:active {
      background-color: #E55A00; /* journeys.care.accent */
    }
  `,
  disabled: css`
    background-color: #BDBDBD; /* neutral.gray400 */
    color: #757575; /* neutral.gray600 */
    cursor: not-allowed;
    
    &:hover, &:active {
      background-color: #BDBDBD; /* neutral.gray400 */
    }
  `,
};

// Main container for the video consultation interface
export const VideoContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #212121; /* neutral.gray900 */
  position: relative;
  overflow: hidden;
  
  @media (min-width: 992px) { /* mediaQueries.md */
    border-radius: 24px; /* spacing.lg */
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
  bottom: 24px; /* spacing.lg */
  right: 24px; /* spacing.lg */
  z-index: 10;
  border: 2px solid #FFFFFF; /* neutral.white */
  
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
  padding: 16px; /* spacing.md */
  background-color: rgba(0, 0, 0, 0.5);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  gap: 16px; /* spacing.md */
  z-index: 10;
  
  @media (min-width: 992px) { /* mediaQueries.md */
    padding: 24px; /* spacing.lg */
    gap: 24px; /* spacing.lg */
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
  ${props => buttonVariants[props.variant || 'primary']}
  
  &:focus-visible {
    box-shadow: 0 0 0 2px #E55A00; /* journeys.care.accent */
  }
  
  @media (min-width: 992px) { /* mediaQueries.md */
    width: 60px;
    height: 60px;
  }
`;

// Status indicator for connection status
export const StatusIndicator = styled.div<{ status: 'connecting' | 'connected' | 'reconnecting' | 'disconnected' }>`
  position: absolute;
  top: 16px; /* spacing.md */
  left: 16px; /* spacing.md */
  padding: 4px 8px; /* spacing.xs spacing.sm */
  border-radius: 8px; /* spacing.sm */
  font-size: 12px;
  font-weight: 500;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 4px; /* spacing.xs */
  
  ${props => {
    switch (props.status) {
      case 'connected':
        return css`
          background-color: #00C853; /* semantic.success */
          color: #FFFFFF; /* neutral.white */
        `;
      case 'connecting':
        return css`
          background-color: #FF8C42; /* journeys.care.primary */
          color: #FFFFFF; /* neutral.white */
        `;
      case 'reconnecting':
        return css`
          background-color: #FFD600; /* semantic.warning */
          color: #212121; /* neutral.gray900 */
        `;
      case 'disconnected':
        return css`
          background-color: #FF3B30; /* semantic.error */
          color: #FFFFFF; /* neutral.white */
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
    
    ${props => 
      props.status === 'connecting' || props.status === 'reconnecting' 
        ? css`
            animation: pulse 1.5s infinite;
            @keyframes pulse {
              0% { opacity: 0.4; }
              50% { opacity: 1; }
              100% { opacity: 0.4; }
            }
          `
        : ''
    }
  }
`;

// Container for provider information
export const ProviderInfoContainer = styled.div`
  position: absolute;
  top: 16px; /* spacing.md */
  right: 16px; /* spacing.md */
  padding: 8px 16px; /* spacing.sm spacing.md */
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 8px; /* spacing.sm */
  color: #FFFFFF; /* neutral.white */
  z-index: 10;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px; /* spacing.sm */
  
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
  gap: 4px; /* spacing.xs */
  padding: 4px 8px; /* spacing.xs spacing.sm */
  border-radius: 8px; /* spacing.sm */
  font-size: 12px;
  position: absolute;
  bottom: 16px; /* spacing.md */
  left: 16px; /* spacing.md */
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
  color: #FFFFFF; /* neutral.white */
  
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
  
  ${props => {
    switch (props.quality) {
      case 'excellent':
        return css`
          color: #00C853; /* semantic.success */
          .bar-1 { height: 3px; }
          .bar-2 { height: 6px; }
          .bar-3 { height: 9px; }
          .bar-4 { height: 12px; }
        `;
      case 'good':
        return css`
          color: #00C853; /* semantic.success */
          .bar-1 { height: 3px; }
          .bar-2 { height: 6px; }
          .bar-3 { height: 9px; }
          .bar-4 { height: 3px; opacity: 0.3; }
        `;
      case 'fair':
        return css`
          color: #FFD600; /* semantic.warning */
          .bar-1 { height: 3px; }
          .bar-2 { height: 6px; }
          .bar-3 { height: 3px; opacity: 0.3; }
          .bar-4 { height: 3px; opacity: 0.3; }
        `;
      case 'poor':
        return css`
          color: #FF3B30; /* semantic.error */
          .bar-1 { height: 3px; }
          .bar-2 { height: 3px; opacity: 0.3; }
          .bar-3 { height: 3px; opacity: 0.3; }
          .bar-4 { height: 3px; opacity: 0.3; }
        `;
      default:
        return '';
    }
  }}
`;