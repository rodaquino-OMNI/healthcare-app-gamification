import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { colors, typography, spacing, borderRadius } from 'design-system/tokens';

const SECTIONS = [
    {
        title: '1. Introducao',
        content:
            'A AUSTA Saude S.A. ("nos", "nosso") esta comprometida em proteger sua privacidade. Esta Politica de Privacidade descreve como coletamos, usamos, armazenamos e compartilhamos seus dados pessoais em conformidade com a Lei Geral de Protecao de Dados (LGPD - Lei 13.709/2018).',
    },
    {
        title: '2. Dados Coletados',
        content:
            'Coletamos os seguintes tipos de dados: (a) Dados de identificacao: nome, CPF, data de nascimento, genero; (b) Dados de contato: email, telefone, endereco; (c) Dados de saude: historico medico, consultas, exames, medicamentos, metricas de saude; (d) Dados do plano: numero do plano, cobertura, sinistros; (e) Dados de uso: interacoes com o app, dispositivos conectados, dados de gamificacao.',
    },
    {
        title: '3. Base Legal para Tratamento',
        content:
            'O tratamento dos seus dados e realizado com base em: (a) Consentimento explicito para dados sensiveis de saude; (b) Execucao de contrato (prestacao de servicos de saude); (c) Obrigacao legal (regulamentacoes de saude e ANS); (d) Interesse legitimo (melhoria dos servicos).',
    },
    {
        title: '4. Finalidade do Tratamento',
        content:
            'Seus dados sao utilizados para: prestacao de servicos de saude; gerenciamento do plano de saude; agendamento de consultas e telemedicina; acompanhamento de metricas de saude; programas de gamificacao e bem-estar; comunicacoes sobre o servico; cumprimento de obrigacoes legais e regulatorias.',
    },
    {
        title: '5. Compartilhamento de Dados',
        content:
            'Seus dados podem ser compartilhados com: profissionais de saude autorizados; operadoras de plano de saude; laboratorios e clinicas credenciadas; orgaos reguladores (quando exigido por lei). Nao vendemos ou compartilhamos seus dados com terceiros para fins de marketing.',
    },
    {
        title: '6. Seus Direitos (LGPD)',
        content:
            'Conforme a LGPD, voce tem direito a: (a) Confirmar a existencia de tratamento; (b) Acessar seus dados; (c) Corrigir dados incompletos ou desatualizados; (d) Solicitar anonimizacao ou bloqueio; (e) Solicitar portabilidade dos dados; (f) Solicitar eliminacao; (g) Revogar consentimento.',
    },
    {
        title: '7. Seguranca dos Dados',
        content:
            'Empregamos medidas tecnicas e organizacionais para proteger seus dados, incluindo: criptografia de dados em transito e em repouso; controle de acesso baseado em funcoes; monitoramento continuo de seguranca; auditorias periodicas; treinamento de colaboradores.',
    },
    {
        title: '8. Retencao de Dados',
        content:
            'Seus dados sao retidos pelo tempo necessario para cumprir as finalidades para as quais foram coletados, incluindo obrigacoes legais (minimo de 20 anos para prontuarios medicos, conforme Resolucao CFM 1.821/2007).',
    },
    {
        title: '9. Encarregado de Protecao de Dados (DPO)',
        content:
            'Para exercer seus direitos ou esclarecer duvidas sobre esta politica, entre em contato com nosso Encarregado de Protecao de Dados: dpo@austa.com.br.',
    },
];

/**
 * Privacy policy page (LGPD).
 * Displays the full privacy policy text.
 */
const PrivacyPolicyPage: NextPage = () => {
    const router = useRouter();

    return (
        <div style={{ padding: spacing.xl, maxWidth: '720px', margin: '0 auto' }}>
            <button onClick={() => router.back()} style={backLinkStyle}>
                &larr; Voltar
            </button>

            <h1 style={titleStyle}>Politica de Privacidade</h1>
            <p style={lastUpdatedStyle}>Ultima atualizacao: 15 de janeiro de 2024</p>

            <div style={lgpdBadgeStyle}>Em conformidade com a LGPD (Lei 13.709/2018)</div>

            <div style={cardStyle}>
                {SECTIONS.map((section, idx) => (
                    <div key={idx} style={sectionStyle}>
                        <h2 style={sectionTitleStyle}>{section.title}</h2>
                        <p style={sectionContentStyle}>{section.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const backLinkStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: colors.brand.primary,
    fontSize: typography.fontSize['text-sm'],
    cursor: 'pointer',
    padding: 0,
    marginBottom: spacing.lg,
    display: 'block',
    fontFamily: typography.fontFamily.body,
};
const titleStyle: React.CSSProperties = {
    fontSize: typography.fontSize['heading-xl'],
    fontWeight: typography.fontWeight.semiBold,
    color: colors.gray[70],
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.heading,
};
const lastUpdatedStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-xs'],
    color: colors.gray[40],
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily.body,
};
const lgpdBadgeStyle: React.CSSProperties = {
    display: 'inline-block',
    fontSize: typography.fontSize['text-xs'],
    fontWeight: typography.fontWeight.medium,
    color: colors.semantic.success,
    backgroundColor: colors.semantic.successBg,
    padding: `${spacing.xs} ${spacing.md}`,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xl,
    fontFamily: typography.fontFamily.body,
};
const cardStyle: React.CSSProperties = {
    backgroundColor: colors.gray[0],
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};
const sectionStyle: React.CSSProperties = {
    marginBottom: spacing.xl,
};
const sectionTitleStyle: React.CSSProperties = {
    fontSize: typography.fontSize['heading-sm'],
    fontWeight: typography.fontWeight.semiBold,
    color: colors.gray[70],
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.heading,
};
const sectionContentStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-md'],
    color: colors.gray[50],
    lineHeight: typography.lineHeight.relaxed,
    fontFamily: typography.fontFamily.body,
    margin: 0,
};

export default PrivacyPolicyPage;
