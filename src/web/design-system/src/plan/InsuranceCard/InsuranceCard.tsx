import React from 'react';
import styled from 'styled-components';

import {} from './InsuranceCard.styles';
import { Card } from '../../components/Card/Card';
import { Box } from '../../primitives/Box/Box';
import { Text } from '../../primitives/Text/Text';
import { borderRadius } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';

/**
 * Plan data for the insurance card
 */
interface InsurancePlan {
    /** Unique identifier for the plan */
    id: string;
    /** Display name of the plan */
    name: string;
    /** Plan type (e.g., Individual, Family) */
    type: string;
    /** Plan number for identification */
    planNumber: string;
    /** Start date of the plan validity (ISO format) */
    validityStart: string;
    /** End date of the plan validity (ISO format) */
    validityEnd: string;
}

/**
 * User data for the insurance card
 */
interface InsuranceUser {
    /** Unique identifier for the user */
    id: string;
    /** Full name of the user */
    name: string;
    /** CPF (Brazilian individual taxpayer registry) */
    cpf: string;
}

/**
 * Props interface for the InsuranceCard component
 */
export interface InsuranceCardProps {
    /** Plan data to display on the card */
    plan: InsurancePlan;
    /** User data to display on the card */
    user: InsuranceUser;
    /** Callback fired when the share button is pressed */
    onShare: () => void;
}

/**
 * Formats a date string from ISO format to Brazilian date format (DD/MM/YYYY)
 */
const formatDateBR = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
};

/**
 * Styled components for internal layout
 */
const FieldRow = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: ${spacing.xs};
`;

const FieldLabel = styled.span`
    font-size: ${typography.fontSize.sm};
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.neutral.gray600};
    margin-bottom: ${spacing['4xs']};
`;

const FieldValue = styled.span`
    font-size: ${typography.fontSize.md};
    font-weight: ${typography.fontWeight.regular};
    color: ${colors.neutral.gray900};
`;

const ShareButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    padding-top: ${spacing.sm};
`;

const InstructionsText = styled.p`
    font-size: ${typography.fontSize.sm};
    color: ${colors.neutral.gray600};
    margin: ${spacing.sm} 0 0 0;
    line-height: 1.5;
`;

/**
 * InsuranceCard component for the AUSTA SuperApp Plan journey.
 * Displays a digital representation of a user's insurance card including
 * plan details, member information, and a share action.
 *
 * @example
 * <InsuranceCard
 *   plan={{
 *     id: '1', name: 'Plano Essencial', type: 'Individual',
 *     planNumber: '123456', validityStart: '2023-01-01',
 *     validityEnd: '2023-12-31',
 *   }}
 *   user={{ id: '1', name: 'Maria Silva', cpf: '123.456.789-00' }}
 *   onShare={() => handleShare()}
 * />
 */
export const InsuranceCard: React.FC<InsuranceCardProps> = ({ plan, user, onShare }) => {
    const validityRange = `${formatDateBR(plan.validityStart)} - ${formatDateBR(plan.validityEnd)}`;

    return (
        <Card
            journey="plan"
            elevation="md"
            borderRadius="lg"
            accessibilityLabel={`Cart\u00e3o do plano ${plan.name}`}
            aria-label={`Cart\u00e3o do plano ${plan.name}`}
        >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Text fontWeight="bold" fontSize="lg">
                    {`Cart\u00e3o do Plano`}
                </Text>

                <div style={{ display: 'flex', flexDirection: 'column', marginTop: spacing.sm }}>
                    <Text fontWeight="bold" fontSize="xl">
                        {plan.name}
                    </Text>
                    <Text fontSize="md" color={colors.neutral.gray600}>
                        {plan.type}
                    </Text>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', marginTop: spacing.md }}>
                    <FieldRow>
                        <FieldLabel>Titular</FieldLabel>
                        <FieldValue>{user.name}</FieldValue>
                    </FieldRow>

                    <FieldRow>
                        <FieldLabel>{`N\u00famero do Plano`}</FieldLabel>
                        <FieldValue>{plan.planNumber}</FieldValue>
                    </FieldRow>

                    <FieldRow>
                        <FieldLabel>CPF</FieldLabel>
                        <FieldValue>{user.cpf}</FieldValue>
                    </FieldRow>

                    <FieldRow>
                        <FieldLabel>Validade</FieldLabel>
                        <FieldValue>{validityRange}</FieldValue>
                    </FieldRow>
                </div>

                <InstructionsText>
                    {`Para utilizar seu plano, apresente este cart\u00e3o digital na rede credenciada.`}
                </InstructionsText>

                <ShareButtonWrapper>
                    <Box
                        backgroundColor="journeys.plan.secondary"
                        onClick={onShare}
                        aria-label={`Compartilhar cart\u00e3o do plano`}
                        role="button"
                        style={{
                            padding: `${spacing.sm} ${spacing.md}`,
                            borderRadius: borderRadius.md,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text fontWeight="medium" color={colors.neutral.white}>
                            Compartilhar
                        </Text>
                    </Box>
                </ShareButtonWrapper>
            </div>
        </Card>
    );
};

export default InsuranceCard;
