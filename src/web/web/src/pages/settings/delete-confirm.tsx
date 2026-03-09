import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

/**
 * Account deletion confirmation page.
 * Displays warning, requires user to type confirmation text before deletion.
 */
const DeleteConfirmPage: React.FC = () => {
    const router = useRouter();
    const [confirmationText, setConfirmationText] = useState('');
    const requiredText = 'EXCLUIR';

    const handleDelete = (): void => {
        if (confirmationText !== requiredText) {
            alert(`Por favor, digite "${requiredText}" para confirmar a exclusão.`);
            return;
        }
        alert('Sua conta foi excluída permanentemente.');
        void router.push('/');
    };

    const isConfirmed = confirmationText === requiredText;

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.semantic.error}>
                Confirmar Exclusão de Conta
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Esta ação é permanente e não pode ser desfeita.
            </Text>

            {/* Warning Card */}
            <Card
                journey="health"
                elevation="sm"
                padding="lg"
                style={{
                    backgroundColor: '#fff3cd',
                    borderLeft: `4px solid ${colors.semantic.error}`,
                    marginBottom: spacing.xl,
                }}
            >
                <Text fontSize="md" fontWeight="medium" color={colors.semantic.error}>
                    Aviso Importante
                </Text>
                <ul style={{ marginTop: spacing.md, color: colors.semantic.error, paddingLeft: spacing.lg }}>
                    <li style={{ marginBottom: spacing.sm }}>
                        <Text fontSize="sm" color={colors.semantic.error}>
                            Todos os seus dados serão permanentemente deletados.
                        </Text>
                    </li>
                    <li style={{ marginBottom: spacing.sm }}>
                        <Text fontSize="sm" color={colors.semantic.error}>
                            Seus medicamentos, registros e histórico não poderão ser recuperados.
                        </Text>
                    </li>
                    <li>
                        <Text fontSize="sm" color={colors.semantic.error}>
                            Você perderá acesso a todas as funcionalidades do aplicativo.
                        </Text>
                    </li>
                </ul>
            </Card>

            {/* Confirmation Input */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing.md }}>
                    Para confirmar, digite &quot;<strong>{requiredText}</strong>&quot; no campo abaixo:
                </Text>
                <input
                    type="text"
                    placeholder={requiredText}
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value.toUpperCase())}
                    style={{
                        width: '100%',
                        padding: spacing.md,
                        borderRadius: '8px',
                        border: `2px solid ${
                            confirmationText === ''
                                ? colors.neutral.gray300
                                : isConfirmed
                                  ? colors.semantic.success
                                  : colors.semantic.error
                        }`,
                        fontSize: '14px',
                        backgroundColor: '#fff',
                        color: colors.neutral.gray900,
                        fontFamily: 'inherit',
                        fontWeight: 'bold',
                        letterSpacing: '2px',
                    }}
                    data-testid="deletion-confirmation-input"
                />
                <Text
                    fontSize="xs"
                    color={isConfirmed ? colors.semantic.success : colors.semantic.error}
                    style={{ marginTop: spacing.sm }}
                >
                    {isConfirmed ? '✓ Confirmação realizada' : '✗ Digite " EXCLUIR" para continuar'}
                </Text>
            </Card>

            {/* Action Buttons */}
            <Box style={{ marginTop: spacing.xl }}>
                <Button
                    variant="primary"
                    journey="health"
                    onPress={handleDelete}
                    accessibilityLabel="Excluir minha conta"
                >
                    Excluir Minha Conta
                </Button>
            </Box>

            <Box style={{ marginTop: spacing.md }}>
                <Button
                    variant="secondary"
                    journey="health"
                    onPress={() => router.back()}
                    accessibilityLabel="Cancelar exclusão"
                >
                    Cancelar
                </Button>
            </Box>
        </div>
    );
};

export default DeleteConfirmPage;
