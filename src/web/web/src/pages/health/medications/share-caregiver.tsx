import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

/**
 * Share medication access with caregiver page.
 * Allows user to invite caregiver by name/email with specific permissions.
 */
const ShareCaregiverPage: React.FC = () => {
    const router = useRouter();
    const [caregiverName, setCaregiverName] = useState('');
    const [caregiverEmail, setCaregiverEmail] = useState('');
    const [permission, setPermission] = useState<'view' | 'edit'>('view');

    const handleShare = () => {
        if (!caregiverName || !caregiverEmail) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        alert(`Acesso compartilhado com ${caregiverName} (${caregiverEmail})`);
        setCaregiverName('');
        setCaregiverEmail('');
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                Compartilhar com Cuidador
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Conceda acesso ao seu histórico de medicamentos a um cuidador.
            </Text>

            {/* Form */}
            <Card journey="health" elevation="sm" padding="lg">
                {/* Name Input */}
                <Box style={{ marginBottom: spacing.lg }}>
                    <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing.xs }}>
                        Nome do Cuidador
                    </Text>
                    <input
                        type="text"
                        placeholder="Ex: Maria Silva"
                        value={caregiverName}
                        onChange={(e) => setCaregiverName(e.target.value)}
                        style={{
                            width: '100%',
                            padding: spacing.md,
                            borderRadius: '8px',
                            border: `1px solid ${colors.neutral.gray300}`,
                            fontSize: '14px',
                            backgroundColor: '#fff',
                            color: colors.neutral.gray900,
                            fontFamily: 'inherit',
                        }}
                        data-testid="caregiver-name-input"
                    />
                </Box>

                {/* Email Input */}
                <Box style={{ marginBottom: spacing.lg }}>
                    <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing.xs }}>
                        E-mail
                    </Text>
                    <input
                        type="email"
                        placeholder="Ex: maria@email.com"
                        value={caregiverEmail}
                        onChange={(e) => setCaregiverEmail(e.target.value)}
                        style={{
                            width: '100%',
                            padding: spacing.md,
                            borderRadius: '8px',
                            border: `1px solid ${colors.neutral.gray300}`,
                            fontSize: '14px',
                            backgroundColor: '#fff',
                            color: colors.neutral.gray900,
                            fontFamily: 'inherit',
                        }}
                        data-testid="caregiver-email-input"
                    />
                </Box>

                {/* Permission Select */}
                <Box style={{ marginBottom: spacing.lg }}>
                    <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing.xs }}>
                        Permissão
                    </Text>
                    <select
                        value={permission}
                        onChange={(e) => setPermission(e.target.value as 'view' | 'edit')}
                        style={{
                            width: '100%',
                            padding: spacing.md,
                            borderRadius: '8px',
                            border: `1px solid ${colors.neutral.gray300}`,
                            fontSize: '14px',
                            backgroundColor: '#fff',
                            color: colors.neutral.gray900,
                            fontFamily: 'inherit',
                        }}
                        data-testid="permission-select"
                    >
                        <option value="view">Visualizar apenas</option>
                        <option value="edit">Visualizar e editar</option>
                    </select>
                </Box>
            </Card>

            {/* Action Buttons */}
            <Box style={{ marginTop: spacing.xl }}>
                <Button
                    variant="primary"
                    journey="health"
                    onPress={handleShare}
                    accessibilityLabel="Compartilhar acesso"
                >
                    Compartilhar
                </Button>
            </Box>

            <Box style={{ marginTop: spacing.md }}>
                <Button variant="secondary" journey="health" onPress={() => router.back()} accessibilityLabel="Voltar">
                    Voltar
                </Button>
            </Box>
        </div>
    );
};

export default ShareCaregiverPage;
