import { colors, typography, spacing, borderRadius } from 'design-system/tokens';
import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import { useAuth } from '@/hooks/useAuth';

interface ContactChannel {
    id: string;
    title: string;
    description: string;
    availability: string;
    icon: string;
    action: string;
}

const CHANNELS: ContactChannel[] = [
    {
        id: 'chat',
        title: 'Chat ao Vivo',
        description: 'Converse em tempo real com um atendente',
        availability: 'Seg-Sex, 8h-20h',
        icon: 'C',
        action: '/help/chat',
    },
    {
        id: 'phone',
        title: 'Telefone',
        description: 'Ligue para nossa central de atendimento',
        availability: '24 horas, 7 dias',
        icon: 'T',
        action: 'tel:08001234567',
    },
    {
        id: 'email',
        title: 'Email',
        description: 'Envie sua duvida por email',
        availability: 'Resposta em ate 24h',
        icon: 'E',
        action: 'mailto:suporte@austa.com.br',
    },
    {
        id: 'whatsapp',
        title: 'WhatsApp',
        description: 'Atendimento via WhatsApp',
        availability: 'Seg-Sex, 8h-18h',
        icon: 'W',
        action: 'https://wa.me/5511999999999',
    },
];

/**
 * Contact support page.
 * Shows available support channels (chat, phone, email).
 */
const ContactPage: NextPage = () => {
    const router = useRouter();
    const { isAuthenticated: _isAuthenticated } = useAuth();

    const handleChannelClick = (channel: ContactChannel): void => {
        if (channel.action.startsWith('/')) {
            void router.push(channel.action);
        } else {
            // External links (tel:, mailto:, https://)
            window.open(channel.action, '_blank');
        }
    };

    return (
        <div style={{ padding: spacing.xl, maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={titleStyle}>Fale Conosco</h1>
            <p style={subtitleStyle}>Escolha o canal de sua preferencia para entrar em contato.</p>

            {CHANNELS.map((channel) => (
                <div
                    key={channel.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleChannelClick(channel)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            handleChannelClick(channel);
                        }
                    }}
                    style={channelCardStyle}
                >
                    <div style={iconStyle}>{channel.icon}</div>
                    <div style={{ flex: 1 }}>
                        <h3 style={channelTitleStyle}>{channel.title}</h3>
                        <p style={channelDescStyle}>{channel.description}</p>
                        <span style={availabilityStyle}>{channel.availability}</span>
                    </div>
                    <span style={arrowStyle}>&rsaquo;</span>
                </div>
            ))}

            {/* Emergency info */}
            <div style={emergencyCardStyle}>
                <h3
                    style={{
                        fontSize: typography.fontSize['heading-sm'],
                        color: colors.semantic.error,
                        marginBottom: spacing.xs,
                    }}
                >
                    Emergencia?
                </h3>
                <p style={{ fontSize: typography.fontSize['text-sm'], color: colors.gray[60], margin: 0 }}>
                    Em caso de emergencia medica, ligue 192 (SAMU) ou va ao pronto-socorro mais proximo.
                </p>
            </div>

            <button onClick={() => void router.push('/help')} style={backBtnStyle}>
                &larr; Voltar para Central de Ajuda
            </button>
        </div>
    );
};

const titleStyle: React.CSSProperties = {
    fontSize: typography.fontSize['heading-xl'],
    fontWeight: typography.fontWeight.semiBold,
    color: colors.gray[70],
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.heading,
};
const subtitleStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-sm'],
    color: colors.gray[50],
    marginBottom: spacing.xl,
    fontFamily: typography.fontFamily.body,
};
const channelCardStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.gray[0],
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    marginBottom: spacing.md,
    cursor: 'pointer',
};
const iconStyle: React.CSSProperties = {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.brandPalette[50],
    color: colors.brand.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.fontSize['text-lg'],
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.heading,
    flexShrink: 0,
};
const channelTitleStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-md'],
    fontWeight: typography.fontWeight.semiBold,
    color: colors.gray[70],
    margin: 0,
    fontFamily: typography.fontFamily.body,
};
const channelDescStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-sm'],
    color: colors.gray[50],
    margin: `${spacing['3xs']} 0`,
    fontFamily: typography.fontFamily.body,
};
const availabilityStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-xs'],
    color: colors.gray[40],
    fontFamily: typography.fontFamily.body,
};
const arrowStyle: React.CSSProperties = {
    fontSize: typography.fontSize['heading-xl'],
    color: colors.gray[30],
    flexShrink: 0,
};
const emergencyCardStyle: React.CSSProperties = {
    backgroundColor: colors.semantic.errorBg,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginTop: spacing.xl,
    borderLeft: `4px solid ${colors.semantic.error}`,
};
const backBtnStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: colors.brand.primary,
    fontSize: typography.fontSize['text-sm'],
    cursor: 'pointer',
    padding: 0,
    marginTop: spacing.xl,
    fontFamily: typography.fontFamily.body,
};

export const getStaticProps: GetStaticProps = () => ({ props: {} });

export default ContactPage;
