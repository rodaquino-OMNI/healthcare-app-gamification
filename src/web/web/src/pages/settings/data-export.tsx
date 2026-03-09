import { colors, typography, spacing, borderRadius } from 'design-system/tokens';
import type { NextPage } from 'next';
import React, { useState } from 'react';

import { restClient } from '../../api/client';

interface ExportCategory {
    key: string;
    label: string;
    description: string;
    selected: boolean;
}

/**
 * LGPD data export page.
 * Allows users to request export of their personal data.
 */
const DataExportPage: NextPage = () => {
    const [categories, setCategories] = useState<ExportCategory[]>([
        { key: 'personal', label: 'Dados Pessoais', description: 'Nome, CPF, endereco, contato', selected: true },
        { key: 'health', label: 'Dados de Saude', description: 'Consultas, exames, medicamentos', selected: true },
        { key: 'plan', label: 'Dados do Plano', description: 'Cobertura, sinistros, pagamentos', selected: false },
        {
            key: 'activity',
            label: 'Dados de Atividade',
            description: 'Historico de acesso, dispositivos',
            selected: false,
        },
        {
            key: 'gamification',
            label: 'Dados de Gamificacao',
            description: 'Conquistas, recompensas, XP',
            selected: false,
        },
    ]);
    const [format, setFormat] = useState<'json' | 'csv' | 'pdf'>('json');
    const [requested, setRequested] = useState(false);
    const [loading, setLoading] = useState(false);
    const [_error, setError] = useState<string | null>(null);

    const toggleCategory = (key: string): void => {
        setCategories((prev) => prev.map((c) => (c.key === key ? { ...c, selected: !c.selected } : c)));
    };

    const handleRequest = async (): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const selectedCategories = categories.filter((c) => c.selected).map((c) => c.key);
            await restClient.post('/privacy/export', {
                categories: selectedCategories,
                format,
            });
            setRequested(true);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao solicitar exportação de dados');
        } finally {
            setLoading(false);
        }
    };

    const anySelected = categories.some((c) => c.selected);

    return (
        <div style={{ padding: spacing.xl, maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={titleStyle}>Exportar Meus Dados</h1>
            <p style={subtitleStyle}>
                Em conformidade com a LGPD, voce pode solicitar uma copia de todos os seus dados pessoais.
            </p>

            {requested ? (
                <div style={successCardStyle}>
                    <h2
                        style={{
                            fontSize: typography.fontSize['heading-md'],
                            color: colors.semantic.success,
                            marginBottom: spacing.xs,
                        }}
                    >
                        Solicitacao Enviada
                    </h2>
                    <p style={{ fontSize: typography.fontSize['text-sm'], color: colors.gray[50], margin: 0 }}>
                        Sua solicitacao foi recebida. Voce recebera um email com o link para download em ate 48 horas.
                    </p>
                </div>
            ) : (
                <>
                    <div style={cardStyle}>
                        <h2 style={sectionTitleStyle}>Categorias de Dados</h2>
                        {categories.map((cat) => (
                            <label key={cat.key} style={checkRowStyle} aria-label={cat.label}>
                                <input
                                    type="checkbox"
                                    checked={cat.selected}
                                    onChange={() => toggleCategory(cat.key)}
                                    style={{ marginRight: spacing.sm, accentColor: colors.brand.primary }}
                                />
                                <div>
                                    <span style={{ fontSize: typography.fontSize['text-md'], color: colors.gray[70] }}>
                                        {cat.label}
                                    </span>
                                    <span
                                        style={{
                                            display: 'block',
                                            fontSize: typography.fontSize['text-xs'],
                                            color: colors.gray[40],
                                        }}
                                    >
                                        {cat.description}
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>

                    <div style={{ ...cardStyle, marginTop: spacing.md }}>
                        <h2 style={sectionTitleStyle}>Formato</h2>
                        {(['json', 'csv', 'pdf'] as const).map((f) => (
                            <label key={f} style={radioRowStyle}>
                                <input
                                    type="radio"
                                    name="format"
                                    checked={format === f}
                                    onChange={() => setFormat(f)}
                                    style={{ marginRight: spacing.sm, accentColor: colors.brand.primary }}
                                />
                                <span
                                    style={{
                                        fontSize: typography.fontSize['text-md'],
                                        color: colors.gray[70],
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    {f}
                                </span>
                            </label>
                        ))}
                    </div>

                    <button
                        onClick={() => void handleRequest()}
                        disabled={!anySelected || loading}
                        style={{
                            ...primaryButtonStyle,
                            backgroundColor: anySelected ? colors.brand.primary : colors.gray[30],
                            cursor: anySelected ? 'pointer' : 'not-allowed',
                        }}
                    >
                        Solicitar Exportacao
                    </button>
                </>
            )}
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
const cardStyle: React.CSSProperties = {
    backgroundColor: colors.gray[0],
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};
const successCardStyle: React.CSSProperties = {
    ...cardStyle,
    borderLeft: `4px solid ${colors.semantic.success}`,
};
const sectionTitleStyle: React.CSSProperties = {
    fontSize: typography.fontSize['heading-sm'],
    fontWeight: typography.fontWeight.semiBold,
    color: colors.gray[60],
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily.heading,
};
const checkRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    padding: `${spacing.sm} 0`,
    borderBottom: `1px solid ${colors.gray[10]}`,
    cursor: 'pointer',
};
const radioRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: `${spacing.xs} 0`,
    cursor: 'pointer',
};
const primaryButtonStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing.sm,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize['text-md'],
    fontWeight: typography.fontWeight.semiBold,
    fontFamily: typography.fontFamily.body,
    marginTop: spacing.xl,
};

export default DataExportPage;
