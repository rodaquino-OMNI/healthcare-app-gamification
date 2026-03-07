/* eslint-disable @typescript-eslint/no-unsafe-return */
import { restClient } from './client';

export async function savePersonalInfo(data: {
    name: string;
    dob: string;
    gender: string;
    bloodType: string;
}): Promise<void> {
    try {
        const response = await restClient.put('/users/me/personal-info', data);
        return response.data;
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
        const response = await restClient.post('/users/me/dependents', data);
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}

export async function getDependents(): Promise<
    Array<{
        id: string;
        name: string;
        cpf: string;
        dob: string;
        relationship: string;
        gender: string;
    }>
> {
    try {
        const response = await restClient.get('/users/me/dependents');
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}

export async function removeDependent(id: string): Promise<void> {
    try {
        const response = await restClient.delete(`/users/me/dependents/${id}`);
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}

export async function saveTheme(theme: string): Promise<void> {
    try {
        const response = await restClient.put('/users/me/preferences/theme', { theme });
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}

export async function saveLanguage(lang: string): Promise<void> {
    try {
        const response = await restClient.put('/users/me/preferences/language', { lang });
        return response.data;
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
        const response = await restClient.put('/users/me/preferences/accessibility', prefs);
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}

export async function lookupCep(cep: string): Promise<{
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
}> {
    try {
        const response = await restClient.get(`https://viacep.com.br/ws/${cep}/json/`);
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
        const response = await restClient.post('/users/me/addresses', data);
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}

export async function getAddresses(): Promise<
    Array<{
        id: string;
        label: string;
        cep: string;
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
    }>
> {
    try {
        const response = await restClient.get('/users/me/addresses');
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}

export async function removeAddress(id: string): Promise<void> {
    try {
        const response = await restClient.delete(`/users/me/addresses/${id}`);
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}

// eslint-disable-next-line max-len
export async function submitFeedback(data: { rating: number; category: string; comment: string }): Promise<void> {
    try {
        const response = await restClient.post('/feedback', data);
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}

export async function getInsuranceDocs(): Promise<
    Array<{
        id: string;
        name: string;
        type: string;
        url: string;
        uploadedAt: string;
    }>
> {
    try {
        const response = await restClient.get('/users/me/insurance/documents');
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}

export async function downloadDoc(id: string): Promise<Blob> {
    try {
        // eslint-disable-next-line max-len
        const response = await restClient.get(`/users/me/insurance/documents/${id}/download`, { responseType: 'blob' });
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Unexpected error');
    }
}
