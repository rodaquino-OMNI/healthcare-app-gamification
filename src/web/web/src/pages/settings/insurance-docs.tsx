import { colors, typography, spacing, borderRadius } from 'design-system/tokens';
import type { NextPage } from 'next';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSettings } from '@/hooks/useSettings';

/**
 * Insurance documents page.
 * Displays available plan documents for download.
 */
const InsuranceDocsPage: NextPage = () => {
    const { t } = useTranslation();
    const { insuranceDocs: docs, isLoading: loading, error: hookError, downloadDoc } = useSettings();
    const [error, setError] = useState('');

    const handleDownload = async (doc: { id: string; name: string }): Promise<void> => {
        try {
            const blob = await downloadDoc(doc.id);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = doc.name;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : (hookError ?? 'Erro ao baixar documento.'));
        }
    };

    return (
        <div style={{ padding: spacing.xl, maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={titleStyle}>Documentos do Plano</h1>
            <p style={subtitleStyle}>Acesse e baixe seus documentos de seguro saude.</p>

            {error && (
                <p
                    style={{
                        color: colors.semantic.error,
                        fontSize: typography.fontSize['text-sm'],
                        marginBottom: spacing.sm,
                        fontFamily: typography.fontFamily.body,
                    }}
                >
                    {error}
                </p>
            )}

            {loading ? (
                <p
                    style={{
                        fontSize: typography.fontSize['text-sm'],
                        color: colors.gray[50],
                        fontFamily: typography.fontFamily.body,
                    }}
                >
                    {t('common.loading')}
                </p>
            ) : (
                <div style={cardStyle}>
                    {docs.map((doc, idx) => (
                        <div
                            key={doc.id}
                            style={{
                                ...docRowStyle,
                                borderBottom: idx < docs.length - 1 ? `1px solid ${colors.gray[10]}` : 'none',
                            }}
                        >
                            <div style={docIconStyle}>{doc.type}</div>
                            <div style={{ flex: 1 }}>
                                <span style={docNameStyle}>{doc.name}</span>
                                <span style={docMetaStyle}>{doc.uploadedAt}</span>
                            </div>
                            <button
                                onClick={() => void handleDownload(doc)}
                                style={downloadBtnStyle}
                                aria-label={`Baixar ${doc.name}`}
                            >
                                Baixar
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <p style={footerNoteStyle}>Todos os documentos estao protegidos e disponiveis conforme a LGPD.</p>
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
    padding: spacing.md,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};
const docRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: `${spacing.sm} ${spacing.xs}`,
    gap: spacing.sm,
};
const docIconStyle: React.CSSProperties = {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.semantic.errorBg,
    color: colors.semantic.error,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.fontSize['text-2xs'],
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.mono,
    flexShrink: 0,
};
const docNameStyle: React.CSSProperties = {
    display: 'block',
    fontSize: typography.fontSize['text-sm'],
    fontWeight: typography.fontWeight.medium,
    color: colors.gray[70],
    fontFamily: typography.fontFamily.body,
};
const docMetaStyle: React.CSSProperties = {
    display: 'block',
    fontSize: typography.fontSize['text-xs'],
    color: colors.gray[40],
    marginTop: spacing['3xs'],
    fontFamily: typography.fontFamily.body,
};
const downloadBtnStyle: React.CSSProperties = {
    padding: `${spacing.xs} ${spacing.sm}`,
    backgroundColor: colors.brand.primary,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: typography.fontSize['text-xs'],
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily.body,
    flexShrink: 0,
};
const footerNoteStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-xs'],
    color: colors.gray[40],
    marginTop: spacing.lg,
    textAlign: 'center' as const,
    fontFamily: typography.fontFamily.body,
};

export const getServerSideProps = () => ({ props: {} });

export default InsuranceDocsPage;
