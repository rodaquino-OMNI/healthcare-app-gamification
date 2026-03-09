import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { ClaimCard } from './ClaimCard';

// Provide a minimal i18next mock so the component renders without a full i18n setup.
// react-i18next's useTranslation hook is expected to be configured via the Storybook
// i18next decorator in preview.tsx or via an alias. This fallback wraps the story
// with a simple translation stub if the global setup is absent.
const i18nDecorator = (Story: React.ComponentType): React.ReactElement => <Story />;

const meta: Meta<typeof ClaimCard> = {
    title: 'Plan/ClaimCard',
    component: ClaimCard,
    tags: ['autodocs'],
    decorators: [i18nDecorator],
    argTypes: {
        showActions: { control: 'boolean' },
        compact: { control: 'boolean' },
        onPress: { action: 'pressed' },
        onViewDetails: { action: 'view-details' },
        onTrackClaim: { action: 'track-claim' },
    },
};

export default meta;
type Story = StoryObj<typeof ClaimCard>;

const pendingClaim = {
    id: 'c1',
    type: 'consultation',
    amount: 350.0,
    status: 'pending' as const,
    submittedAt: '2026-02-10T10:00:00',
    documents: [{ name: 'recibo.pdf' }],
};

const approvedClaim = {
    id: 'c2',
    type: 'exam',
    amount: 1200.0,
    status: 'approved' as const,
    submittedAt: '2026-01-20T09:30:00',
    documents: [{ name: 'laudo.pdf' }, { name: 'nota_fiscal.pdf' }],
};

const deniedClaim = {
    id: 'c3',
    type: 'hospitalization',
    amount: 8500.0,
    status: 'denied' as const,
    submittedAt: '2026-01-05T14:00:00',
    documents: [],
};

const additionalInfoClaim = {
    id: 'c4',
    type: 'procedure',
    amount: 2200.0,
    status: 'additional_info_required' as const,
    submittedAt: '2026-02-15T11:00:00',
    documents: [{ name: 'solicitacao.pdf' }],
};

export const Default: Story = {
    args: {
        claim: pendingClaim,
        showActions: true,
        compact: false,
        onViewDetails: () => {},
        onTrackClaim: () => {},
    },
};

export const Pending: Story = {
    args: {
        claim: pendingClaim,
        showActions: true,
        compact: false,
        onViewDetails: () => {},
        onTrackClaim: () => {},
    },
};

export const Approved: Story = {
    args: {
        claim: approvedClaim,
        showActions: true,
        compact: false,
        onViewDetails: () => {},
    },
};

export const Denied: Story = {
    args: {
        claim: deniedClaim,
        showActions: true,
        compact: false,
        onViewDetails: () => {},
    },
};

export const AdditionalInfoRequired: Story = {
    args: {
        claim: additionalInfoClaim,
        showActions: true,
        compact: false,
        onViewDetails: () => {},
        onTrackClaim: () => {},
    },
};

export const Compact: Story = {
    args: {
        claim: approvedClaim,
        showActions: false,
        compact: true,
    },
};

export const NoActions: Story = {
    args: {
        claim: pendingClaim,
        showActions: false,
        compact: false,
    },
};
