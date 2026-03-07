import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { colors, typography, spacing, borderRadius } from 'design-system/tokens';

/**
 * About the app page.
 * Shows version info, credits, and links to legal pages.
 */
const AboutPage: NextPage = () => {
    const router = useRouter();

    const appInfo = [
        { label: 'Versao', value: '2.4.1 (Build 241)' },
        { label: 'Plataforma', value: 'Web' },
        { label: 'Ultima atualizacao', value: '15/02/2024' },
        { label: 'Ambiente', value: 'Producao' },
    ];

    const legalLinks = [
        { label: 'Termos de Servico', path: '/help/terms' },
        { label: 'Politica de Privacidade', path: '/help/privacy' },
        { label: 'Central de Ajuda', path: '/help' },
        { label: 'Reportar Problema', path: '/help/report' },
    ];

    return (
        <div style={{ padding: spacing.xl, maxWidth: '480px', margin: '0 auto' }}>
            {/* App identity */}
            <div style={{ textAlign: 'center' as const, marginBottom: spacing['2xl'] }}>
                <div style={logoStyle}>AUSTA</div>
                <h1 style={titleStyle}>AUSTA Saude</h1>
                <p style={subtitleStyle}>Seu super app de saude e bem-estar</p>
            </div>

            {/* Version info */}
            <div style={cardStyle}>
                <h2 style={sectionTitleStyle}>Informacoes do App</h2>
                {appInfo.map((info) => (
                    <div key={info.label} style={infoRowStyle}>
                        <span style={infoLabelStyle}>{info.label}</span>
                        <span style={infoValueStyle}>{info.value}</span>
                    </div>
                ))}
            </div>

            {/* Legal links */}
            <div style={{ ...cardStyle, marginTop: spacing.md }}>
                <h2 style={sectionTitleStyle}>Legal e Suporte</h2>
                {legalLinks.map((link) => (
                    <button key={link.label} onClick={() => router.push(link.path)} style={legalLinkStyle}>
                        <span>{link.label}</span>
                        <span style={{ color: colors.gray[30] }}>&rsaquo;</span>
                    </button>
                ))}
            </div>

            {/* Credits */}
            <div style={{ ...cardStyle, marginTop: spacing.md }}>
                <h2 style={sectionTitleStyle}>Creditos</h2>
                <p style={creditTextStyle}>Desenvolvido pela equipe AUSTA Saude S.A.</p>
                <p style={creditTextStyle}>Design System: AUSTA Design System v3.0</p>
                <p style={creditTextStyle}>Tecnologias: React, Next.js, React Native, NestJS</p>
            </div>

            {/* Footer */}
            <p style={copyrightStyle}>&copy; 2024 AUSTA Saude S.A. Todos os direitos reservados.</p>
        </div>
    );
};

const logoStyle: React.CSSProperties = {
    width: 80,
    height: 80,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.brand.primary,
    color: colors.neutral.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.fontSize['heading-md'],
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.logo,
    margin: '0 auto',
    marginBottom: spacing.md,
};
const titleStyle: React.CSSProperties = {
    fontSize: typography.fontSize['heading-xl'],
    fontWeight: typography.fontWeight.semiBold,
    color: colors.gray[70],
    marginBottom: spacing['3xs'],
    fontFamily: typography.fontFamily.heading,
};
const subtitleStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-sm'],
    color: colors.gray[50],
    fontFamily: typography.fontFamily.body,
};
const cardStyle: React.CSSProperties = {
    backgroundColor: colors.gray[0],
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};
const sectionTitleStyle: React.CSSProperties = {
    fontSize: typography.fontSize['heading-xs'],
    fontWeight: typography.fontWeight.semiBold,
    color: colors.gray[60],
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily.heading,
};
const infoRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${spacing.xs} 0`,
    borderBottom: `1px solid ${colors.gray[10]}`,
};
const infoLabelStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-sm'],
    color: colors.gray[50],
    fontFamily: typography.fontFamily.body,
};
const infoValueStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-sm'],
    color: colors.gray[70],
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily.body,
};
const legalLinkStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: `${spacing.sm} 0`,
    background: 'none',
    border: 'none',
    borderBottom: `1px solid ${colors.gray[10]}`,
    cursor: 'pointer',
    fontSize: typography.fontSize['text-sm'],
    color: colors.gray[70],
    fontFamily: typography.fontFamily.body,
    textAlign: 'left' as const,
};
const creditTextStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-sm'],
    color: colors.gray[50],
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.body,
};
const copyrightStyle: React.CSSProperties = {
    textAlign: 'center' as const,
    fontSize: typography.fontSize['text-xs'],
    color: colors.gray[40],
    marginTop: spacing.xl,
    fontFamily: typography.fontFamily.body,
};

export default AboutPage;
