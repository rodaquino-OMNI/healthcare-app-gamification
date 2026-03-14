import { colors, typography, spacing, borderRadius } from 'design-system/tokens';
import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import { useAuth } from '@/hooks/useAuth';

const SECTIONS = [
    {
        title: '1. Aceitacao dos Termos',
        content:
            'Ao acessar ou usar o aplicativo AUSTA Saude, voce concorda com estes Termos de Servico. Se nao concordar com alguma parte destes termos, nao devera usar o aplicativo.',
    },
    {
        title: '2. Descricao do Servico',
        content:
            'O AUSTA Saude e um aplicativo de gestao de saude que permite agendar consultas, gerenciar medicamentos, acompanhar metricas de saude, acessar informacoes do plano de saude e participar de programas de gamificacao voltados ao bem-estar.',
    },
    {
        title: '3. Cadastro e Conta',
        content:
            'Para utilizar os servicos, voce deve criar uma conta fornecendo informacoes precisas e completas. Voce e responsavel por manter a confidencialidade das suas credenciais de acesso e por todas as atividades realizadas em sua conta.',
    },
    {
        title: '4. Uso Adequado',
        content:
            'Voce concorda em usar o aplicativo apenas para fins legais e de acordo com estes termos. E proibido: (a) utilizar o app para fins ilegais; (b) compartilhar sua conta com terceiros; (c) tentar acessar sistemas nao autorizados; (d) interferir no funcionamento do servico.',
    },
    {
        title: '5. Dados de Saude',
        content:
            'Os dados de saude inseridos no aplicativo sao tratados com o mais alto nivel de seguranca e em conformidade com a LGPD (Lei Geral de Protecao de Dados) e regulamentacoes de saude vigentes. Estes dados sao de uso pessoal e compartilhados apenas com profissionais de saude autorizados.',
    },
    {
        title: '6. Limitacao de Responsabilidade',
        content:
            'O AUSTA Saude nao substitui atendimento medico profissional. As informacoes fornecidas pelo aplicativo sao de carater informativo e nao devem ser consideradas como diagnostico ou prescricao medica. Em caso de emergencia, procure atendimento medico imediato.',
    },
    {
        title: '7. Propriedade Intelectual',
        content:
            'Todo o conteudo do aplicativo, incluindo textos, graficos, logotipos, icones, imagens e software, e propriedade da AUSTA Saude S.A. ou de seus licenciadores e e protegido por leis de propriedade intelectual.',
    },
    {
        title: '8. Alteracoes nos Termos',
        content:
            'Reservamo-nos o direito de modificar estes termos a qualquer momento. Alteracoes significativas serao comunicadas com antecedencia por meio do aplicativo ou email. O uso continuado apos as alteracoes constitui aceitacao dos novos termos.',
    },
    {
        title: '9. Contato',
        content:
            'Para duvidas sobre estes Termos de Servico, entre em contato: suporte@austa.com.br ou pelo telefone 0800-123-4567.',
    },
];

/**
 * Terms of service page.
 * Displays scrollable legal text of terms and conditions.
 */
const TermsPage: NextPage = () => {
    const router = useRouter();
    const { isAuthenticated: _isAuthenticated } = useAuth();

    return (
        <div style={{ padding: spacing.xl, maxWidth: '720px', margin: '0 auto' }}>
            <button onClick={() => router.back()} style={backLinkStyle}>
                &larr; Voltar
            </button>

            <h1 style={titleStyle}>Termos de Servico</h1>
            <p style={lastUpdatedStyle}>Ultima atualizacao: 15 de janeiro de 2024</p>

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

export const getStaticProps: GetStaticProps = () => ({ props: {} });

export default TermsPage;
