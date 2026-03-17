import { Card } from 'design-system/components/Card/Card';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';

interface StepProps {
    data: Record<string, unknown>;
    onUpdate: (field: string, value: unknown) => void;
}

interface SectionConfig {
    key: string;
    title: string;
    fields: { label: string; valueKey: string }[];
}

const SECTIONS: SectionConfig[] = [
    {
        key: 'personalInfo',
        title: 'Personal Information',
        fields: [
            { label: 'Full Name', valueKey: 'fullName' },
            { label: 'Date of Birth', valueKey: 'dateOfBirth' },
            { label: 'Gender', valueKey: 'gender' },
            { label: 'Blood Type', valueKey: 'bloodType' },
        ],
    },
    {
        key: 'healthConditions',
        title: 'Health Conditions',
        fields: [
            { label: 'Existing Conditions', valueKey: 'existingConditions' },
            { label: 'Allergies', valueKey: 'allergies' },
            { label: 'Current Medications', valueKey: 'currentMedications' },
        ],
    },
    {
        key: 'lifestyle',
        title: 'Lifestyle',
        fields: [
            { label: 'Exercise Frequency', valueKey: 'exerciseFrequency' },
            { label: 'Diet Type', valueKey: 'dietType' },
            { label: 'Sleep Hours', valueKey: 'sleepHours' },
        ],
    },
    {
        key: 'mentalHealth',
        title: 'Mental Health',
        fields: [
            { label: 'Stress Level', valueKey: 'stressLevel' },
            { label: 'Mood Rating', valueKey: 'moodRating' },
        ],
    },
    {
        key: 'goals',
        title: 'Health Goals',
        fields: [{ label: 'Goals', valueKey: 'healthGoals' }],
    },
];

const formatValue = (value: unknown): string => {
    if (value === undefined || value === null || value === '') {
        return '--';
    }
    if (Array.isArray(value)) {
        return value.length > 0 ? value.join(', ') : '--';
    }
    return String(value);
};

const StepReviewSummaryPage: React.FC<StepProps> = ({ data, onUpdate }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.text}>
                Review Your Assessment
            </Text>
            <Text fontSize="sm" color={colors.gray[50]}>
                Please review your information before submitting. Click Edit to make changes.
            </Text>

            {SECTIONS.map((section) => (
                <Card key={section.key} journey="health" elevation="sm" padding="lg">
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: spacing.sm,
                        }}
                    >
                        <Text fontSize="md" fontWeight="semiBold" color={colors.journeys.health.text}>
                            {section.title}
                        </Text>
                        <button
                            onClick={() => onUpdate('editSection', section.key)}
                            style={{
                                border: 'none',
                                backgroundColor: 'transparent',
                                color: colors.journeys.health.primary,
                                cursor: 'pointer',
                                fontSize: 13,
                                fontWeight: 600,
                            }}
                            aria-label={`Edit ${section.title}`}
                        >
                            Edit
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing['3xs'] }}>
                        {section.fields.map((field) => (
                            <div
                                key={field.valueKey}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: `${spacing['3xs']} 0`,
                                    borderBottom: `1px solid ${colors.neutral.gray200}`,
                                }}
                            >
                                <Text fontSize="sm" color={colors.neutral.gray600}>
                                    {field.label}
                                </Text>
                                <Text fontSize="sm" fontWeight="medium" color={colors.neutral.gray900}>
                                    {formatValue(data[field.valueKey])}
                                </Text>
                            </div>
                        ))}
                    </div>
                </Card>
            ))}

            <Text fontSize="xs" color={colors.neutral.gray600} style={{ textAlign: 'center' }}>
                By proceeding, you confirm that the information provided is accurate to the best of your knowledge.
            </Text>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default StepReviewSummaryPage;
