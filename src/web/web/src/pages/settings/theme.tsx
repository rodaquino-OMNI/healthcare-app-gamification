import React, { useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { colors, typography, spacing, borderRadius } from '@web/design-system/src/tokens';

type ThemeOption = 'light' | 'dark' | 'system';

interface ThemeChoice {
  value: ThemeOption;
  label: string;
  description: string;
  previewBg: string;
  previewText: string;
}

const THEMES: ThemeChoice[] = [
  { value: 'light', label: 'Claro', description: 'Tema claro para uso diurno', previewBg: colors.gray[0], previewText: colors.gray[70] },
  { value: 'dark', label: 'Escuro', description: 'Tema escuro para conforto visual', previewBg: colors.gray[70], previewText: colors.gray[5] },
  { value: 'system', label: 'Sistema', description: 'Seguir configuracao do dispositivo', previewBg: colors.gray[10], previewText: colors.gray[60] },
];

/**
 * Theme selection page.
 * Allows users to choose between Light, Dark, and System themes.
 */
const ThemePage: NextPage = () => {
  const router = useRouter();
  const [selected, setSelected] = useState<ThemeOption>('light');

  const handleSave = () => {
    // TODO: Persist theme preference
    router.push('/settings');
  };

  return (
    <div style={{ padding: spacing.xl, maxWidth: '480px', margin: '0 auto' }}>
      <h1 style={titleStyle}>Tema</h1>
      <p style={subtitleStyle}>Escolha a aparencia do aplicativo.</p>

      <div style={cardStyle}>
        {THEMES.map((theme) => (
          <div
            key={theme.value}
            onClick={() => setSelected(theme.value)}
            style={{
              ...optionStyle,
              borderColor: selected === theme.value ? colors.brand.primary : colors.gray[20],
            }}
          >
            {/* Preview swatch */}
            <div style={{
              width: 48, height: 48, borderRadius: borderRadius.md,
              backgroundColor: theme.previewBg, border: `1px solid ${colors.gray[20]}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: typography.fontSize['text-xs'], color: theme.previewText,
              fontFamily: typography.fontFamily.mono, marginRight: spacing.md, flexShrink: 0,
            }}>
              Aa
            </div>
            <div style={{ flex: 1 }}>
              <span style={optionLabelStyle}>{theme.label}</span>
              <span style={optionDescStyle}>{theme.description}</span>
            </div>
            {selected === theme.value && (
              <span style={{ color: colors.brand.primary, fontSize: typography.fontSize['text-lg'], flexShrink: 0 }}>
                &#10003;
              </span>
            )}
          </div>
        ))}

        <button onClick={handleSave} style={primaryButtonStyle}>Aplicar Tema</button>
      </div>
    </div>
  );
};

const titleStyle: React.CSSProperties = {
  fontSize: typography.fontSize['heading-xl'], fontWeight: typography.fontWeight.semiBold,
  color: colors.gray[70], marginBottom: spacing.xs, fontFamily: typography.fontFamily.heading,
};
const subtitleStyle: React.CSSProperties = {
  fontSize: typography.fontSize['text-sm'], color: colors.gray[50],
  marginBottom: spacing.xl, fontFamily: typography.fontFamily.body,
};
const cardStyle: React.CSSProperties = {
  backgroundColor: colors.gray[0], borderRadius: borderRadius.md,
  padding: spacing.xl, boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};
const optionStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', padding: spacing.md,
  borderRadius: borderRadius.md, border: `2px solid ${colors.gray[20]}`,
  marginBottom: spacing.xs, cursor: 'pointer', transition: 'border-color 0.15s',
};
const optionLabelStyle: React.CSSProperties = {
  display: 'block', fontSize: typography.fontSize['text-md'], fontWeight: typography.fontWeight.medium,
  color: colors.gray[70], fontFamily: typography.fontFamily.body,
};
const optionDescStyle: React.CSSProperties = {
  display: 'block', fontSize: typography.fontSize['text-xs'], color: colors.gray[40],
  marginTop: spacing['3xs'], fontFamily: typography.fontFamily.body,
};
const primaryButtonStyle: React.CSSProperties = {
  width: '100%', padding: spacing.sm, backgroundColor: colors.brand.primary,
  color: colors.neutral.white, border: 'none', borderRadius: borderRadius.md, cursor: 'pointer',
  fontSize: typography.fontSize['text-md'], fontWeight: typography.fontWeight.semiBold,
  fontFamily: typography.fontFamily.body, marginTop: spacing.xl,
};

export default ThemePage;
