import { Card } from 'design-system/components/Card/Card';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';

interface StepProps {
    data: Record<string, unknown>;
    onUpdate: (field: string, value: unknown) => void;
}

const PLAN_TYPES = [
    { label: 'Basic', value: 'basic' },
    { label: 'Standard', value: 'standard' },
    { label: 'Premium', value: 'premium' },
];

const COVERAGE_OPTIONS = [
    { label: 'Medical', value: 'medical' },
    { label: 'Dental', value: 'dental' },
    { label: 'Vision', value: 'vision' },
];

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

const StepInsuranceInfoPage: React.FC<StepProps> = ({ data, onUpdate }) => {
    const coverageSelected: string[] = (data.coverageDetails as string[]) || [];

    const toggleCoverage = (value: string): void => {
        const updated = coverageSelected.includes(value)
            ? coverageSelected.filter((c) => c !== value)
            : [...coverageSelected, value];
        onUpdate('coverageDetails', updated);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.text}>
                Insurance Information
            </Text>
            <Text fontSize="sm" color={colors.gray[50]}>
                Provide your insurance details to help us coordinate your care efficiently.
            </Text>

            {/* Has Insurance */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Do you have health insurance?
                </Text>
                <div style={{ display: 'flex', gap: spacing.xs }}>
                    {['yes', 'no'].map((opt) => {
                        const isActive = (data.hasInsurance as string) === opt;
                        return (
                            <button
                                key={opt}
                                onClick={() => onUpdate('hasInsurance', opt)}
                                style={{
                                    flex: 1,
                                    padding: spacing.sm,
                                    borderRadius: 20,
                                    border: `1px solid ${isActive ? colors.journeys.health.primary : colors.neutral.gray300}`,
                                    backgroundColor: isActive ? colors.journeys.health.primary : colors.neutral.white,
                                    color: isActive ? colors.neutral.white : colors.neutral.gray900,
                                    cursor: 'pointer',
                                    fontSize: 14,
                                    fontWeight: isActive ? 600 : 400,
                                }}
                                aria-pressed={isActive}
                                aria-label={opt === 'yes' ? 'Yes' : 'No'}
                            >
                                {opt === 'yes' ? 'Yes' : 'No'}
                            </button>
                        );
                    })}
                </div>
            </Card>

            {(data.hasInsurance as string) === 'yes' && (
                <>
                    {/* Provider Name */}
                    <Card journey="health" elevation="sm" padding="lg">
                        <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color={colors.neutral.gray700}
                            style={{ marginBottom: spacing['3xs'] }}
                        >
                            Insurance Provider
                        </Text>
                        <input
                            style={inputStyle}
                            type="text"
                            placeholder="e.g. SulAmerica, Unimed, Bradesco Saude"
                            value={(data.providerName as string) || ''}
                            onChange={(e) => onUpdate('providerName', e.target.value)}
                            aria-label="Insurance provider name"
                        />
                    </Card>

                    {/* Plan Type */}
                    <Card journey="health" elevation="sm" padding="lg">
                        <Text
                            fontSize="sm"
                            fontWeight="semiBold"
                            color={colors.journeys.health.text}
                            style={{ marginBottom: spacing.sm }}
                        >
                            Plan Type
                        </Text>
                        <div style={{ display: 'flex', gap: spacing.xs }}>
                            {PLAN_TYPES.map((opt) => {
                                const isActive = (data.planType as string) === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        onClick={() => onUpdate('planType', opt.value)}
                                        style={{
                                            flex: 1,
                                            padding: spacing.sm,
                                            borderRadius: 8,
                                            border: `1px solid ${isActive ? colors.journeys.health.primary : colors.neutral.gray300}`,
                                            backgroundColor: isActive
                                                ? colors.journeys.health.primary
                                                : colors.neutral.white,
                                            color: isActive ? colors.neutral.white : colors.neutral.gray900,
                                            cursor: 'pointer',
                                            fontSize: 13,
                                            fontWeight: isActive ? 600 : 400,
                                        }}
                                        aria-pressed={isActive}
                                        aria-label={opt.label}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                    </Card>

                    {/* Member ID */}
                    <Card journey="health" elevation="sm" padding="lg">
                        <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color={colors.neutral.gray700}
                            style={{ marginBottom: spacing['3xs'] }}
                        >
                            Member ID
                        </Text>
                        <input
                            style={inputStyle}
                            type="text"
                            placeholder="Enter your member ID"
                            value={(data.memberId as string) || ''}
                            onChange={(e) => onUpdate('memberId', e.target.value)}
                            aria-label="Insurance member ID"
                        />
                    </Card>

                    {/* Coverage Details */}
                    <Card journey="health" elevation="sm" padding="lg">
                        <Text
                            fontSize="sm"
                            fontWeight="semiBold"
                            color={colors.journeys.health.text}
                            style={{ marginBottom: spacing.sm }}
                        >
                            Coverage Areas
                        </Text>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
                            {COVERAGE_OPTIONS.map((opt) => {
                                const checked = coverageSelected.includes(opt.value);
                                return (
                                    <button
                                        key={opt.value}
                                        onClick={() => toggleCoverage(opt.value)}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: spacing.xs,
                                            padding: `${spacing['3xs']} ${spacing.sm}`,
                                            borderRadius: 20,
                                            border: `1px solid ${checked ? colors.journeys.health.primary : colors.neutral.gray300}`,
                                            backgroundColor: checked
                                                ? colors.journeys.health.background
                                                : colors.neutral.white,
                                            cursor: 'pointer',
                                            fontSize: 13,
                                            fontWeight: checked ? 600 : 400,
                                            color: checked ? colors.journeys.health.accent : colors.neutral.gray900,
                                        }}
                                        aria-pressed={checked}
                                        aria-label={`${opt.label} coverage ${checked ? 'selected' : 'not selected'}`}
                                    >
                                        {checked ? '\u2713 ' : ''}
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                    </Card>
                </>
            )}
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default StepInsuranceInfoPage;
