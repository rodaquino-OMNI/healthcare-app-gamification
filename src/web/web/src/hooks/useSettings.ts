import { useState, useEffect, useCallback } from 'react';

import {
    savePersonalInfo as apiSavePersonalInfo,
    addDependent as apiAddDependent,
    getDependents,
    removeDependent as apiRemoveDependent,
    saveTheme as apiSaveTheme,
    saveLanguage as apiSaveLanguage,
    saveAccessibility as apiSaveAccessibility,
    lookupCep as apiLookupCep,
    saveAddress as apiSaveAddress,
    getAddresses,
    removeAddress as apiRemoveAddress,
    submitFeedback as apiSubmitFeedback,
    getInsuranceDocs,
    downloadDoc as apiDownloadDoc,
} from '@/api/settings';

interface Dependent {
    id: string;
    name: string;
    cpf: string;
    dob: string;
    relationship: string;
    gender: string;
}

interface Address {
    id: string;
    label: string;
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
}

interface InsuranceDoc {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: string;
}

interface PersonalInfo {
    name: string;
    dob: string;
    gender: string;
    bloodType: string;
}

interface CepResult {
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
}

interface UseSettingsReturn {
    personalInfo: PersonalInfo | null;
    dependents: Dependent[];
    addresses: Address[];
    insuranceDocs: InsuranceDoc[];
    isLoading: boolean;
    error: string | null;
    savePersonalInfo: (data: PersonalInfo) => Promise<void>;
    addDependent: (data: {
        name: string;
        cpf: string;
        dob: string;
        relationship: string;
        gender: string;
    }) => Promise<void>;
    removeDependent: (id: string) => Promise<void>;
    saveTheme: (theme: string) => Promise<void>;
    saveLanguage: (lang: string) => Promise<void>;
    saveAccessibility: (prefs: {
        fontSize: string;
        highContrast: boolean;
        reducedMotion: boolean;
        screenReader: boolean;
    }) => Promise<void>;
    lookupCep: (cep: string) => Promise<CepResult>;
    saveAddress: (data: {
        label: string;
        cep: string;
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
    }) => Promise<void>;
    removeAddress: (id: string) => Promise<void>;
    submitFeedback: (data: { rating: number; category: string; comment: string }) => Promise<void>;
    downloadDoc: (id: string) => Promise<Blob>;
    refreshDependents: () => Promise<void>;
    refreshAddresses: () => Promise<void>;
    refreshDocs: () => Promise<void>;
}

/**
 * Hook that provides settings-related data and actions.
 * Wraps all settings API functions with loading/error state management
 * and provides local state for dependents, addresses, and insurance docs.
 */
export function useSettings(): UseSettingsReturn {
    const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
    const [dependents, setDependents] = useState<Dependent[]>([]);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [insuranceDocs, setInsuranceDocs] = useState<InsuranceDoc[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refreshDependents = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getDependents();
            setDependents(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar dependentes.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshAddresses = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getAddresses();
            setAddresses(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar enderecos.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshDocs = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getInsuranceDocs();
            setInsuranceDocs(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar documentos.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void refreshDependents();
        void refreshAddresses();
        void refreshDocs();
    }, [refreshDependents, refreshAddresses, refreshDocs]);

    const savePersonalInfo = async (data: PersonalInfo): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            await apiSavePersonalInfo(data);
            setPersonalInfo(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar dados pessoais.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const addDependent = async (data: {
        name: string;
        cpf: string;
        dob: string;
        relationship: string;
        gender: string;
    }): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            await apiAddDependent(data);
            await refreshDependents();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao adicionar dependente.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const removeDependent = async (id: string): Promise<void> => {
        setError(null);
        try {
            await apiRemoveDependent(id);
            setDependents((prev) => prev.filter((d) => d.id !== id));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao remover dependente.');
            throw err;
        }
    };

    const saveTheme = async (theme: string): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            await apiSaveTheme(theme);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar tema.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const saveLanguage = async (lang: string): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            await apiSaveLanguage(lang);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar idioma.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const saveAccessibility = async (prefs: {
        fontSize: string;
        highContrast: boolean;
        reducedMotion: boolean;
        screenReader: boolean;
    }): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            await apiSaveAccessibility(prefs);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar preferencias de acessibilidade.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const lookupCep = async (cep: string): Promise<CepResult> => {
        setIsLoading(true);
        setError(null);
        try {
            return await apiLookupCep(cep);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao buscar CEP.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const saveAddress = async (data: {
        label: string;
        cep: string;
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
    }): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            await apiSaveAddress(data);
            await refreshAddresses();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar endereco.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const removeAddress = async (id: string): Promise<void> => {
        setError(null);
        try {
            await apiRemoveAddress(id);
            setAddresses((prev) => prev.filter((a) => a.id !== id));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao remover endereco.');
            throw err;
        }
    };

    const submitFeedback = async (data: { rating: number; category: string; comment: string }): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            await apiSubmitFeedback(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao enviar feedback.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const downloadDoc = async (id: string): Promise<Blob> => {
        setError(null);
        try {
            return await apiDownloadDoc(id);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao baixar documento.');
            throw err;
        }
    };

    return {
        personalInfo,
        dependents,
        addresses,
        insuranceDocs,
        isLoading,
        error,
        savePersonalInfo,
        addDependent,
        removeDependent,
        saveTheme,
        saveLanguage,
        saveAccessibility,
        lookupCep,
        saveAddress,
        removeAddress,
        submitFeedback,
        downloadDoc,
        refreshDependents,
        refreshAddresses,
        refreshDocs,
    };
}
