import { colors, typography, spacing, borderRadius } from 'design-system/tokens';
import type { NextPage } from 'next';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';
import { useSettings } from '@/hooks/useSettings';

/**
 * Accessibility settings page.
 * Allows users to configure font size, high contrast, and reduced motion.
 */
const AccessibilityPage: NextPage = () => {
    const { t: _t } = useTranslation();
    const router = useRouter();
    const { saveAccessibility, isLoading: _isLoading, error: hookError } = useSettings();
    const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('normal');
    const [highContrast, setHighContrast] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [screenReader, setScreenReader] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fontSizes = [
        { value: 'normal' as const, label: 'Normal', preview: '16px' },
        { value: 'large' as const, label: 'Grande', preview: '20px' },
        { value: 'extra-large' as const, label: 'Extra Grande', preview: '24px' },
    ];

    const toggles = [
        {
            label: 'Alto Contraste',
            desc: 'Aumentar contraste de cores para melhor visibilidade',
            value: highContrast,
            toggle: () => setHighContrast(!highContrast),
        },
        {
            label: 'Reducao de Movimento',
            desc: 'Reduzir animacoes e transicoes',
            value: reducedMotion,
            toggle: () => setReducedMotion(!reducedMotion),
        },
        {
            label: 'Leitor de Tela',
            desc: 'Otimizar para leitores de tela (VoiceOver, TalkBack)',
            value: screenReader,
            toggle: () => setScreenReader(!screenReader),
        },
    ];

    const handleSave = async (): Promise<void> => {
        setLoading(true);
        setError('');
        try {
            await saveAccessibility({ fontSize, highContrast, reducedMotion, screenReader });
            void router.push('/settings');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : (hookError ?? 'Erro inesperado.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: spacing.xl, maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={titleStyle}>Acessibilidade</h1>
            <p style={subtitleStyle}>Personalize a experiencia para suas necessidades.</p>

            {error && <div style={errorStyle}>{error}</div>}

            {/* Font size selector */}
            <div style={cardStyle}>
                <h2 style={sectionTitleStyle}>Tamanho da Fonte</h2>
                <div style={{ display: 'flex', gap: spacing.xs }}>
                    {fontSizes.map((fs) => (
                        <button
                            key={fs.value}
                            onClick={() => setFontSize(fs.value)}
                            style={{
                                flex: 1,
                                padding: spacing.md,
                                textAlign: 'center' as const,
                                borderRadius: borderRadius.md,
                                cursor: 'pointer',
                                border: `2px solid ${fontSize === fs.value ? colors.brand.primary : colors.gray[20]}`,
                                backgroundColor: fontSize === fs.value ? colors.brandPalette[50] : colors.gray[0],
                                color: colors.gray[70],
                                fontFamily: typography.fontFamily.body,
                            }}
                        >
                            <span
                                style={{
                                    display: 'block',
                                    fontSize: fs.preview,
                                    fontWeight: typography.fontWeight.semiBold,
                                }}
                            >
                                Aa
                            </span>
                            <span
                                style={{
                                    display: 'block',
                                    fontSize: typography.fontSize['text-xs'],
                                    marginTop: spacing['3xs'],
                                    color: colors.gray[50],
                                }}
                            >
                                {fs.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Toggle settings */}
            <div style={{ ...cardStyle, marginTop: spacing.md }}>
                <h2 style={sectionTitleStyle}>Opcoes Visuais</h2>
                {toggles.map((item) => (
                    <div key={item.label} style={rowStyle}>
                        <div>
                            <span style={rowLabelStyle}>{item.label}</span>
                            <span style={rowDescStyle}>{item.desc}</span>
                        </div>
                        <button
                            onClick={item.toggle}
                            style={{
                                ...toggleBtnStyle,
                                backgroundColor: item.value ? colors.brand.primary : colors.gray[30],
                            }}
                            aria-label={item.label}
                        >
                            <span
                                style={{
                                    ...toggleKnobStyle,
                                    transform: item.value ? 'translateX(20px)' : 'translateX(0)',
                                }}
                            />
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={() => void handleSave()}
                disabled={loading}
                style={{ ...primaryButtonStyle, opacity: loading ? 0.7 : 1 }}
            >
                {loading ? 'Salvando...' : 'Salvar Preferencias'}
            </button>
        </div>
    );
};

const errorStyle: React.CSSProperties = {
    backgroundColor: colors.semantic.errorBg,
    border: `1px solid ${colors.semantic.error}`,
    borderRadius: 6,
    color: colors.semantic.error,
    fontSize: 14,
    padding: '10px 14px',
    marginBottom: 16,
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
const sectionTitleStyle: React.CSSProperties = {
    fontSize: typography.fontSize['heading-sm'],
    fontWeight: typography.fontWeight.semiBold,
    color: colors.gray[60],
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily.heading,
};
const rowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${spacing.sm} 0`,
    borderBottom: `1px solid ${colors.gray[10]}`,
};
const rowLabelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: typography.fontSize['text-md'],
    color: colors.gray[70],
    fontFamily: typography.fontFamily.body,
};
const rowDescStyle: React.CSSProperties = {
    display: 'block',
    fontSize: typography.fontSize['text-xs'],
    color: colors.gray[40],
    marginTop: spacing['3xs'],
    fontFamily: typography.fontFamily.body,
};
const toggleBtnStyle: React.CSSProperties = {
    width: 48,
    height: 28,
    borderRadius: borderRadius.full,
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background-color 0.2s',
    flexShrink: 0,
};
const toggleKnobStyle: React.CSSProperties = {
    display: 'block',
    width: 22,
    height: 22,
    borderRadius: '50%',
    backgroundColor: colors.neutral.white,
    position: 'absolute',
    top: 3,
    left: 3,
    transition: 'transform 0.2s',
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

export const getServerSideProps = () => ({ props: {} });

export default AccessibilityPage;
