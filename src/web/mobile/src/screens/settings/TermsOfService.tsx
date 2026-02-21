import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing, spacingValues } from '../../../../design-system/src/tokens/spacing';

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.neutral.white};
`;

const ContentWrapper = styled.View`
  padding-horizontal: ${spacing.xl};
  padding-top: ${spacing['2xl']};
  padding-bottom: ${spacing['4xl']};
`;

const Title = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.neutral.gray900};
  margin-bottom: ${spacing.xs};
`;

const LastUpdated = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.regular};
  color: ${colors.gray[40]};
  margin-bottom: ${spacing['2xl']};
`;

const SectionTitle = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.gray900};
  margin-top: ${spacing.xl};
  margin-bottom: ${spacing.sm};
`;

const Paragraph = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.regular};
  color: ${colors.gray[60]};
  line-height: 24px;
  margin-bottom: ${spacing.md};
`;

// --- Content Sections ---

interface Section {
  key: string;
  titleKey: string;
  paragraphs: string[];
}

const SECTIONS: Section[] = [
  {
    key: 'general',
    titleKey: 'settings.terms.sections.general',
    paragraphs: [
      'Estes Termos de Servico regulam o uso do aplicativo AUSTA SuperApp, uma plataforma digital de saude e bem-estar. Ao acessar ou utilizar o aplicativo, voce concorda com estes termos em sua totalidade.',
      'A AUSTA reserva-se o direito de modificar estes termos a qualquer momento, mediante notificacao previa aos usuarios. O uso continuado do aplicativo apos tais modificacoes constitui aceitacao dos novos termos.',
      'Caso voce nao concorde com qualquer disposicao destes termos, devera cessar imediatamente o uso do aplicativo.',
    ],
  },
  {
    key: 'appUsage',
    titleKey: 'settings.terms.sections.appUsage',
    paragraphs: [
      'O AUSTA SuperApp oferece funcionalidades de gestao de saude, agendamento de consultas, telemedicina, acompanhamento de medicamentos e acesso a informacoes do plano de saude.',
      'O usuario compromete-se a utilizar o aplicativo de forma responsavel, nao compartilhando credenciais de acesso com terceiros e mantendo suas informacoes atualizadas.',
      'As informacoes fornecidas pelo aplicativo tem carater informativo e nao substituem a consulta medica presencial ou a orientacao de profissionais de saude qualificados.',
    ],
  },
  {
    key: 'userAccount',
    titleKey: 'settings.terms.sections.userAccount',
    paragraphs: [
      'Para utilizar o aplicativo, e necessario criar uma conta com dados veridicos e completos. O usuario e responsavel pela seguranca de suas credenciais de acesso.',
      'A AUSTA podera suspender ou cancelar contas que violem estes termos, apresentem atividade suspeita ou contenham informacoes falsas.',
    ],
  },
  {
    key: 'personalData',
    titleKey: 'settings.terms.sections.personalData',
    paragraphs: [
      'O tratamento de dados pessoais pelo AUSTA SuperApp esta em conformidade com a Lei Geral de Protecao de Dados (LGPD - Lei n. 13.709/2018).',
      'Os dados pessoais coletados sao utilizados exclusivamente para a prestacao dos servicos oferecidos pelo aplicativo, conforme detalhado em nossa Politica de Privacidade.',
      'O usuario tem direito de acessar, corrigir, excluir e portar seus dados pessoais a qualquer momento, conforme previsto na LGPD.',
    ],
  },
  {
    key: 'liability',
    titleKey: 'settings.terms.sections.liability',
    paragraphs: [
      'A AUSTA nao se responsabiliza por danos decorrentes de uso inadequado do aplicativo, interrupcoes de servico causadas por fatores externos, ou por decisoes medicas tomadas com base exclusivamente nas informacoes do aplicativo.',
      'O aplicativo e fornecido "como esta", sem garantias de disponibilidade ininterrupta ou ausencia de erros. A AUSTA empenha-se em manter o servico operacional e seguro.',
    ],
  },
  {
    key: 'finalProvisions',
    titleKey: 'settings.terms.sections.finalProvisions',
    paragraphs: [
      'Estes termos sao regidos pela legislacao brasileira. Quaisquer disputas serao resolvidas no foro da comarca de Sao Paulo, SP.',
      'Caso alguma disposicao destes termos seja considerada invalida ou inexequivel, as demais disposicoes permanecerao em pleno vigor e efeito.',
      'Para duvidas ou esclarecimentos sobre estes termos, entre em contato conosco atraves dos canais de atendimento disponiveis no aplicativo.',
    ],
  },
];

/**
 * TermsOfService screen -- scrollable legal terms document.
 * Displays 6 sections of terms with headers and paragraphs
 * in Portuguese, with last-updated date.
 */
export const TermsOfServiceScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
      >
        <ContentWrapper>
          <Title testID="terms-title">
            {t('settings.terms.title')}
          </Title>
          <LastUpdated testID="terms-last-updated">
            {t('settings.terms.lastUpdated')} 01/01/2024
          </LastUpdated>

          {SECTIONS.map((section) => (
            <React.Fragment key={section.key}>
              <SectionTitle
                accessibilityRole="header"
                testID={`terms-section-${section.key}`}
              >
                {t(section.titleKey)}
              </SectionTitle>
              {section.paragraphs.map((paragraph, index) => (
                <Paragraph key={`${section.key}-${index}`}>
                  {paragraph}
                </Paragraph>
              ))}
            </React.Fragment>
          ))}
        </ContentWrapper>
      </ScrollView>
    </Container>
  );
};

export default TermsOfServiceScreen;
