import { restClient } from './client';

export async function savePersonalInfo(data: {
    name: string;
    dob: string;
    gender: string;
    bloodType: string;
}): Promise<void> {
    try {
        await restClient.put('/users/me/personal-info', data);
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}

export async function addDependent(data: {
    name: string;
    cpf: string;
    dob: string;
    relationship: string;
    gender: string;
}): Promise<void> {
    try {
        await restClient.post('/users/me/dependents', data);
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}

interface Dependent {
    id: string;
    name: string;
    cpf: string;
    dob: string;
    relationship: string;
    gender: string;
}

export async function getDependents(): Promise<Dependent[]> {
    try {
        const response = await restClient.get<Dependent[]>('/users/me/dependents');
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}

export async function removeDependent(id: string): Promise<void> {
    try {
        await restClient.delete(`/users/me/dependents/${id}`);
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}

export async function saveTheme(theme: string): Promise<void> {
    try {
        await restClient.put('/users/me/preferences/theme', { theme });
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}

export async function saveLanguage(lang: string): Promise<void> {
    try {
        await restClient.put('/users/me/preferences/language', { lang });
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}

export async function saveAccessibility(prefs: {
    fontSize: string;
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
}): Promise<void> {
    try {
        await restClient.put('/users/me/preferences/accessibility', prefs);
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}

interface CepResult {
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
}

export async function lookupCep(cep: string): Promise<CepResult> {
    try {
        const response = await restClient.get<CepResult>(`https://viacep.com.br/ws/${cep}/json/`);
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}

export async function saveAddress(data: {
    label: string;
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
}): Promise<void> {
    try {
        await restClient.post('/users/me/addresses', data);
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
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

export async function getAddresses(): Promise<Address[]> {
    try {
        const response = await restClient.get<Address[]>('/users/me/addresses');
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}

export async function removeAddress(id: string): Promise<void> {
    try {
        await restClient.delete(`/users/me/addresses/${id}`);
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}

export async function submitFeedback(data: { rating: number; category: string; comment: string }): Promise<void> {
    try {
        await restClient.post('/feedback', data);
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}

interface InsuranceDoc {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: string;
}

export async function getInsuranceDocs(): Promise<InsuranceDoc[]> {
    try {
        const response = await restClient.get<InsuranceDoc[]>('/users/me/insurance/documents');
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}

export async function downloadDoc(id: string): Promise<Blob> {
    try {
        const response = await restClient.get<Blob>(`/users/me/insurance/documents/${id}/download`, {
            responseType: 'blob',
        });
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}

export async function updateDependent(
    id: string,
    data: { name?: string; dob?: string; relationship?: string; gender?: string }
): Promise<void> {
    try {
        await restClient.put(`/users/me/dependents/${id}`, data);
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}

export async function getPreferences(): Promise<{
    theme: string;
    language: string;
    accessibility: { fontSize: string; highContrast: boolean; reducedMotion: boolean; screenReader: boolean };
}> {
    try {
        const response = await restClient.get<{
            theme: string;
            language: string;
            accessibility: { fontSize: string; highContrast: boolean; reducedMotion: boolean; screenReader: boolean };
        }>('/users/me/preferences');
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}

export async function deleteInsuranceDoc(id: string): Promise<void> {
    try {
        await restClient.delete(`/users/me/insurance/documents/${id}`);
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}

export async function uploadInsuranceDoc(file: FormData): Promise<{ id: string; name: string; url: string }> {
    try {
        const response = await restClient.post<{ id: string; name: string; url: string }>(
            '/users/me/insurance/documents',
            file,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}

export async function getPrivacySettings(): Promise<{
    dataSharing: boolean;
    analyticsEnabled: boolean;
    marketingOptIn: boolean;
    lgpdConsent: boolean;
}> {
    try {
        const response = await restClient.get<{
            dataSharing: boolean;
            analyticsEnabled: boolean;
            marketingOptIn: boolean;
            lgpdConsent: boolean;
        }>('/users/me/privacy');
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}
