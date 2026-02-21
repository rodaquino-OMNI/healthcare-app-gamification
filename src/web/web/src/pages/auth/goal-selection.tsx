import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { typography } from 'src/web/design-system/src/tokens/typography';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import { borderRadius } from 'src/web/design-system/src/tokens/borderRadius';
import AuthLayout from 'src/web/web/src/layouts/AuthLayout';

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.gray[70]};
  margin: 0 0 ${spacing.xs} 0;
  text-align: center;
`;

const Subtitle = styled.p`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${colors.gray[50]};
  line-height: ${typography.lineHeight.relaxed};
  margin: 0 0 ${spacing['2xl']} 0;
  text-align: center;
  max-width: 400px;
`;

const GoalsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing.md};
  width: 100%;
  margin-bottom: ${spacing['2xl']};
`;

const GoalCard = styled.button<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${spacing.lg} ${spacing.md};
  background-color: ${(props) =>
    props.$selected ? colors.gray[5] : colors.neutral.white};
  border: 2px solid ${(props) =>
    props.$selected ? colors.brand.primary : colors.gray[20]};
  border-radius: ${borderRadius.lg};
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease;

  &:hover {
    border-color: ${(props) =>
      props.$selected ? colors.brand.primary : colors.gray[40]};
  }
`;

const GoalIcon = styled.span`
  font-size: 32px;
  margin-bottom: ${spacing.sm};
`;

const GoalTitle = styled.span`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.gray[70]};
`;

const GoalDescription = styled.span`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${colors.gray[50]};
  margin-top: ${spacing['3xs']};
`;

const ContinueButton = styled.button<{ $disabled: boolean }>`
  width: 100%;
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.white};
  background: ${(props) =>
    props.$disabled
      ? colors.gray[30]
      : `linear-gradient(135deg, ${colors.brand.primary}, ${colors.brand.secondary})`};
  border: none;
  border-radius: 10px;
  padding: ${spacing.md} ${spacing.xl};
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    ${(props) =>
      !props.$disabled &&
      `
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `}
  }

  &:active {
    transform: translateY(0);
  }
`;

const SelectionCount = styled.p`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.gray[50]};
  margin: ${spacing.sm} 0 0;
  text-align: center;
`;

const BackLink = styled.button`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.gray[50]};
  background: none;
  border: none;
  cursor: pointer;
  margin-bottom: ${spacing.xl};

  &:hover {
    color: ${colors.gray[60]};
  }
`;

interface GoalItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const GOALS: GoalItem[] = [
  { id: 'weight', icon: '\u2696\uFE0F', title: 'Controle de Peso', description: 'Gerencie seu peso' },
  { id: 'chronic', icon: '\u2764\uFE0F', title: 'Doencas Cronicas', description: 'Acompanhe condicoes' },
  { id: 'fitness', icon: '\uD83C\uDFC3', title: 'Fitness e Exercicio', description: 'Melhore sua forma' },
  { id: 'mental', icon: '\uD83E\uDDE0', title: 'Saude Mental', description: 'Cuide da mente' },
  { id: 'nutrition', icon: '\uD83E\uDD57', title: 'Nutricao e Dieta', description: 'Coma melhor' },
  { id: 'sleep', icon: '\uD83C\uDF19', title: 'Qualidade do Sono', description: 'Durma melhor' },
];

/**
 * Goal Selection page - allows users to choose their health goals
 * during the personalization onboarding flow.
 */
export default function GoalSelectionPage() {
  const router = useRouter();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = useCallback((goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : [...prev, goalId],
    );
  }, []);

  const isDisabled = selectedGoals.length === 0;

  return (
    <AuthLayout>
      <ContentContainer>
        <BackLink onClick={() => router.back()}>
          {'\u2190'} Voltar
        </BackLink>

        <Title>Escolha seus Objetivos</Title>
        <Subtitle>
          Selecione os objetivos de saude que mais importam para voce.
          Voce pode alterar depois.
        </Subtitle>

        <GoalsGrid>
          {GOALS.map((goal) => {
            const isSelected = selectedGoals.includes(goal.id);
            return (
              <GoalCard
                key={goal.id}
                $selected={isSelected}
                onClick={() => toggleGoal(goal.id)}
                aria-pressed={isSelected}
              >
                <GoalIcon>{goal.icon}</GoalIcon>
                <GoalTitle>{goal.title}</GoalTitle>
                <GoalDescription>{goal.description}</GoalDescription>
              </GoalCard>
            );
          })}
        </GoalsGrid>

        <ContinueButton
          $disabled={isDisabled}
          disabled={isDisabled}
          onClick={() => router.push('/auth/onboarding-confirmation')}
        >
          Continuar
        </ContinueButton>

        <SelectionCount>
          {selectedGoals.length === 0
            ? 'Selecione ao menos um objetivo'
            : `${selectedGoals.length} objetivo(s) selecionado(s)`}
        </SelectionCount>
      </ContentContainer>
    </AuthLayout>
  );
}
