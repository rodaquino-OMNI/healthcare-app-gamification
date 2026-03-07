import React, { useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { colors, typography, spacing, borderRadius } from '@web/design-system/src/tokens';

interface HelpCategory {
    id: string;
    title: string;
    description: string;
    icon: string;
    articleCount: number;
}

const CATEGORIES: HelpCategory[] = [
    { id: 'account', title: 'Conta e Acesso', description: 'Login, senha, biometria', icon: 'U', articleCount: 8 },
    { id: 'plan', title: 'Plano de Saude', description: 'Cobertura, sinistros, carencia', icon: 'P', articleCount: 12 },
    {
        id: 'appointments',
        title: 'Consultas e Agendamentos',
        description: 'Agendar, cancelar, telemedicina',
        icon: 'C',
        articleCount: 10,
    },
    { id: 'health', title: 'Saude e Metricas', description: 'Exames, medicamentos, metas', icon: 'S', articleCount: 7 },
    {
        id: 'gamification',
        title: 'Conquistas e Recompensas',
        description: 'XP, missoes, ranking',
        icon: 'G',
        articleCount: 5,
    },
    {
        id: 'privacy',
        title: 'Privacidade e LGPD',
        description: 'Dados pessoais, exportacao',
        icon: 'L',
        articleCount: 6,
    },
];

/**
 * Help center home page.
 * Search bar and category grid for navigating help topics.
 */
const HelpHomePage: NextPage = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCategories = searchQuery
        ? CATEGORIES.filter(
              (c) =>
                  c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  c.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : CATEGORIES;

    return (
        <div style={{ padding: spacing.xl, maxWidth: '720px', margin: '0 auto' }}>
            <h1 style={titleStyle}>Central de Ajuda</h1>
            <p style={subtitleStyle}>Como podemos ajudar voce hoje?</p>

            {/* Search bar */}
            <div style={searchContainerStyle}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar artigos de ajuda..."
                    style={searchInputStyle}
                    aria-label="Buscar ajuda"
                />
            </div>

            {/* Category grid */}
            <div style={gridStyle}>
                {filteredCategories.map((cat) => (
                    <div
                        key={cat.id}
                        onClick={() => router.push(`/help/faq?category=${cat.id}`)}
                        style={categoryCardStyle}
                    >
                        <div style={categoryIconStyle}>{cat.icon}</div>
                        <h3 style={categoryTitleStyle}>{cat.title}</h3>
                        <p style={categoryDescStyle}>{cat.description}</p>
                        <span style={articleCountStyle}>{cat.articleCount} artigos</span>
                    </div>
                ))}
            </div>

            {/* Quick links */}
            <div style={{ marginTop: spacing['2xl'] }}>
                <h2 style={sectionTitleStyle}>Precisa de mais ajuda?</h2>
                <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' as const }}>
                    <button onClick={() => router.push('/help/contact')} style={quickLinkStyle}>
                        Falar com Suporte
                    </button>
                    <button onClick={() => router.push('/help/chat')} style={quickLinkStyle}>
                        Chat ao Vivo
                    </button>
                    <button onClick={() => router.push('/help/report')} style={quickLinkStyle}>
                        Reportar Problema
                    </button>
                </div>
            </div>
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
const searchContainerStyle: React.CSSProperties = {
    marginBottom: spacing['2xl'],
};
const searchInputStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.gray[20]}`,
    fontSize: typography.fontSize['text-md'],
    fontFamily: typography.fontFamily.body,
    color: colors.gray[70],
    boxSizing: 'border-box',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};
const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: spacing.md,
};
const categoryCardStyle: React.CSSProperties = {
    backgroundColor: colors.gray[0],
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    cursor: 'pointer',
    transition: 'box-shadow 0.15s',
};
const categoryIconStyle: React.CSSProperties = {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.brandPalette[50],
    color: colors.brand.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.fontSize['text-lg'],
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.heading,
    marginBottom: spacing.sm,
};
const categoryTitleStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-md'],
    fontWeight: typography.fontWeight.semiBold,
    color: colors.gray[70],
    margin: `0 0 ${spacing['3xs']} 0`,
    fontFamily: typography.fontFamily.body,
};
const categoryDescStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-xs'],
    color: colors.gray[40],
    margin: `0 0 ${spacing.xs} 0`,
    fontFamily: typography.fontFamily.body,
};
const articleCountStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-2xs'],
    color: colors.gray[40],
    fontFamily: typography.fontFamily.body,
};
const sectionTitleStyle: React.CSSProperties = {
    fontSize: typography.fontSize['heading-sm'],
    fontWeight: typography.fontWeight.semiBold,
    color: colors.gray[60],
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily.heading,
};
const quickLinkStyle: React.CSSProperties = {
    padding: `${spacing.xs} ${spacing.md}`,
    backgroundColor: colors.gray[0],
    color: colors.brand.primary,
    border: `1px solid ${colors.brand.primary}`,
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: typography.fontSize['text-sm'],
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily.body,
};

export default HelpHomePage;
