import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

interface Caregiver {
  id: string;
  name: string;
  email: string;
  permission: 'view' | 'edit';
  dateAdded: string;
}

/**
 * Manage caregiver access to medication records.
 * Display list of caregivers with add/remove actions.
 */
const CaregiverAccessPage: React.FC = () => {
  const router = useRouter();
  const [caregivers, setCaregivers] = useState<Caregiver[]>([
    {
      id: '1',
      name: 'Maria Silva',
      email: 'maria@email.com',
      permission: 'view',
      dateAdded: '15 de janeiro de 2025',
    },
    {
      id: '2',
      name: 'João Santos',
      email: 'joao@email.com',
      permission: 'edit',
      dateAdded: '10 de janeiro de 2025',
    },
  ]);

  const handleRemove = (id: string) => {
    setCaregivers(caregivers.filter((c) => c.id !== id));
    alert('Cuidador removido.');
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
      <Text
        fontSize="2xl"
        fontWeight="bold"
        color={colors.journeys.health.text}
      >
        Acesso do Cuidador
      </Text>
      <Text
        fontSize="md"
        color={colors.gray[50]}
        style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}
      >
        Gerencie quem tem acesso ao seu histórico de medicamentos.
      </Text>

      {/* Caregivers List */}
      {caregivers.length > 0 ? (
        <div>
          {caregivers.map((caregiver) => (
            <Card
              key={caregiver.id}
              journey="health"
              elevation="sm"
              padding="lg"
              style={{ marginBottom: spacing.lg }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <Text fontSize="md" fontWeight="medium" color={colors.neutral.gray900}>
                    {caregiver.name}
                  </Text>
                  <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing.xs }}>
                    {caregiver.email}
                  </Text>
                  <div style={{ marginTop: spacing.sm, display: 'flex', gap: spacing.md }}>
                    <span
                      style={{
                        backgroundColor: colors.journeys.health.background,
                        color: colors.journeys.health.primary,
                        padding: `${spacing.xs} ${spacing.sm}`,
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 500,
                      }}
                      data-testid={`permission-badge-${caregiver.id}`}
                    >
                      {caregiver.permission === 'view' ? 'Visualização' : 'Edição'}
                    </span>
                    <Text fontSize="xs" color={colors.gray[50]}>
                      Adicionado: {caregiver.dateAdded}
                    </Text>
                  </div>
                </div>
                <Button
                  variant="tertiary"
                  journey="health"
                  onPress={() => handleRemove(caregiver.id)}
                  accessibilityLabel={`Remover ${caregiver.name}`}
                >
                  Remover
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card journey="health" elevation="sm" padding="lg">
          <Text
            fontSize="md"
            color={colors.gray[50]}
            style={{ textAlign: 'center' }}
          >
            Nenhum cuidador tem acesso no momento.
          </Text>
        </Card>
      )}

      {/* Add Button */}
      <Box style={{ marginTop: spacing.xl }}>
        <Button
          variant="primary"
          journey="health"
          onPress={() => router.push('/health/medications/share-caregiver')}
          accessibilityLabel="Adicionar cuidador"
        >
          Adicionar Cuidador
        </Button>
      </Box>

      <Box style={{ marginTop: spacing.md }}>
        <Button
          variant="secondary"
          journey="health"
          onPress={() => router.back()}
          accessibilityLabel="Voltar"
        >
          Voltar
        </Button>
      </Box>
    </div>
  );
};

export default CaregiverAccessPage;
