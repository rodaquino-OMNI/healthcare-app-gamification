import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { JourneyHeader } from '@/components/shared/JourneyHeader';
import { CareLayout } from '@/layouts/CareLayout';

type TabKey = 'upcoming' | 'past' | 'cancelled';

interface AppointmentItem {
    id: string;
    doctor: string;
    specialty: string;
    date: string;
    time: string;
    type: string;
    status: TabKey;
}

const TABS: { key: TabKey; label: string }[] = [
    { key: 'upcoming', label: 'Proximas' },
    { key: 'past', label: 'Anteriores' },
    { key: 'cancelled', label: 'Canceladas' },
];

const MOCK_APPOINTMENTS: AppointmentItem[] = [
    {
        id: '1',
        doctor: 'Dra. Ana Silva',
        specialty: 'Cardiologia',
        date: '03/03/2026',
        time: '14:00',
        type: 'Presencial',
        status: 'upcoming',
    },
    {
        id: '2',
        doctor: 'Dr. Carlos Santos',
        specialty: 'Clinico Geral',
        date: '10/03/2026',
        time: '09:30',
        type: 'Telemedicina',
        status: 'upcoming',
    },
    {
        id: '3',
        doctor: 'Dra. Maria Oliveira',
        specialty: 'Dermatologia',
        date: '15/01/2026',
        time: '10:00',
        type: 'Presencial',
        status: 'past',
    },
    {
        id: '4',
        doctor: 'Dr. Pedro Lima',
        specialty: 'Ortopedia',
        date: '20/12/2025',
        time: '16:00',
        type: 'Presencial',
        status: 'past',
    },
    {
        id: '5',
        doctor: 'Dra. Lucia Ferreira',
        specialty: 'Pediatria',
        date: '08/01/2026',
        time: '11:00',
        type: 'Telemedicina',
        status: 'cancelled',
    },
];

const STATUS_COLORS: Record<TabKey, { bg: string; text: string }> = {
    upcoming: { bg: colors.semantic.successBg, text: colors.semantic.success },
    past: { bg: colors.neutral.gray100, text: colors.gray[50] },
    cancelled: { bg: colors.semantic.errorBg, text: colors.semantic.error },
};

const STATUS_LABELS: Record<TabKey, string> = {
    upcoming: 'Confirmada',
    past: 'Concluida',
    cancelled: 'Cancelada',
};

const ListPage: React.FC = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabKey>('upcoming');

    const filtered = MOCK_APPOINTMENTS.filter((a) => a.status === activeTab);

    return (
        <CareLayout>
            <JourneyHeader title="Minhas Consultas" />
            <div style={{ maxWidth: '960px', margin: '0 auto', padding: spacing.xl }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: spacing.xl,
                    }}
                >
                    <div style={{ display: 'flex', gap: spacing.xs }}>
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                aria-pressed={activeTab === tab.key}
                                style={{
                                    padding: `${spacing.xs} ${spacing.md}`,
                                    borderRadius: '20px',
                                    border: 'none',
                                    backgroundColor:
                                        activeTab === tab.key ? colors.journeys.care.primary : colors.neutral.gray100,
                                    color: activeTab === tab.key ? colors.neutral.white : colors.gray[50],
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <Button
                        journey="care"
                        onPress={() => void router.push('/care/appointments/search')}
                        accessibilityLabel="Nova consulta"
                    >
                        Nova Consulta
                    </Button>
                </div>

                {filtered.length === 0 ? (
                    <Card journey="care" elevation="sm">
                        <Box padding="xl" style={{ textAlign: 'center' }}>
                            <Text fontSize="md" color={colors.gray[50]}>
                                Nenhuma consulta nesta categoria.
                            </Text>
                        </Box>
                    </Card>
                ) : (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: spacing.md,
                        }}
                    >
                        {filtered.map((apt) => (
                            <Card
                                key={apt.id}
                                journey="care"
                                elevation="sm"
                                interactive
                                onPress={() => void router.push(`/care/appointments/${apt.id}`)}
                                accessibilityLabel={`Consulta com ${apt.doctor}`}
                            >
                                <Box padding="md">
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: spacing.xs,
                                        }}
                                    >
                                        <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                                            {apt.doctor}
                                        </Text>
                                        <span
                                            style={{
                                                padding: `${spacing['3xs']} ${spacing.xs}`,
                                                borderRadius: '12px',
                                                backgroundColor: STATUS_COLORS[apt.status].bg,
                                                color: STATUS_COLORS[apt.status].text,
                                                fontSize: '12px',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {STATUS_LABELS[apt.status]}
                                        </span>
                                    </div>
                                    <Text fontSize="sm" color={colors.gray[50]}>
                                        {apt.specialty}
                                    </Text>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginTop: spacing.sm,
                                        }}
                                    >
                                        <Text fontSize="sm" color={colors.journeys.care.text}>
                                            {apt.date} - {apt.time}
                                        </Text>
                                        <span
                                            style={{
                                                padding: `${spacing['3xs']} ${spacing.xs}`,
                                                borderRadius: '12px',
                                                backgroundColor: colors.journeys.care.background,
                                                color: colors.journeys.care.primary,
                                                fontSize: '12px',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {apt.type}
                                        </span>
                                    </div>
                                </Box>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </CareLayout>
    );
};

export default ListPage;
