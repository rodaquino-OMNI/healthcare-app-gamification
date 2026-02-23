import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { SettingsNavigationProp } from '../../navigation/types';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { colors } from '@design-system/tokens/colors';
import { typography } from '@design-system/tokens/typography';
import { spacing, spacingValues } from '@design-system/tokens/spacing';
import { borderRadius } from '@design-system/tokens/borderRadius';

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const Header = styled.View`
  padding-horizontal: ${spacing.xl};
  padding-top: ${spacing.xl};
  padding-bottom: ${spacing.md};
`;

const Title = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['text-2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.default};
`;

const FAQList = styled.View`
  padding-horizontal: ${spacing.xl};
  padding-top: ${spacing.md};
`;

const FAQItem = styled.View`
  margin-bottom: ${spacing.sm};
  border-radius: ${borderRadius.md};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.muted};
  overflow: hidden;
`;

const QuestionRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${spacing.lg};
  padding-vertical: ${spacing.md};
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const QuestionText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.default};
  flex: 1;
  margin-right: ${spacing.sm};
`;

const ExpandIcon = styled.Text<{ expanded: boolean }>`
  font-size: ${typography.fontSize['text-lg']};
  color: ${({ theme }) => theme.colors.text.subtle};
  transform: ${(props) => (props.expanded ? 'rotate(90deg)' : 'rotate(0deg)')};
`;

const AnswerContainer = styled.View`
  padding-horizontal: ${spacing.lg};
  padding-bottom: ${spacing.md};
  background-color: ${({ theme }) => theme.colors.background.subtle};
`;

const AnswerText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.regular};
  color: ${colors.gray[70]};
  line-height: 22px;
`;

const ViewDetailLink = styled.TouchableOpacity`
  margin-top: ${spacing.sm};
`;

const ViewDetailText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.brand.primary};
`;

const EmptyText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
  margin-top: ${spacing['2xl']};
`;

// --- Types ---

interface FAQItemData {
  id: string;
  question: string;
  answer: string;
}

// --- Mock Data ---

const FAQ_ITEMS: FAQItemData[] = [
  {
    id: '1',
    question: 'Como alterar minha senha?',
    answer:
      'Acesse Configuracoes > Seguranca > Alterar Senha. Voce precisara inserir sua senha atual e depois a nova senha. A nova senha deve ter no minimo 8 caracteres, incluindo letras maiusculas e numeros.',
  },
  {
    id: '2',
    question: 'Como exportar meus dados?',
    answer:
      'De acordo com a LGPD, voce pode solicitar uma copia dos seus dados. Va em Configuracoes > Dados > Exportar Dados. Selecione as categorias desejadas e o formato (JSON ou PDF). O arquivo sera preparado e disponibilizado para download.',
  },
  {
    id: '3',
    question: 'Como conectar um dispositivo?',
    answer:
      'Va em Configuracoes > Dispositivos > Dispositivos Conectados e toque em "Parear Novo Dispositivo". Certifique-se de que o Bluetooth esta ativado e o dispositivo esta no modo de pareamento. Siga as instrucoes na tela para concluir.',
  },
  {
    id: '4',
    question: 'Como agendar uma consulta?',
    answer:
      'Acesse a jornada "Cuidar-me Agora" e toque em "Agendar Consulta". Voce pode buscar por especialidade, medico ou local. Selecione o profissional, escolha a data e horario disponiveis, e confirme o agendamento.',
  },
  {
    id: '5',
    question: 'Como solicitar reembolso?',
    answer:
      'Va em "Meu Plano" > "Reembolsos" > "Solicitar Reembolso". Preencha o formulario com os dados do atendimento, anexe os comprovantes e envie. Voce pode acompanhar o status da solicitacao a qualquer momento.',
  },
];

// --- Component ---

export const FAQCategoryScreen: React.FC = () => {
  const navigation = useNavigation<SettingsNavigationProp>();
  const route = useRoute();
  const { t } = useTranslation();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const category = (route.params as { category?: string } | undefined)?.category;

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleViewDetail = (item: FAQItemData) => {
    // Note: SettingsStackParamList defines HelpFAQDetail with { faqId: string },
    // but the detail screen reads { question, answer }. Using faqId to carry the item id.
    navigation.navigate('HelpFAQDetail', { faqId: item.id });
  };

  const filteredItems = category
    ? FAQ_ITEMS.filter((item) =>
        item.question.toLowerCase().includes(category.toLowerCase()),
      )
    : FAQ_ITEMS;

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
      >
        <Header>
          <Title accessibilityRole="header" testID="faq-category-title">
            {t('help.faq.title')}
          </Title>
        </Header>

        <FAQList>
          {filteredItems.length === 0 ? (
            <EmptyText testID="faq-empty">{t('help.faq.noResults')}</EmptyText>
          ) : (
            filteredItems.map((item) => {
              const isExpanded = expandedIds.has(item.id);
              return (
                <FAQItem key={item.id}>
                  <QuestionRow
                    onPress={() => toggleExpand(item.id)}
                    accessibilityRole="button"
                    accessibilityLabel={item.question}
                    accessibilityState={{ expanded: isExpanded }}
                    testID={`faq-question-${item.id}`}
                  >
                    <QuestionText>{item.question}</QuestionText>
                    <ExpandIcon expanded={isExpanded}>{'>'}</ExpandIcon>
                  </QuestionRow>
                  {isExpanded && (
                    <AnswerContainer>
                      <AnswerText testID={`faq-answer-${item.id}`}>
                        {item.answer}
                      </AnswerText>
                      <ViewDetailLink
                        onPress={() => handleViewDetail(item)}
                        accessibilityRole="link"
                        accessibilityLabel={t('help.faqDetail.title')}
                        testID={`faq-detail-link-${item.id}`}
                      >
                        <ViewDetailText>
                          {t('help.faqDetail.title')} {'>'}
                        </ViewDetailText>
                      </ViewDetailLink>
                    </AnswerContainer>
                  )}
                </FAQItem>
              );
            })
          )}
        </FAQList>
      </ScrollView>
    </Container>
  );
};

export default FAQCategoryScreen;
