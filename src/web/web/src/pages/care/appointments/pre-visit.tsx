import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { JourneyHeader } from '@/components/shared/JourneyHeader';
import { useAppointments } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';
import { CareLayout } from '@/layouts/CareLayout';

interface ChecklistItem {
    id: string;
    label: string;
    section: string;
    checked: boolean;
}

const INITIAL_CHECKLIST: ChecklistItem[] = [
    {
        id: '1',
        label: 'Documento de identidade (RG ou CNH)',
        section: 'Documentos',
        checked: false,
    },
    { id: '2', label: 'Carteira do convenio', section: 'Documentos', checked: false },
    { id: '3', label: 'Pedido medico / encaminhamento', section: 'Documentos', checked: false },
    { id: '4', label: 'Resultados de exames anteriores', section: 'Exames', checked: false },
    { id: '5', label: 'Lista de medicamentos em uso', section: 'Exames', checked: false },
    { id: '6', label: 'Anotar sintomas e duvidas', section: 'Preparacao', checked: false },
    { id: '7', label: 'Jejum (se necessario)', section: 'Preparacao', checked: false },
    { id: '8', label: 'Confirmar endereco da clinica', section: 'Logistica', checked: false },
    {
        id: '9',
        label: 'Verificar transporte / estacionamento',
        section: 'Logistica',
        checked: false,
    },
];

const PreVisitPage: React.FC = () => {
    const router = useRouter();
    const { appointments: _appointments, loading, error } = useAppointments();
    const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);
    const { t } = useTranslation();

    if (loading) {
        return (
            <CareLayout>
                <JourneyHeader title="Checklist Pre-Consulta" />
                <div style={{ maxWidth: '640px', margin: '0 auto', padding: spacing.xl, textAlign: 'center' }}>
                    <Text fontSize="md" color={colors.gray[50]}>
                        {t('common.loading')}
                    </Text>
                </div>
            </CareLayout>
        );
    }

    if (error) {
        return (
            <CareLayout>
                <JourneyHeader title="Checklist Pre-Consulta" />
                <div style={{ maxWidth: '640px', margin: '0 auto', padding: spacing.xl, textAlign: 'center' }}>
                    <Text fontSize="md" color={colors.semantic.error}>
                        {t('common.error')}
                    </Text>
                </div>
            </CareLayout>
        );
    }

    const toggleItem = (id: string): void => {
        setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
    };

    const completedCount = checklist.filter((item) => item.checked).length;
    const totalCount = checklist.length;
    const allDone = completedCount === totalCount;
    const progressPercent = Math.round((completedCount / totalCount) * 100);

    const sections = Array.from(new Set(checklist.map((item) => item.section)));

    return (
        <CareLayout>
            <JourneyHeader title="Checklist Pre-Consulta" />
            <div style={{ maxWidth: '640px', margin: '0 auto', padding: spacing.xl }}>
                <Card journey="care" elevation="sm" style={{ marginBottom: spacing.xl }}>
                    <Box padding="md">
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: spacing.xs,
                            }}
                        >
                            <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                                Dra. Ana Silva — Cardiologia
                            </Text>
                            <Text fontSize="sm" color={colors.journeys.care.primary}>
                                03/03/2026 14:00
                            </Text>
                        </div>
                    </Box>
                </Card>

                {/* Progress */}
                <div style={{ marginBottom: spacing.xl }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: spacing.xs,
                        }}
                    >
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Progresso
                        </Text>
                        <Text fontSize="sm" fontWeight="bold" color={colors.journeys.care.primary}>
                            {completedCount}/{totalCount} ({progressPercent}%)
                        </Text>
                    </div>
                    <div
                        style={{
                            height: '8px',
                            backgroundColor: colors.neutral.gray100,
                            borderRadius: '4px',
                        }}
                    >
                        <div
                            style={{
                                width: `${progressPercent}%`,
                                height: '100%',
                                backgroundColor: allDone ? colors.semantic.success : colors.journeys.care.primary,
                                borderRadius: '4px',
                                transition: 'width 0.3s ease',
                            }}
                        />
                    </div>
                </div>

                {sections.map((section) => (
                    <div key={section} style={{ marginBottom: spacing.xl }}>
                        <Text
                            fontWeight="bold"
                            fontSize="md"
                            color={colors.journeys.care.text}
                            style={{ marginBottom: spacing.sm }}
                        >
                            {section}
                        </Text>
                        <div style={{ display: 'grid', gap: spacing.xs }}>
                            {checklist
                                .filter((item) => item.section === section)
                                .map((item) => (
                                    <label
                                        key={item.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: spacing.sm,
                                            padding: spacing.sm,
                                            borderRadius: '8px',
                                            backgroundColor: item.checked
                                                ? colors.semantic.successBg
                                                : colors.neutral.white,
                                            border: `1px solid ${
                                                item.checked ? colors.semantic.success : colors.neutral.gray300
                                            }`,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={item.checked}
                                            onChange={() => toggleItem(item.id)}
                                            aria-label={item.label}
                                            style={{ accentColor: colors.journeys.care.primary }}
                                        />
                                        <Text
                                            fontSize="sm"
                                            color={item.checked ? colors.semantic.success : colors.journeys.care.text}
                                            style={{
                                                textDecoration: item.checked ? 'line-through' : 'none',
                                            }}
                                        >
                                            {item.label}
                                        </Text>
                                    </label>
                                ))}
                        </div>
                    </div>
                ))}

                {allDone && (
                    <Card
                        journey="care"
                        elevation="md"
                        style={{
                            borderLeft: `4px solid ${colors.semantic.success}`,
                            marginBottom: spacing.xl,
                        }}
                    >
                        <Box padding="md" style={{ textAlign: 'center' }}>
                            <Text fontWeight="bold" fontSize="lg" color={colors.semantic.success}>
                                Tudo pronto!
                            </Text>
                            <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing.xs }}>
                                Voce esta preparado(a) para sua consulta.
                            </Text>
                        </Box>
                    </Card>
                )}

                <div style={{ textAlign: 'center' }}>
                    <Button journey="care" variant="outlined" onPress={() => router.back()} accessibilityLabel="Voltar">
                        Voltar
                    </Button>
                </div>
            </div>
        </CareLayout>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default PreVisitPage;
