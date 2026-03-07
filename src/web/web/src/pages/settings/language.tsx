import React, { useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { colors, typography, spacing, borderRadius } from '@web/design-system/src/tokens';
import { saveLanguage } from '../../api/settings';

interface LanguageOption {
    code: string;
    label: string;
    nativeLabel: string;
}

const LANGUAGES: LanguageOption[] = [
    { code: 'pt-BR', label: 'Portugues (Brasil)', nativeLabel: 'Portugues (Brasil)' },
    { code: 'en-US', label: 'Ingles (EUA)', nativeLabel: 'English (US)' },
    { code: 'es', label: 'Espanhol', nativeLabel: 'Espanol' },
];

/**
 * Language selection page.
 * Allows users to choose the app interface language.
 */
const LanguagePage: NextPage = () => {
    const router = useRouter();
    const [selected, setSelected] = useState('pt-BR');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        setLoading(true);
        setError('');
        try {
            await saveLanguage(selected);
            router.push('/settings');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar idioma.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: spacing.xl, maxWidth: '480px', margin: '0 auto' }}>
            <h1 style={titleStyle}>Idioma</h1>
            <p style={subtitleStyle}>Escolha o idioma da interface do aplicativo.</p>

            <div style={cardStyle}>
                {LANGUAGES.map((lang) => (
                    <div
                        key={lang.code}
                        onClick={() => setSelected(lang.code)}
                        style={{
                            ...optionStyle,
                            borderColor: selected === lang.code ? colors.brand.primary : colors.gray[20],
                            backgroundColor: selected === lang.code ? colors.brandPalette[50] : colors.gray[0],
                        }}
                    >
                        <div style={{ flex: 1 }}>
                            <span style={optionLabelStyle}>{lang.label}</span>
                            <span style={optionNativeStyle}>{lang.nativeLabel}</span>
                        </div>
                        {selected === lang.code && (
                            <span style={{ color: colors.brand.primary, fontSize: typography.fontSize['text-lg'] }}>
                                &#10003;
                            </span>
                        )}
                    </div>
                ))}

                {error && (
                    <p
                        style={{
                            color: 'red',
                            marginBottom: spacing.sm,
                            fontSize: typography.fontSize['text-sm'],
                            fontFamily: typography.fontFamily.body,
                        }}
                    >
                        {error}
                    </p>
                )}
                <button onClick={handleSave} disabled={loading} style={primaryButtonStyle}>
                    {loading ? 'Salvando...' : 'Salvar Idioma'}
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
const optionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    border: `2px solid ${colors.gray[20]}`,
    marginBottom: spacing.xs,
    cursor: 'pointer',
    transition: 'border-color 0.15s, background-color 0.15s',
};
const optionLabelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: typography.fontSize['text-md'],
    fontWeight: typography.fontWeight.medium,
    color: colors.gray[70],
    fontFamily: typography.fontFamily.body,
};
const optionNativeStyle: React.CSSProperties = {
    display: 'block',
    fontSize: typography.fontSize['text-xs'],
    color: colors.gray[40],
    marginTop: spacing['3xs'],
    fontFamily: typography.fontFamily.body,
};
const primaryButtonStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing.sm,
    backgroundColor: colors.brand.primary,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: typography.fontSize['text-md'],
    fontWeight: typography.fontWeight.semiBold,
    fontFamily: typography.fontFamily.body,
    marginTop: spacing.xl,
};

export default LanguagePage;
