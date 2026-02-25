import styled from 'styled-components';
import { Card } from '../../components/Card/Card';
import { Box } from '../../primitives/Box/Box';
import { Text } from '../../primitives/Text/Text';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';
import { borderRadius } from '../../tokens/borderRadius';

/**
 * The main container for the DeviceCard component, extending the Card component
 * with Health journey-specific styling
 */
export const DeviceCardContainer = styled(Card)`
  margin-bottom: ${props => props.theme.spacing.md};
  border-left: 4px solid ${props => props.theme.colors.journeys.health.primary};
  background-color: ${props => props.theme.colors.neutral.white};
  transition: all ${props => props.theme.animation.duration.normal} ease-in-out;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

/**
 * Header section of the DeviceCard containing the device name and connection status
 */
export const DeviceCardHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

/**
 * Styled component for the device name text
 */
export const DeviceName = styled(Text)`
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.neutral.gray900};
  margin: 0;
`;

/**
 * Props for the ConnectionStatus component
 */
interface ConnectionStatusProps {
  connected: boolean;
}

/**
 * Styled component for the connection status text with conditional styling based on connection state
 */
export const ConnectionStatus = styled(Text)<ConnectionStatusProps>`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.connected ? props.theme.colors.semantic.success : props.theme.colors.semantic.error};
  display: flex;
  align-items: center;
  
  & svg {
    margin-right: ${props => props.theme.spacing.xs};
  }
`;

/**
 * Container for the last sync information
 */
export const LastSyncContainer = styled(Box)`
  margin-top: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.neutral.gray600};
`;

/**
 * Container for the device type icon
 */
export const DeviceIconContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.full};
  background-color: ${props => props.theme.colors.journeys.health.background};
  color: ${props => props.theme.colors.journeys.health.primary};
  margin-right: ${props => props.theme.spacing.md};
`;

/**
 * Container for the device details section
 */
export const DeviceDetails = styled(Box)`
  display: flex;
  margin-top: ${props => props.theme.spacing.md};
  align-items: flex-start;
`;