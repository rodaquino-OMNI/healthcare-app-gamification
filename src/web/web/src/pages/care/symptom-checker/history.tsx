import { Badge } from 'design-system/components/Badge/Badge';
import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WEB_CARE_ROUTES } from 'shared/constants/routes';

import { useSymptomChecker } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

type FilterTab = 'all' | 'recent' | 'resolved' | 'ongoing';

interface CheckHistory {
    id: string;
    date: string;
    primarySymptom: string;
    topCondition: string;
    severity: 'low' | 'moderate' | 'high';
    status: 'resolved' | 'ongoing';
}

const MOCK_HISTORY: CheckHistory[] = [
    {
        id: 'h1',
        date: '2026-02-18',
        primarySymptom: 'Headache, nasal congestion',
        topCondition: 'Upper Respiratory Infection',
        severity: 'low',
        status: 'ongoing',
    },
    {
        id: 'h2',
        date: '2026-02-10',
        primarySymptom: 'Sore throat, fever',
        topCondition: 'Pharyngitis',
        severity: 'moderate',
        status: 'resolved',
    },
    {
        id: 'h3',
        date: '2026-01-25',
        primarySymptom: 'Lower back pain',
        topCondition: 'Lumbar Strain',
        severity: 'low',
        status: 'resolved',
    },
    {
        id: 'h4',
        date: '2026-01-15',
        primarySymptom: 'Chest tightness, wheezing',
        topCondition: 'Asthma Exacerbation',
        severity: 'high',
        status: 'resolved',
    },
    {
        id: 'h5',
        date: '2025-12-28',
        primarySymptom: 'Stomach pain, nausea',
        topCondition: 'Gastritis',
        severity: 'moderate',
        status: 'resolved',
    },
];

const FILTER_TABS: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'recent', label: 'Last 30 Days' },
    { key: 'resolved', label: 'Resolved' },
    { key: 'ongoing', label: 'Ongoing' },
];

const getSeverityStatus = (s: string): 'success' | 'warning' | 'error' => {
    if (s === 'high') {
        return 'error';
    }
    if (s === 'moderate') {
        return 'warning';
    }
    return 'success';
};

/** Past symptom checks history page with filter tabs and timeline layout. */
const HistoryPage: React.FC = () => {
    const router = useRouter();
    const { symptoms: _symptoms, results: _results, isLoading, error } = useSymptomChecker();
    const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.gray[50]}>
                    {t('common.loading')}
                </Text>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.semantic.error}>
                    {error.message}
                </Text>
            </div>
        );
    }

    const filteredHistory = MOCK_HISTORY.filter((item) => {
        if (activeFilter === 'all') {
            return true;
        }
        if (activeFilter === 'recent') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return new Date(item.date) >= thirtyDaysAgo;
        }
        return item.status === activeFilter;
    });

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                Symptom Check History
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}>
                Review your past symptom assessments and their outcomes.
            </Text>

            <Box display="flex" style={{ gap: spacing.xs, marginBottom: spacing.xl, flexWrap: 'wrap' }}>
                {FILTER_TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveFilter(tab.key)}
                        data-testid={`history-filter-${tab.key}`}
                        style={{
                            padding: `${spacing.xs} ${spacing.md}`,
                            borderRadius: '20px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: activeFilter === tab.key ? 'bold' : 'normal',
                            backgroundColor:
                                activeFilter === tab.key ? colors.journeys.care.primary : colors.neutral.gray200,
                            color: activeFilter === tab.key ? colors.neutral.white : colors.gray[60],
                            transition: 'all 0.2s',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </Box>

            {filteredHistory.length === 0 ? (
                <Card journey="care" elevation="sm" padding="lg">
                    <Text fontSize="md" color={colors.gray[50]} style={{ textAlign: 'center' }}>
                        No symptom checks found for this filter.
                    </Text>
                </Card>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                    {filteredHistory.map((item) => (
                        <Card
                            key={item.id}
                            journey="care"
                            elevation="sm"
                            padding="lg"
                            interactive
                            onPress={() =>
                                void router.push({
                                    pathname: '/care/symptom-checker/condition-detail',
                                    query: { checkId: item.id },
                                })
                            }
                            accessibilityLabel={`Symptom check from ${item.date}`}
                        >
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                <div>
                                    <Text fontSize="xs" color={colors.gray[40]}>
                                        {item.date}
                                    </Text>
                                    <Text fontWeight="bold" fontSize="md" style={{ marginTop: spacing['3xs'] }}>
                                        {item.topCondition}
                                    </Text>
                                    <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing['3xs'] }}>
                                        {item.primarySymptom}
                                    </Text>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-end',
                                        gap: spacing['3xs'],
                                    }}
                                >
                                    <Badge variant="status" status={getSeverityStatus(item.severity)}>
                                        {item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}
                                    </Badge>
                                    <Badge variant="status" status={item.status === 'ongoing' ? 'warning' : 'success'}>
                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                    </Badge>
                                </div>
                            </Box>
                        </Card>
                    ))}
                </div>
            )}

            <Box display="flex" justifyContent="space-between" style={{ marginTop: spacing['2xl'] }}>
                <Button
                    variant="secondary"
                    journey="care"
                    onPress={() => router.back()}
                    accessibilityLabel="Go back"
                    data-testid="history-back-btn"
                >
                    Back
                </Button>
                <Button
                    journey="care"
                    onPress={() => void router.push(WEB_CARE_ROUTES.SYMPTOM_BODY_MAP)}
                    accessibilityLabel="Start new symptom check"
                    data-testid="history-new-check-btn"
                >
                    New Check
                </Button>
            </Box>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default HistoryPage;
