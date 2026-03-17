import { Card } from 'design-system/components/Card/Card';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';

interface StepProps {
    data: Record<string, unknown>;
    onUpdate: (field: string, value: unknown) => void;
}

const RELATIONSHIPS = ['Spouse', 'Parent', 'Sibling', 'Child', 'Friend', 'Other'];

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing.sm,
    border: `1px solid ${colors.neutral.gray300}`,
    borderRadius: 8,
    fontSize: 14,
    color: colors.neutral.gray900,
    backgroundColor: colors.neutral.white,
    outline: 'none',
    boxSizing: 'border-box',
};

const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing.sm,
    border: `1px solid ${colors.neutral.gray300}`,
    borderRadius: 8,
    fontSize: 14,
    color: colors.neutral.gray900,
    backgroundColor: colors.neutral.white,
    outline: 'none',
};

const ContactFields: React.FC<{
    prefix: string;
    data: Record<string, unknown>;
    onUpdate: (field: string, value: unknown) => void;
}> = ({ prefix, data, onUpdate }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        <div>
            <Text
                fontSize="sm"
                fontWeight="medium"
                color={colors.neutral.gray700}
                style={{ marginBottom: spacing['3xs'] }}
            >
                Full Name
            </Text>
            <input
                style={inputStyle}
                type="text"
                placeholder="Contact full name"
                value={(data[`${prefix}Name`] as string) || ''}
                onChange={(e) => onUpdate(`${prefix}Name`, e.target.value)}
                aria-label={`${prefix} contact name`}
            />
        </div>
        <div>
            <Text
                fontSize="sm"
                fontWeight="medium"
                color={colors.neutral.gray700}
                style={{ marginBottom: spacing['3xs'] }}
            >
                Relationship
            </Text>
            <select
                style={selectStyle}
                value={(data[`${prefix}Relationship`] as string) || ''}
                onChange={(e) => onUpdate(`${prefix}Relationship`, e.target.value)}
                aria-label={`${prefix} contact relationship`}
            >
                <option value="">Select relationship</option>
                {RELATIONSHIPS.map((rel) => (
                    <option key={rel} value={rel.toLowerCase()}>
                        {rel}
                    </option>
                ))}
            </select>
        </div>
        <div>
            <Text
                fontSize="sm"
                fontWeight="medium"
                color={colors.neutral.gray700}
                style={{ marginBottom: spacing['3xs'] }}
            >
                Phone Number
            </Text>
            <input
                style={inputStyle}
                type="tel"
                placeholder="(00) 00000-0000"
                value={(data[`${prefix}Phone`] as string) || ''}
                onChange={(e) => onUpdate(`${prefix}Phone`, e.target.value)}
                aria-label={`${prefix} contact phone`}
            />
        </div>
    </div>
);

const StepEmergencyContactsPage: React.FC<StepProps> = ({ data, onUpdate }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.text}>
                Emergency Contacts
            </Text>
            <Text fontSize="sm" color={colors.gray[50]}>
                Provide at least one emergency contact. This information will be used in case of medical emergencies.
            </Text>

            {/* Primary Contact */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="md"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Primary Contact
                </Text>
                <ContactFields prefix="primary" data={data} onUpdate={onUpdate} />
            </Card>

            {/* Add Secondary Toggle */}
            <button
                onClick={() => onUpdate('showSecondary', !(data.showSecondary as boolean))}
                style={{
                    padding: spacing.sm,
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 600,
                    textAlign: 'center',
                }}
                aria-label={(data.showSecondary as boolean) ? 'Remove secondary contact' : 'Add secondary contact'}
            >
                {(data.showSecondary as boolean) ? '- Remove Secondary Contact' : '+ Add Secondary Contact'}
            </button>

            {/* Secondary Contact */}
            {(data.showSecondary as boolean) && (
                <Card journey="health" elevation="sm" padding="lg">
                    <Text
                        fontSize="md"
                        fontWeight="semiBold"
                        color={colors.journeys.health.text}
                        style={{ marginBottom: spacing.sm }}
                    >
                        Secondary Contact
                    </Text>
                    <ContactFields prefix="secondary" data={data} onUpdate={onUpdate} />
                </Card>
            )}
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default StepEmergencyContactsPage;
