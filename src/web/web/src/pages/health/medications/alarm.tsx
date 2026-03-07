import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

/**
 * Medication alarm notification page.
 * Displays current medication to take with action buttons (take/snooze/skip).
 */
const MedicationAlarmPage: React.FC = () => {
    const router = useRouter();
    const [snoozed, setSnoozed] = useState(false);

    const medication = {
        name: 'Amoxicilina',
        dosage: '500mg',
        time: '08:00',
        instructions: 'Tomar com água após as refeições',
    };

    const handleTake = () => {
        alert('Medicamento marcado como tomado!');
        router.back();
    };

    const handleSnooze = () => {
        setSnoozed(true);
        alert('Lembrete adiado para 30 minutos depois.');
        setTimeout(() => router.back(), 2000);
    };

    const handleSkip = () => {
        alert('Medicamento marcado como pulado.');
        router.back();
    };

    return (
        <div
            style={{
                maxWidth: '720px',
                margin: '0 auto',
                padding: spacing.xl,
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {/* Alert Card */}
            <Card
                journey="health"
                elevation="lg"
                padding="xl"
                style={{
                    width: '100%',
                    backgroundColor: colors.semantic.warning,
                    borderColor: colors.semantic.warning,
                }}
            >
                <Text fontSize="lg" color="#fff" style={{ textAlign: 'center', marginBottom: spacing.md }}>
                    Hora de tomar seu medicamento
                </Text>

                {/* Medication Info */}
                <div
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        padding: spacing.lg,
                        borderRadius: '12px',
                        marginBottom: spacing.xl,
                    }}
                >
                    <Text
                        fontSize="heading-2xl"
                        fontWeight="bold"
                        color="#fff"
                        style={{ textAlign: 'center', marginBottom: spacing.sm }}
                    >
                        {medication.name}
                    </Text>
                    <Text
                        fontSize="xl"
                        color="rgba(255,255,255,0.9)"
                        style={{ textAlign: 'center', marginBottom: spacing.md }}
                    >
                        {medication.dosage}
                    </Text>
                    <Text
                        fontSize="lg"
                        color="rgba(255,255,255,0.8)"
                        style={{ textAlign: 'center', marginBottom: spacing.sm }}
                    >
                        {medication.time}
                    </Text>
                    <Text fontSize="sm" color="rgba(255,255,255,0.7)" style={{ textAlign: 'center' }}>
                        {medication.instructions}
                    </Text>
                </div>

                {/* Action Buttons */}
                <Box style={{ marginBottom: spacing.md }}>
                    <Button
                        variant="primary"
                        journey="health"
                        onPress={handleTake}
                        accessibilityLabel="Confirmar medicamento"
                    >
                        Tomar Agora
                    </Button>
                </Box>

                <Box style={{ marginBottom: spacing.md }}>
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={handleSnooze}
                        accessibilityLabel="Adiar lembrete"
                    >
                        {snoozed ? 'Lembrete Adiado' : 'Adiar (30 min)'}
                    </Button>
                </Box>

                <Box>
                    <Button
                        variant="tertiary"
                        journey="health"
                        onPress={handleSkip}
                        accessibilityLabel="Pular este medicamento"
                    >
                        Pular
                    </Button>
                </Box>
            </Card>
        </div>
    );
};

export default MedicationAlarmPage;
