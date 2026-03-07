import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { Slider } from 'src/web/design-system/src/components/Slider/Slider';
import { Select } from 'src/web/design-system/src/components/Select/Select';
import Input from 'src/web/design-system/src/components/Input/Input';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import { WEB_CARE_ROUTES } from 'src/web/shared/constants/routes';

const DURATION_OPTIONS = [
    { label: 'Less than 1 day', value: 'less-1-day' },
    { label: '1-3 days', value: '1-3-days' },
    { label: '4-7 days', value: '4-7-days' },
    { label: '1-2 weeks', value: '1-2-weeks' },
    { label: '2-4 weeks', value: '2-4-weeks' },
    { label: 'More than 1 month', value: 'more-1-month' },
];

const ONSET_OPTIONS = [
    { label: 'Sudden', value: 'sudden' },
    { label: 'Gradual', value: 'gradual' },
    { label: 'After an event/injury', value: 'after-event' },
    { label: 'Unknown', value: 'unknown' },
];

/**
 * Symptom detail page where users describe their symptoms
 * including severity, duration, onset type, and additional notes.
 */
const SymptomDetailPage: React.FC = () => {
    const router = useRouter();
    const { regions } = router.query;

    const [severity, setSeverity] = useState(5);
    const [duration, setDuration] = useState('');
    const [onset, setOnset] = useState('');
    const [notes, setNotes] = useState('');

    const handleContinue = () => {
        router.push({
            pathname: WEB_CARE_ROUTES.SYMPTOM_QUESTIONS,
            query: {
                regions,
                severity: severity.toString(),
                duration,
                onset,
            },
        });
    };

    const isFormValid = duration !== '' && onset !== '';

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                Describe Your Symptoms
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Provide details to help us assess your condition accurately.
            </Text>

            <Card journey="care" elevation="md" padding="lg">
                <Box style={{ marginBottom: spacing.xl }}>
                    <Text fontWeight="medium" fontSize="md" style={{ marginBottom: spacing.sm }}>
                        Severity (1-10)
                    </Text>
                    <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={severity}
                        onChange={setSeverity}
                        showValue
                        journey="care"
                        accessibilityLabel="Symptom severity from 1 to 10"
                    />
                    <Box display="flex" justifyContent="space-between" style={{ marginTop: spacing.xs }}>
                        <Text fontSize="sm" color={colors.semantic.success}>
                            Mild
                        </Text>
                        <Text fontSize="sm" color={colors.semantic.warning}>
                            Moderate
                        </Text>
                        <Text fontSize="sm" color={colors.semantic.error}>
                            Severe
                        </Text>
                    </Box>
                </Box>

                <Box style={{ marginBottom: spacing.xl }}>
                    <Select
                        label="How long have you had these symptoms?"
                        options={DURATION_OPTIONS}
                        value={duration}
                        onChange={(val) => setDuration(val as string)}
                        journey="care"
                        placeholder="Select duration"
                        testID="duration-select"
                    />
                </Box>

                <Box style={{ marginBottom: spacing.xl }}>
                    <Select
                        label="How did the symptoms start?"
                        options={ONSET_OPTIONS}
                        value={onset}
                        onChange={(val) => setOnset(val as string)}
                        journey="care"
                        placeholder="Select onset type"
                        testID="onset-select"
                    />
                </Box>

                <Box style={{ marginBottom: spacing.md }}>
                    <Input
                        label="Additional notes (optional)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Describe anything else about your symptoms..."
                        journey="care"
                        testID="notes-input"
                    />
                </Box>
            </Card>

            <Box display="flex" justifyContent="space-between" style={{ marginTop: spacing['2xl'] }}>
                <Button
                    variant="secondary"
                    journey="care"
                    onPress={() => router.back()}
                    accessibilityLabel="Go back to body map"
                >
                    Back
                </Button>
                <Button
                    journey="care"
                    onPress={handleContinue}
                    disabled={!isFormValid}
                    accessibilityLabel="Continue to follow-up questions"
                >
                    Continue
                </Button>
            </Box>
        </div>
    );
};

export default SymptomDetailPage;
