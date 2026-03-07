import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import { CareLayout } from 'src/web/web/src/layouts/CareLayout';
import { JourneyHeader } from 'src/web/web/src/components/shared/JourneyHeader';

interface AppointmentTypeOption {
    id: string;
    label: string;
    description: string;
    icon: string;
    price: string;
}

const TYPES: AppointmentTypeOption[] = [
    {
        id: 'presencial',
        label: 'Presencial',
        description: 'Consulta na clinica com o medico pessoalmente.',
        icon: 'P',
        price: 'R$ 350,00',
    },
    {
        id: 'telemedicina',
        label: 'Telemedicina',
        description: 'Consulta por video chamada, no conforto de casa.',
        icon: 'T',
        price: 'R$ 250,00',
    },
    {
        id: 'domiciliar',
        label: 'Visita Domiciliar',
        description: 'O medico vai ate voce. Ideal para acamados.',
        icon: 'D',
        price: 'R$ 550,00',
    },
];

const AppointmentTypePage: React.FC = () => {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);

    const handleContinue = () => {
        if (selected) {
            router.push({ pathname: '/care/appointments/reason-for-visit', query: { type: selected } });
        }
    };

    return (
        <CareLayout>
            <JourneyHeader title="Tipo de Consulta" />
            <div style={{ maxWidth: '960px', margin: '0 auto', padding: spacing.xl }}>
                <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.xs }}
                >
                    Selecione o tipo de consulta
                </Text>
                <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing.xl }}>
                    Escolha como deseja realizar sua consulta medica.
                </Text>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.md }}>
                    {TYPES.map((t) => {
                        const isSelected = selected === t.id;
                        return (
                            <Card
                                key={t.id}
                                journey="care"
                                elevation={isSelected ? 'md' : 'sm'}
                                interactive
                                onPress={() => setSelected(t.id)}
                                accessibilityLabel={`Selecionar ${t.label}`}
                            >
                                <Box
                                    padding="lg"
                                    style={{
                                        border: isSelected
                                            ? `2px solid ${colors.journeys.care.primary}`
                                            : `2px solid transparent`,
                                        borderRadius: '12px',
                                        backgroundColor: isSelected
                                            ? colors.journeys.care.background
                                            : colors.neutral.white,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '56px',
                                            height: '56px',
                                            borderRadius: '50%',
                                            backgroundColor: isSelected
                                                ? colors.journeys.care.primary
                                                : colors.neutral.gray100,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: spacing.md,
                                        }}
                                    >
                                        <Text
                                            fontSize="xl"
                                            fontWeight="bold"
                                            color={isSelected ? colors.neutral.white : colors.gray[50]}
                                        >
                                            {t.icon}
                                        </Text>
                                    </div>
                                    <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                                        {t.label}
                                    </Text>
                                    <Text
                                        fontSize="sm"
                                        color={colors.gray[50]}
                                        style={{ marginTop: spacing.xs, minHeight: '40px' }}
                                    >
                                        {t.description}
                                    </Text>
                                    <Text
                                        fontWeight="bold"
                                        fontSize="md"
                                        color={colors.journeys.care.primary}
                                        style={{ marginTop: spacing.sm }}
                                    >
                                        {t.price}
                                    </Text>
                                </Box>
                            </Card>
                        );
                    })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: spacing['2xl'] }}>
                    <Button journey="care" onPress={handleContinue} disabled={!selected} accessibilityLabel="Continuar">
                        Continuar
                    </Button>
                </div>
            </div>
        </CareLayout>
    );
};

export default AppointmentTypePage;
