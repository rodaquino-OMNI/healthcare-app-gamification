import styled from 'styled-components';
import type { ThemeProps } from 'styled-components';

export const ProviderCardContainer = styled.div`
  background-color: #FFFFFF;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-left: 4px solid ${props => props.theme.colors.journeys.care.primary};
`;

export const ProviderName = styled.h3`
  font-size: 18px;
  font-weight: 500;
  color: #333;
`;

export const ProviderSpecialty = styled.p`
  font-size: 14px;
  color: #666;
`;

export const ProviderLocation = styled.p`
  font-size: 14px;
  color: #666;
`;

export const AvailabilityInfo = styled.p`
  font-size: 12px;
  color: #999;
`;

export const AppointmentButton = styled.button`
  background-color: ${props => props.theme.colors.journeys.care.primary};
  color: #FFFFFF;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.journeys.care.accent};
  }
`;