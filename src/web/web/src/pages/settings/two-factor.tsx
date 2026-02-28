import React, { useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { colors, typography, spacing, borderRadius } from '@web/design-system/src/tokens';
import { enable2FA, disable2FA, configure2FA } from '@web/web/src/api/auth';

/**
 * Two-factor authentication settings page.
 * Allows users to enable/disable and configure 2FA methods.
 */
const TwoFactorPage: NextPage = () => {
  const router = useRouter();
  const [enabled, setEnabled] = useState(false);
  const [method, setMethod] = useState<'sms' | 'authenticator'>('sms');
  const [phone, setPhone] = useState('(11) 99999-9999');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleToggle = async () => {
    setLoading(true);
    setError('');
    try {
      if (enabled) {
        await disable2FA();
        setEnabled(false);
      } else {
        await enable2FA();
        setEnabled(true);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar 2FA.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      await configure2FA(method, method === 'sms' ? phone : undefined);
      router.push('/settings');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar configuracao.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: spacing.xl, maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={titleStyle}>Autenticacao em Duas Etapas</h1>
      <p style={subtitleStyle}>
        Adicione uma camada extra de seguranca a sua conta.
      </p>

      <div style={cardStyle}>
        {error && <div style={{ backgroundColor: colors.semantic.errorBg, color: colors.semantic.error, padding: spacing.sm, borderRadius: borderRadius.sm, marginBottom: spacing.md, fontSize: typography.fontSize['text-sm'] }}>{error}</div>}
        {/* Enable/Disable toggle */}
        <div style={toggleRowStyle}>
          <div>
            <span style={toggleLabelStyle}>Ativar 2FA</span>
            <span style={toggleDescStyle}>
              Exigir codigo de verificacao ao fazer login
            </span>
          </div>
          <button
            onClick={handleToggle}
            disabled={loading}
            style={{
              ...toggleBtnStyle,
              backgroundColor: enabled ? colors.brand.primary : colors.gray[30],
            }}
            aria-label="Ativar autenticacao em duas etapas"
          >
            <span style={{
              ...toggleKnobStyle,
              transform: enabled ? 'translateX(20px)' : 'translateX(0)',
            }} />
          </button>
        </div>

        {enabled && (
          <>
            {/* Method selection */}
            <div style={{ marginTop: spacing.xl }}>
              <label style={labelStyle}>Metodo de Verificacao</label>

              <div
                onClick={() => setMethod('sms')}
                style={{
                  ...optionStyle,
                  borderColor: method === 'sms' ? colors.brand.primary : colors.gray[20],
                }}
              >
                <strong style={{ color: colors.gray[70] }}>SMS</strong>
                <span style={optionDescStyle}>Receba codigos por mensagem de texto</span>
              </div>

              <div
                onClick={() => setMethod('authenticator')}
                style={{
                  ...optionStyle,
                  borderColor: method === 'authenticator' ? colors.brand.primary : colors.gray[20],
                }}
              >
                <strong style={{ color: colors.gray[70] }}>Aplicativo Autenticador</strong>
                <span style={optionDescStyle}>Use Google Authenticator ou similar</span>
              </div>
            </div>

            {/* SMS phone input */}
            {method === 'sms' && (
              <div style={{ marginTop: spacing.lg }}>
                <label style={labelStyle}>Numero de Telefone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={inputStyle}
                />
              </div>
            )}

            {/* Authenticator QR placeholder */}
            {method === 'authenticator' && (
              <div style={{ marginTop: spacing.lg, textAlign: 'center' as const }}>
                <div style={qrPlaceholderStyle}>QR Code</div>
                <p style={{ fontSize: typography.fontSize['text-xs'], color: colors.gray[40] }}>
                  Escaneie com seu aplicativo autenticador
                </p>
              </div>
            )}

            <button onClick={handleSave} disabled={loading} style={{ ...primaryButtonStyle, opacity: loading ? 0.6 : 1 }}>{loading ? 'Salvando...' : 'Salvar Configuracao'}</button>
          </>
        )}
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
const toggleRowStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
};
const toggleLabelStyle: React.CSSProperties = {
  display: 'block', fontSize: typography.fontSize['text-md'],
  fontWeight: typography.fontWeight.medium, color: colors.gray[70], fontFamily: typography.fontFamily.body,
};
const toggleDescStyle: React.CSSProperties = {
  display: 'block', fontSize: typography.fontSize['text-xs'],
  color: colors.gray[40], marginTop: spacing['3xs'], fontFamily: typography.fontFamily.body,
};
const toggleBtnStyle: React.CSSProperties = {
  width: 48, height: 28, borderRadius: borderRadius.full, border: 'none',
  cursor: 'pointer', position: 'relative', transition: 'background-color 0.2s',
  flexShrink: 0,
};
const toggleKnobStyle: React.CSSProperties = {
  display: 'block', width: 22, height: 22, borderRadius: '50%',
  backgroundColor: colors.neutral.white, position: 'absolute',
  top: 3, left: 3, transition: 'transform 0.2s',
};
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: typography.fontSize['text-sm'], fontWeight: typography.fontWeight.medium,
  color: colors.gray[60], marginBottom: spacing.xs, fontFamily: typography.fontFamily.body,
};
const optionStyle: React.CSSProperties = {
  padding: spacing.md, borderRadius: borderRadius.md,
  border: `2px solid ${colors.gray[20]}`, marginBottom: spacing.xs,
  cursor: 'pointer', transition: 'border-color 0.15s',
};
const optionDescStyle: React.CSSProperties = {
  display: 'block', fontSize: typography.fontSize['text-xs'],
  color: colors.gray[40], marginTop: spacing['3xs'],
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: spacing.sm, borderRadius: borderRadius.md,
  border: `1px solid ${colors.gray[20]}`, fontSize: typography.fontSize['text-md'],
  fontFamily: typography.fontFamily.body, color: colors.gray[70], boxSizing: 'border-box',
};
const qrPlaceholderStyle: React.CSSProperties = {
  width: 160, height: 160, margin: '0 auto', marginBottom: spacing.sm,
  backgroundColor: colors.gray[10], borderRadius: borderRadius.md,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: colors.gray[40], fontSize: typography.fontSize['text-sm'],
};
const primaryButtonStyle: React.CSSProperties = {
  width: '100%', padding: spacing.sm, backgroundColor: colors.brand.primary,
  color: colors.neutral.white, border: 'none', borderRadius: borderRadius.md,
  cursor: 'pointer', fontSize: typography.fontSize['text-md'],
  fontWeight: typography.fontWeight.semiBold, fontFamily: typography.fontFamily.body,
  marginTop: spacing.xl,
};

export default TwoFactorPage;
