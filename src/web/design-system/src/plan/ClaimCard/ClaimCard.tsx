import React from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { Card } from '../../components/Card';
import { Text } from '../../primitives/Text/Text';
import { Icon } from '../../primitives/Icon/Icon';
import { Button } from '../../components/Button';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';
import { borderRadius } from '../../tokens/borderRadius';
import {
    ClaimCardContainer,
    ClaimCardHeader,
    ClaimCardBody,
    ClaimCardFooter,
    ClaimStatusText,
} from './ClaimCard.styles';

export interface ClaimCardProps {
    /**
     * The claim data to display
     */
    claim: Claim;

    /**
     * Function to call when the card is pressed
     */
    onPress?: () => void;

    /**
     * Function to call when the View Details button is pressed
     */
    onViewDetails?: () => void;

    /**
     * Function to call when the Track Claim button is pressed
     */
    onTrackClaim?: () => void;

    /**
     * Whether to show action buttons
     * @default true
     */
    showActions?: boolean;

    /**
     * Whether to show a compact version of the card
     * @default false
     */
    compact?: boolean;

    /**
     * Accessibility label for the card
     */
    accessibilityLabel?: string;
}

interface Claim {
    id: string;
    type: string;
    amount: number;
    status: 'pending' | 'approved' | 'denied' | 'additional_info_required';
    submittedAt: string;
    documents: any[];
}

/**
 * Helper function to determine the appropriate icon based on claim status
 */
const getStatusIcon = (status: string): string => {
    switch (status) {
        case 'approved':
            return 'check-circle';
        case 'denied':
            return 'x-circle';
        case 'additional_info_required':
            return 'alert-circle';
        case 'pending':
        default:
            return 'clock';
    }
};

/**
 * Helper function to determine the appropriate color based on claim status
 */
const getStatusColor = (status: string): string => {
    switch (status) {
        case 'approved':
            return 'success';
        case 'denied':
            return 'error';
        case 'additional_info_required':
            return 'warning';
        case 'pending':
        default:
            return 'info';
    }
};

/**
 * Helper function to format currency values
 */
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(amount);
};

/**
 * Component for displaying insurance claim information in a card format
 */
export const ClaimCard: React.FC<ClaimCardProps> = ({
    claim,
    onPress,
    onViewDetails,
    onTrackClaim,
    showActions = true,
    compact = false,
    accessibilityLabel,
}) => {
    const { t } = useTranslation();
    const statusIcon = getStatusIcon(claim.status);
    const statusColor = getStatusColor(claim.status);

    const formattedAmount = formatCurrency(claim.amount);
    const formattedDate = format(new Date(claim.submittedAt), 'dd/MM/yyyy');

    // Map the status to the ClaimStatusText component status prop
    const mappedStatus =
        claim.status === 'additional_info_required'
            ? 'moreInfo'
            : (claim.status as 'pending' | 'approved' | 'denied' | 'inReview' | 'moreInfo');

    return (
        <Card
            journey="plan"
            onPress={onPress}
            interactive={!!onPress}
            accessibilityLabel={
                accessibilityLabel ||
                `${t(`claim.type.${claim.type}`)} ${formattedAmount}, ${t(`claim.status.${claim.status}`)}`
            }
        >
            <ClaimCardHeader>
                <Text fontWeight="medium" fontSize={compact ? 'sm' : 'md'}>
                    {t(`claim.type.${claim.type}`)}
                </Text>
                <Text fontSize="sm" color="neutral.gray600">
                    {t('claim.submittedOn')} {formattedDate}
                </Text>
            </ClaimCardHeader>

            <ClaimCardBody>
                <Text fontWeight="bold" fontSize={compact ? 'lg' : 'xl'}>
                    {formattedAmount}
                </Text>

                {!compact && claim.documents.length > 0 && (
                    <Text fontSize="sm">{t('claim.documents', { count: claim.documents.length })}</Text>
                )}
            </ClaimCardBody>

            <ClaimCardFooter>
                <ClaimStatusText status={mappedStatus}>
                    <Icon name={statusIcon} size={spacing.md} aria-hidden="true" />
                    <Text marginLeft="xs">{t(`claim.status.${claim.status}`)}</Text>
                </ClaimStatusText>

                {showActions && !compact && (
                    <div>
                        {onViewDetails && (
                            <Button variant="tertiary" size="sm" onPress={onViewDetails} journey="plan">
                                {t('claim.viewDetails')}
                            </Button>
                        )}

                        {onTrackClaim && (
                            <Button variant="secondary" size="sm" onPress={onTrackClaim} journey="plan">
                                {t('claim.track')}
                            </Button>
                        )}
                    </div>
                )}
            </ClaimCardFooter>
        </Card>
    );
};
