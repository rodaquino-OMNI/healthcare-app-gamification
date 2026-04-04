import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useMedications } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

/**
 * Share medication access with caregiver page.
 * Allows user to invite caregiver by name/email with specific permissions.
 */
const ShareCaregiverPage: React.FC = () => {
    const { t } = useTranslation();
    const { medications, loading, error, refetch } = useMedications();
    const router = useRouter();
    const [caregiverName, setCaregiverName] = useState('');
    const [caregiverEmail, setCaregiverEmail] = useState('');
    const [permission, setPermission] = useState<'view' | 'edit'>('view');

    if (loading) {
        return (
            <div style={{ padding: '24px' }}>
                <p>{t('common.loading')}</p>
            </div>
        );
    }
    if (error) {
        return (
            <div style={{ padding: '24px' }}>
                <p>
                    {t('common.error')} <button onClick={refetch}>Retry</button>
                </p>
            </div>
        );
    }

    void medications;

    const handleShare = (): void => {
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
                            backgroundColor: colors.gray[0],
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
                            backgroundColor: colors.gray[0],
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
                            backgroundColor: colors.gray[0],
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

export const getServerSideProps = () => ({ props: {} });

export default ShareCaregiverPage;
