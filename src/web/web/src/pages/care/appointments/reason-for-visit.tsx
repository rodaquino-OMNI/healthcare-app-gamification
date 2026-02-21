import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import { CareLayout } from 'src/web/web/src/layouts/CareLayout';
import { JourneyHeader } from 'src/web/web/src/components/shared/JourneyHeader';

const COMMON_REASONS = [
  'Check-up de rotina',
  'Dor de cabeca persistente',
  'Resultado de exames',
  'Renovacao de receita',
  'Acompanhamento pos-cirurgico',
  'Dor nas costas',
  'Pressao alta',
  'Alergia',
];

const ReasonForVisitPage: React.FC = () => {
  const router = useRouter();
  const { type } = router.query;
  const [reason, setReason] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);

  const toggleChip = (chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const handleContinue = () => {
    router.push({ pathname: '/care/appointments/documents', query: { type, reason } });
  };

  const hasContent = reason.trim().length > 0 || selectedChips.length > 0;

  return (
    <CareLayout>
      <JourneyHeader title="Motivo da Consulta" />
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: spacing.xl }}>
        <Text fontSize="lg" fontWeight="bold" color={colors.journeys.care.text} style={{ marginBottom: spacing.md }}>
          Descreva o motivo da sua consulta
        </Text>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Ex: Estou sentindo dores no peito ha 3 dias..."
          rows={5}
          aria-label="Motivo da consulta"
          style={{
            width: '100%',
            padding: spacing.md,
            borderRadius: '8px',
            border: `1px solid ${colors.neutral.gray300}`,
            fontSize: '16px',
            resize: 'vertical',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
        />

        <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text} style={{ marginTop: spacing.xl, marginBottom: spacing.sm }}>
          Motivos comuns
        </Text>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
          {COMMON_REASONS.map((chip) => {
            const isActive = selectedChips.includes(chip);
            return (
              <button
                key={chip}
                onClick={() => toggleChip(chip)}
                aria-pressed={isActive}
                style={{
                  padding: `${spacing.xs} ${spacing.sm}`,
                  borderRadius: '20px',
                  border: `1px solid ${isActive ? colors.journeys.care.primary : colors.neutral.gray300}`,
                  backgroundColor: isActive ? colors.journeys.care.background : 'transparent',
                  color: isActive ? colors.journeys.care.primary : colors.journeys.care.text,
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                {chip}
              </button>
            );
          })}
        </div>

        <Card journey="care" elevation="sm" style={{ marginTop: spacing.xl }}>
          <Box padding="md">
            <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text} style={{ marginBottom: spacing.xs }}>
              Anexar arquivos
            </Text>
            <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing.sm }}>
              Adicione exames, receitas ou outros documentos relevantes.
            </Text>
            <Button journey="care" variant="outlined" accessibilityLabel="Anexar arquivo">
              Selecionar Arquivo
            </Button>
          </Box>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: spacing['2xl'] }}>
          <Button journey="care" onPress={handleContinue} disabled={!hasContent} accessibilityLabel="Continuar">
            Continuar
          </Button>
        </div>
      </div>
    </CareLayout>
  );
};

export default ReasonForVisitPage;
