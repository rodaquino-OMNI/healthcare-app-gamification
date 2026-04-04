import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { typography } from 'design-system/tokens/typography';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { restClient } from '@/api/client';
import { useNotifications } from '@/hooks/useNotifications';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';
import { MainLayout } from '@/layouts/MainLayout';

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
    background-color: ${(props) => props.journeyColor};
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

export const getServerSideProps = () => ({ props: {} });

export default function NotificationDetailPage(): React.ReactElement {
    const { t } = useTranslation();
    const router = useRouter();
    const { id } = router.query;
    const { markAsRead, unreadCount: _unreadCount } = useNotifications();

    const [notification, setNotification] = useState<{
        id: string;
        title: string;
        body: string;
        journey: string;
        createdAt: string;
        deepLink: string | null;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Validate id to prevent SSRF — only allow alphanumeric and hyphens (UUIDs, numeric IDs)
    const rawId = Array.isArray(id) ? id[0] : id;
    const safeId = typeof rawId === 'string' && /^[a-zA-Z0-9-]+$/.test(rawId) ? rawId : null;

    useEffect(() => {
        if (!safeId) {
            return;
        }

        restClient
            .get(`/notifications/${safeId}`)
            .then((res) => {
                const data = res.data as {
                    id: string;
                    title: string;
                    body: string;
                    journey: string;
                    createdAt: string;
                    deepLink: string | null;
                };
                setNotification(data);
                void markAsRead(safeId);
            })
            .catch(() => {
                setError('Erro ao carregar notificacao.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [safeId, markAsRead]);

    const getJourneyColor = (journey: string): string => {
        switch (journey) {
            case 'health':
                return colors.journeys.health.primary;
            case 'care':
                return colors.journeys.care.primary;
            case 'plan':
                return colors.journeys.plan.primary;
            default:
                return colors.brand.primary;
        }
    };

    const getJourneyLabel = (journey: string): string => {
        switch (journey) {
            case 'health':
                return 'Minha Saude';
            case 'care':
                return 'Cuidar-me';
            case 'plan':
                return 'Meu Plano';
            default:
                return 'Geral';
        }
    };

    return (
        <MainLayout>
            <PageContainer>
                <BackButton onClick={() => router.back()}>Voltar</BackButton>

                {loading && <div>{t('common.loading')}</div>}
                {error && <div>{t('common.error')}</div>}
                {!loading && !error && notification && (
                    <NotificationCard>
                        <JourneyBadge journeyColor={getJourneyColor(notification.journey)}>
                            {getJourneyLabel(notification.journey)}
                        </JourneyBadge>
                        <Title>{notification.title}</Title>
                        <TimeStamp>{new Date(notification.createdAt).toLocaleString('pt-BR')}</TimeStamp>
                        <Body>{notification.body}</Body>

                        {notification.deepLink && (
                            <ActionButton onClick={() => void router.push(notification.deepLink!)}>
                                Ver mais
                            </ActionButton>
                        )}
                    </NotificationCard>
                )}
            </PageContainer>
        </MainLayout>
    );
}
