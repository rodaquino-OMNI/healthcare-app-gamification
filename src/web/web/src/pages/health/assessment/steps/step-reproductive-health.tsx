import { Card } from 'design-system/components/Card/Card';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';

interface StepProps {
    data: Record<string, unknown>;
    onUpdate: (field: string, value: unknown) => void;
}

const PREGNANCY_OPTIONS = [
    { key: 'notPregnant', label: 'Not pregnant' },
    { key: 'pregnant', label: 'Currently pregnant' },
    { key: 'trying', label: 'Trying to conceive' },
    { key: 'unsure', label: 'Unsure' },
];

const CHECKUP_OPTIONS = [
    { key: 'lessThan6Months', label: 'Less than 6 months ago' },
    { key: '6to12Months', label: '6-12 months ago' },
    { key: '1to2Years', label: '1-2 years ago' },
    { key: 'moreThan2Years', label: 'More than 2 years ago' },
];

const CONTRACEPTION_OPTIONS = [
    { key: 'yes', label: 'Yes' },
    { key: 'no', label: 'No' },
    { key: 'notApplicable', label: 'N/A' },
];

const MENSTRUAL_OPTIONS = [
    { key: 'regular', label: 'Regular' },
    { key: 'irregular', label: 'Irregular' },
    { key: 'notApplicable', label: 'N/A' },
];

const optionStyle = (selected: boolean): React.CSSProperties => ({
    padding: spacing.sm,
    borderRadius: 8,
    border: `1px solid ${selected ? colors.journeys.health.primary : colors.neutral.gray300}`,
    backgroundColor: selected ? colors.journeys.health.background : colors.neutral.white,
    textAlign: 'left' as const,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    fontSize: 14,
    fontWeight: selected ? 600 : 400,
    color: colors.neutral.gray900,
});

const chipStyle = (selected: boolean): React.CSSProperties => ({
    flex: 1,
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: 20,
    border: `1px solid ${selected ? colors.journeys.health.primary : colors.neutral.gray300}`,
    backgroundColor: selected ? colors.journeys.health.primary : colors.neutral.white,
    color: selected ? colors.neutral.white : colors.neutral.gray900,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: selected ? 600 : 400,
    textAlign: 'center' as const,
});

const StepReproductiveHealthPage: React.FC<StepProps> = ({ data, onUpdate }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.text}>
                    Reproductive Health
                </Text>
                <button
                    onClick={() => onUpdate('reproductiveSkipped', true)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: colors.journeys.health.primary,
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: 13,
                    }}
                    aria-label="Skip this section"
                >
                    Skip
                </button>
            </div>
            <Text fontSize="sm" color={colors.gray[50]}>
                This section is optional. Your answers help personalize health recommendations.
            </Text>

            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Pregnancy Status
                </Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                    {PREGNANCY_OPTIONS.map(({ key, label }) => {
                        const isActive = (data.pregnancyStatus as string) === key;
                        return (
                            <button
                                key={key}
                                onClick={() => onUpdate('pregnancyStatus', key)}
                                style={optionStyle(isActive)}
                                aria-pressed={isActive}
                                aria-label={label}
                            >
                                <div
                                    style={{
                                        width: 18,
                                        height: 18,
                                        borderRadius: '50%',
                                        border: `2px solid ${isActive ? colors.journeys.health.primary : colors.neutral.gray400}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    {isActive && (
                                        <div
                                            style={{
                                                width: 10,
                                                height: 10,
                                                borderRadius: '50%',
                                                backgroundColor: colors.journeys.health.primary,
                                            }}
                                        />
                                    )}
                                </div>
                                {label}
                            </button>
                        );
                    })}
                </div>
            </Card>

            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Last Reproductive Health Checkup
                </Text>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
                    {CHECKUP_OPTIONS.map(({ key, label }) => {
                        const isActive = (data.lastReproductiveCheckup as string) === key;
                        return (
                            <button
                                key={key}
                                onClick={() => onUpdate('lastReproductiveCheckup', key)}
                                style={{
                                    padding: `${spacing['3xs']} ${spacing.sm}`,
                                    borderRadius: 20,
                                    border: `1px solid ${isActive ? colors.journeys.health.primary : colors.neutral.gray300}`,
                                    backgroundColor: isActive
                                        ? colors.journeys.health.background
                                        : colors.neutral.white,
                                    cursor: 'pointer',
                                    fontSize: 13,
                                    fontWeight: isActive ? 600 : 400,
                                    color: isActive ? colors.journeys.health.accent : colors.neutral.gray900,
                                }}
                                aria-pressed={isActive}
                                aria-label={label}
                            >
                                {isActive ? '\u2713 ' : ''}
                                {label}
                            </button>
                        );
                    })}
                </div>
            </Card>

            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Contraception Use
                </Text>
                <div style={{ display: 'flex', gap: spacing.xs }}>
                    {CONTRACEPTION_OPTIONS.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => onUpdate('contraception', key)}
                            style={chipStyle((data.contraception as string) === key)}
                            aria-pressed={(data.contraception as string) === key}
                            aria-label={label}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </Card>

            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Menstrual Regularity
                </Text>
                <div style={{ display: 'flex', gap: spacing.xs }}>
                    {MENSTRUAL_OPTIONS.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => onUpdate('menstrualRegularity', key)}
                            style={chipStyle((data.menstrualRegularity as string) === key)}
                            aria-pressed={(data.menstrualRegularity as string) === key}
                            aria-label={label}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </Card>

            <Card
                journey="health"
                elevation="sm"
                padding="lg"
                style={{ borderLeft: `3px solid ${colors.semantic.info}` }}
            >
                <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.text}>
                    Privacy Notice
                </Text>
                <Text fontSize="xs" color={colors.gray[50]} style={{ marginTop: spacing['3xs'] }}>
                    This information is strictly confidential and used only to personalize your health recommendations.
                </Text>
            </Card>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default StepReproductiveHealthPage;
