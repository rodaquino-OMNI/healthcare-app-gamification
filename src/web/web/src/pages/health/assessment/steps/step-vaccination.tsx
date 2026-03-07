import React from 'react';
import { Card } from 'design-system/components/Card/Card';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

interface StepProps {
    data: Record<string, unknown>;
    onUpdate: (field: string, value: unknown) => void;
}

const COVID_OPTIONS = [
    { key: 'fullyVaccinated', label: 'Fully vaccinated' },
    { key: 'partiallyVaccinated', label: 'Partially vaccinated' },
    { key: 'notVaccinated', label: 'Not vaccinated' },
    { key: 'preferNotToSay', label: 'Prefer not to say' },
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

const StepVaccinationPage: React.FC<StepProps> = ({ data, onUpdate }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.text}>
                Vaccination History
            </Text>
            <Text fontSize="sm" color={colors.gray[50]}>
                Keeping track of your vaccinations helps ensure you are up to date with preventive care.
            </Text>

            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    COVID-19 Vaccination Status
                </Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                    {COVID_OPTIONS.map(({ key, label }) => {
                        const isActive = data.covidStatus === key;
                        return (
                            <button
                                key={key}
                                onClick={() => onUpdate('covidStatus', key)}
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
                    Annual Flu Vaccine (last 12 months)
                </Text>
                <div style={{ display: 'flex', gap: spacing.xs }}>
                    {['yes', 'no'].map((opt) => (
                        <button
                            key={opt}
                            onClick={() => onUpdate('fluVaccine', opt)}
                            style={chipStyle(data.fluVaccine === opt)}
                            aria-pressed={data.fluVaccine === opt}
                            aria-label={opt === 'yes' ? 'Yes' : 'No'}
                        >
                            {opt === 'yes' ? 'Yes' : 'No'}
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
                    Other Vaccines Up to Date
                </Text>
                <div style={{ display: 'flex', gap: spacing.xs }}>
                    {[
                        { key: 'yes', label: 'Yes' },
                        { key: 'no', label: 'No' },
                        { key: 'unsure', label: 'Unsure' },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => onUpdate('otherVaccines', key)}
                            style={chipStyle(data.otherVaccines === key)}
                            aria-pressed={data.otherVaccines === key}
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
                    Do you have a vaccination card/record?
                </Text>
                <div style={{ display: 'flex', gap: spacing.xs }}>
                    {['yes', 'no'].map((opt) => (
                        <button
                            key={opt}
                            onClick={() => onUpdate('vaccinationCard', opt)}
                            style={chipStyle(data.vaccinationCard === opt)}
                            aria-pressed={data.vaccinationCard === opt}
                            aria-label={opt === 'yes' ? 'Yes' : 'No'}
                        >
                            {opt === 'yes' ? 'Yes' : 'No'}
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
                    Important Information
                </Text>
                <Text fontSize="xs" color={colors.gray[50]} style={{ marginTop: spacing['3xs'] }}>
                    Keeping your vaccinations up to date is one of the most effective ways to prevent serious diseases.
                    We can help remind you about upcoming vaccinations.
                </Text>
            </Card>
        </div>
    );
};

export default StepVaccinationPage;
