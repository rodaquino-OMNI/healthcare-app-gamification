import React from 'react';
import styled from 'styled-components';
import { Card } from '../../components/Card/Card';
import { Text } from '../../primitives/Text/Text';
import { Icon } from '../../primitives/Icon/Icon';
import { colors } from '../../tokens/colors';
import { sizing } from '../../tokens/sizing';

/**
 * Interface defining the props for the MedicationCard component
 */
export interface MedicationCardProps {
    /** Name of the medication */
    name: string;
    /** Medication dosage information */
    dosage: string;
    /** Schedule for taking the medication */
    schedule: string;
    /** Whether medication adherence is being followed */
    adherence: boolean;
}

const Container = styled.div`
    display: flex;
    align-items: center;
`;

const MedicationDetails = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-left: ${(props) => props.theme.spacing.sm};
`;

const AdherenceStatus = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: ${(props) => props.theme.spacing.md};
`;

/**
 * A card component for displaying medication information within the Care Now journey.
 * Shows medication name, dosage, schedule, and adherence status.
 */
export const MedicationCard: React.FC<MedicationCardProps> = ({ name, dosage, schedule, adherence }) => {
    // Determine the icon and color for adherence status
    const adherenceIcon = adherence ? 'check' : 'warning';
    const adherenceColor = adherence ? colors.semantic.success : colors.semantic.warning;

    // Construct accessibility label
    const accessibilityLabel = `Medication ${name}, ${dosage}, ${schedule}, ${
        adherence ? 'taken as prescribed' : 'not taken as prescribed'
    }`;

    return (
        <Card journey="care" elevation="sm" interactive accessibilityLabel={accessibilityLabel}>
            <Container>
                <Icon name="pill" size={sizing.icon.md} color={colors.journeys.care.primary} aria-hidden={true} />
                <MedicationDetails>
                    <Text fontWeight="medium" fontSize="lg">
                        {name} - {dosage}
                    </Text>
                    <Text color={colors.neutral.gray700} fontSize="md">
                        {schedule}
                    </Text>
                </MedicationDetails>
                <AdherenceStatus>
                    <Icon name={adherenceIcon} size={sizing.icon.md} color={adherenceColor} aria-hidden={true} />
                </AdherenceStatus>
            </Container>
        </Card>
    );
};
