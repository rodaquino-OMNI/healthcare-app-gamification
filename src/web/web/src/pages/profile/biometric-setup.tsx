import { borderRadius } from 'design-system/tokens/borderRadius';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { typography } from 'design-system/tokens/typography';
import Image from 'next/image';
import React, { useState } from 'react';
import styled from 'styled-components';

import { useProfile } from '@/hooks/useProfile';
import { useSafeNavRouter as useRouter } from '@/hooks/useSafeRouter';
import { AuthLayout } from '@/layouts/AuthLayout';

import { restClient } from '../../api/client';

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
const biometricIllustration = require('@austa/design-system/assets/illustrations/profile-setup/profile-setup-01.png');

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`;

const Title = styled.h2`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-xl']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.gray[70]};
    margin: 0 0 ${spacing.xs} 0;
`;

const Subtitle = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: ${colors.gray[50]};
    line-height: ${typography.lineHeight.relaxed};
    margin: 0 0 ${spacing['2xl']} 0;
    max-width: 360px;
`;

const BenefitsList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0 0 ${spacing['2xl']} 0;
    width: 100%;
    text-align: left;
`;

const BenefitItem = styled.li`
    display: flex;
    align-items: center;
    padding: ${spacing.sm} ${spacing.md};
    background-color: ${colors.gray[5]};
    border-radius: ${borderRadius.md};
    margin-bottom: ${spacing.sm};
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: ${colors.gray[70]};
`;

const BenefitIcon = styled.span`
    margin-right: ${spacing.md};
    font-size: 18px;
`;

const PrimaryButton = styled.button`
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
    margin-bottom: ${spacing.md};

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &:active {
        transform: translateY(0);
    }
`;

const SkipLink = styled.button`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.gray[50]};
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: underline;
    padding: ${spacing.xs};

    &:hover {
        color: ${colors.gray[60]};
    }
`;

const SecurityNote = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    color: ${colors.gray[40]};
    margin: ${spacing.xl} 0 0;
    max-width: 320px;
`;

const BENEFITS = [
    { icon: '\u26A1', text: 'Login mais rapido e conveniente' },
    { icon: '\uD83D\uDD12', text: 'Acesso seguro com biometria' },
    { icon: '\uD83D\uDE4C', text: 'Sem necessidade de digitar senhas' },
];

/**
 * Biometric Setup page - allows users to enable biometric
 * authentication (Face ID / Touch ID) during profile setup.
 */

export const getServerSideProps = () => ({ props: {} });

export default function BiometricSetupPage(): React.ReactElement {
    const router = useRouter();
    const { profile } = useProfile();
    const [error, setError] = useState<string | null>(null);
    const [enrolling, setEnrolling] = useState(false);

    const handleEnable = async (): Promise<void> => {
        setEnrolling(true);
        setError(null);
        try {
            const credential = await navigator.credentials.create({
                publicKey: {
                    challenge: new Uint8Array(32),
                    rp: { name: 'AUSTA Health' },
                    user: {
                        id: new Uint8Array(16),
                        name: (profile?.name as string) || 'user',
                        displayName: (profile?.name as string) || 'User',
                    },
                    pubKeyCredParams: [{ alg: -7, type: 'public-key' as const }],
                },
            });
            if (credential) {
                await restClient.post('/auth/biometric/enroll', {
                    credentialId: credential.id,
                    type: credential.type,
                });
            }
            router.push('/profile/confirmation');
        } catch (err) {
            setError('Falha no cadastro biometrico');
        } finally {
            setEnrolling(false);
        }
    };

    const handleSkip = (): void => {
        router.push('/profile/confirmation');
    };

    return (
        <AuthLayout>
            <ContentContainer>
                <Image
                    src={biometricIllustration}
                    alt="Biometric setup illustration"
                    width={200}
                    height={200}
                    style={{ marginBottom: '24px' }}
                />

                <Title>Proteja sua Conta</Title>
                <Subtitle>Ative a autenticacao biometrica para acessar sua conta de forma rapida e segura.</Subtitle>

                <BenefitsList>
                    {BENEFITS.map((benefit, index) => (
                        <BenefitItem key={index}>
                            <BenefitIcon>{benefit.icon}</BenefitIcon>
                            {benefit.text}
                        </BenefitItem>
                    ))}
                </BenefitsList>

                {error && <Subtitle style={{ color: colors.semantic.error }}>{error}</Subtitle>}

                <PrimaryButton onClick={() => void handleEnable()} disabled={enrolling}>
                    {enrolling ? 'Ativando...' : 'Ativar Face ID / Touch ID'}
                </PrimaryButton>

                <SkipLink onClick={handleSkip}>Pular por enquanto</SkipLink>

                <SecurityNote>
                    Seus dados biometricos sao armazenados de forma segura no seu dispositivo e nunca sao compartilhados
                    com terceiros.
                </SecurityNote>
            </ContentContainer>
        </AuthLayout>
    );
}
