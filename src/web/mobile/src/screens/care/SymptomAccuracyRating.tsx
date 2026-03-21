import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useRoute, RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';

interface PossibleCondition {
    id: string;
    name: string;
    probability: number;
    severity: 'low' | 'medium' | 'high';
}

type SymptomAccuracyRatingRouteParams = {
    checkId: string;
    conditions: PossibleCondition[];
};

type AccuracyOption = 'very_accurate' | 'somewhat_accurate' | 'not_accurate';

interface AccuracyChoice {
    key: AccuracyOption;
    labelKey: string;
}

const ACCURACY_OPTIONS: AccuracyChoice[] = [
    { key: 'very_accurate', labelKey: 'journeys.care.symptomChecker.accuracyRating.veryAccurate' },
    { key: 'somewhat_accurate', labelKey: 'journeys.care.symptomChecker.accuracyRating.somewhatAccurate' },
    { key: 'not_accurate', labelKey: 'journeys.care.symptomChecker.accuracyRating.notAccurate' },
];

/**
 * Rate accuracy of AI symptom diagnosis.
 * Allows users to provide star rating, accuracy assessment, and feedback.
 */
const SymptomAccuracyRating: React.FC = () => {
    const route = useRoute<RouteProp<{ params: SymptomAccuracyRatingRouteParams }, 'params'>>();
    const { t } = useTranslation();

    const { _checkId = '', conditions = [] } = route.params || {};

    const [starRating, setStarRating] = useState(0);
    const [selectedAccuracy, setSelectedAccuracy] = useState<AccuracyOption | null>(null);
    const [feedback, setFeedback] = useState('');

    const handleStarPress = (star: number) => {
        setStarRating(star);
    };

    const handleSubmit = () => {
        if (starRating === 0) {
            Alert.alert(
                t('journeys.care.symptomChecker.accuracyRating.ratingRequired'),
                t('journeys.care.symptomChecker.accuracyRating.ratingRequiredMessage')
            );
            return;
        }

        Alert.alert(
            t('journeys.care.symptomChecker.accuracyRating.thankYouTitle'),
            t('journeys.care.symptomChecker.accuracyRating.thankYouMessage'),
            [{ text: t('journeys.care.symptomChecker.accuracyRating.ok') }]
        );
    };

    const renderStar = (position: number): React.ReactElement | null => {
        const isFilled = position <= starRating;
        return (
            <Touchable
                key={position}
                onPress={() => handleStarPress(position)}
                accessibilityLabel={`${t('journeys.care.symptomChecker.accuracyRating.star')} ${position} ${t('journeys.care.symptomChecker.accuracyRating.of')} 5`}
                accessibilityRole="button"
                testID={`star-${position}`}
            >
                <Text
                    fontSize="heading-md"
                    color={isFilled ? colors.semantic.warning : colors.neutral.gray400}
                    style={styles.star}
                >
                    {isFilled ? '\u2605' : '\u2606'}
                </Text>
            </Touchable>
        );
    };

    return (
        <View style={styles.root}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <Text variant="heading" journey="care" testID="accuracy-title">
                    {t('journeys.care.symptomChecker.accuracyRating.title')}
                </Text>

                {/* Conditions reviewed */}
                {conditions.length > 0 && (
                    <Card journey="care" elevation="sm">
                        <Text variant="body" fontWeight="semiBold" journey="care">
                            {t('journeys.care.symptomChecker.accuracyRating.conditionsReviewed')}
                        </Text>
                        {conditions.slice(0, 3).map((condition, index) => (
                            <Text key={condition.id} variant="body" journey="care" testID={`condition-${index}`}>
                                {'\u2022'} {condition.name} ({condition.probability}%)
                            </Text>
                        ))}
                    </Card>
                )}

                {/* Star rating */}
                <Card journey="care" elevation="md">
                    <Text variant="body" fontWeight="semiBold" journey="care">
                        {t('journeys.care.symptomChecker.accuracyRating.rateOverall')}
                    </Text>
                    <View style={styles.starContainer}>{[1, 2, 3, 4, 5].map(renderStar)}</View>
                    {starRating > 0 && (
                        <Text
                            fontSize="text-sm"
                            color={colors.neutral.gray600}
                            testID="star-label"
                            style={styles.starLabel}
                        >
                            {starRating}/5
                        </Text>
                    )}
                </Card>

                {/* Accuracy question */}
                <Card journey="care" elevation="sm">
                    <Text variant="body" fontWeight="semiBold" journey="care">
                        {t('journeys.care.symptomChecker.accuracyRating.wasAccurate')}
                    </Text>
                    <View style={styles.optionsContainer}>
                        {ACCURACY_OPTIONS.map((option) => {
                            const isSelected = selectedAccuracy === option.key;
                            return (
                                <Touchable
                                    key={option.key}
                                    onPress={() => setSelectedAccuracy(option.key)}
                                    accessibilityLabel={t(option.labelKey)}
                                    accessibilityRole="button"
                                    testID={`accuracy-${option.key}`}
                                >
                                    <View style={[styles.optionButton, isSelected && styles.optionButtonActive]}>
                                        <Text
                                            fontSize="text-sm"
                                            fontWeight={isSelected ? 'semiBold' : 'regular'}
                                            color={isSelected ? colors.neutral.white : colors.journeys.care.text}
                                        >
                                            {t(option.labelKey)}
                                        </Text>
                                    </View>
                                </Touchable>
                            );
                        })}
                    </View>
                </Card>

                {/* Feedback text input */}
                <Card journey="care" elevation="sm">
                    <Text variant="body" fontWeight="semiBold" journey="care">
                        {t('journeys.care.symptomChecker.accuracyRating.additionalFeedback')}
                    </Text>
                    <TextInput
                        style={styles.feedbackInput}
                        value={feedback}
                        onChangeText={setFeedback}
                        placeholder={t('journeys.care.symptomChecker.accuracyRating.feedbackPlaceholder')}
                        placeholderTextColor={colors.neutral.gray500}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        accessibilityLabel={t('journeys.care.symptomChecker.accuracyRating.additionalFeedback')}
                        testID="feedback-input"
                    />
                </Card>

                {/* Submit button */}
                <View style={styles.buttonContainer}>
                    <Button
                        onPress={handleSubmit}
                        journey="care"
                        accessibilityLabel={t('journeys.care.symptomChecker.accuracyRating.submit')}
                        testID="submit-button"
                    >
                        {t('journeys.care.symptomChecker.accuracyRating.submit')}
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.journeys.care.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacingValues.md,
        paddingBottom: spacingValues['3xl'],
    },
    starContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: spacingValues.sm,
        gap: spacingValues.sm,
    },
    star: {
        fontSize: 40,
    },
    starLabel: {
        textAlign: 'center',
        marginTop: spacingValues['3xs'],
    },
    optionsContainer: {
        marginTop: spacingValues.sm,
        gap: spacingValues.xs,
    },
    optionButton: {
        paddingVertical: spacingValues.sm,
        paddingHorizontal: spacingValues.md,
        borderRadius: spacingValues.xs,
        borderWidth: 1,
        borderColor: colors.neutral.gray300,
        alignItems: 'center',
    },
    optionButtonActive: {
        backgroundColor: colors.journeys.care.primary,
        borderColor: colors.journeys.care.primary,
    },
    feedbackInput: {
        marginTop: spacingValues.sm,
        borderWidth: 1,
        borderColor: colors.neutral.gray300,
        borderRadius: spacingValues.xs,
        padding: spacingValues.sm,
        minHeight: 100,
        fontSize: 14,
        color: colors.journeys.care.text,
    },
    buttonContainer: {
        marginTop: spacingValues.xl,
    },
});

export { SymptomAccuracyRating };
export default SymptomAccuracyRating;
