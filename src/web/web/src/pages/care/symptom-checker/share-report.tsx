import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSymptomChecker } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

type ShareMethod = 'email' | 'app' | 'link';

const ShareReportPage: React.FC = () => {
    const router = useRouter();
    const { symptoms: _symptoms, results: _results, isLoading, error } = useSymptomChecker();
    const [doctorEmail, setDoctorEmail] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const [shareMethod, setShareMethod] = useState<ShareMethod>('email');
    const [isSending, setIsSending] = useState(false);
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.gray[50]}>
                    {t('common.loading')}
                </Text>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.semantic.error}>
                    {error.message}
                </Text>
            </div>
        );
    }

    const handleShare = (): void => {
        setIsSending(true);
        // Simulate share operation
        setTimeout(() => {
            setIsSending(false);
            void router.push('/care/symptom-checker/conditions-list');
        }, 1000);
    };

    return (
        <div
            style={{
                maxWidth: '720px',
                margin: '0 auto',
                padding: spacing.xl,
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.lg,
            }}
        >
            <div>
                <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                    Compartilhar Relatorio
                </Text>
                <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.sm }}>
                    Envie seu relatorio para seu medico
                </Text>
            </div>

            <div
                style={{
                    display: 'flex',
                    gap: spacing.md,
                    padding: spacing.md,
                    backgroundColor: colors.neutral.gray100,
                    borderRadius: '8px',
                }}
            >
                {(['email', 'app', 'link'] as const).map((method) => (
                    <button
                        key={method}
                        onClick={() => setShareMethod(method)}
                        style={{
                            flex: 1,
                            padding: spacing.md,
                            backgroundColor:
                                shareMethod === method ? colors.journeys.care.primary : colors.neutral.white,
                            color: shareMethod === method ? colors.neutral.white : colors.journeys.care.text,
                            border: `1px solid ${
                                shareMethod === method ? colors.journeys.care.primary : colors.neutral.gray300
                            }`,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '500',
                        }}
                        data-testid={`share-method-${method}`}
                    >
                        {method === 'email' && 'Email'}
                        {method === 'app' && 'App'}
                        {method === 'link' && 'Link'}
                    </button>
                ))}
            </div>

            {shareMethod === 'email' && (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: spacing.md,
                        padding: spacing.lg,
                        backgroundColor: colors.neutral.white,
                        borderRadius: '8px',
                        border: `1px solid ${colors.neutral.gray200}`,
                    }}
                >
                    <div>
                        <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color={colors.journeys.care.text}
                            style={{ marginBottom: spacing.sm }}
                        >
                            Nome do Medico
                        </Text>
                        <input
                            type="text"
                            value={doctorName}
                            onChange={(e) => setDoctorName(e.target.value)}
                            placeholder="Dr. Silva"
                            style={{
                                width: '100%',
                                padding: spacing.md,
                                border: `1px solid ${colors.neutral.gray300}`,
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontFamily: 'inherit',
                            }}
                            data-testid="doctor-name-input"
                        />
                    </div>

                    <div>
                        <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color={colors.journeys.care.text}
                            style={{ marginBottom: spacing.sm }}
                        >
                            Email do Medico
                        </Text>
                        <input
                            type="email"
                            value={doctorEmail}
                            onChange={(e) => setDoctorEmail(e.target.value)}
                            placeholder="medico@exemplo.com"
                            style={{
                                width: '100%',
                                padding: spacing.md,
                                border: `1px solid ${colors.neutral.gray300}`,
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontFamily: 'inherit',
                            }}
                            data-testid="doctor-email-input"
                        />
                    </div>
                </div>
            )}

            {shareMethod === 'app' && (
                <div
                    style={{
                        padding: spacing.lg,
                        backgroundColor: colors.neutral.white,
                        borderRadius: '8px',
                        border: `1px solid ${colors.neutral.gray200}`,
                    }}
                >
                    <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color={colors.journeys.care.text}
                        style={{ marginBottom: spacing.md }}
                    >
                        Compartilhar via Aplicativo
                    </Text>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: spacing.md,
                        }}
                    >
                        {['WhatsApp', 'Telegram', 'Messages', 'Messenger'].map((app) => (
                            <button
                                key={app}
                                style={{
                                    padding: spacing.md,
                                    backgroundColor: colors.neutral.gray100,
                                    border: `1px solid ${colors.neutral.gray300}`,
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                }}
                                data-testid={`share-app-${app.toLowerCase()}`}
                            >
                                {app}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {shareMethod === 'link' && (
                <div
                    style={{
                        padding: spacing.lg,
                        backgroundColor: colors.neutral.white,
                        borderRadius: '8px',
                        border: `1px solid ${colors.neutral.gray200}`,
                    }}
                >
                    <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color={colors.journeys.care.text}
                        style={{ marginBottom: spacing.md }}
                    >
                        Link de Compartilhamento
                    </Text>
                    <div style={{ display: 'flex', gap: spacing.sm }}>
                        <input
                            type="text"
                            value="https://app.exemplo.com/report/abc123xyz"
                            readOnly
                            style={{
                                flex: 1,
                                padding: spacing.md,
                                border: `1px solid ${colors.neutral.gray300}`,
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontFamily: 'monospace',
                                backgroundColor: colors.neutral.gray100,
                            }}
                            data-testid="share-link-input"
                        />
                        <button
                            style={{
                                padding: `${spacing.md} ${spacing.lg}`,
                                backgroundColor: colors.journeys.care.primary,
                                color: colors.neutral.white,
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '500',
                            }}
                            data-testid="copy-share-link"
                            onClick={() =>
                                void navigator.clipboard.writeText('https://app.exemplo.com/report/abc123xyz')
                            }
                        >
                            Copiar
                        </button>
                    </div>
                </div>
            )}

            <div
                style={{
                    display: 'flex',
                    gap: spacing.md,
                    marginTop: spacing.lg,
                }}
            >
                <button
                    onClick={() => void handleShare()}
                    disabled={isSending || (shareMethod === 'email' && !doctorEmail)}
                    style={{
                        flex: 1,
                        padding: `${spacing.md} ${spacing.lg}`,
                        backgroundColor:
                            isSending || (shareMethod === 'email' && !doctorEmail)
                                ? colors.neutral.gray300
                                : colors.journeys.care.primary,
                        color: colors.neutral.white,
                        border: 'none',
                        borderRadius: '6px',
                        cursor: isSending || (shareMethod === 'email' && !doctorEmail) ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                    }}
                    data-testid="send-share-button"
                >
                    {isSending ? 'Enviando...' : 'Enviar Relatorio'}
                </button>
                <button
                    onClick={() => router.back()}
                    style={{
                        flex: 1,
                        padding: `${spacing.md} ${spacing.lg}`,
                        backgroundColor: colors.neutral.gray200,
                        color: colors.journeys.care.text,
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                    }}
                    data-testid="cancel-share-button"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default ShareReportPage;
