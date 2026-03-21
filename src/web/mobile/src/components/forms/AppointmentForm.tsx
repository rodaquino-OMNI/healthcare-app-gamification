/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { JOURNEY_COLORS } from '@shared/constants/journeys';
import { Appointment } from '@shared/types/care.types';
import React, { useState, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { z } from 'zod';

import { ROUTES } from '@constants/routes';
import { JourneyContext } from '@context/JourneyContext';
import type { CareNavigationProp } from '@navigation/types';

// Define appointment validation schema
const appointmentSchema = z.object({
    providerId: z.string().min(1, { message: 'Seleção de médico é obrigatória' }),
    dateTime: z.date({
        required_error: 'Data da consulta é obrigatória',
        invalid_type_error: 'Formato de data inválido',
    }),
    type: z.string().min(1, { message: 'Tipo de consulta é obrigatório' }),
    reason: z.string().min(1, { message: 'Motivo da consulta é obrigatório' }),
    notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

const AppointmentForm: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const { _journey } = useContext(JourneyContext);
    const navigation = useNavigation<CareNavigationProp>();

    const {
        control,
        handleSubmit,
        _setValue,
        formState: { errors },
    } = useForm<AppointmentFormData>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            providerId: '',
            dateTime: undefined,
            type: '',
            reason: '',
            notes: '',
        },
    });

    const onSubmit = async (data: AppointmentFormData): Promise<void> => {
        try {
            setIsSubmitting(true);
            setSubmitError(null);

            // Create appointment object
            const appointmentData: Partial<Appointment> = {
                providerId: data.providerId,
                dateTime: data.dateTime.toISOString(),
                type: data.type,
                reason: data.reason,
                notes: data.notes || '',
                status: 'scheduled',
            };

            // Call API to book appointment (mock implementation)
            const response = await bookAppointment(appointmentData);

            // Trigger gamification event (would be implemented in a real app)
            triggerGamificationEvent('APPOINTMENT_BOOKED', {
                appointmentType: data.type,
            });

            // Navigate to confirmation
            navigation.navigate(ROUTES.CARE_APPOINTMENTS, {
                appointmentId: response.id,
            });
        } catch (error) {
            console.error('Error booking appointment:', error);
            setSubmitError('Falha ao agendar consulta. Por favor, tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Mock implementation of appointment booking API
    const bookAppointment = async (_appointmentData: Partial<Appointment>): Promise<{ id: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ id: 'new-appointment-id' });
            }, 1000);
        });
    };

    // TODO(AUSTA-402): wire to real gamification service
    const triggerGamificationEvent = (_eventType: string, _data: any) => {
        // Placeholder for gamification event trigger
    };

    // Get care journey color
    const careColor = JOURNEY_COLORS.CARE;

    return (
        <ScrollView style={styles.container}>
            <Text style={[styles.title, { color: careColor }]}>Agendar Consulta</Text>

            {submitError && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{submitError}</Text>
                </View>
            )}

            <Controller
                control={control}
                name="providerId"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Médico</Text>
                        <View style={styles.pickerContainer}>
                            <Picker selectedValue={value} onValueChange={onChange} style={styles.picker}>
                                <Picker.Item label="Selecione um médico" value="" />
                                <Picker.Item label="Dr. Carlos Silva - Cardiologista" value="provider-1" />
                                <Picker.Item label="Dra. Ana Oliveira - Neurologista" value="provider-2" />
                                <Picker.Item label="Dr. Paulo Santos - Clínico Geral" value="provider-3" />
                            </Picker>
                        </View>
                        {errors.providerId && <Text style={styles.errorText}>{errors.providerId.message}</Text>}
                    </View>
                )}
            />

            <Controller
                control={control}
                name="dateTime"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Data e Hora</Text>
                        <TouchableOpacity style={styles.textInput} onPress={() => setShowDatePicker(true)}>
                            <Text>{value ? value.toLocaleString('pt-BR') : 'Selecione data e hora'}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={value || new Date()}
                                mode="datetime"
                                is24Hour={true}
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker(false);
                                    if (selectedDate) {
                                        onChange(selectedDate);
                                    }
                                }}
                                minimumDate={new Date()}
                            />
                        )}
                        {errors.dateTime && <Text style={styles.errorText}>{errors.dateTime.message}</Text>}
                    </View>
                )}
            />

            <Controller
                control={control}
                name="type"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Tipo de Consulta</Text>
                        <View style={styles.radioContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.radioButton,
                                    value === 'in-person' && {
                                        borderColor: careColor,
                                        backgroundColor: `${careColor}20`,
                                    },
                                ]}
                                onPress={() => onChange('in-person')}
                                accessibilityLabel="Consulta presencial"
                            >
                                <Text style={styles.radioText}>Presencial</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.radioButton,
                                    value === 'telemedicine' && {
                                        borderColor: careColor,
                                        backgroundColor: `${careColor}20`,
                                    },
                                ]}
                                onPress={() => onChange('telemedicine')}
                                accessibilityLabel="Teleconsulta"
                            >
                                <Text style={styles.radioText}>Telemedicina</Text>
                            </TouchableOpacity>
                        </View>
                        {errors.type && <Text style={styles.errorText}>{errors.type.message}</Text>}
                    </View>
                )}
            />

            <Controller
                control={control}
                name="reason"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Motivo da Consulta</Text>
                        <TextInput
                            value={value}
                            onChangeText={onChange}
                            style={[styles.textInput, styles.textArea]}
                            placeholder="Descreva brevemente o motivo da sua consulta"
                            multiline
                            accessibilityLabel="Motivo da consulta"
                        />
                        {errors.reason && <Text style={styles.errorText}>{errors.reason.message}</Text>}
                    </View>
                )}
            />

            <Controller
                control={control}
                name="notes"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Observações (Opcional)</Text>
                        <TextInput
                            value={value}
                            onChangeText={onChange}
                            style={[styles.textInput, styles.textArea]}
                            placeholder="Informações adicionais para o médico"
                            multiline
                            accessibilityLabel="Observações adicionais para o médico"
                        />
                    </View>
                )}
            />

            <View style={styles.coverageInfo}>
                <Text style={styles.coverageTitle}>Informações de Cobertura</Text>
                <Text style={styles.coverageText}>✓ Esta consulta está coberta pelo seu plano</Text>
                <Text style={styles.coverageText}>✓ Copagamento estimado: R$ 30,00</Text>
            </View>

            <View style={styles.gamificationBanner}>
                <Text style={styles.gamificationText}>🏆 Agende 3 consultas e ganhe 150 XP!</Text>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '66%', backgroundColor: careColor }]} />
                </View>
                <Text style={styles.progressText}>2/3 concluídas</Text>
            </View>

            <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: careColor }]}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                accessibilityLabel={isSubmitting ? 'Agendando consulta' : 'Agendar consulta'}
            >
                <Text style={styles.submitButtonText}>{isSubmitting ? 'Agendando...' : 'Agendar Consulta'}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '500',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    picker: {
        height: 50,
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    radioButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        flex: 1,
        marginRight: 8,
        alignItems: 'center',
    },
    radioText: {
        fontSize: 16,
    },
    errorContainer: {
        backgroundColor: '#ffecec',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    errorText: {
        color: '#ff3b30',
        fontSize: 14,
        marginTop: 4,
    },
    submitButton: {
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 30,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    coverageInfo: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 8,
        marginTop: 16,
        marginBottom: 16,
    },
    coverageTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    coverageText: {
        fontSize: 14,
        marginBottom: 4,
    },
    gamificationBanner: {
        backgroundColor: '#fff8f0',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ffebcc',
    },
    gamificationText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    progressBar: {
        height: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 4,
    },
    progressFill: {
        height: '100%',
        borderRadius: 5,
    },
    progressText: {
        fontSize: 14,
        textAlign: 'right',
    },
});

export default AppointmentForm;
