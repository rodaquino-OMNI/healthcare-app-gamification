import React, { useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { colors, typography, spacing, borderRadius } from 'design-system/tokens';
import { restClient } from '@/api/client';

/**
 * Report problem form page.
 * Allows users to submit bug reports or issues.
 */
const ReportPage: NextPage = () => {
    const router = useRouter();
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [severity, setSeverity] = useState('medium');
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const categories = [
        { value: 'bug', label: 'Erro / Bug' },
        { value: 'crash', label: 'App Travando' },
        { value: 'slow', label: 'Lentidao' },
        { value: 'wrong-data', label: 'Dados Incorretos' },
        { value: 'payment', label: 'Problema com Pagamento' },
        { value: 'access', label: 'Problema de Acesso' },
        { value: 'other', label: 'Outro' },
    ];

    const severities = [
        { value: 'low', label: 'Baixa', desc: 'Inconveniencia menor' },
        { value: 'medium', label: 'Media', desc: 'Funcionalidade prejudicada' },
        { value: 'high', label: 'Alta', desc: 'Funcionalidade bloqueada' },
        { value: 'critical', label: 'Critica', desc: 'Dados ou seguranca afetados' },
    ];

    const handleSubmit = async () => {
        if (!category || !title || !description) return;

        setSubmitting(true);
        setSubmitError(null);

        try {
            await restClient.post('/support/reports', {
                category,
                title,
                description,
                severity,
            });
            setSubmitted(true);
        } catch {
            setSubmitError('Erro ao enviar relato. Tente novamente.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div
                style={{
                    padding: spacing.xl,
                    maxWidth: '480px',
                    margin: '0 auto',
                    textAlign: 'center' as const,
                    paddingTop: spacing['5xl'],
                }}
            >
                <div style={successIconStyle}>&#10003;</div>
                <h1 style={{ ...titleStyle, textAlign: 'center' as const }}>Problema Reportado</h1>
                <p
                    style={{
                        fontSize: typography.fontSize['text-sm'],
                        color: colors.gray[50],
                        marginBottom: spacing.xl,
                    }}
                >
                    Recebemos seu relato. Nossa equipe analisara e responderemos em ate 48 horas.
                </p>
                <button onClick={() => router.push('/help')} style={primaryButtonStyle}>
                    Voltar para Central de Ajuda
                </button>
            </div>
        );
    }

    const isValid = category && title && description;

    return (
        <div style={{ padding: spacing.xl, maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={titleStyle}>Reportar Problema</h1>
            <p style={subtitleStyle}>Descreva o problema encontrado para que possamos resolver.</p>

            <div style={cardStyle}>
                <div style={fieldGroup}>
                    <label style={labelStyle}>Categoria *</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} style={selectStyle}>
                        <option value="">Selecione o tipo de problema...</option>
                        {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={fieldGroup}>
                    <label style={labelStyle}>Titulo *</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={inputStyle}
                        placeholder="Resumo do problema"
                    />
                </div>

                <div style={fieldGroup}>
                    <label style={labelStyle}>Descricao *</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={textareaStyle}
                        rows={5}
                        placeholder="Descreva o que aconteceu, quando aconteceu e o que voce esperava..."
                    />
                </div>

                <div style={fieldGroup}>
                    <label style={labelStyle}>Gravidade</label>
                    <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' as const }}>
                        {severities.map((sev) => (
                            <button
                                key={sev.value}
                                onClick={() => setSeverity(sev.value)}
                                style={{
                                    ...severityBtnStyle,
                                    borderColor: severity === sev.value ? colors.brand.primary : colors.gray[20],
                                    backgroundColor: severity === sev.value ? colors.brandPalette[50] : colors.gray[0],
                                }}
                            >
                                <span style={{ fontWeight: typography.fontWeight.medium }}>{sev.label}</span>
                                <span style={{ fontSize: typography.fontSize['text-2xs'], color: colors.gray[40] }}>
                                    {sev.desc}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {submitError && (
                    <p
                        style={{
                            color: colors.semantic.error,
                            fontSize: typography.fontSize['text-sm'],
                            marginBottom: spacing.sm,
                        }}
                    >
                        {submitError}
                    </p>
                )}
                <button
                    onClick={handleSubmit}
                    disabled={!isValid || submitting}
                    style={{
                        ...primaryButtonStyle,
                        backgroundColor: isValid ? colors.brand.primary : colors.gray[30],
                        cursor: isValid ? 'pointer' : 'not-allowed',
                    }}
                >
                    {submitting ? 'Enviando...' : 'Enviar Relato'}
                </button>
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
const cardStyle: React.CSSProperties = {
    backgroundColor: colors.gray[0],
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};
const fieldGroup: React.CSSProperties = { marginBottom: spacing.lg };
const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: typography.fontSize['text-sm'],
    fontWeight: typography.fontWeight.medium,
    color: colors.gray[60],
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.body,
};
const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.gray[20]}`,
    fontSize: typography.fontSize['text-md'],
    fontFamily: typography.fontFamily.body,
    color: colors.gray[70],
    boxSizing: 'border-box',
};
const selectStyle: React.CSSProperties = { ...inputStyle, backgroundColor: colors.gray[0] };
const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    resize: 'vertical',
};
const severityBtnStyle: React.CSSProperties = {
    flex: '1 1 calc(50% - 4px)',
    padding: spacing.xs,
    borderRadius: borderRadius.md,
    border: `2px solid ${colors.gray[20]}`,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing['3xs'],
    fontSize: typography.fontSize['text-sm'],
    color: colors.gray[70],
    fontFamily: typography.fontFamily.body,
    backgroundColor: colors.gray[0],
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
};
const successIconStyle: React.CSSProperties = {
    width: 64,
    height: 64,
    borderRadius: '50%',
    backgroundColor: colors.semantic.successBg,
    color: colors.semantic.success,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.fontSize['heading-xl'],
    fontWeight: typography.fontWeight.bold,
    margin: '0 auto',
    marginBottom: spacing.md,
};

export default ReportPage;
