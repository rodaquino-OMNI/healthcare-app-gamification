import React from 'react';
import type { NextPage } from 'next';
import { colors, typography, spacing, borderRadius } from '@web/design-system/src/tokens';

interface InsuranceDoc {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
}

const MOCK_DOCS: InsuranceDoc[] = [
  { id: '1', name: 'Contrato do Plano', type: 'PDF', date: '15/01/2024', size: '2.3 MB' },
  { id: '2', name: 'Guia de Cobertura 2024', type: 'PDF', date: '01/01/2024', size: '1.8 MB' },
  { id: '3', name: 'Carteirinha Digital', type: 'PDF', date: '15/01/2024', size: '450 KB' },
  { id: '4', name: 'Declaracao de Saude', type: 'PDF', date: '10/12/2023', size: '890 KB' },
  { id: '5', name: 'Termo de Adesao', type: 'PDF', date: '15/01/2023', size: '1.1 MB' },
  { id: '6', name: 'Rede Credenciada', type: 'PDF', date: '01/03/2024', size: '3.5 MB' },
];

/**
 * Insurance documents page.
 * Displays available plan documents for download.
 */
const InsuranceDocsPage: NextPage = () => {
  const handleDownload = (doc: InsuranceDoc) => {
    // TODO: Download document via API
    console.log('Downloading:', doc.name);
  };

  return (
    <div style={{ padding: spacing.xl, maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={titleStyle}>Documentos do Plano</h1>
      <p style={subtitleStyle}>Acesse e baixe seus documentos de seguro saude.</p>

      <div style={cardStyle}>
        {MOCK_DOCS.map((doc, idx) => (
          <div
            key={doc.id}
            style={{
              ...docRowStyle,
              borderBottom: idx < MOCK_DOCS.length - 1 ? `1px solid ${colors.gray[10]}` : 'none',
            }}
          >
            <div style={docIconStyle}>
              {doc.type}
            </div>
            <div style={{ flex: 1 }}>
              <span style={docNameStyle}>{doc.name}</span>
              <span style={docMetaStyle}>{doc.date} - {doc.size}</span>
            </div>
            <button onClick={() => handleDownload(doc)} style={downloadBtnStyle} aria-label={`Baixar ${doc.name}`}>
              Baixar
            </button>
          </div>
        ))}
      </div>

      <p style={footerNoteStyle}>
        Todos os documentos estao protegidos e disponiveis conforme a LGPD.
      </p>
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
  padding: spacing.md, boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};
const docRowStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', padding: `${spacing.sm} ${spacing.xs}`,
  gap: spacing.sm,
};
const docIconStyle: React.CSSProperties = {
  width: 40, height: 40, borderRadius: borderRadius.sm,
  backgroundColor: colors.semantic.errorBg, color: colors.semantic.error,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: typography.fontSize['text-2xs'], fontWeight: typography.fontWeight.bold,
  fontFamily: typography.fontFamily.mono, flexShrink: 0,
};
const docNameStyle: React.CSSProperties = {
  display: 'block', fontSize: typography.fontSize['text-sm'],
  fontWeight: typography.fontWeight.medium, color: colors.gray[70],
  fontFamily: typography.fontFamily.body,
};
const docMetaStyle: React.CSSProperties = {
  display: 'block', fontSize: typography.fontSize['text-xs'], color: colors.gray[40],
  marginTop: spacing['3xs'], fontFamily: typography.fontFamily.body,
};
const downloadBtnStyle: React.CSSProperties = {
  padding: `${spacing.xs} ${spacing.sm}`, backgroundColor: colors.brand.primary,
  color: colors.neutral.white, border: 'none', borderRadius: borderRadius.md,
  cursor: 'pointer', fontSize: typography.fontSize['text-xs'],
  fontWeight: typography.fontWeight.medium, fontFamily: typography.fontFamily.body,
  flexShrink: 0,
};
const footerNoteStyle: React.CSSProperties = {
  fontSize: typography.fontSize['text-xs'], color: colors.gray[40],
  marginTop: spacing.lg, textAlign: 'center' as const, fontFamily: typography.fontFamily.body,
};

export default InsuranceDocsPage;
