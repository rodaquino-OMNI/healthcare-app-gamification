import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

interface HistoryItem {
    id: string;
    label: string;
    category: string;
}

const HISTORY_ITEMS: HistoryItem[] = [
    { id: 'diabetes', label: 'Diabetes', category: 'Chronic Conditions' },
    { id: 'hypertension', label: 'Hypertension', category: 'Chronic Conditions' },
    { id: 'asthma', label: 'Asthma', category: 'Chronic Conditions' },
    { id: 'heart-disease', label: 'Heart Disease', category: 'Chronic Conditions' },
    { id: 'allergies', label: 'Known Allergies', category: 'Allergies & Sensitivities' },
    { id: 'drug-allergy', label: 'Drug Allergies', category: 'Allergies & Sensitivities' },
    { id: 'recent-surgery', label: 'Recent Surgery', category: 'Recent Events' },
    { id: 'recent-hospitalization', label: 'Recent Hospitalization', category: 'Recent Events' },
    { id: 'pregnant', label: 'Currently Pregnant', category: 'Other' },
    { id: 'smoking', label: 'Smoker', category: 'Other' },
];

/** Medical history checklist page for the symptom checker flow. */
const MedicalHistoryPage: React.FC = () => {
    const router = useRouter();
    const [enabled, setEnabled] = useState<Record<string, boolean>>({});

    const toggleItem = (id: string) => {
        setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const categories = [...new Set(HISTORY_ITEMS.map((item) => item.category))];

    const handleContinue = () => {
        const selected = Object.keys(enabled).filter((k) => enabled[k]);
        router.push({
            pathname: '/care/symptom-checker/medication-context',
            query: { ...router.query, history: selected.join(',') },
        });
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                Medical History
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Select any conditions that apply to you.
            </Text>

            {categories.map((category) => (
                <div key={category} style={{ marginBottom: spacing.lg }}>
                    <Text
                        fontSize="sm"
                        fontWeight="bold"
                        color={colors.gray[50]}
                        style={{ marginBottom: spacing.xs, textTransform: 'uppercase', letterSpacing: '0.5px' }}
                    >
                        {category}
                    </Text>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                        {HISTORY_ITEMS.filter((item) => item.category === category).map((item) => (
                            <Card
                                key={item.id}
                                journey="care"
                                elevation="sm"
                                interactive
                                onPress={() => toggleItem(item.id)}
                                backgroundColor={
                                    enabled[item.id] ? colors.journeys.care.background : colors.neutral.white
                                }
                                borderColor={enabled[item.id] ? colors.journeys.care.primary : colors.neutral.gray300}
                                accessibilityLabel={`${item.label}${enabled[item.id] ? ', selected' : ''}`}
                            >
                                <Box display="flex" justifyContent="space-between" alignItems="center" padding="sm">
                                    <Text fontSize="md" color={colors.journeys.care.text}>
                                        {item.label}
                                    </Text>
                                    <div
                                        data-testid={`toggle-${item.id}`}
                                        style={{
                                            width: '40px',
                                            height: '22px',
                                            borderRadius: '11px',
                                            backgroundColor: enabled[item.id]
                                                ? colors.journeys.care.primary
                                                : colors.neutral.gray400,
                                            position: 'relative',
                                            transition: 'background-color 0.2s',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '18px',
                                                height: '18px',
                                                borderRadius: '50%',
                                                backgroundColor: colors.neutral.white,
                                                position: 'absolute',
                                                top: '2px',
                                                left: enabled[item.id] ? '20px' : '2px',
                                                transition: 'left 0.2s',
                                            }}
                                        />
                                    </div>
                                </Box>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}

            <Box display="flex" justifyContent="space-between" style={{ marginTop: spacing['2xl'] }}>
                <Button
                    variant="secondary"
                    journey="care"
                    onPress={() => router.back()}
                    accessibilityLabel="Go back"
                    data-testid="medical-history-back-btn"
                >
                    Back
                </Button>
                <Button
                    journey="care"
                    onPress={handleContinue}
                    accessibilityLabel="Continue to medications"
                    data-testid="medical-history-continue-btn"
                >
                    Continue
                </Button>
            </Box>
        </div>
    );
};

export default MedicalHistoryPage;
