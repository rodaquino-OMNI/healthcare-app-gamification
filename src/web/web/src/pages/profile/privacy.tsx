import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { typography } from 'design-system/tokens/typography';
import React, { useState } from 'react';
import styled from 'styled-components';

import { restClient } from '@/api/client';
import { useProfile } from '@/hooks/useProfile';
import { MainLayout } from '@/layouts/MainLayout';

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

const SectionDescription = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.gray[50]};
    line-height: ${typography.lineHeight.base};
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

const DangerButton = styled.button`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.semantic.error};
    background-color: transparent;
    border: 1px solid ${colors.semantic.error};
    border-radius: 10px;
    padding: ${spacing.xs} ${spacing.lg};
    cursor: pointer;
    transition: background-color 0.15s ease;

    &:hover {
        background-color: ${colors.semantic.errorBg};
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

const DialogOverlay = styled.div`
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const DialogCard = styled.div`
    background-color: ${colors.neutral.white};
    border-radius: 12px;
    padding: ${spacing.xl};
    max-width: 400px;
    width: 90%;
`;

const DialogTitle = styled.h3`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-sm']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.semantic.error};
    margin: 0 0 ${spacing.sm} 0;
`;

const DialogMessage = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.gray[50]};
    line-height: ${typography.lineHeight.base};
    margin: 0;
`;

const DialogActions = styled.div`
    display: flex;
    gap: ${spacing.sm};
    justify-content: flex-end;
    margin-top: ${spacing.xl};
`;

const DialogCancelBtn = styled.button`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.gray[60]};
    background-color: transparent;
    border: 1px solid ${colors.gray[30]};
    border-radius: 8px;
    padding: ${spacing.xs} ${spacing.lg};
    cursor: pointer;
`;

const DialogConfirmBtn = styled.button`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.neutral.white};
    background-color: ${colors.semantic.error};
    border: none;
    border-radius: 8px;
    padding: ${spacing.xs} ${spacing.lg};
    cursor: pointer;
`;

const LinkButton = styled.button`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.brand.primary};
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-top: ${spacing.sm};

    &:hover {
        text-decoration: underline;
    }
