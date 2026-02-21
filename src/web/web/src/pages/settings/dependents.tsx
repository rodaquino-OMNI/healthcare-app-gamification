import React, { useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { colors, typography, spacing, borderRadius } from '@web/design-system/src/tokens';

interface Dependent {
  id: string;
  name: string;
  relationship: string;
  dob: string;
  cpf: string;
}

const MOCK_DEPENDENTS: Dependent[] = [
  { id: '1', name: 'Joao Silva', relationship: 'Filho', dob: '10/05/2015', cpf: '987.654.321-00' },
  { id: '2', name: 'Ana Silva', relationship: 'Filha', dob: '22/08/2018', cpf: '876.543.210-99' },
];

/**
 * Dependents list page.
 * Shows family members linked to the health plan.
 */
const DependentsPage: NextPage = () => {
  const router = useRouter();
  const [dependents] = useState<Dependent[]>(MOCK_DEPENDENTS);

  const handleRemove = (id: string) => {
    // TODO: Confirm and remove dependent via API
    console.log('Remove dependent:', id);
  };

  return (
    <div style={{ padding: spacing.xl, maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={titleStyle}>Dependentes</h1>
      <p style={subtitleStyle}>Gerencie os dependentes vinculados ao seu plano.</p>

      {dependents.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: 'center' as const }}>
          <p style={{ fontSize: typography.fontSize['text-md'], color: colors.gray[40], margin: 0 }}>
            Nenhum dependente cadastrado.
          </p>
        </div>
      ) : (
        dependents.map((dep) => (
          <div key={dep.id} style={{ ...cardStyle, marginBottom: spacing.md }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={depNameStyle}>{dep.name}</h3>
                <span style={depRelStyle}>{dep.relationship}</span>
              </div>
            </div>
            <div style={{ marginTop: spacing.sm }}>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>Data de Nascimento</span>
                <span style={detailValueStyle}>{dep.dob}</span>
              </div>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>CPF</span>
                <span style={detailValueStyle}>{dep.cpf}</span>
              </div>
            </div>
            <button onClick={() => handleRemove(dep.id)} style={removeBtnStyle}>
              Remover Dependente
            </button>
          </div>
        ))
      )}

      <button
        onClick={() => router.push('/settings/add-dependent')}
        style={addBtnStyle}
      >
        + Adicionar Dependente
      </button>
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
  padding: spacing.lg, boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};
const depNameStyle: React.CSSProperties = {
  fontSize: typography.fontSize['text-md'], fontWeight: typography.fontWeight.semiBold,
  color: colors.gray[70], margin: 0, fontFamily: typography.fontFamily.body,
};
const depRelStyle: React.CSSProperties = {
  fontSize: typography.fontSize['text-xs'], color: colors.gray[40], fontFamily: typography.fontFamily.body,
};
const detailRowStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', padding: `${spacing.xs} 0`,
  borderBottom: `1px solid ${colors.gray[10]}`,
};
const detailLabelStyle: React.CSSProperties = {
  fontSize: typography.fontSize['text-sm'], color: colors.gray[50], fontFamily: typography.fontFamily.body,
};
const detailValueStyle: React.CSSProperties = {
  fontSize: typography.fontSize['text-sm'], color: colors.gray[70],
  fontWeight: typography.fontWeight.medium, fontFamily: typography.fontFamily.body,
};
const removeBtnStyle: React.CSSProperties = {
  marginTop: spacing.md, padding: `${spacing.xs} ${spacing.md}`,
  backgroundColor: 'transparent', color: colors.semantic.error,
  border: `1px solid ${colors.semantic.error}`, borderRadius: borderRadius.md,
  cursor: 'pointer', fontSize: typography.fontSize['text-sm'], fontFamily: typography.fontFamily.body,
};
const addBtnStyle: React.CSSProperties = {
  width: '100%', padding: spacing.sm, backgroundColor: colors.gray[0],
  color: colors.brand.primary, border: `2px dashed ${colors.brand.primary}`,
  borderRadius: borderRadius.md, cursor: 'pointer', fontSize: typography.fontSize['text-md'],
  fontWeight: typography.fontWeight.medium, fontFamily: typography.fontFamily.body,
  marginTop: spacing.md,
};

export default DependentsPage;
