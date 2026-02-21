import React from 'react';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

interface StepProps {
  data: Record<string, any>;
  onUpdate: (field: string, value: any) => void;
}

interface CategoryConfig {
  key: string;
  label: string;
  subLabels: string[];
}

const CATEGORIES: CategoryConfig[] = [
  { key: 'physical', label: 'Physical Health', subLabels: ['Exercise', 'BMI'] },
  { key: 'nutrition', label: 'Nutrition', subLabels: ['Diet', 'Hydration'] },
  { key: 'mental', label: 'Mental Health', subLabels: ['Stress', 'Mood'] },
  { key: 'lifestyle', label: 'Lifestyle', subLabels: ['Sleep', 'Habits'] },
];

const getScoreColor = (score: number): string => {
  if (score >= 80) return colors.semantic.success;
  if (score >= 60) return colors.semantic.warning;
  return colors.semantic.error;
};

const getScoreLabel = (score: number): string => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  return 'Needs Improvement';
};

const StepResultsHealthScorePage: React.FC<StepProps> = ({ data, onUpdate }) => {
  const overallScore: number = data.overallScore ?? 0;
  const categoryScores: Record<string, number> = data.categoryScores ?? {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, alignItems: 'center' }}>
      <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.text} style={{ textAlign: 'center' }}>
        Your Health Score
      </Text>

      {/* Circular Score Display */}
      <div
        style={{
          width: 140,
          height: 140,
          borderRadius: 70,
          border: `10px solid ${getScoreColor(overallScore)}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.neutral.white,
        }}
      >
        <span style={{ fontSize: 36, fontWeight: 700, color: colors.brand.primary }}>
          {overallScore}
        </span>
        <Text fontSize="xs" color={colors.neutral.gray600}>out of 100</Text>
      </div>
      <Text fontSize="sm" fontWeight="medium" color={getScoreColor(overallScore)} style={{ textAlign: 'center' }}>
        {getScoreLabel(overallScore)}
      </Text>

      {/* Category Breakdown */}
      <div style={{ width: '100%' }}>
        <Text fontSize="md" fontWeight="semiBold" color={colors.journeys.health.text} style={{ marginBottom: spacing.sm }}>
          Score Breakdown
        </Text>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
          {CATEGORIES.map((cat) => {
            const score: number = categoryScores[cat.key] ?? 0;
            const barColor = getScoreColor(score);
            return (
              <Card key={cat.key} journey="health" elevation="sm" padding="md">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                  <Text fontSize="sm" fontWeight="semiBold" color={colors.neutral.gray900}>
                    {cat.label}
                  </Text>
                  <Text fontSize="sm" fontWeight="bold" color={barColor}>
                    {score}
                  </Text>
                </div>
                {/* Progress Bar */}
                <div
                  style={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: colors.neutral.gray200,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: 8,
                      borderRadius: 4,
                      width: `${Math.min(score, 100)}%`,
                      backgroundColor: barColor,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: spacing['3xs'] }}>
                  {cat.subLabels.map((sub) => (
                    <Text key={sub} fontSize="xs" color={colors.neutral.gray600}>{sub}</Text>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CTA Buttons */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        <button
          onClick={() => onUpdate('viewRecommendations', true)}
          style={{
            width: '100%',
            padding: spacing.md,
            borderRadius: 8,
            border: 'none',
            backgroundColor: colors.journeys.health.primary,
            color: colors.neutral.white,
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 600,
          }}
          aria-label="View recommendations"
        >
          View Recommendations
        </button>
        <button
          onClick={() => onUpdate('shareWithDoctor', true)}
          style={{
            width: '100%',
            padding: spacing.md,
            borderRadius: 8,
            border: `1px solid ${colors.journeys.health.primary}`,
            backgroundColor: colors.neutral.white,
            color: colors.journeys.health.primary,
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 600,
          }}
          aria-label="Share with doctor"
        >
          Share with Doctor
        </button>
      </div>
    </div>
  );
};

export default StepResultsHealthScorePage;
