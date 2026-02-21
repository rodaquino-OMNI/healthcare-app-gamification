import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { typography } from 'src/web/design-system/src/tokens/typography';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import { Stepper } from 'src/web/design-system/src/components/Stepper/Stepper';
import { WEB_AUTH_ROUTES } from 'src/web/shared/constants/routes';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: ${colors.gray[0]};
  padding: ${spacing['3xl']} ${spacing.xl};
`;

const ContentCard = styled.div`
  max-width: 640px;
  width: 100%;
  background-color: ${colors.neutral.white};
  border-radius: 16px;
  padding: ${spacing['2xl']};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const StepperWrapper = styled.div`
  margin-bottom: ${spacing['2xl']};
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${colors.gray[10]};
  border-radius: 2px;
  margin-bottom: ${spacing['2xl']};
  overflow: hidden;
`;

const ProgressFill = styled.div<{ width: number }>`
  height: 100%;
  width: ${props => props.width}%;
  background: linear-gradient(90deg, ${colors.brand.primary}, ${colors.brand.secondary});
  border-radius: 2px;
  transition: width 0.3s ease;
`;

const StepContent = styled.div`
  text-align: center;
  padding: ${spacing.xl} 0;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StepIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${spacing.md};
`;

const StepTitle = styled.h2`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.gray[70]};
  margin: 0 0 ${spacing.sm} 0;
`;

const StepDescription = styled.p`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${colors.gray[50]};
  line-height: ${typography.lineHeight.relaxed};
  margin: 0;
  max-width: 400px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${spacing.md};
  margin-top: ${spacing.xl};
`;

const NavButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  padding: ${spacing.sm} ${spacing.xl};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
  flex: 1;

  ${props => props.variant === 'primary'
    ? `
      background-color: ${colors.brand.primary};
      color: ${colors.neutral.white};
      border: none;
      &:hover { background-color: ${colors.brandPalette[400]}; }
    `
    : `
      background-color: transparent;
      color: ${colors.gray[50]};
      border: 1px solid ${colors.gray[20]};
      &:hover { background-color: ${colors.gray[5]}; }
    `
  }
`;

const SkipLink = styled.button`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.gray[40]};
  background: none;
  border: none;
  cursor: pointer;
  margin-top: ${spacing.md};
  text-decoration: underline;

  &:hover {
    color: ${colors.gray[60]};
  }
`;

const ONBOARDING_STEPS = [
  {
    label: 'Saude',
    icon: '\u2764\uFE0F',
    title: 'Minha Saude',
    description: 'Acompanhe metricas de saude, conecte dispositivos e visualize seu historico medico completo.',
  },
  {
    label: 'Gamificacao',
    icon: '\u{1F3C6}',
    title: 'Conquistas & Recompensas',
    description: 'Ganhe pontos, suba de nivel e desbloqueie recompensas ao cuidar da sua saude.',
  },
  {
    label: 'Plano',
    icon: '\u{1F4CB}',
    title: 'Meu Plano & Beneficios',
    description: 'Visualize cobertura, simule custos e acompanhe reembolsos do seu plano de saude.',
  },
  {
    label: 'Telehealth',
    icon: '\u{1F4F1}',
    title: 'Telemedicina',
    description: 'Consulte medicos por video, agende consultas e gerencie seus medicamentos.',
  },
  {
    label: 'Comunidade',
    icon: '\u{1F91D}',
    title: 'Comunidade',
    description: 'Conecte-se com outros usuarios, participe de desafios e compartilhe sua jornada de saude.',
  },
];

/**
 * Onboarding page with a 5-step wizard introducing the app features.
 * Uses the Stepper component for step navigation and a progress bar.
 */
export default function OnboardingPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const currentStep = ONBOARDING_STEPS[activeStep];
  const progressPercent = ((activeStep + 1) / ONBOARDING_STEPS.length) * 100;

  const handleNext = () => {
    if (activeStep < ONBOARDING_STEPS.length - 1) {
      setActiveStep(prev => prev + 1);
    } else {
      router.push(WEB_AUTH_ROUTES.REGISTER);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    router.push(WEB_AUTH_ROUTES.REGISTER);
  };

  return (
    <PageContainer>
      <ContentCard>
        <StepperWrapper>
          <Stepper
            steps={ONBOARDING_STEPS.map(s => ({ label: s.label }))}
            activeStep={activeStep}
            orientation="horizontal"
            journey="health"
            onStepPress={setActiveStep}
          />
        </StepperWrapper>

        <ProgressTrack>
          <ProgressFill width={progressPercent} />
        </ProgressTrack>

        <StepContent>
          <StepIcon>{currentStep.icon}</StepIcon>
          <StepTitle>{currentStep.title}</StepTitle>
          <StepDescription>{currentStep.description}</StepDescription>
        </StepContent>

        <ButtonRow>
          {activeStep > 0 ? (
            <NavButton variant="secondary" onClick={handlePrevious}>
              Anterior
            </NavButton>
          ) : (
            <div style={{ flex: 1 }} />
          )}
          <NavButton variant="primary" onClick={handleNext}>
            {activeStep === ONBOARDING_STEPS.length - 1 ? 'Comecar' : 'Proximo'}
          </NavButton>
        </ButtonRow>

        <div style={{ textAlign: 'center' }}>
          <SkipLink onClick={handleSkip}>
            Pular introducao
          </SkipLink>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
