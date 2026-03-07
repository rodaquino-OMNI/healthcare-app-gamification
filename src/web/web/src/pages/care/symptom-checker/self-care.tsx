import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Badge } from 'src/web/design-system/src/components/Badge/Badge';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

interface SelfCareTip {
    id: string;
    category: string;
    title: string;
    description: string;
}

const SELF_CARE_TIPS: SelfCareTip[] = [
    {
        id: 't1',
        category: 'Hydration',
        title: 'Drink Plenty of Fluids',
        description: 'Aim for 8-10 glasses of water daily. Warm beverages like tea with honey can soothe the throat.',
    },
    {
        id: 't2',
        category: 'Hydration',
        title: 'Avoid Dehydrating Drinks',
        description: 'Limit caffeine and alcohol as they can contribute to dehydration.',
    },
    {
        id: 't3',
        category: 'Rest',
        title: 'Get Adequate Sleep',
        description: 'Aim for 7-9 hours of sleep. Your body heals faster during rest.',
    },
    {
        id: 't4',
        category: 'Rest',
        title: 'Reduce Physical Activity',
        description: 'Avoid strenuous exercise until symptoms improve. Light walking is acceptable.',
    },
    {
        id: 't5',
        category: 'Nutrition',
        title: 'Eat Nutrient-Rich Foods',
        description: 'Focus on fruits, vegetables, and lean proteins. Vitamin C and zinc may support recovery.',
    },
    {
        id: 't6',
        category: 'Nutrition',
        title: 'Warm Soups and Broths',
        description: 'Chicken soup and bone broth provide hydration and nutrients while being easy to digest.',
    },
    {
        id: 't7',
        category: 'Environment',
        title: 'Use a Humidifier',
        description: 'Adding moisture to the air can ease congestion and soothe irritated airways.',
    },
    {
        id: 't8',
        category: 'Environment',
        title: 'Keep Warm and Comfortable',
        description: 'Maintain a comfortable room temperature and dress in layers.',
    },
];

const getCategoryColor = (category: string): 'success' | 'info' | 'warning' => {
    switch (category) {
        case 'Hydration':
            return 'info';
        case 'Nutrition':
            return 'success';
        case 'Environment':
            return 'warning';
        default:
            return 'info';
    }
};

/** Self-care tips page with categorized recommendation cards. */
const SelfCarePage: React.FC = () => {
    const router = useRouter();
    const categories = [...new Set(SELF_CARE_TIPS.map((t) => t.category))];

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                Self-Care Tips
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Follow these recommendations to support your recovery at home.
            </Text>

            {categories.map((category) => (
                <div key={category} style={{ marginBottom: spacing.xl }}>
                    <Box display="flex" alignItems="center" style={{ gap: spacing.xs, marginBottom: spacing.sm }}>
                        <Badge variant="status" status={getCategoryColor(category)}>
                            {category}
                        </Badge>
                    </Box>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                        {SELF_CARE_TIPS.filter((t) => t.category === category).map((tip) => (
                            <Card key={tip.id} journey="care" elevation="sm" padding="lg">
                                <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                                    {tip.title}
                                </Text>
                                <Text fontSize="sm" color={colors.gray[60]} style={{ marginTop: spacing.xs }}>
                                    {tip.description}
                                </Text>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}

            <Box display="flex" justifyContent="space-between" style={{ marginTop: spacing.xl }}>
                <Button
                    variant="secondary"
                    journey="care"
                    onPress={() => router.back()}
                    accessibilityLabel="Go back"
                    data-testid="self-care-back-btn"
                >
                    Back
                </Button>
                <Button
                    journey="care"
                    onPress={() => router.push('/care/symptom-checker/book-appointment')}
                    accessibilityLabel="Book an appointment if needed"
                    data-testid="self-care-book-btn"
                >
                    Book Appointment
                </Button>
            </Box>
        </div>
    );
};

export default SelfCarePage;
