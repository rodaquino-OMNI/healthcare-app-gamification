import { useState } from 'react';

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
    const [isLoading] = useState(false);
    const [error] = useState<Error | null>(null);

    const addSymptom = (_symptom: Omit<Symptom, 'id'>): void => {};
    const removeSymptom = (_id: string): void => {};
    const submitSymptoms = async (): Promise<void> => {};
    const getRecommendations = async (): Promise<void> => {};

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
