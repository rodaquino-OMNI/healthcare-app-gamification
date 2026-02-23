import React from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { SettingsNavigationProp } from '../../navigation/types';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../constants/routes';
import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing, spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadius } from '../../../../design-system/src/tokens/borderRadius';

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.default};
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
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: ${spacing.xs};
`;

const LastUpdated = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.text.subtle};
  margin-bottom: ${spacing['2xl']};
`;

const SectionTitle = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.default};
  margin-top: ${spacing.xl};
  margin-bottom: ${spacing.sm};
`;

const Paragraph = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.text.default};
  line-height: 24px;
  margin-bottom: ${spacing.md};
`;

const LinkButton = styled.TouchableOpacity`
  padding-vertical: ${spacing.sm};
  padding-horizontal: ${spacing.md};
  border-radius: ${borderRadius.md};
  border-width: 1px;
  border-color: ${colors.brand.primary};
  margin-bottom: ${spacing.sm};
  align-items: center;
`;

const LinkButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.brand.primary};
`;

// --- Content Sections ---

interface Section {
  key: string;
  titleKey: string;
  paragraphs: string[];
  hasLinks?: boolean;
}

const SECTIONS: Section[] = [
  {
    key: 'collection',
    titleKey: 'settings.privacyPolicy.sections.collection',
    paragraphs: [
      'O AUSTA SuperApp coleta dados pessoais necessarios para a prestacao de servicos de saude, incluindo: nome completo, CPF, data de nascimento, endereco, dados de contato e informacoes de saude.',
      'A coleta de dados sensíveis de saude (historico medico, medicamentos, resultados de exames) e realizada com consentimento explicito do titular e utilizada exclusivamente para fins de atendimento medico.',
      'Dados de uso do aplicativo, como frequencia de acesso e funcionalidades utilizadas, podem ser coletados para melhoria continua dos servicos.',
    ],
  },
  {
    key: 'usage',
    titleKey: 'settings.privacyPolicy.sections.usage',
    paragraphs: [
      'Os dados pessoais coletados sao utilizados para: prestacao de servicos de saude, agendamento de consultas, telemedicina, gestao do plano de saude e comunicacoes relacionadas aos servicos contratados.',
      'Dados anonimizados podem ser utilizados para fins estatísticos e de pesquisa, visando a melhoria dos servicos de saude oferecidos.',
    ],
  },
  {
    key: 'sharing',
    titleKey: 'settings.privacyPolicy.sections.sharing',
    paragraphs: [
      'Os dados pessoais podem ser compartilhados com: profissionais de saude envolvidos no seu atendimento, operadoras do plano de saude, laboratorios e clinicas parceiras, e autoridades competentes quando exigido por lei.',
      'Nenhum dado pessoal e comercializado ou compartilhado com terceiros para fins de marketing sem o consentimento explicito do titular.',
    ],
  },
  {
    key: 'storage',
    titleKey: 'settings.privacyPolicy.sections.storage',
    paragraphs: [
      'Os dados sao armazenados em servidores seguros, com criptografia em transito e em repouso. Implementamos medidas tecnicas e organizacionais adequadas para proteger seus dados contra acesso nao autorizado, perda ou destruicao.',
      'Os dados pessoais sao mantidos pelo periodo necessario para a prestacao dos servicos e cumprimento de obrigacoes legais, conforme previsto na legislacao aplicavel.',
    ],
  },
  {
    key: 'rights',
    titleKey: 'settings.privacyPolicy.sections.rights',
    paragraphs: [
      'Conforme a LGPD, voce tem direito a: confirmar a existencia de tratamento de dados; acessar seus dados; corrigir dados incompletos, inexatos ou desatualizados; solicitar anonimizacao, bloqueio ou eliminacao de dados desnecessarios; solicitar a portabilidade dos dados; e revogar o consentimento.',
      'Para exercer seus direitos, utilize as opcoes abaixo ou entre em contato com nosso Encarregado de Protecao de Dados.',
    ],
    hasLinks: true,
  },
  {
    key: 'dpo',
    titleKey: 'settings.privacyPolicy.sections.dpo',
    paragraphs: [
      'O Encarregado de Protecao de Dados (DPO) da AUSTA e responsavel por receber comunicacoes dos titulares de dados e da Autoridade Nacional de Protecao de Dados (ANPD).',
      'Contato do DPO: dpo@austa.com.br. Horario de atendimento: segunda a sexta-feira, das 8h as 18h.',
    ],
  },
];

/**
 * PrivacyPolicy screen -- LGPD-compliant privacy policy document.
 * Displays 6 sections with legal text, plus action links under
 * "Direitos do Titular" to Data Export and Account Deletion.
 */
export const PrivacyPolicyScreen: React.FC = () => {
  const navigation = useNavigation<SettingsNavigationProp>();
  const { t } = useTranslation();

  const handleExport = () => {
    navigation.navigate(ROUTES.SETTINGS_DATA_EXPORT);
  };

  const handleDelete = () => {
    navigation.navigate(ROUTES.SETTINGS_DELETE_ACCOUNT);
  };

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
      >
        <ContentWrapper>
          <Title testID="privacy-policy-title">
            {t('settings.privacyPolicy.title')}
          </Title>
          <LastUpdated testID="privacy-policy-last-updated">
            {t('settings.privacyPolicy.lastUpdated')} 01/01/2024
          </LastUpdated>

          {SECTIONS.map((section) => (
            <React.Fragment key={section.key}>
              <SectionTitle
                accessibilityRole="header"
                testID={`privacy-section-${section.key}`}
              >
                {t(section.titleKey)}
              </SectionTitle>
              {section.paragraphs.map((paragraph, index) => (
                <Paragraph key={`${section.key}-${index}`}>
                  {paragraph}
                </Paragraph>
              ))}
              {section.hasLinks && (
                <>
                  <LinkButton
                    onPress={handleExport}
                    accessibilityRole="button"
                    accessibilityLabel={t('settings.privacyPolicy.exportLink')}
                    testID="privacy-export-link"
                  >
                    <LinkButtonText>{t('settings.privacyPolicy.exportLink')}</LinkButtonText>
                  </LinkButton>
                  <LinkButton
                    onPress={handleDelete}
                    accessibilityRole="button"
                    accessibilityLabel={t('settings.privacyPolicy.deleteLink')}
                    testID="privacy-delete-link"
                  >
                    <LinkButtonText>{t('settings.privacyPolicy.deleteLink')}</LinkButtonText>
                  </LinkButton>
                </>
              )}
            </React.Fragment>
          ))}
        </ContentWrapper>
      </ScrollView>
    </Container>
  );
};

export default PrivacyPolicyScreen;
