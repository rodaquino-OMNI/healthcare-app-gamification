import React, { useState } from 'react';
import type { NextPage } from 'next';
import { colors, typography, spacing, borderRadius } from '@web/design-system/src/tokens';

/**
 * Biometric preferences page.
 * Allows users to toggle Face ID and fingerprint authentication.
 */
const BiometricPage: NextPage = () => {
  const [faceId, setFaceId] = useState(true);
  const [fingerprint, setFingerprint] = useState(false);
  const [loginBiometric, setLoginBiometric] = useState(true);
  const [transactionBiometric, setTransactionBiometric] = useState(false);

  const toggleItems = [
    { label: 'Face ID', desc: 'Use reconhecimento facial para autenticar', value: faceId, toggle: () => setFaceId(!faceId) },
    { label: 'Impressao Digital', desc: 'Use sua digital para autenticar', value: fingerprint, toggle: () => setFingerprint(!fingerprint) },
    { label: 'Login Biometrico', desc: 'Usar biometria ao fazer login no app', value: loginBiometric, toggle: () => setLoginBiometric(!loginBiometric) },
    { label: 'Confirmar Transacoes', desc: 'Exigir biometria para confirmar agendamentos', value: transactionBiometric, toggle: () => setTransactionBiometric(!transactionBiometric) },
  ];

  return (
    <div style={{ padding: spacing.xl, maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={titleStyle}>Biometria</h1>
      <p style={subtitleStyle}>Gerencie como voce usa biometria no app.</p>

      <div style={cardStyle}>
        {toggleItems.map((item) => (
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
              <span style={{
                ...toggleKnobStyle,
                transform: item.value ? 'translateX(20px)' : 'translateX(0)',
              }} />
            </button>
          </div>
        ))}
      </div>

      <div style={infoBoxStyle}>
        <p style={{ fontSize: typography.fontSize['text-xs'], color: colors.gray[50], margin: 0 }}>
          A biometria e armazenada de forma segura no seu dispositivo. A AUSTA nao
          tem acesso aos seus dados biometricos.
        </p>
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
const rowStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: `${spacing.sm} 0`, borderBottom: `1px solid ${colors.gray[10]}`,
};
const rowLabelStyle: React.CSSProperties = {
  display: 'block', fontSize: typography.fontSize['text-md'],
  color: colors.gray[70], fontFamily: typography.fontFamily.body,
};
const rowDescStyle: React.CSSProperties = {
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
const infoBoxStyle: React.CSSProperties = {
  marginTop: spacing.lg, padding: spacing.md, backgroundColor: colors.gray[5],
  borderRadius: borderRadius.md, borderLeft: `3px solid ${colors.brand.primary}`,
};

export default BiometricPage;
