import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { typography } from 'src/web/design-system/src/tokens/typography';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import { borderRadius } from 'src/web/design-system/src/tokens/borderRadius';
import AuthLayout from 'src/web/web/src/layouts/AuthLayout';
import { restClient } from '../../api/client';

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`;

const IllustrationCircle = styled.div`
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background-color: ${colors.gray[5]};
    border: 3px solid ${colors.brand.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: ${spacing.xl};
`;

const IllustrationEmoji = styled.span`
    font-size: 48px;
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
export default function BiometricSetupPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [enrolling, setEnrolling] = useState(false);

    const handleEnable = async () => {
        setEnrolling(true);
        setError(null);
        try {
            const credential = await navigator.credentials.create({
                publicKey: {
                    challenge: new Uint8Array(32),
                    rp: { name: 'AUSTA Health' },
                    user: {
                        id: new Uint8Array(16),
                        name: 'user',
                        displayName: 'User',
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

    const handleSkip = () => {
        router.push('/profile/confirmation');
    };

    return (
        <AuthLayout>
            <ContentContainer>
                <IllustrationCircle>
                    <IllustrationEmoji>{'\uD83D\uDD90\uFE0F'}</IllustrationEmoji>
                </IllustrationCircle>

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

                {error && <Subtitle style={{ color: colors.semantic?.error || '#dc2626' }}>{error}</Subtitle>}

                <PrimaryButton onClick={handleEnable} disabled={enrolling}>
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