`;

interface PrivacySetting {
    key: string;
    label: string;
    description: string;
    enabled: boolean;
}

/**
 * Privacy settings page - allows users to manage their data sharing and privacy options.
 * Mirrors the mobile SettingsPrivacy screen.
 */

export const getServerSideProps = () => ({ props: {} });

export default function PrivacySettingsPage(): React.ReactElement {
    const { profile: _profile } = useProfile();
    const [_loading, setLoading] = useState(false);
    const [_error, setError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [settings, setSettings] = useState<PrivacySetting[]>([
        {
            key: 'share_health_data',
            label: 'Compartilhar Dados de Saude',
            description: 'Permitir compartilhar dados com profissionais de saude autorizados',
            enabled: true,
        },
        {
            key: 'analytics',
            label: 'Dados de Uso Anonimizados',
            description: 'Ajude a melhorar o app compartilhando dados de uso anonimizados',
            enabled: false,
        },
        {
            key: 'location',
            label: 'Servicos de Localizacao',
            description: 'Permitir acesso a localizacao para buscar medicos proximos',
            enabled: true,
        },
        {
            key: 'biometric',
            label: 'Autenticacao Biometrica',
            description: 'Usar impressao digital ou Face ID para acesso',
            enabled: true,
        },
    ]);

    const toggleSetting = (key: string): void => {
        setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, enabled: !s.enabled } : s)));
    };

    const handleSave = async (): Promise<void> => {
        setLoading(true);
        try {
            await restClient.patch('/privacy/my-data', { settings });
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar configurações');
        } finally {
            setLoading(false);
        }
    };

    const handleExportData = async (): Promise<void> => {
        setLoading(true);
        try {
            await restClient.get('/privacy/export');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao exportar dados');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async (): Promise<void> => {
        setLoading(true);
        try {
            await restClient.delete('/privacy/my-data');
            window.location.href = '/login';
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao excluir conta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <PageContainer>
                <Title>Privacidade</Title>
                <Subtitle>Gerencie seus dados e preferencias de privacidade.</Subtitle>

                <Section>
                    <SectionTitle>Compartilhamento de Dados</SectionTitle>
                    <SectionDescription>
                        Controle como seus dados sao compartilhados com terceiros. Seus dados de saude sao protegidos
                        conforme a LGPD e regulamentacoes de saude.
                    </SectionDescription>
                    {settings
                        .filter((s) => ['share_health_data', 'analytics', 'location'].includes(s.key))
                        .map((setting) => (
                            <ToggleRow key={setting.key}>
                                <div>
                                    <ToggleLabel>{setting.label}</ToggleLabel>
                                    <ToggleDescription>{setting.description}</ToggleDescription>
                                </div>
                                <ToggleSwitch>
                                    <ToggleInput
                                        type="checkbox"
                                        checked={setting.enabled}
                                        onChange={() => toggleSetting(setting.key)}
                                        aria-label={setting.label}
                                    />
                                    <ToggleSlider />
                                </ToggleSwitch>
                            </ToggleRow>
                        ))}
                </Section>

                <Section>
                    <SectionTitle>Seguranca</SectionTitle>
                    {settings
                        .filter((s) => s.key === 'biometric')
                        .map((setting) => (
                            <ToggleRow key={setting.key}>
                                <div>
                                    <ToggleLabel>{setting.label}</ToggleLabel>
                                    <ToggleDescription>{setting.description}</ToggleDescription>
                                </div>
                                <ToggleSwitch>
                                    <ToggleInput
                                        type="checkbox"
                                        checked={setting.enabled}
                                        onChange={() => toggleSetting(setting.key)}
                                        aria-label={setting.label}
                                    />
                                    <ToggleSlider />
                                </ToggleSwitch>
                            </ToggleRow>
                        ))}
                </Section>

                <Section>
                    <SectionTitle>Seus Dados</SectionTitle>
                    <SectionDescription>
                        Voce tem o direito de acessar, exportar ou excluir seus dados pessoais a qualquer momento.
                    </SectionDescription>
                    <LinkButton onClick={() => void handleExportData()}>Exportar Meus Dados</LinkButton>
                </Section>

                <SaveButton onClick={() => void handleSave()}>Salvar Configuracoes</SaveButton>

                <Section style={{ marginTop: '40px' }}>
                    <SectionTitle>Zona de Perigo</SectionTitle>
                    <SectionDescription>
                        A exclusao da conta e permanente e remove todos os seus dados. Esta acao nao pode ser desfeita.
                    </SectionDescription>
                    <DangerButton onClick={() => setShowDeleteConfirm(true)}>Excluir Minha Conta</DangerButton>
                </Section>
                {showDeleteConfirm && (
                    <DialogOverlay aria-label="Confirmar exclusao de conta" onClick={() => setShowDeleteConfirm(false)}>
                        <DialogCard onClick={(e) => e.stopPropagation()}>
                            <DialogTitle>Excluir Conta</DialogTitle>
                            <DialogMessage>
                                Tem certeza que deseja excluir sua conta? Esta acao e permanente e todos os seus dados
                                serao removidos. Nao e possivel desfazer.
                            </DialogMessage>
                            <DialogActions>
                                <DialogCancelBtn onClick={() => setShowDeleteConfirm(false)}>Cancelar</DialogCancelBtn>
                                <DialogConfirmBtn onClick={() => void handleDeleteAccount()}>
                                    Sim, Excluir
                                </DialogConfirmBtn>
                            </DialogActions>
                        </DialogCard>
                    </DialogOverlay>
                )}
            </PageContainer>
        </MainLayout>
    );
}
