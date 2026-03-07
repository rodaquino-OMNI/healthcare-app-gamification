import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { CareLayout } from '@/layouts/CareLayout';
import { JourneyHeader } from '@/components/shared/JourneyHeader';

interface InsurancePlan {
    id: string;
    name: string;
    number: string;
}

const PLANS: InsurancePlan[] = [
    { id: '1', name: 'AUSTA Saude Premium', number: '****-4521' },
    { id: '2', name: 'AUSTA Saude Basico', number: '****-7890' },
    { id: '3', name: 'Particular (sem convenio)', number: '' },
];

const InsurancePage: React.FC = () => {
    const router = useRouter();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [verified, setVerified] = useState(false);

    const handleVerify = () => {
        setVerified(true);
    };

    const isCovered = selectedPlan !== '3';

    const handleContinue = () => {
        router.push('/care/appointments/success');
    };

    return (
        <CareLayout>
            <JourneyHeader title="Verificacao de Convenio" />
            <div style={{ maxWidth: '640px', margin: '0 auto', padding: spacing.xl }}>
                <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.md }}
                >
                    Selecione seu plano de saude
                </Text>

                <div style={{ display: 'grid', gap: spacing.sm, marginBottom: spacing.xl }}>
                    {PLANS.map((plan) => {
                        const isSelected = selectedPlan === plan.id;
                        return (
                            <label
                                key={plan.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: spacing.sm,
                                    padding: spacing.md,
                                    borderRadius: '8px',
                                    border: `2px solid ${isSelected ? colors.journeys.care.primary : colors.neutral.gray300}`,
                                    backgroundColor: isSelected
                                        ? colors.journeys.care.background
                                        : colors.neutral.white,
                                    cursor: 'pointer',
                                }}
                            >
                                <input
                                    type="radio"
                                    name="plan"
                                    value={plan.id}
                                    checked={isSelected}
                                    onChange={() => {
                                        setSelectedPlan(plan.id);
                                        setVerified(false);
                                    }}
                                    aria-label={plan.name}
                                    style={{ accentColor: colors.journeys.care.primary }}
                                />
                                <div>
                                    <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                                        {plan.name}
                                    </Text>
                                    {plan.number && (
                                        <Text fontSize="sm" color={colors.gray[50]}>
                                            {plan.number}
                                        </Text>
                                    )}
                                </div>
                            </label>
                        );
                    })}
                </div>

                {selectedPlan && !verified && (
                    <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
                        <Button
                            journey="care"
                            variant="outlined"
                            onPress={handleVerify}
                            accessibilityLabel="Verificar cobertura"
                        >
                            Verificar Cobertura
                        </Button>
                    </div>
                )}

                {verified && (
                    <Card journey="care" elevation="md" style={{ marginBottom: spacing.xl }}>
                        <Box padding="lg">
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: spacing.sm,
                                    marginBottom: spacing.md,
                                }}
                            >
                                <span
                                    style={{
                                        padding: `${spacing['3xs']} ${spacing.xs}`,
                                        borderRadius: '12px',
                                        backgroundColor: isCovered
                                            ? colors.semantic.successBg
                                            : colors.semantic.warningBg,
                                        color: isCovered ? colors.semantic.success : colors.semantic.warning,
                                        fontSize: '12px',
                                        fontWeight: 600,
                                    }}
                                >
                                    {isCovered ? 'Coberto' : 'Particular'}
                                </span>
                                <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                                    {isCovered ? 'Consulta coberta pelo convenio' : 'Pagamento particular'}
                                </Text>
                            </div>
                            <div style={{ display: 'grid', gap: spacing.sm }}>
                                <div>
                                    <Text fontSize="sm" color={colors.gray[50]}>
                                        Copagamento
                                    </Text>
                                    <Text fontWeight="bold" color={colors.journeys.care.text}>
                                        {isCovered ? 'R$ 50,00' : 'R$ 350,00'}
                                    </Text>
                                </div>
                                <div>
                                    <Text fontSize="sm" color={colors.gray[50]}>
                                        Cobertura
                                    </Text>
                                    <Text fontWeight="bold" color={colors.journeys.care.text}>
                                        {isCovered ? '85%' : '0%'}
                                    </Text>
                                </div>
                                <div>
                                    <Text fontSize="sm" color={colors.gray[50]}>
                                        Autorizacao
                                    </Text>
                                    <Text fontWeight="bold" color={colors.journeys.care.text}>
                                        {isCovered ? 'Nao necessaria' : 'N/A'}
                                    </Text>
                                </div>
                            </div>
                        </Box>
                    </Card>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: spacing.xl }}>
                    <Button journey="care" variant="outlined" onPress={() => router.back()} accessibilityLabel="Voltar">
                        Voltar
                    </Button>
                    <Button journey="care" onPress={handleContinue} disabled={!verified} accessibilityLabel="Continuar">
                        Continuar
                    </Button>
                </div>
            </div>
        </CareLayout>
    );
};

export default InsurancePage;
