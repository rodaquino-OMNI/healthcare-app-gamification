import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { typography } from 'design-system/tokens/typography';
import React, { useState } from 'react';
import styled from 'styled-components';

import { restClient } from '@/api/client';
import { useMedications } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';
import { MainLayout } from '@/layouts/MainLayout';

const PageContainer = styled.div`
    max-width: 600px;
    margin: 0 auto;
    padding: ${spacing.xl} ${spacing.md};
`;

const BackLink = styled.button`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.journeys.health.primary};
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-bottom: ${spacing.lg};

    &:hover {
        text-decoration: underline;
    }
`;

const Title = styled.h1`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-xl']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.gray[70]};
    text-align: center;
    margin: 0 0 ${spacing['3xs']} 0;
`;

const MedName = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: ${colors.journeys.health.primary};
    text-align: center;
    font-weight: ${typography.fontWeight.semiBold};
    margin: 0 0 ${spacing.xl} 0;
`;

const Section = styled.div`
    margin-bottom: ${spacing.xl};
`;

const SectionTitle = styled.h2`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-sm']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.journeys.health.accent};
    margin: 0 0 ${spacing.md} 0;
`;

const Label = styled.label`
    display: block;
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.gray[60]};
    margin-bottom: ${spacing['3xs']};
`;

const TimeInput = styled.input`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['heading-xl']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.gray[70]};
    padding: ${spacing.sm} ${spacing.md};
    border: 2px solid ${colors.journeys.health.primary};
    border-radius: 10px;
    outline: none;
    text-align: center;
    width: 140px;

    &:focus {
        box-shadow: 0 0 0 3px ${colors.journeys.health.primary}20;
    }
`;

const TimeHint = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    color: ${colors.gray[40]};
    margin: ${spacing['3xs']} 0 0;
`;

const ChipGroup = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${spacing.xs};
`;

const Chip = styled.button<{ selected?: boolean }>`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${(props) => (props.selected ? typography.fontWeight.semiBold : typography.fontWeight.regular)};
    color: ${(props) => (props.selected ? colors.journeys.health.primary : colors.gray[60])};
    background-color: ${(props) => (props.selected ? colors.journeys.health.background : colors.neutral.white)};
    border: 1px solid ${(props) => (props.selected ? colors.journeys.health.primary : colors.gray[20])};
    border-radius: 8px;
    padding: ${spacing.xs} ${spacing.md};
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
        border-color: ${colors.journeys.health.primary};
    }
`;

const DayChip = styled.button<{ selected?: boolean }>`
    width: 44px;
    height: 44px;
    border-radius: 50%;
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    font-weight: ${typography.fontWeight.medium};
    color: ${(props) => (props.selected ? colors.neutral.white : colors.gray[60])};
    background-color: ${(props) => (props.selected ? colors.journeys.health.primary : colors.neutral.white)};
    border: 1px solid ${(props) => (props.selected ? colors.journeys.health.primary : colors.gray[20])};
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
        border-color: ${colors.journeys.health.primary};
    }
`;

const IntervalRow = styled.div`
    display: flex;
    align-items: center;
    gap: ${spacing.xs};
    margin-top: ${spacing.sm};
`;

const IntervalInput = styled.input`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-lg']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.gray[70]};
    border: 2px solid ${colors.journeys.health.primary};
    border-radius: 8px;
    padding: ${spacing['3xs']} ${spacing.sm};
    text-align: center;
    width: 60px;
    outline: none;

    &:focus {
        box-shadow: 0 0 0 3px ${colors.journeys.health.primary}20;
    }
`;

const IntervalLabel = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.gray[60]};
`;

const ToggleRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${spacing.sm};
`;

const ToggleSwitch = styled.label`
    position: relative;
    display: inline-block;
    width: 48px;
    height: 28px;
    flex-shrink: 0;
`;

const ToggleInput = styled.input`
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + span {
        background-color: ${colors.journeys.health.primary};
    }

    &:checked + span::before {
        transform: translateX(20px);
    }
`;

const ToggleSlider = styled.span`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${colors.gray[30]};
    transition: 0.2s;
    border-radius: 14px;

    &::before {
        position: absolute;
        content: '';
        height: 22px;
        width: 22px;
        left: 3px;
        bottom: 3px;
        background-color: ${colors.neutral.white};
        transition: 0.2s;
        border-radius: 50%;
    }
