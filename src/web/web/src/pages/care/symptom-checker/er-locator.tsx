import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Badge } from 'src/web/design-system/src/components/Badge/Badge';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

interface EmergencyRoom {
  id: string;
  name: string;
  address: string;
  distance: string;
  phone: string;
  waitTime: string;
  open24h: boolean;
}

const MOCK_ERS: EmergencyRoom[] = [
  { id: 'er1', name: 'Hospital Sao Paulo - ER', address: 'R. Napoleao de Barros, 715', distance: '1.2 km', phone: '(11) 5576-4000', waitTime: '~30 min', open24h: true },
  { id: 'er2', name: 'Hospital Albert Einstein - ER', address: 'Av. Albert Einstein, 627', distance: '3.5 km', phone: '(11) 2151-1233', waitTime: '~15 min', open24h: true },
  { id: 'er3', name: 'UPA Vila Mariana', address: 'R. Domingos de Morais, 2564', distance: '2.1 km', phone: '(11) 5084-3000', waitTime: '~45 min', open24h: true },
  { id: 'er4', name: 'Hospital Sirio-Libanes - ER', address: 'R. Dona Adma Jafet, 91', distance: '4.8 km', phone: '(11) 3394-0200', waitTime: '~20 min', open24h: true },
];

/** ER locator page listing nearest emergency rooms with call and directions actions. */
const ERLocatorPage: React.FC = () => {
  const router = useRouter();

  const handleCall = (phone: string) => {
    window.open(`tel:${phone.replace(/\D/g, '')}`, '_self');
  };

  const handleDirections = (address: string) => {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`, '_blank');
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
      <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
        Nearest Emergency Rooms
      </Text>
      <Text
        fontSize="md"
        color={colors.gray[50]}
        style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}
      >
        Find the closest emergency room and get directions or call ahead.
      </Text>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        {MOCK_ERS.map((er) => (
          <Card key={er.id} journey="care" elevation="md" padding="lg">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              style={{ marginBottom: spacing.xs }}
            >
              <div>
                <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                  {er.name}
                </Text>
                <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing['3xs'] }}>
                  {er.address}
                </Text>
              </div>
              <Badge variant="status" status="info">
                {er.distance}
              </Badge>
            </Box>

            <Box display="flex" style={{ gap: spacing.lg, marginTop: spacing.sm, marginBottom: spacing.md }}>
              <div>
                <Text fontSize="xs" color={colors.gray[40]}>Wait Time</Text>
                <Text fontSize="sm" fontWeight="medium">{er.waitTime}</Text>
              </div>
              <div>
                <Text fontSize="xs" color={colors.gray[40]}>Status</Text>
                <Text fontSize="sm" fontWeight="medium" color={colors.semantic.success}>
                  {er.open24h ? 'Open 24h' : 'Open'}
                </Text>
              </div>
              <div>
                <Text fontSize="xs" color={colors.gray[40]}>Phone</Text>
                <Text fontSize="sm" fontWeight="medium">{er.phone}</Text>
              </div>
            </Box>

            <Box display="flex" style={{ gap: spacing.sm }}>
              <Button
                journey="care"
                onPress={() => handleCall(er.phone)}
                accessibilityLabel={`Call ${er.name}`}
                data-testid={`er-call-${er.id}`}
              >
                Call
              </Button>
              <Button
                variant="secondary"
                journey="care"
                onPress={() => handleDirections(er.address)}
                accessibilityLabel={`Get directions to ${er.name}`}
                data-testid={`er-directions-${er.id}`}
              >
                Directions
              </Button>
            </Box>
          </Card>
        ))}
      </div>

      <Box display="flex" justifyContent="center" style={{ marginTop: spacing['2xl'] }}>
        <Button
          variant="tertiary"
          journey="care"
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          data-testid="er-locator-back-btn"
        >
          Back
        </Button>
      </Box>
    </div>
  );
};

export default ERLocatorPage;
