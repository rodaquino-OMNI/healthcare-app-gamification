import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { colors } from 'design-system/tokens/colors';
import { typography } from 'design-system/tokens/typography';
import { spacing } from 'design-system/tokens/spacing';
import { borderRadius } from 'design-system/tokens/borderRadius';
import AuthLayout from '@/layouts/AuthLayout';

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

const BENEFITS = [
    { icon: '\u2705', text: 'Better health recommendations tailored to you' },
    { icon: '\u2705', text: 'Personalized health tips and insights' },
    { icon: '\u2705', text: 'Tailored wellness plans for your goals' },
    { icon: '\u2705', text: 'Smarter notifications and reminders' },
];

/**
 * Personalization Intro page - introduces the personalization flow
 * and explains its benefits before goal selection.
 */
export default function PersonalizationIntroPage() {
    const router = useRouter();

    return (
        <AuthLayout>
            <ContentContainer>
                <IllustrationCircle>
                    <IllustrationEmoji>{'\u2728'}</IllustrationEmoji>
                </IllustrationCircle>

                <Title>Personalize sua Experiencia</Title>
                <Subtitle>
                    Personalize o AUSTA para atender melhor as suas necessidades de saude. Leva apenas um minuto.
                </Subtitle>

                <BenefitsList>
                    {BENEFITS.map((benefit, index) => (
                        <BenefitItem key={index}>
                            <BenefitIcon>{benefit.icon}</BenefitIcon>
                            {benefit.text}
                        </BenefitItem>
                    ))}
                </BenefitsList>

                <PrimaryButton onClick={() => router.push('/auth/goal-selection')}>Comecar</PrimaryButton>

                <SkipLink onClick={() => router.push('/home')}>Pular por enquanto</SkipLink>
            </ContentContainer>
        </AuthLayout>
    );
}
