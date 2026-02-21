import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import { CareLayout } from 'src/web/web/src/layouts/CareLayout';
import { JourneyHeader } from 'src/web/web/src/components/shared/JourneyHeader';

const CancelledPage: React.FC = () => {
  const router = useRouter();

  return (
    <CareLayout>
      <JourneyHeader title="Consulta Cancelada" />
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: spacing.xl }}>
        <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: colors.semantic.errorBg,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.md,
            }}
            aria-hidden="true"
          >
            <Text fontSize="2xl" color={colors.semantic.error}>X</Text>
          </div>
          <Text fontSize="xl" fontWeight="bold" color={colors.journeys.care.text}>
            Consulta cancelada
          </Text>
          <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs }}>
            Sua consulta foi cancelada com sucesso.
          </Text>
        </div>

        <Card journey="care" elevation="md" style={{ marginBottom: spacing.md }}>
          <Box padding="lg">
            <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text} style={{ marginBottom: spacing.md }}>
              Detalhes do Cancelamento
            </Text>
            <div style={{ display: 'grid', gap: spacing.sm }}>
              <div>
                <Text fontSize="sm" color={colors.gray[50]}>Medico</Text>
                <Text fontWeight="bold" color={colors.journeys.care.text}>Dra. Ana Silva — Cardiologia</Text>
              </div>
              <div>
                <Text fontSize="sm" color={colors.gray[50]}>Data original</Text>
                <Text fontWeight="bold" color={colors.journeys.care.text}>03/03/2026 as 14:00</Text>
              </div>
              <div>
                <Text fontSize="sm" color={colors.gray[50]}>Cancelado em</Text>
                <Text fontWeight="bold" color={colors.journeys.care.text}>21/02/2026 as 10:35</Text>
              </div>
              <div>
                <Text fontSize="sm" color={colors.gray[50]}>Motivo</Text>
                <Text fontWeight="bold" color={colors.journeys.care.text}>Conflito de agenda</Text>
              </div>
            </div>
          </Box>
        </Card>

        <Card journey="care" elevation="sm" style={{ borderLeft: `4px solid ${colors.semantic.success}` }}>
          <Box padding="md">
            <Text fontWeight="bold" fontSize="md" color={colors.semantic.success} style={{ marginBottom: spacing.xs }}>
              Reembolso
            </Text>
            <div style={{ display: 'grid', gap: spacing.sm }}>
              <div>
                <Text fontSize="sm" color={colors.gray[50]}>Valor</Text>
                <Text fontWeight="bold" color={colors.journeys.care.text}>R$ 50,00 (copagamento)</Text>
              </div>
              <div>
                <Text fontSize="sm" color={colors.gray[50]}>Status</Text>
                <span style={{
                  display: 'inline-block',
                  padding: `${spacing['3xs']} ${spacing.xs}`,
                  borderRadius: '12px',
                  backgroundColor: colors.semantic.warningBg,
                  color: colors.semantic.warning,
                  fontSize: '12px',
                  fontWeight: 600,
                }}>
                  Em processamento
                </span>
              </div>
              <div>
                <Text fontSize="sm" color={colors.gray[50]}>Previsao</Text>
                <Text fontWeight="bold" color={colors.journeys.care.text}>Ate 5 dias uteis</Text>
              </div>
            </div>
          </Box>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: spacing['2xl'] }}>
          <Button journey="care" variant="outlined" onPress={() => router.push('/care/appointments/list')} accessibilityLabel="Voltar as consultas">
            Minhas Consultas
          </Button>
          <Button journey="care" onPress={() => router.push('/care/appointments/search')} accessibilityLabel="Agendar nova consulta">
            Agendar Nova Consulta
          </Button>
        </div>
      </div>
    </CareLayout>
  );
};

export default CancelledPage;
