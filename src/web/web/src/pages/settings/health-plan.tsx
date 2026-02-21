import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { colors, typography, spacing, borderRadius } from '@web/design-system/src/tokens';

const { plan } = colors.journeys;

/**
 * Health plan information page.
 * Displays current plan details and member information.
 */
const HealthPlanPage: NextPage = () => {
  const router = useRouter();

  const planData = {
    name: 'AUSTA Saude Premium',
    number: 'PLN-2024-00891',
    memberSince: '15/01/2023',
    status: 'Ativo',
    type: 'Individual',
    coverage: 'Nacional',
    operator: 'AUSTA Saude S.A.',
    ansNumber: '312.345',
  };

  const memberData = {
    name: 'Maria Silva',
    cpf: '123.456.789-00',
    memberId: 'MBR-2024-45678',
    dependents: 2,
  };

  return (
    <div style={{ padding: spacing.xl, maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={titleStyle}>Meu Plano de Saude</h1>
      <p style={subtitleStyle}>Informacoes do seu plano e cobertura.</p>

      {/* Plan card */}
      <div style={{ ...cardStyle, borderLeft: `4px solid ${plan.primary}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
          <h2 style={{ ...sectionTitleStyle, margin: 0 }}>{planData.name}</h2>
          <span style={statusBadgeStyle}>{planData.status}</span>
        </div>

        {Object.entries({
          'Numero do Plano': planData.number,
          'Tipo': planData.type,
          'Cobertura': planData.coverage,
          'Operadora': planData.operator,
          'Registro ANS': planData.ansNumber,
          'Membro desde': planData.memberSince,
        }).map(([label, value]) => (
          <div key={label} style={infoRowStyle}>
            <span style={infoLabelStyle}>{label}</span>
            <span style={infoValueStyle}>{value}</span>
          </div>
        ))}
      </div>

      {/* Member info */}
      <div style={{ ...cardStyle, marginTop: spacing.md }}>
        <h2 style={sectionTitleStyle}>Dados do Titular</h2>
        {Object.entries({
          'Nome': memberData.name,
          'CPF': memberData.cpf,
          'ID do Membro': memberData.memberId,
          'Dependentes': String(memberData.dependents),
        }).map(([label, value]) => (
          <div key={label} style={infoRowStyle}>
            <span style={infoLabelStyle}>{label}</span>
            <span style={infoValueStyle}>{value}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: spacing.xs, marginTop: spacing.xl }}>
        <button onClick={() => router.push('/plan/coverage')} style={linkBtnStyle}>
          Ver Cobertura
        </button>
        <button onClick={() => router.push('/plan/card')} style={linkBtnStyle}>
          Carteirinha Digital
        </button>
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
const sectionTitleStyle: React.CSSProperties = {
  fontSize: typography.fontSize['heading-sm'], fontWeight: typography.fontWeight.semiBold,
  color: colors.gray[60], marginBottom: spacing.md, fontFamily: typography.fontFamily.heading,
};
const statusBadgeStyle: React.CSSProperties = {
  fontSize: typography.fontSize['text-xs'], fontWeight: typography.fontWeight.medium,
  color: colors.semantic.success, backgroundColor: colors.semantic.successBg,
  padding: `${spacing['3xs']} ${spacing.xs}`, borderRadius: borderRadius.full,
};
const infoRowStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', padding: `${spacing.xs} 0`,
  borderBottom: `1px solid ${colors.gray[10]}`,
};
const infoLabelStyle: React.CSSProperties = {
  fontSize: typography.fontSize['text-sm'], color: colors.gray[50], fontFamily: typography.fontFamily.body,
};
const infoValueStyle: React.CSSProperties = {
  fontSize: typography.fontSize['text-sm'], color: colors.gray[70],
  fontWeight: typography.fontWeight.medium, fontFamily: typography.fontFamily.body,
};
const linkBtnStyle: React.CSSProperties = {
  flex: 1, padding: spacing.sm, backgroundColor: colors.gray[0],
  color: colors.brand.primary, border: `1px solid ${colors.brand.primary}`,
  borderRadius: borderRadius.md, cursor: 'pointer', fontSize: typography.fontSize['text-sm'],
  fontWeight: typography.fontWeight.medium, fontFamily: typography.fontFamily.body,
  textAlign: 'center' as const,
};

export default HealthPlanPage;
