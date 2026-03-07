import React from 'react';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

interface StepProps {
    data: Record<string, any>;
    onUpdate: (field: string, value: any) => void;
}

const COMMON_ALLERGENS = [
    'Penicillin',
    'Sulfa drugs',
    'NSAIDs (Ibuprofen)',
    'Aspirin',
    'Peanuts',
    'Tree nuts',
    'Shellfish',
    'Eggs',
    'Dairy',
    'Soy',
    'Wheat / Gluten',
    'Latex',
    'Bee stings',
    'Pollen',
    'Dust mites',
    'Pet dander',
];

const SEVERITY_OPTIONS = ['Mild', 'Moderate', 'Severe', 'Life-threatening'];

const chipStyle = (selected: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: `${spacing['3xs']} ${spacing.sm}`,
    borderRadius: 20,
    border: `1px solid ${selected ? colors.journeys.health.primary : colors.neutral.gray300}`,
    backgroundColor: selected ? colors.journeys.health.background : colors.neutral.white,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: selected ? 600 : 400,
    color: selected ? colors.journeys.health.accent : colors.neutral.gray900,
});

const StepAllergiesPage: React.FC<StepProps> = ({ data, onUpdate }) => {
    const selectedAllergens: string[] = data.allergens || [];
    const allergySeverity: string = data.allergySeverity || '';

    const toggleAllergen = (allergen: string) => {
        const updated = selectedAllergens.includes(allergen)
            ? selectedAllergens.filter((a) => a !== allergen)
            : [...selectedAllergens, allergen];
        onUpdate('allergens', updated);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.text}>
                Allergies
            </Text>
            <Text fontSize="sm" color={colors.gray[50]}>
                Select any known allergies. This is important for safe medication recommendations.
            </Text>

            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Common Allergens
                </Text>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
                    {COMMON_ALLERGENS.map((allergen) => {
                        const selected = selectedAllergens.includes(allergen);
                        return (
                            <button
                                key={allergen}
                                onClick={() => toggleAllergen(allergen)}
                                style={chipStyle(selected)}
                                aria-pressed={selected}
                                aria-label={`${allergen} ${selected ? 'selected' : 'not selected'}`}
                            >
                                {selected ? '\u2713 ' : ''}
                                {allergen}
                            </button>
                        );
                    })}
                </div>
            </Card>

            {/* Custom allergen */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color={colors.gray[60]}
                    style={{ marginBottom: spacing['3xs'] }}
                >
                    Other allergens
                </Text>
                <input
                    style={{
                        width: '100%',
                        padding: spacing.sm,
                        border: `1px solid ${colors.neutral.gray300}`,
                        borderRadius: 8,
                        fontSize: 14,
                        color: colors.neutral.gray900,
                        backgroundColor: colors.neutral.white,
                        outline: 'none',
                        boxSizing: 'border-box',
                    }}
                    type="text"
                    placeholder="Type any additional allergens"
                    value={data.otherAllergen || ''}
                    onChange={(e) => onUpdate('otherAllergen', e.target.value)}
                    aria-label="Other allergens"
                />
            </Card>

            {/* Severity */}
            {selectedAllergens.length > 0 && (
                <Card journey="health" elevation="sm" padding="lg">
                    <Text
                        fontSize="sm"
                        fontWeight="semiBold"
                        color={colors.journeys.health.text}
                        style={{ marginBottom: spacing.sm }}
                    >
                        Overall Allergy Severity
                    </Text>
                    <div style={{ display: 'flex', gap: spacing.xs }}>
                        {SEVERITY_OPTIONS.map((sev) => {
                            const isActive = allergySeverity === sev;
                            return (
                                <button
                                    key={sev}
                                    onClick={() => onUpdate('allergySeverity', sev)}
                                    style={{
                                        flex: 1,
                                        padding: spacing.xs,
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
                                    aria-label={`Severity: ${sev}`}
                                >
                                    {sev}
                                </button>
                            );
                        })}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default StepAllergiesPage;
