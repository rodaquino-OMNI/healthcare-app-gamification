import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { SettingsNavigationProp } from '../../navigation/types';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { ROUTES } from '../../constants/routes';
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
  font-size: ${typography.fontSize['text-xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.default};
`;

const ContentSection = styled.View`
  padding-horizontal: ${spacing.xl};
  padding-top: ${spacing.md};
`;

const AnswerText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.regular};
  color: ${colors.gray[70]};
  line-height: 24px;
  margin-bottom: ${spacing.md};
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.background.subtle};
  margin-vertical: ${spacing.xl};
  margin-horizontal: ${spacing.xl};
`;

const HelpfulSection = styled.View`
  padding-horizontal: ${spacing.xl};
  align-items: center;
`;

const HelpfulTitle = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: ${spacing.md};
`;

const HelpfulButtonRow = styled.View`
  flex-direction: row;
  gap: 16px;
`;

const HelpfulButton = styled.TouchableOpacity<{ isSelected: boolean; variant: 'yes' | 'no' }>`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${spacing.xl};
  padding-vertical: ${spacing.sm};
  border-radius: ${borderRadius.full};
  border-width: 1px;
  border-color: ${(props) =>
    props.isSelected
      ? props.variant === 'yes'
        ? colors.semantic.success
        : colors.semantic.error
      : colors.gray[20]};
  background-color: ${(props) =>
    props.isSelected
      ? props.variant === 'yes'
        ? colors.semantic.success + '10'
        : colors.semantic.error + '10'
      : colors.neutral.white};
`;

const HelpfulButtonText = styled.Text<{ isSelected: boolean; variant: 'yes' | 'no' }>`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${(props) =>
    props.isSelected
      ? props.variant === 'yes'
        ? colors.semantic.success
        : colors.semantic.error
      : colors.gray[50]};
  margin-left: ${spacing.xs};
`;

const ThankYouText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.semantic.success};
  margin-top: ${spacing.md};
`;

const RelatedSection = styled.View`
  padding-horizontal: ${spacing.xl};
  padding-top: ${spacing.xl};
`;

const RelatedTitle = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: ${spacing.md};
`;

const RelatedItem = styled.TouchableOpacity`
  padding-vertical: ${spacing.sm};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray[10]};
`;

const RelatedItemText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.brand.primary};
`;

const ContactLink = styled.TouchableOpacity`
  padding-horizontal: ${spacing.xl};
  padding-vertical: ${spacing.lg};
  align-items: center;
`;

const ContactLinkText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.brand.primary};
`;

// --- Types ---

type VoteState = 'yes' | 'no' | null;

// --- Mock Related Articles ---

const RELATED_ARTICLES = [
  { id: '1', question: 'Como alterar meu email?', answer: 'Acesse Configuracoes > Conta > Editar Perfil para alterar seu email cadastrado.' },
  { id: '2', question: 'Como ativar notificacoes?', answer: 'Va em Configuracoes > Notificacoes para gerenciar suas preferencias de notificacao.' },
  { id: '3', question: 'Como entrar em contato com suporte?', answer: 'Acesse a Central de Ajuda > Fale Conosco para chat, telefone ou email.' },
];

// --- Component ---

export const FAQDetailScreen: React.FC = () => {
  const navigation = useNavigation<SettingsNavigationProp>();
  const route = useRoute();
  const { t } = useTranslation();
  const [vote, setVote] = useState<VoteState>(null);

  const params = route.params as { question?: string; answer?: string } | undefined;
  const question = params?.question ?? t('help.faqDetail.title');
  const answer = params?.answer ?? '';

  const handleVote = (value: 'yes' | 'no') => {
    setVote(value);
  };

  const handleRelatedArticle = (article: { id: string; question: string; answer: string }) => {
    // Note: SettingsStackParamList defines HelpFAQDetail with { faqId: string }.
    // Using faqId to carry the article id.
    navigation.navigate('HelpFAQDetail', { faqId: article.id });
  };

  const handleContactSupport = () => {
    navigation.navigate(ROUTES.HELP_CONTACT);
  };

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
      >
        <Header>
          <Title accessibilityRole="header" testID="faq-detail-title">
            {question}
          </Title>
        </Header>

        <ContentSection>
          <AnswerText testID="faq-detail-answer">{answer}</AnswerText>
        </ContentSection>

        <Divider />

        <HelpfulSection>
          <HelpfulTitle>{t('help.faqDetail.wasHelpful')}</HelpfulTitle>
          <HelpfulButtonRow>
            <HelpfulButton
              variant="yes"
              isSelected={vote === 'yes'}
              onPress={() => handleVote('yes')}
              accessibilityRole="button"
              accessibilityLabel={t('help.faqDetail.yes')}
              testID="faq-helpful-yes"
            >
              <HelpfulButtonText variant="yes" isSelected={vote === 'yes'}>
                {t('help.faqDetail.yes')}
              </HelpfulButtonText>
            </HelpfulButton>
            <HelpfulButton
              variant="no"
              isSelected={vote === 'no'}
              onPress={() => handleVote('no')}
              accessibilityRole="button"
              accessibilityLabel={t('help.faqDetail.no')}
              testID="faq-helpful-no"
            >
              <HelpfulButtonText variant="no" isSelected={vote === 'no'}>
                {t('help.faqDetail.no')}
              </HelpfulButtonText>
            </HelpfulButton>
          </HelpfulButtonRow>
          {vote !== null && (
            <ThankYouText testID="faq-thank-you">
              {t('help.faqDetail.thankYou')}
            </ThankYouText>
          )}
        </HelpfulSection>

        <Divider />

        <RelatedSection>
          <RelatedTitle>{t('help.faqDetail.relatedArticles')}</RelatedTitle>
          {RELATED_ARTICLES.map((article) => (
            <RelatedItem
              key={article.id}
              onPress={() => handleRelatedArticle(article)}
              accessibilityRole="link"
              accessibilityLabel={article.question}
              testID={`faq-related-${article.id}`}
            >
              <RelatedItemText>{article.question}</RelatedItemText>
            </RelatedItem>
          ))}
        </RelatedSection>

        <ContactLink
          onPress={handleContactSupport}
          accessibilityRole="link"
          accessibilityLabel={t('help.faqDetail.contactSupport')}
          testID="faq-contact-support"
        >
          <ContactLinkText>{t('help.faqDetail.contactSupport')}</ContactLinkText>
        </ContactLink>
      </ScrollView>
    </Container>
  );
};

export default FAQDetailScreen;
