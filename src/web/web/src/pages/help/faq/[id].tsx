import { colors, typography, spacing, borderRadius } from 'design-system/tokens';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { useAuth } from '@/hooks/useAuth';

interface FaqArticle {
    id: string;
    question: string;
    answer: string;
    category: string;
    relatedIds: string[];
    lastUpdated: string;
}

const ARTICLES: Record<string, FaqArticle> = {
    '1': {
        id: '1',
        question: 'Como alterar minha senha?',
        answer: 'Para alterar sua senha, siga os passos abaixo:\n\n1. Acesse o menu Configuracoes\n2. Selecione "Alterar Senha"\n3. Informe sua senha atual\n4. Crie uma nova senha com pelo menos 8 caracteres, incluindo uma letra maiuscula, um numero e um caractere especial\n5. Confirme a nova senha\n6. Clique em "Alterar Senha"\n\nVoce recebera um email confirmando a alteracao. Se nao reconhecer a mudanca, entre em contato conosco imediatamente.',
        category: 'Conta e Acesso',
        relatedIds: ['2'],
        lastUpdated: '15/01/2024',
    },
    '2': {
        id: '2',
        question: 'Como ativar a autenticacao em duas etapas?',
        answer: 'A autenticacao em duas etapas (2FA) adiciona uma camada extra de seguranca:\n\n1. Acesse Configuracoes > Autenticacao em Duas Etapas\n2. Ative a opcao "Ativar 2FA"\n3. Escolha o metodo: SMS ou Aplicativo Autenticador\n4. Para SMS: confirme seu numero de telefone\n5. Para Autenticador: escaneie o QR code com Google Authenticator ou similar\n6. Insira o codigo de verificacao para confirmar\n\nApos ativado, sera solicitado um codigo a cada novo login.',
        category: 'Conta e Acesso',
        relatedIds: ['1'],
        lastUpdated: '10/01/2024',
    },
};

const DEFAULT_ARTICLE: FaqArticle = {
    id: '0',
    question: 'Artigo nao encontrado',
    answer: 'O artigo que voce esta procurando nao foi encontrado. Tente buscar na Central de Ajuda.',
    category: 'Geral',
    relatedIds: [],
    lastUpdated: '',
};

/**
 * Individual FAQ article page.
 * Shows a full FAQ article based on the route ID.
 */
const FaqArticlePage: NextPage = () => {
    const router = useRouter();
    const { isAuthenticated: _isAuthenticated } = useAuth();
    const { id } = router.query;
    const articleId = typeof id === 'string' ? id : '';
    const article = ARTICLES[articleId] || DEFAULT_ARTICLE;
    const [helpful, setHelpful] = useState<boolean | null>(null);

    const paragraphs = article.answer.split('\n\n');

    return (
        <div style={{ padding: spacing.xl, maxWidth: '720px', margin: '0 auto' }}>
            <button onClick={() => void router.push('/help/faq')} style={backLinkStyle}>
                &larr; Voltar para FAQ
            </button>

            <div style={cardStyle}>
                <span style={categoryBadgeStyle}>{article.category}</span>
                <h1 style={titleStyle}>{article.question}</h1>

                <div style={{ marginTop: spacing.lg }}>
                    {paragraphs.map((p, idx) => (
                        <p key={idx} style={paragraphStyle}>
                            {p}
                        </p>
                    ))}
                </div>

                {article.lastUpdated && <p style={lastUpdatedStyle}>Atualizado em {article.lastUpdated}</p>}
            </div>

            {/* Helpfulness feedback */}
            <div style={feedbackCardStyle}>
                <p style={feedbackQuestionStyle}>Este artigo foi util?</p>
                {helpful === null ? (
                    <div style={{ display: 'flex', gap: spacing.xs, justifyContent: 'center' }}>
                        <button onClick={() => setHelpful(true)} style={feedbackBtnStyle}>
                            Sim
                        </button>
                        <button onClick={() => setHelpful(false)} style={feedbackBtnStyle}>
                            Nao
                        </button>
                    </div>
                ) : (
                    <p
                        style={{
                            fontSize: typography.fontSize['text-sm'],
                            color: colors.gray[50],
                            textAlign: 'center' as const,
                        }}
                    >
                        {helpful ? 'Obrigada pelo feedback!' : 'Sentimos muito. Tente entrar em contato com o suporte.'}
                    </p>
                )}
            </div>

            {/* Related articles */}
            {article.relatedIds.length > 0 && (
                <div style={{ marginTop: spacing.xl }}>
                    <h2 style={sectionTitleStyle}>Artigos Relacionados</h2>
                    {article.relatedIds.map((relId) => {
                        const related = ARTICLES[relId];
                        if (!related) {
                            return null;
                        }
                        return (
                            <button
                                key={relId}
                                onClick={() => void router.push(`/help/faq/${relId}`)}
                                style={relatedLinkStyle}
                            >
                                {related.question}
                            </button>
                        );
                    })}
                </div>
            )}
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
const cardStyle: React.CSSProperties = {
    backgroundColor: colors.gray[0],
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};
const categoryBadgeStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-xs'],
    fontWeight: typography.fontWeight.medium,
    color: colors.brand.primary,
    backgroundColor: colors.brandPalette[50],
    padding: `${spacing['3xs']} ${spacing.xs}`,
    borderRadius: borderRadius.full,
};
const titleStyle: React.CSSProperties = {
    fontSize: typography.fontSize['heading-lg'],
    fontWeight: typography.fontWeight.semiBold,
    color: colors.gray[70],
    marginTop: spacing.md,
    fontFamily: typography.fontFamily.heading,
};
const paragraphStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-md'],
    color: colors.gray[60],
    lineHeight: typography.lineHeight.base,
    fontFamily: typography.fontFamily.body,
    marginBottom: spacing.md,
    whiteSpace: 'pre-line',
};
const lastUpdatedStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-xs'],
    color: colors.gray[40],
    marginTop: spacing.xl,
    fontFamily: typography.fontFamily.body,
};
const feedbackCardStyle: React.CSSProperties = {
    backgroundColor: colors.gray[5],
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginTop: spacing.xl,
    textAlign: 'center' as const,
};
const feedbackQuestionStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-md'],
    fontWeight: typography.fontWeight.medium,
    color: colors.gray[60],
    marginBottom: spacing.sm,
    fontFamily: typography.fontFamily.body,
};
const feedbackBtnStyle: React.CSSProperties = {
    padding: `${spacing.xs} ${spacing.xl}`,
    backgroundColor: colors.gray[0],
    color: colors.gray[60],
    border: `1px solid ${colors.gray[20]}`,
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: typography.fontSize['text-sm'],
    fontFamily: typography.fontFamily.body,
};
const sectionTitleStyle: React.CSSProperties = {
    fontSize: typography.fontSize['heading-sm'],
    fontWeight: typography.fontWeight.semiBold,
    color: colors.gray[60],
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily.heading,
};
const relatedLinkStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    textAlign: 'left' as const,
    background: 'none',
    border: 'none',
    color: colors.brand.primary,
    fontSize: typography.fontSize['text-sm'],
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    padding: `${spacing.xs} 0`,
    fontFamily: typography.fontFamily.body,
};

export const getStaticPaths: GetStaticPaths = () => ({
    paths: [],
    fallback: 'blocking' as const,
});

export const getStaticProps: GetStaticProps = () => ({ props: {} });

export default FaqArticlePage;
