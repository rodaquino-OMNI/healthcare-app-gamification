import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
    {
        id: '1',
        question: 'Como adicionar um novo medicamento?',
        answer: 'Vá para a aba Saúde, selecione Medicamentos e clique em "Adicionar". Você pode escanear a receita ou buscar o medicamento no banco de dados.',
    },
    {
        id: '2',
        question: 'Como configurar lembretes para meus medicamentos?',
        answer: 'No detalhe do medicamento, clique em "Configurar Lembrete" e selecione o horário e frequência desejados. Você receberá notificações nos horários agendados.',
    },
    {
        id: '3',
        question: 'Posso compartilhar meus medicamentos com um cuidador?',
        answer: 'Sim, vá para Configurações > Medicamentos > Compartilhar com Cuidador. Insira o e-mail da pessoa e selecione o nível de permissão desejado.',
    },
    {
        id: '4',
        question: 'Como exportar meu histórico de medicamentos?',
        answer: 'Vá para Configurações > Exportar Dados. Selecione o período desejado e o formato (PDF ou CSV). O arquivo será enviado por e-mail.',
    },
    {
        id: '5',
        question: 'O que fazer se perder um medicamento?',
        answer: 'Você pode consultar o histórico na seção "Histórico de Medicamentos". Se precisar de ajuda, entre em contato com nosso suporte por chat.',
    },
];

/**
 * FAQ category page displaying expandable question-answer items.
 * Users can click to view answers and navigate to detailed FAQ.
 */
const FAQCategoryPage: React.FC = () => {
    const router = useRouter();
    const { isAuthenticated: _isAuthenticated } = useAuth();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string): void => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.brand.primary}>
                Perguntas Frequentes
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Encontre respostas para perguntas comuns sobre saúde e medicamentos.
            </Text>

            {/* FAQ Items */}
            <div>
                {FAQ_ITEMS.map((item) => (
                    <Card
                        key={item.id}
                        journey="health"
                        elevation="sm"
                        padding="lg"
                        style={{ marginBottom: spacing.lg, cursor: 'pointer' }}
                    >
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={() => toggleExpand(item.id)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    toggleExpand(item.id);
                                }
                            }}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                userSelect: 'none',
                            }}
                            data-testid={`faq-question-${item.id}`}
                        >
                            <Text
                                fontSize="md"
                                fontWeight="medium"
                                color={colors.neutral.gray900}
                                style={{ flex: 1, paddingRight: spacing.md }}
                            >
                                {item.question}
                            </Text>
                            <span
                                style={{
                                    fontSize: '20px',
                                    color: colors.brand.primary,
                                    transition: 'transform 0.3s',
                                    transform: expandedId === item.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                }}
                                data-testid={`faq-chevron-${item.id}`}
                            >
                                ▼
                            </span>
                        </div>

                        {/* Expandable Answer */}
                        {expandedId === item.id && (
                            <div
                                style={{
                                    marginTop: spacing.md,
                                    paddingTop: spacing.md,
                                    borderTop: `1px solid ${colors.neutral.gray300}`,
                                }}
                                data-testid={`faq-answer-${item.id}`}
                            >
                                <Text fontSize="sm" color={colors.gray[50]} style={{ lineHeight: '1.6' }}>
                                    {item.answer}
                                </Text>
                                <Button
                                    variant="tertiary"
                                    journey="health"
                                    onPress={() => void router.push(`/help/faq/${item.id}`)}
                                    accessibilityLabel="Ver mais detalhes"
                                    style={{ marginTop: spacing.md }}
                                >
                                    Ver Mais Detalhes
                                </Button>
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            {/* Back Button */}
            <Box style={{ marginTop: spacing.xl }}>
                <Button variant="secondary" journey="health" onPress={() => router.back()} accessibilityLabel="Voltar">
                    Voltar
                </Button>
            </Box>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default FAQCategoryPage;