`;

const SnoozeLabel = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: ${colors.gray[60]};
`;

const PreviewCard = styled.div`
    background-color: ${colors.gray[5]};
    border-left: 4px solid ${colors.journeys.health.primary};
    border-radius: 10px;
    padding: ${spacing.md};
`;

const PreviewHeader = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    color: ${colors.gray[40]};
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const PreviewMedName = styled.p`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['text-lg']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.gray[70]};
    margin: ${spacing['3xs']} 0 0;
`;

const PreviewTimeRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: ${spacing.sm};
`;

const PreviewTime = styled.span`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['text-xl']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.journeys.health.primary};
`;

const PreviewFrequency = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.gray[50]};
`;

const ButtonRow = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${spacing.sm};
    margin-top: ${spacing.xl};
`;

const PrimaryButton = styled.button`
    width: 100%;
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.neutral.white};
    background-color: ${colors.journeys.health.primary};
    border: none;
    border-radius: 10px;
    padding: ${spacing.sm} ${spacing.xl};
    cursor: pointer;
    transition: background-color 0.15s ease;

    &:hover {
        background-color: ${colors.journeys.health.secondary};
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const SecondaryButton = styled.button`
    width: 100%;
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.journeys.health.primary};
    background-color: transparent;
    border: 2px solid ${colors.journeys.health.primary};
    border-radius: 10px;
    padding: ${spacing.sm} ${spacing.xl};
    cursor: pointer;
    transition: border-color 0.15s ease;

    &:hover {
        border-color: ${colors.journeys.health.secondary};
        color: ${colors.journeys.health.secondary};
    }
`;

const ErrorMessage = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.semantic.error};
    text-align: center;
    margin: 0 0 ${spacing.sm} 0;
