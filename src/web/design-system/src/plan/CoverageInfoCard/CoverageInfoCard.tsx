import React from 'react';
import styled from 'styled-components';
import { Card } from '../components/Card/Card';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';
import { borderRadius } from '../../tokens/borderRadius';
import { Coverage } from 'src/web/shared/types/plan.types';

/**
 * Interface defining the props for the CoverageInfoCard component
 */
export interface CoverageInfoCardProps {
  coverage: Coverage;
}

// Styled components for the card contents
const CoverageTitle = styled.h3`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.medium};
  margin: 0 0 ${spacing.sm} 0;
  color: ${colors.journeys.plan.primary};
`;

const CoverageDetails = styled.p`
  font-family: ${typography.fontFamily.base};
  font-size: ${typography.fontSize.md};
  line-height: ${typography.lineHeight.base};
  margin: 0 0 ${spacing.md} 0;
  color: ${colors.neutral.gray800};
`;

const CoverageLimitations = styled.div`
  padding: ${spacing.sm};
  background-color: ${colors.neutral.gray100};
  border-radius: ${borderRadius.xs};
  margin: ${spacing.sm} 0;
  font-size: ${typography.fontSize.sm};
  color: ${colors.neutral.gray700};
`;

const CoPaymentBadge = styled.div`
  display: inline-block;
  padding: ${spacing.xs} ${spacing.sm};
  background-color: ${colors.journeys.plan.secondary};
  color: ${colors.neutral.white};
  border-radius: ${borderRadius.xs};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  margin-top: ${spacing.sm};
`;

// Map coverage types to human-readable names
const coverageTypeNames: Record<string, string> = {
  medical_visit: 'Consulta Médica',
  specialist_visit: 'Consulta com Especialista',
  emergency_care: 'Atendimento de Emergência',
  preventive_care: 'Cuidados Preventivos',
  prescription_drugs: 'Medicamentos com Receita',
  mental_health: 'Saúde Mental',
  rehabilitation: 'Reabilitação',
  durable_medical_equipment: 'Equipamentos Médicos Duráveis',
  lab_tests: 'Exames Laboratoriais',
  imaging: 'Exames de Imagem',
  other: 'Outros Serviços'
};

/**
 * A component that displays insurance coverage information in a card format.
 * Designed for the Plan journey, it shows coverage type, details, limitations,
 * and co-payment information if available.
 */
export const CoverageInfoCard: React.FC<CoverageInfoCardProps> = ({ coverage }) => {
  // Get the human-readable coverage type name
  const coverageName = coverageTypeNames[coverage.type] || coverage.type;
  
  return (
    <Card 
      journey="plan" 
      elevation="sm"
      accessibilityLabel={`Coverage information for ${coverageName}`}
    >
      <CoverageTitle>{coverageName}</CoverageTitle>
      <CoverageDetails>{coverage.details}</CoverageDetails>
      
      {coverage.limitations && (
        <CoverageLimitations>
          <strong>Limitações:</strong> {coverage.limitations}
        </CoverageLimitations>
      )}
      
      {coverage.coPayment !== undefined && (
        <CoPaymentBadge>
          Copagamento: R$ {coverage.coPayment.toFixed(2)}
        </CoPaymentBadge>
      )}
    </Card>
  );
};