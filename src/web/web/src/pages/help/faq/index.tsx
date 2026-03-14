import { colors, typography, spacing, borderRadius } from 'design-system/tokens';
import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { useAuth } from '@/hooks/useAuth';

interface FaqItem {
    id: string;
    question: string;
    answer: string;
    category: string;
}

const FAQ_ITEMS: FaqItem[] = [
    {
        id: '1',
        category: 'account',
        question: 'Como alterar minha senha?',
        answer: 'Acesse Configuracoes > Alterar Senha. Voce precisara informar sua senha atual e criar uma nova senha com pelo menos 8 caracteres.',
    },
    {
        id: '2',
        category: 'account',
        question: 'Como ativar a autenticacao em duas etapas?',
        answer: 'Va em Configuracoes > Autenticacao em Duas Etapas. Voce pode escolher entre SMS ou aplicativo autenticador.',
    },
    {
        id: '3',
        category: 'plan',
        question: 'Quais procedimentos meu plano cobre?',
        answer: 'Consulte a pagina Cobertura no menu Meu Plano para ver a lista completa de procedimentos cobertos pelo seu plano.',
    },
    {
        id: '4',
        category: 'plan',
        question: 'Como solicitar reembolso?',
        answer: 'Acesse Meu Plano > Sinistros > Novo Sinistro. Preencha o formulario e envie os documentos comprobatorios.',
    },
    {
        id: '5',
        category: 'appointments',
        question: 'Como agendar uma consulta?',
        answer: 'Va em Cuidar-me Agora > Buscar Medico. Escolha o especialista, selecione data e horario disponiveis.',
    },
    {
        id: '6',
        category: 'appointments',
        question: 'Como funciona a telemedicina?',
        answer: 'Apos agendar uma consulta por telemedicina, voce recebera um link de acesso. Na hora da consulta, entre na sala de espera virtual.',
    },
    {
        id: '7',
        category: 'health',
        question: 'Como conectar meu dispositivo wearable?',
        answer: 'Va em Configuracoes > Dispositivos Conectados > Adicionar Dispositivo. Siga as instrucoes de pareamento.',
    },
    {
        id: '8',
        category: 'privacy',
        question: 'Como exportar meus dados pessoais?',
        answer: 'Conforme a LGPD, acesse Configuracoes > Exportar Dados. Selecione as categorias desejadas e o formato de exportacao.',
    },
    {
        id: '9',
        category: 'gamification',
        question: 'Como ganhar XP e subir de nivel?',
        answer: 'Complete missoes diarias, mantenha consultas em dia, registre medicamentos e atinja metas de saude para ganhar pontos de experiencia.',
    },
    {
        id: '10',
        category: 'privacy',
        question: 'Como excluir minha conta?',
        answer: 'Acesse Configuracoes > Excluir Conta. Leia as consequencias, confirme com sua senha. A exclusao e permanente e irreversivel.',
    },
];

/**
 * FAQ categories listing page with accordion.
 * Shows questions organized by category with expandable answers.
 */
const FaqIndexPage: NextPage = () => {
    const router = useRouter();
    const { isAuthenticated: _isAuthenticated } = useAuth();
    const { category } = router.query;
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filteredItems = category ? FAQ_ITEMS.filter((item) => item.category === category) : FAQ_ITEMS;

    const categoryLabels: Record<string, string> = {
        account: 'Conta e Acesso',
        plan: 'Plano de Saude',
        appointments: 'Consultas e Agendamentos',
        health: 'Saude e Metricas',
        gamification: 'Conquistas e Recompensas',
        privacy: 'Privacidade e LGPD',
    };

    const toggleItem = (id: string): void => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div style={{ padding: spacing.xl, maxWidth: '720px', margin: '0 auto' }}>
            <h1 style={titleStyle}>
                {category && typeof category === 'string' && categoryLabels[category]
                    ? categoryLabels[category]
                    : 'Perguntas Frequentes'}
            </h1>
            <p style={subtitleStyle}>{filteredItems.length} artigos encontrados</p>

            <div style={listStyle}>
                {filteredItems.map((item) => (
                    <div key={item.id} style={accordionItemStyle}>
                        <button
                            onClick={() => toggleItem(item.id)}
                            style={accordionHeaderStyle}
                            aria-expanded={expandedId === item.id}
                        >
                            <span style={questionStyle}>{item.question}</span>
                            <span
                                style={{
                                    color: colors.gray[40],
                                    fontSize: typography.fontSize['text-lg'],
                                    flexShrink: 0,
                                }}
                            >
                                {expandedId === item.id ? '-' : '+'}
                            </span>
                        </button>
                        {expandedId === item.id && (
                            <div style={accordionBodyStyle}>
                                <p style={answerStyle}>{item.answer}</p>
                                <button onClick={() => void router.push(`/help/faq/${item.id}`)} style={readMoreStyle}>
                                    Ver artigo completo
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {category && (
                <button onClick={() => void router.push('/help')} style={backBtnStyle}>
                    Voltar para Central de Ajuda
                </button>
            )}
        </div>
    );
};

const titleStyle: React.CSSProperties = {
    fontSize: typography.fontSize['heading-xl'],
    fontWeight: typography.fontWeight.semiBold,
    color: colors.gray[70],
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.heading,
};
const subtitleStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-sm'],
    color: colors.gray[50],
    marginBottom: spacing.xl,
    fontFamily: typography.fontFamily.body,
};
const listStyle: React.CSSProperties = {
    backgroundColor: colors.gray[0],
    borderRadius: borderRadius.md,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    overflow: 'hidden',
};
const accordionItemStyle: React.CSSProperties = {
    borderBottom: `1px solid ${colors.gray[10]}`,
};
const accordionHeaderStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left' as const,
};
const questionStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-md'],
    fontWeight: typography.fontWeight.medium,
    color: colors.gray[70],
    fontFamily: typography.fontFamily.body,
};
const accordionBodyStyle: React.CSSProperties = {
    padding: `0 ${spacing.md} ${spacing.md} ${spacing.md}`,
};
const answerStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-sm'],
    color: colors.gray[50],
    lineHeight: typography.lineHeight.base,
    fontFamily: typography.fontFamily.body,
    margin: 0,
};
const readMoreStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: colors.brand.primary,
    fontSize: typography.fontSize['text-sm'],
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    padding: 0,
    marginTop: spacing.sm,
    fontFamily: typography.fontFamily.body,
};
const backBtnStyle: React.CSSProperties = {
    marginTop: spacing.xl,
    padding: `${spacing.xs} ${spacing.md}`,
    backgroundColor: 'transparent',
    color: colors.brand.primary,
    border: `1px solid ${colors.brand.primary}`,
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: typography.fontSize['text-sm'],
    fontFamily: typography.fontFamily.body,
};

export const getStaticProps: GetStaticProps = () => ({ props: {} });

export default FaqIndexPage;