`;

type FrequencyType = 'daily' | 'weekly' | 'interval' | 'custom';

const FREQUENCY_OPTIONS: Array<{ label: string; value: FrequencyType }> = [
    { label: 'Diariamente', value: 'daily' },
    { label: 'Semanalmente', value: 'weekly' },
    { label: 'A cada X horas', value: 'interval' },
    { label: 'Personalizado', value: 'custom' },
];

const DAYS_OF_WEEK = [
    { label: 'Dom', value: 'sunday' },
    { label: 'Seg', value: 'monday' },
    { label: 'Ter', value: 'tuesday' },
    { label: 'Qua', value: 'wednesday' },
    { label: 'Qui', value: 'thursday' },
    { label: 'Sex', value: 'friday' },
    { label: 'Sab', value: 'saturday' },
];

const SNOOZE_OPTIONS = [
    { label: '5 min', value: 5 },
    { label: '10 min', value: 10 },
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
];

/**
 * Medication reminder configuration page - allows users to set up reminders.
 * Mirrors the mobile MedicationReminder screen.
 */

export const getServerSideProps = () => ({ props: {} });

export default function MedicationReminderPage(): React.ReactElement {
    const { medications, loading: medsLoading, error: medsError, refetch } = useMedications();
    const router = useRouter();
    const medicationName = (router.query.name as string) || 'Medicamento';

    const [time, setTime] = useState('08:00');
    const [frequency, setFrequency] = useState<FrequencyType>('daily');
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [intervalHours, setIntervalHours] = useState('8');
    const [snoozeEnabled, setSnoozeEnabled] = useState(true);
    const [snoozeDuration, setSnoozeDuration] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (medsLoading) {
        return (
            <div style={{ padding: '24px' }}>
                <p>Loading...</p>
            </div>
        );
    }
    if (medsError) {
        return (
            <div style={{ padding: '24px' }}>
                <p>
                    Error loading data. <button onClick={refetch}>Retry</button>
                </p>
            </div>
        );
    }

    void medications;

    const toggleDay = (day: string): void => {
        setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
    };

    const getFrequencyLabel = (): string => {
        switch (frequency) {
            case 'daily':
                return 'Todos os dias';
            case 'weekly':
                return selectedDays.length > 0
                    ? DAYS_OF_WEEK.filter((d) => selectedDays.includes(d.value))
                          .map((d) => d.label)
                          .join(', ')
                    : 'Selecione os dias';
            case 'interval':
                return `A cada ${intervalHours} horas`;
            case 'custom':
                return 'Personalizado';
            default:
                return '';
        }
    };

    const handleSave = async (): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            await restClient.post('/health/medication-reminders', {
                medicationName,
                time,
                frequency,
                selectedDays,
                intervalHours: Number(intervalHours),
                snoozeEnabled,
                snoozeDuration,
            });
            router.back();
        } catch (err) {
            setError('Failed to save reminder');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <PageContainer>
                <BackLink onClick={() => router.back()}>Voltar</BackLink>

                <Title>Configurar Lembrete</Title>
                <MedName>{medicationName}</MedName>

                {/* Section: Horario */}
                <Section>
                    <SectionTitle>Horario do Lembrete</SectionTitle>
                    <TimeInput
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        aria-label="Horario do lembrete"
                    />
                    <TimeHint>Formato 24h (ex: 08:00, 14:30)</TimeHint>
                </Section>

                {/* Section: Frequencia */}
                <Section>
                    <SectionTitle>Frequencia</SectionTitle>
                    <ChipGroup>
                        {FREQUENCY_OPTIONS.map((opt) => (
                            <Chip
                                key={opt.value}
                                selected={frequency === opt.value}
                                onClick={() => setFrequency(opt.value)}
                            >
                                {opt.label}
                            </Chip>
                        ))}
                    </ChipGroup>

                    {frequency === 'weekly' && (
                        <ChipGroup style={{ marginTop: '12px' }}>
                            {DAYS_OF_WEEK.map((day) => (
                                <DayChip
                                    key={day.value}
                                    selected={selectedDays.includes(day.value)}
                                    onClick={() => toggleDay(day.value)}
                                >
                                    {day.label}
                                </DayChip>
                            ))}
                        </ChipGroup>
                    )}

                    {frequency === 'interval' && (
                        <IntervalRow>
                            <IntervalLabel>A cada</IntervalLabel>
                            <IntervalInput
                                type="number"
                                min={1}
                                max={24}
                                value={intervalHours}
                                onChange={(e) => setIntervalHours(e.target.value)}
                                aria-label="Intervalo em horas"
                            />
                            <IntervalLabel>horas</IntervalLabel>
                        </IntervalRow>
                    )}
                </Section>

                {/* Section: Soneca */}
                <Section>
                    <SectionTitle>Opcoes de Soneca</SectionTitle>
                    <ToggleRow>
                        <SnoozeLabel>Permitir soneca</SnoozeLabel>
                        <ToggleSwitch>
                            <ToggleInput
                                type="checkbox"
                                checked={snoozeEnabled}
                                onChange={() => setSnoozeEnabled(!snoozeEnabled)}
                                aria-label="Permitir soneca"
                            />
                            <ToggleSlider />
                        </ToggleSwitch>
                    </ToggleRow>
                    {snoozeEnabled && (
                        <>
                            <Label>Tempo de soneca:</Label>
                            <ChipGroup>
                                {SNOOZE_OPTIONS.map((opt) => (
                                    <Chip
                                        key={opt.value}
                                        selected={snoozeDuration === opt.value}
                                        onClick={() => setSnoozeDuration(opt.value)}
                                    >
                                        {opt.label}
                                    </Chip>
                                ))}
                            </ChipGroup>
                        </>
                    )}
                </Section>

                {/* Section: Pre-visualizacao */}
                <Section>
                    <SectionTitle>Pre-visualizacao</SectionTitle>
                    <PreviewCard>
                        <PreviewHeader>Lembrete de Medicamento</PreviewHeader>
                        <PreviewMedName>{medicationName}</PreviewMedName>
                        <PreviewTimeRow>
                            <PreviewTime>{time}</PreviewTime>
                            <PreviewFrequency>{getFrequencyLabel()}</PreviewFrequency>
                        </PreviewTimeRow>
                    </PreviewCard>
                </Section>

                {/* Buttons */}
                <ButtonRow>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <PrimaryButton onClick={() => void handleSave()} disabled={loading}>
                        {loading ? 'Salvando...' : 'Salvar Lembrete'}
                    </PrimaryButton>
                    <SecondaryButton onClick={() => router.back()} disabled={loading}>
                        Cancelar
                    </SecondaryButton>
                </ButtonRow>
            </PageContainer>
        </MainLayout>
    );
}
