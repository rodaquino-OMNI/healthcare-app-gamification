import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

interface FAQDetail {
    id: string;
    question: string;
    answer: string;
    relatedTopics?: string[];
}

const FAQ_DETAILS: Record<string, FAQDetail> = {
    '1': {
        id: '1',
        question: 'Como adicionar um novo medicamento?',
        answer: `Existem duas maneiras de adicionar um novo medicamento no aplicativo:

1. Escanear Receita:
   - Vá para a aba Saúde
   - Selecione "Medicamentos"
   - Clique no botão "+"
   - Escolha "Escanear Receita"
   - Aponte a câmera para a receita
   - O aplicativo extrairá os dados automaticamente
   - Revise e corrija qualquer erro
   - Clique em "Confirmar"

2. Buscar Banco de Dados:
   - Vá para a aba Saúde
   - Selecione "Medicamentos"
   - Clique no botão "+"
   - Escolha "Buscar Medicamento"
   - Digite o nome do medicamento
   - Selecione da lista de resultados
   - Informe a dosagem e frequência
   - Clique em "Adicionar"

Dica: Você pode definir lembretes para não esquecer de tomar seus medicamentos.`,
        relatedTopics: ['Configurar Lembretes', 'Escanear Receita'],
    },
    '2': {
        id: '2',
        question: 'Como configurar lembretes para meus medicamentos?',
        answer: `Para configurar lembretes de medicamentos, siga os passos:

1. Abra um medicamento já adicionado
2. Clique em "Configurar Lembrete"
3. Selecione os horários em que deseja tomar o medicamento
4. Escolha a frequência (diária, em dias específicos, etc)
5. Defina o tipo de notificação (som, vibração, silencioso)
6. Clique em "Salvar"

Você receberá notificações nos horários agendados. Se perder um lembrete, você pode registrá-lo manualmente mais tarde.

Dica: Configure lembretes alguns minutos antes do horário real para ter tempo de se preparar.`,
        relatedTopics: ['Notificações', 'Histórico de Medicamentos'],
    },
};

/**
 * FAQ detail page showing full question and answer.
 * Displays related topics and helpful Sim/Não buttons for feedback.
 */
const FAQDetailPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const [helpful, setHelpful] = useState<boolean | null>(null);

    const faqItem = id && typeof id === 'string' ? FAQ_DETAILS[id] : null;

    if (!faqItem) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="lg" color={colors.semantic.error}>
                    Pergunta não encontrada.
                </Text>
                <Button variant="secondary" journey="health" onPress={() => router.back()} accessibilityLabel="Voltar">
                    Voltar
                </Button>
            </div>
        );
    }

    const handleHelpful = (isHelpful: boolean) => {
        setHelpful(isHelpful);
        alert(
            isHelpful
                ? 'Obrigado! Sua opinião nos ajuda a melhorar.'
                : 'Desculpe, não conseguimos ajudar. Entre em contato com nosso suporte.'
        );
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            {/* Question */}
            <Text fontSize="2xl" fontWeight="bold" color={colors.brand.primary} style={{ marginBottom: spacing.md }}>
                {faqItem.question}
            </Text>

            {/* Answer */}
            <Card journey="health" elevation="sm" padding="lg" style={{ marginBottom: spacing.xl }}>
                <Text
                    fontSize="md"
                    color={colors.neutral.gray900}
                    style={{
                        lineHeight: '1.8',
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    {faqItem.answer}
                </Text>
            </Card>

            {/* Related Topics */}
            {faqItem.relatedTopics && faqItem.relatedTopics.length > 0 && (
                <Card journey="health" elevation="sm" padding="lg" style={{ marginBottom: spacing.xl }}>
                    <Text fontSize="md" fontWeight="medium" color={colors.neutral.gray900}>
                        Tópicos Relacionados
                    </Text>
                    <div style={{ marginTop: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                        {faqItem.relatedTopics.map((topic, index) => (
                            <Text
                                key={`topic-${index}`}
                                fontSize="sm"
                                color={colors.brand.primary}
                                style={{ cursor: 'pointer' }}
                                data-testid={`related-topic-${index}`}
                            >
                                → {topic}
                            </Text>
                        ))}
                    </div>
                </Card>
            )}

            {/* Feedback */}
            <Card journey="health" elevation="sm" padding="lg" style={{ marginBottom: spacing.xl }}>
                <Text fontSize="md" fontWeight="medium" color={colors.neutral.gray900}>
                    Esta resposta foi útil?
                </Text>
                <div style={{ marginTop: spacing.md, display: 'flex', gap: spacing.md }}>
                    <Button
                        variant={helpful === true ? 'primary' : 'secondary'}
                        journey="health"
                        onPress={() => handleHelpful(true)}
                        accessibilityLabel="Sim, foi útil"
                    >
                        Sim
                    </Button>
                    <Button
                        variant={helpful === false ? 'primary' : 'secondary'}
                        journey="health"
                        onPress={() => handleHelpful(false)}
                        accessibilityLabel="Não, não foi útil"
                    >
                        Não
                    </Button>
                </div>
            </Card>

            {/* Back Button */}
            <Box>
                <Button variant="secondary" journey="health" onPress={() => router.back()} accessibilityLabel="Voltar">
                    Voltar
                </Button>
            </Box>
        </div>
    );
};

export default FAQDetailPage;
