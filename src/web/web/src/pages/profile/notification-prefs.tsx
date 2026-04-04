import { borderRadius } from 'design-system/tokens/borderRadius';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { typography } from 'design-system/tokens/typography';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { useProfile } from '@/hooks/useProfile';
import { useSafeNavRouter as useRouter } from '@/hooks/useSafeRouter';
import { AuthLayout } from '@/layouts/AuthLayout';

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const Title = styled.h2`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-xl']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.gray[70]};
    margin: 0 0 ${spacing.xs} 0;
`;

const Description = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: ${colors.gray[50]};
    line-height: ${typography.lineHeight.relaxed};
    margin: 0 0 ${spacing['2xl']} 0;
`;

const PrefsContainer = styled.div`
    margin-bottom: ${spacing['2xl']};
`;

const PrefRow = styled.div`
    display: flex;
    align-items: center;
    padding: ${spacing.md} 0;
    border-bottom: 1px solid ${colors.gray[10]};

    &:last-child {
        border-bottom: none;
    }
`;

const PrefIconContainer = styled.div`
    width: 36px;
    height: 36px;
    border-radius: ${borderRadius.md};
    background-color: ${colors.gray[5]};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${spacing.md};
    flex-shrink: 0;
`;

const PrefIcon = styled.span`
    font-size: 18px;
`;

const PrefTextContainer = styled.div`
    flex: 1;
    margin-right: ${spacing.md};
`;

const PrefTitle = styled.span`
    display: block;
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.gray[70]};
    margin-bottom: 2px;
`;

const PrefDescription = styled.span`
    display: block;
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.gray[50]};
`;

const ToggleSwitch = styled.button<{ $active: boolean }>`
    width: 44px;
    height: 24px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    position: relative;
    background-color: ${(props) => (props.$active ? colors.brand.primary : colors.gray[30])};
    transition: background-color 0.15s ease;
    flex-shrink: 0;

    &::after {
        content: '';
        position: absolute;
        top: 2px;
        left: ${(props) => (props.$active ? '22px' : '2px')};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: ${colors.neutral.white};
        transition: left 0.15s ease;
    }
`;

const SaveButton = styled.button`
    width: 100%;
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.neutral.white};
    background: linear-gradient(135deg, ${colors.brand.primary}, ${colors.brand.secondary});
    border: none;
    border-radius: 10px;
    padding: ${spacing.md} ${spacing.xl};
    cursor: pointer;
    transition:
        transform 0.15s ease,
        box-shadow 0.15s ease;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &:active {
        transform: translateY(0);
    }
`;

const InfoText = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    color: ${colors.gray[40]};
    text-align: center;
    margin: ${spacing.md} 0 0;
`;

interface PrefItem {
    id: string;
    icon: string;
    title: string;
    description: string;
    defaultValue: boolean;
}

const PREFS: PrefItem[] = [
    {
        id: 'appointments',
        icon: '\uD83D\uDCC5',
        title: 'Lembretes de Consulta',
        description: 'Receba lembretes antes das suas consultas',
        defaultValue: true,
    },
    {
        id: 'medications',
        icon: '\uD83D\uDC8A',
        title: 'Alertas de Medicamento',
        description: 'Lembretes de horario de medicamentos',
        defaultValue: true,
    },
    {
        id: 'healthTips',
        icon: '\uD83D\uDCA1',
        title: 'Dicas de Saude',
        description: 'Conteudo personalizado de saude e bem-estar',
        defaultValue: true,
    },
    {
        id: 'promotions',
        icon: '\uD83C\uDF81',
        title: 'Promocoes e Ofertas',
        description: 'Novidades e descontos em servicos',
        defaultValue: false,
    },
];

/**
 * Notification Preferences page - allows users to configure
 * which notifications they want to receive.
 */

export const getServerSideProps = () => ({ props: {} });

export default function NotificationPrefsPage(): React.ReactElement {
    const { t: _t } = useTranslation();
    const router = useRouter();
    const { profile: _profile } = useProfile();

    const [prefs, setPrefs] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        PREFS.forEach((pref) => {
            initial[pref.id] = pref.defaultValue;
        });
        return initial;
    });

    const togglePref = useCallback((prefId: string) => {
        setPrefs((prev) => ({
            ...prev,
            [prefId]: !prev[prefId],
        }));
    }, []);

    const handleSave = (): void => {
        router.push('/profile/confirmation');
    };

    return (
        <AuthLayout>
            <ContentContainer>
                <Title>Preferencias de Notificacao</Title>
                <Description>
                    Escolha quais notificacoes voce deseja receber. Voce pode alterar essas preferencias a qualquer
                    momento nas configuracoes.
                </Description>

                <PrefsContainer>
                    {PREFS.map((pref) => (
                        <PrefRow key={pref.id}>
                            <PrefIconContainer>
                                <PrefIcon>{pref.icon}</PrefIcon>
                            </PrefIconContainer>
                            <PrefTextContainer>
                                <PrefTitle>{pref.title}</PrefTitle>
                                <PrefDescription>{pref.description}</PrefDescription>
                            </PrefTextContainer>
                            <ToggleSwitch
                                $active={prefs[pref.id]}
                                onClick={() => togglePref(pref.id)}
                                role="switch"
                                aria-checked={prefs[pref.id]}
                                aria-label={pref.title}
                            />
                        </PrefRow>
                    ))}
                </PrefsContainer>

                <SaveButton onClick={handleSave}>Salvar Preferencias</SaveButton>

                <InfoText>Voce pode alterar suas preferencias a qualquer momento em Configuracoes.</InfoText>
            </ContentContainer>
        </AuthLayout>
    );
}
