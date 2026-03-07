import type { Meta, StoryObj } from '@storybook/react';
import { AppointmentCard } from './AppointmentCard';

const meta: Meta<typeof AppointmentCard> = {
    title: 'Care/AppointmentCard',
    component: AppointmentCard,
    tags: ['autodocs'],
    argTypes: {
        showActions: { control: 'boolean' },
        onViewDetails: { action: 'view-details' },
        onReschedule: { action: 'reschedule' },
        onCancel: { action: 'cancel' },
        onJoinTelemedicine: { action: 'join-telemedicine' },
    },
};

export default meta;
type Story = StoryObj<typeof AppointmentCard>;

const cardioProvider = {
    id: 'p1',
    name: 'Dr. Rafael Cardoso',
    specialty: 'Cardiologia',
    rating: 4.8,
};

const upcomingAppointment = {
    id: 'a1',
    dateTime: '2026-03-15T14:30:00',
    type: 'in_person' as const,
    status: 'upcoming' as const,
    reason: 'Consulta de rotina',
};

const telemedicineAppointment = {
    id: 'a2',
    dateTime: '2026-03-10T10:00:00',
    type: 'telemedicine' as const,
    status: 'upcoming' as const,
    reason: 'Acompanhamento pós-operatório',
};

export const Default: Story = {
    args: {
        appointment: upcomingAppointment,
        provider: cardioProvider,
        showActions: false,
    },
};

export const Telemedicine: Story = {
    args: {
        appointment: telemedicineAppointment,
        provider: {
            id: 'p2',
            name: 'Dra. Ana Beatriz Lima',
            specialty: 'Clínica Geral',
            rating: 4.9,
        },
        showActions: true,
        onViewDetails: () => {},
        onJoinTelemedicine: () => {},
    },
};

export const InPerson: Story = {
    args: {
        appointment: upcomingAppointment,
        provider: cardioProvider,
        showActions: true,
        onViewDetails: () => {},
        onReschedule: () => {},
        onCancel: () => {},
    },
};

export const WithActions: Story = {
    args: {
        appointment: upcomingAppointment,
        provider: cardioProvider,
        showActions: true,
        onViewDetails: () => {},
        onReschedule: () => {},
        onCancel: () => {},
    },
};

export const Completed: Story = {
    args: {
        appointment: {
            id: 'a3',
            dateTime: '2026-02-01T09:00:00',
            type: 'in_person' as const,
            status: 'completed' as const,
            notes: 'Paciente com excelente evolução.',
        },
        provider: {
            id: 'p3',
            name: 'Dr. Marcos Oliveira',
            specialty: 'Ortopedia',
            rating: 4.7,
        },
        showActions: true,
        onViewDetails: () => {},
    },
};

export const Cancelled: Story = {
    args: {
        appointment: {
            id: 'a4',
            dateTime: '2026-02-20T15:00:00',
            type: 'in_person' as const,
            status: 'cancelled' as const,
        },
        provider: {
            id: 'p4',
            name: 'Dra. Juliana Costa',
            specialty: 'Dermatologia',
            rating: 4.6,
        },
        showActions: false,
    },
};
