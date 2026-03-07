import React from 'react';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { typography } from 'src/web/design-system/src/tokens/typography';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import { borderRadius } from 'src/web/design-system/src/tokens/borderRadius';

interface Appointment {
    id: string;
    doctorName: string;
    specialty: string;
    dateTime: string;
    isTelemedicine: boolean;
}

const MOCK_APPOINTMENTS: Appointment[] = [
    {
        id: 'appt-1',
        doctorName: 'Dr. Ana Silva',
        specialty: 'Cardiologia',
        dateTime: '22 Fev, 10:00',
        isTelemedicine: true,
    },
    {
        id: 'appt-2',
        doctorName: 'Dr. Carlos Lima',
        specialty: 'Clinica Geral',
        dateTime: '25 Fev, 14:30',
        isTelemedicine: false,
    },
    {
        id: 'appt-3',
        doctorName: 'Dra. Maria Costa',
        specialty: 'Dermatologia',
        dateTime: '01 Mar, 09:00',
        isTelemedicine: true,
    },
];

const AppointmentWidgetPage: React.FC = () => {
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Proximas Consultas</h1>
                <a href="/care/appointments" style={styles.seeAll}>
                    Ver Todas
                </a>
            </div>

            <div style={styles.list}>
                {MOCK_APPOINTMENTS.map((appt) => (
                    <div key={appt.id} style={styles.card}>
                        <div style={styles.cardTop}>
                            <span style={styles.doctorName}>{appt.doctorName}</span>
                            {appt.isTelemedicine && <span style={styles.badge}>Telemedicina</span>}
                        </div>
                        <p style={styles.specialty}>{appt.specialty}</p>
                        <p style={styles.dateTime}>{appt.dateTime}</p>
                        {appt.isTelemedicine && (
                            <a href={`/care/telemedicine?id=${appt.id}`} style={styles.joinBtn}>
                                Entrar na Chamada
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: { maxWidth: '800px', margin: '0 auto', padding: spacing.xl },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl },
    title: {
        fontSize: typography.fontSize['heading-xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral.gray900,
        fontFamily: typography.fontFamily.heading,
        margin: 0,
    },
    seeAll: {
        fontSize: typography.fontSize['text-sm'],
        fontWeight: typography.fontWeight.semiBold,
        color: colors.brand.primary,
        textDecoration: 'none',
    },
    list: { display: 'flex', flexDirection: 'column', gap: spacing.sm },
    card: {
        backgroundColor: colors.neutral.white,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        borderLeft: `4px solid ${colors.journeys.care.primary}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    },
    cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
    doctorName: {
        fontSize: typography.fontSize['text-md'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral.gray900,
        fontFamily: typography.fontFamily.body,
    },
    badge: {
        fontSize: typography.fontSize['text-xs'],
        fontWeight: typography.fontWeight.semiBold,
        color: colors.brand.primary,
        backgroundColor: `${colors.brand.primary}15`,
        padding: `${spacing['4xs']} ${spacing.xs}`,
        borderRadius: borderRadius.full,
    },
    specialty: {
        fontSize: typography.fontSize['text-sm'],
        color: colors.neutral.gray600,
        margin: `0 0 ${spacing['3xs']} 0`,
        fontFamily: typography.fontFamily.body,
    },
    dateTime: {
        fontSize: typography.fontSize['text-sm'],
        fontWeight: typography.fontWeight.semiBold,
        color: colors.journeys.care.primary,
        margin: `0 0 ${spacing.sm} 0`,
        fontFamily: typography.fontFamily.body,
    },
    joinBtn: {
        display: 'inline-block',
        backgroundColor: colors.brand.primary,
        color: colors.neutral.white,
        borderRadius: borderRadius.sm,
        padding: `${spacing.xs} ${spacing.md}`,
        fontSize: typography.fontSize['text-sm'],
        fontWeight: typography.fontWeight.bold,
        textDecoration: 'none',
        fontFamily: typography.fontFamily.body,
        textAlign: 'center',
    },
};

export default AppointmentWidgetPage;
