import type { Meta, StoryObj } from '@storybook/react';

import { ProviderCard } from './ProviderCard';

const meta: Meta<typeof ProviderCard> = {
    title: 'Care/ProviderCard',
    component: ProviderCard,
    tags: ['autodocs'],
    argTypes: {
        onPress: { action: 'pressed' },
    },
};

export default meta;
type Story = StoryObj<typeof ProviderCard>;

export const Default: Story = {
    args: {
        provider: {
            id: 'p1',
            name: 'Dr. Rafael Cardoso',
            specialty: 'Cardiologia',
            rating: 4.8,
            reviewCount: 234,
        },
    },
};

export const WithInsurance: Story = {
    args: {
        provider: {
            id: 'p2',
            name: 'Dra. Ana Beatriz Lima',
            specialty: 'Clínica Geral',
            rating: 4.9,
            reviewCount: 512,
            isCoveredByInsurance: true,
            location: {
                name: 'Clínica São Lucas',
                distance: 2.3,
            },
        },
        onPress: () => {},
    },
};

export const WithTelemedicine: Story = {
    args: {
        provider: {
            id: 'p3',
            name: 'Dr. Marcos Oliveira',
            specialty: 'Neurologia',
            rating: 4.7,
            reviewCount: 189,
            isTelemedicineAvailable: true,
            isCoveredByInsurance: true,
        },
        onPress: () => {},
    },
};

export const FullDetails: Story = {
    args: {
        provider: {
            id: 'p4',
            name: 'Dra. Juliana Costa',
            specialty: 'Dermatologia',
            rating: 4.6,
            reviewCount: 321,
            location: {
                name: 'Centro Médico Ipiranga',
                distance: 5.1,
            },
            availability: [{ date: 'Terça-feira, 10 de março', times: ['09:00', '10:30', '14:00', '16:30'] }],
            isCoveredByInsurance: false,
            isTelemedicineAvailable: true,
        },
        onPress: () => {},
    },
};

export const NotCoveredByInsurance: Story = {
    args: {
        provider: {
            id: 'p5',
            name: 'Dr. Eduardo Santos',
            specialty: 'Ortopedia',
            rating: 4.5,
            reviewCount: 156,
            isCoveredByInsurance: false,
            location: {
                name: 'Hospital Santa Casa',
                distance: 8.7,
            },
        },
        onPress: () => {},
    },
};

export const NoReviews: Story = {
    args: {
        provider: {
            id: 'p6',
            name: 'Dra. Patricia Mendes',
            specialty: 'Pediatria',
            rating: 0,
            reviewCount: 0,
        },
    },
};
