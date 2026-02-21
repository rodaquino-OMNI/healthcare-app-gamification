import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { typography } from 'src/web/design-system/src/tokens/typography';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import { MainLayout } from 'src/web/web/src/layouts/MainLayout';

const PageContainer = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: ${spacing.xl} ${spacing.md};
`;

const BackButton = styled.button`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.brand.primary};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-bottom: ${spacing.lg};

  &:hover {
    text-decoration: underline;
  }
`;

const NotificationCard = styled.div`
  background-color: ${colors.neutral.white};
  border-radius: 12px;
  padding: ${spacing.xl};
  border: 1px solid ${colors.gray[20]};
`;

const JourneyBadge = styled.span<{ journeyColor: string }>`
  display: inline-block;
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.white};
  background-color: ${props => props.journeyColor};
  border-radius: 6px;
  padding: ${spacing['3xs']} ${spacing.xs};
  text-transform: uppercase;
  letter-spacing: ${typography.letterSpacing.wide};
  margin-bottom: ${spacing.sm};
`;

const Title = styled.h1`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-lg']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.gray[70]};
  margin: 0 0 ${spacing.xs} 0;
`;

const TimeStamp = styled.p`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.gray[40]};
  margin: 0 0 ${spacing.lg} 0;
`;

const Body = styled.p`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${colors.gray[60]};
  line-height: ${typography.lineHeight.base};
  margin: 0 0 ${spacing.xl} 0;
`;

const ActionButton = styled.button`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.white};
  background-color: ${colors.brand.primary};
  border: none;
  border-radius: 10px;
  padding: ${spacing.sm} ${spacing.xl};
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${colors.brandPalette[400]};
  }
`;

/**
 * Notification detail page - displays a single notification with full content.
 * Mirrors the mobile NotificationDetail screen.
 */
export default function NotificationDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  // TODO: Fetch notification by id from API
  const [notification] = useState({
    id: id as string,
    title: 'Notificacao',
    body: 'Detalhes da notificacao serao carregados aqui.',
    journey: 'health',
    createdAt: new Date().toISOString(),
    deepLink: null as string | null,
  });

  const getJourneyColor = (journey: string): string => {
    switch (journey) {
      case 'health': return colors.journeys.health.primary;
      case 'care': return colors.journeys.care.primary;
      case 'plan': return colors.journeys.plan.primary;
      default: return colors.brand.primary;
    }
  };

  const getJourneyLabel = (journey: string): string => {
    switch (journey) {
      case 'health': return 'Minha Saude';
      case 'care': return 'Cuidar-me';
      case 'plan': return 'Meu Plano';
      default: return 'Geral';
    }
  };

  return (
    <MainLayout>
      <PageContainer>
        <BackButton onClick={() => router.back()}>
          Voltar
        </BackButton>

        <NotificationCard>
          <JourneyBadge journeyColor={getJourneyColor(notification.journey)}>
            {getJourneyLabel(notification.journey)}
          </JourneyBadge>
          <Title>{notification.title}</Title>
          <TimeStamp>
            {new Date(notification.createdAt).toLocaleString('pt-BR')}
          </TimeStamp>
          <Body>{notification.body}</Body>

          {notification.deepLink && (
            <ActionButton onClick={() => router.push(notification.deepLink!)}>
              Ver mais
            </ActionButton>
          )}
        </NotificationCard>
      </PageContainer>
    </MainLayout>
  );
}
