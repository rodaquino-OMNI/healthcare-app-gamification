import styled from 'styled-components';
import { ThemeProps } from 'styled-components';

export const MedicationCardContainer = styled.div`
  background-color: #FFFFFF;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const MedicationName = styled.h3`
  font-size: 18px;
  font-weight: 500;
  color: #333;
`;

export const MedicationDosage = styled.p`
  font-size: 14px;
  color: #666;
`;

export const MedicationSchedule = styled.p`
  font-size: 14px;
  color: #666;
`;

export const MedicationStatus = styled.p`
  font-size: 14px;
  color: #666;
  margin-top: 8px;
`;