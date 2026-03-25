import { useState, useCallback } from 'react';

import { restClient } from '@/api/client';

export interface Symptom {
    id: string;
    name: string;
    severity: string;
    bodyArea: string;
    duration: string;
}

export interface SymptomCheckResult {
    id: string;
    condition: string;
    probability: number;
    severity: string;
    recommendation: string;
}

/** Shape returned by the useSymptomChecker hook */
export interface UseSymptomCheckerReturn {
    symptoms: Symptom[];
    results: SymptomCheckResult[];
    currentStep: number;
    isLoading: boolean;
    error: Error | null;
    addSymptom: (symptom: Omit<Symptom, 'id'>) => void;
    removeSymptom: (id: string) => void;
    submitSymptoms: () => Promise<void>;
    getRecommendations: () => Promise<void>;
    setCurrentStep: (step: number) => void;
    resetFlow: () => void;
}

/**
 * Hook for managing the symptom checker flow state
 * across the 27 symptom-checker pages in the Care Now journey.
 */
export const useSymptomChecker = (): UseSymptomCheckerReturn => {
    const [symptoms, setSymptoms] = useState<Symptom[]>([]);
    const [results, setResults] = useState<SymptomCheckResult[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const addSymptom = useCallback((symptom: Omit<Symptom, 'id'>): void => {
        const newSymptom: Symptom = {
            ...symptom,
            id: `symptom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        };
        setSymptoms((prev) => [...prev, newSymptom]);
    }, []);

    const removeSymptom = useCallback((id: string): void => {
        setSymptoms((prev) => prev.filter((s) => s.id !== id));
    }, []);

    const submitSymptoms = useCallback(async (): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);
            const payload = symptoms.map((s) => s.name);
            await restClient.post('/api/care/symptom-checker/submit', { symptoms: payload });
        } catch (err: unknown) {
            setError(err instanceof Error ? err : new Error('Erro ao enviar sintomas.'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [symptoms]);

    const getRecommendations = useCallback(async (): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await restClient.get<SymptomCheckResult[]>('/api/care/symptom-checker/recommendations');
            setResults(response.data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err : new Error('Erro ao obter recomendações.'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const resetFlow = (): void => {
        setSymptoms([]);
        setResults([]);
        setCurrentStep(0);
    };

    return {
        symptoms,
        results,
        currentStep,
        isLoading,
        error,
        addSymptom,
        removeSymptom,
        submitSymptoms,
        getRecommendations,
        setCurrentStep,
        resetFlow,
    };
};
