import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { typography } from 'design-system/tokens/typography';
import React, { useState } from 'react';
import styled from 'styled-components';

import { MainLayout } from '@/layouts/MainLayout';

import { restClient } from '../../api/client';

const PageContainer = styled.div`
    max-width: 600px;
    margin: 0 auto;
    padding: ${spacing.xl} ${spacing.md};
`;

const Title = styled.h1`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-xl']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.gray[70]};
    margin: 0 0 ${spacing.xs} 0;
`;

const Subtitle = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.gray[50]};
    margin: 0 0 ${spacing.xl} 0;
`;

const Section = styled.div`
    margin-bottom: ${spacing.xl};
`;

const SectionTitle = styled.h2`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-sm']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.gray[60]};
    margin: 0 0 ${spacing.md} 0;
`;

const ToggleRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${spacing.sm} 0;
    border-bottom: 1px solid ${colors.gray[10]};
`;

const ToggleLabel = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: ${colors.gray[60]};
`;

const ToggleDescription = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    color: ${colors.gray[40]};
    display: block;
    margin-top: ${spacing['4xs']};
`;

const ToggleSwitch = styled.label`
    position: relative;
    display: inline-block;
    width: 48px;
    height: 28px;
    flex-shrink: 0;
`;

const ToggleInput = styled.input`
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + span {
        background-color: ${colors.brand.primary};
    }

    &:checked + span::before {
        transform: translateX(20px);
    }
`;

const ToggleSlider = styled.span`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${colors.gray[30]};
    transition: 0.2s;
    border-radius: 14px;

    &::before {
        position: absolute;
        content: '';
        height: 22px;
        width: 22px;
        left: 3px;
        bottom: 3px;
        background-color: ${colors.neutral.white};
        transition: 0.2s;
        border-radius: 50%;
    }
`;

const SaveButton = styled.button`
    width: 100%;
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
    margin-top: ${spacing.xl};

    &:hover {
        background-color: ${colors.brandPalette[400]};
    }
`;

interface NotificationPreference {
    key: string;
    label: string;
    description: string;
    enabled: boolean;
}

/**
 * Notification preferences page - allows users to configure notification settings.
 * Mirrors the mobile SettingsNotifications screen.
 */
export default function NotificationPreferencesPage(): React.ReactElement {
    const [preferences, setPreferences] = useState<NotificationPreference[]>([
        {
            key: 'push',
            label: 'Notificacoes Push',
            description: 'Receba alertas no seu dispositivo',
            enabled: true,
        },
        {
            key: 'email',
            label: 'Notificacoes por E-mail',
            description: 'Receba resumos por e-mail',
            enabled: true,
        },
        {
            key: 'medications',
            label: 'Lembretes de Medicamentos',
            description: 'Alertas para tomar seus medicamentos',
            enabled: true,
        },
        {
            key: 'appointments',
            label: 'Lembretes de Consultas',
            description: 'Alertas sobre consultas agendadas',
            enabled: true,
        },
        {
            key: 'health_goals',
            label: 'Metas de Saude',
            description: 'Atualizacoes sobre suas metas de saude',
            enabled: false,
        },
        {
            key: 'plan_updates',
            label: 'Atualizacoes do Plano',
            description: 'Novidades sobre seu plano de saude',
            enabled: true,
        },
        {
            key: 'achievements',
            label: 'Conquistas',
            description: 'Notificacoes sobre novas conquistas',
            enabled: true,
        },
        {
            key: 'marketing',
            label: 'Comunicacoes de Marketing',
            description: 'Promocoes e novidades da AUSTA',
            enabled: false,
        },
    ]);

    const togglePreference = (key: string): void => {
        setPreferences((prev) => prev.map((pref) => (pref.key === key ? { ...pref, enabled: !pref.enabled } : pref)));
    };

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async (): Promise<void> => {
        setSaving(true);
        setError(null);
        try {
            const payload = preferences.reduce(
                (acc, pref) => {
                    acc[pref.key] = pref.enabled;
                    return acc;
                },
                {} as Record<string, boolean>
            );
            await restClient.put('/users/me/notification-preferences', payload);
        } catch (err) {
            setError('Falha ao salvar preferencias');
        } finally {
            setSaving(false);
        }
    };

    // Group preferences by category
    const essentialPrefs = preferences.filter((p) => ['push', 'email'].includes(p.key));
    const healthPrefs = preferences.filter((p) => ['medications', 'appointments', 'health_goals'].includes(p.key));
    const otherPrefs = preferences.filter((p) => ['plan_updates', 'achievements', 'marketing'].includes(p.key));

    const renderToggle = (pref: NotificationPreference): React.ReactNode => (
        <ToggleRow key={pref.key}>
            <div>
                <ToggleLabel>{pref.label}</ToggleLabel>
                <ToggleDescription>{pref.description}</ToggleDescription>
            </div>
            <ToggleSwitch>
                <ToggleInput
                    type="checkbox"
                    checked={pref.enabled}
                    onChange={() => togglePreference(pref.key)}
                    aria-label={pref.label}
                />
                <ToggleSlider />
            </ToggleSwitch>
        </ToggleRow>
    );

    return (
        <MainLayout>
            <PageContainer>
                <Title>Notificacoes</Title>
                <Subtitle>Configure como e quando voce recebe notificacoes.</Subtitle>

                <Section>
                    <SectionTitle>Canais</SectionTitle>
                    {essentialPrefs.map(renderToggle)}
                </Section>

                <Section>
                    <SectionTitle>Saude e Consultas</SectionTitle>
                    {healthPrefs.map(renderToggle)}
                </Section>

                <Section>
                    <SectionTitle>Outros</SectionTitle>
                    {otherPrefs.map(renderToggle)}
                </Section>

                {error && <Subtitle style={{ color: colors.semantic?.error || '#dc2626' }}>{error}</Subtitle>}

                <SaveButton onClick={() => void handleSave()} disabled={saving}>
                    {saving ? 'Salvando...' : 'Salvar Preferencias'}
                </SaveButton>
            </PageContainer>
        </MainLayout>
    );
}
