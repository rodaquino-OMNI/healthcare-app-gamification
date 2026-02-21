import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import { WEB_CARE_ROUTES } from 'src/web/shared/constants/routes';

const STAR_COUNT = 5;

/** Accuracy rating page with star rating and optional feedback form. */
const AccuracyRatingPage: React.FC = () => {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const getRatingLabel = (value: number): string => {
    switch (value) {
      case 1: return 'Not accurate at all';
      case 2: return 'Somewhat inaccurate';
      case 3: return 'Neutral';
      case 4: return 'Mostly accurate';
      case 5: return 'Very accurate';
      default: return 'Select a rating';
    }
  };

  if (submitted) {
    return (
      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: spacing.xl,
          minHeight: '40vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card journey="care" elevation="md" padding="lg" style={{ textAlign: 'center', width: '100%' }}>
          <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.primary}>
            Thank You!
          </Text>
          <Text
            fontSize="md"
            color={colors.gray[50]}
            style={{ marginTop: spacing.sm, marginBottom: spacing.xl }}
          >
            Your feedback helps us improve the accuracy of our symptom assessments.
          </Text>
          <Button
            journey="care"
            onPress={() => router.push(WEB_CARE_ROUTES.SYMPTOM_CHECKER)}
            accessibilityLabel="Return to symptom checker"
            data-testid="rating-done-btn"
          >
            Done
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
      <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
        Rate Assessment Accuracy
      </Text>
      <Text
        fontSize="md"
        color={colors.gray[50]}
        style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}
      >
        How accurate was the symptom assessment? Your feedback helps improve future results.
      </Text>

      <Card journey="care" elevation="md" padding="lg">
        <Box display="flex" justifyContent="center" style={{ gap: spacing.sm, marginBottom: spacing.sm }}>
          {Array.from({ length: STAR_COUNT }, (_, i) => {
            const starValue = i + 1;
            const isActive = starValue <= (hoveredStar || rating);
            return (
              <button
                key={starValue}
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHoveredStar(starValue)}
                onMouseLeave={() => setHoveredStar(0)}
                data-testid={`star-${starValue}`}
                aria-label={`Rate ${starValue} out of ${STAR_COUNT}`}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '36px',
                  color: isActive ? colors.journeys.care.primary : colors.neutral.gray300,
                  transition: 'color 0.2s, transform 0.1s',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  padding: spacing['3xs'],
                }}
              >
                {'\u2605'}
              </button>
            );
          })}
        </Box>
        <Text
          fontSize="sm"
          color={colors.gray[50]}
          style={{ textAlign: 'center', marginBottom: spacing.lg }}
        >
          {getRatingLabel(hoveredStar || rating)}
        </Text>

        <div style={{ marginBottom: spacing.md }}>
          <label htmlFor="feedback">
            <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.text}>
              Additional Feedback (optional)
            </Text>
          </label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us more about your experience..."
            data-testid="rating-feedback-textarea"
            rows={4}
            style={{
              width: '100%',
              marginTop: spacing.xs,
              padding: spacing.sm,
              border: `1px solid ${colors.neutral.gray300}`,
              borderRadius: '6px',
              fontSize: '14px',
              color: colors.journeys.care.text,
              resize: 'vertical',
              fontFamily: 'inherit',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </Card>

      <Box display="flex" justifyContent="space-between" style={{ marginTop: spacing['2xl'] }}>
        <Button
          variant="tertiary"
          journey="care"
          onPress={() => router.push(WEB_CARE_ROUTES.SYMPTOM_CHECKER)}
          accessibilityLabel="Skip rating"
          data-testid="rating-skip-btn"
        >
          Skip
        </Button>
        <Button
          journey="care"
          onPress={handleSubmit}
          disabled={rating === 0}
          accessibilityLabel="Submit your rating"
          data-testid="rating-submit-btn"
        >
          Submit Rating
        </Button>
      </Box>
    </div>
  );
};

export default AccuracyRatingPage;
