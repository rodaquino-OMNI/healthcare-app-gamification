/**
 * Tests for src/web/web/src/api/settings.ts
 *
 * The web settings module uses restClient (axios).
 * We mock restClient to validate endpoints, HTTP methods, and error handling.
 */

import {
    savePersonalInfo,
    addDependent,
    getDependents,
    removeDependent,
    saveTheme,
    saveLanguage,
    saveAccessibility,
    lookupCep,
    saveAddress,
    getAddresses,
    removeAddress,
    submitFeedback,
    getInsuranceDocs,
    downloadDoc,
} from '../settings';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockClient = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
};

jest.mock('../client', () => ({
    restClient: mockClient,
}));

beforeEach(() => {
    jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// savePersonalInfo
// ---------------------------------------------------------------------------

describe('savePersonalInfo', () => {
    it('should PUT /users/me/personal-info', async () => {
        mockClient.put.mockResolvedValue({});

        const data = { name: 'John', dob: '1990-01-01', gender: 'male', bloodType: 'A+' };
        await savePersonalInfo(data);

        expect(mockClient.put).toHaveBeenCalledWith('/users/me/personal-info', data);
    });

    it('should throw wrapped error on failure', async () => {
        mockClient.put.mockRejectedValue(new Error('Server error'));

        await expect(savePersonalInfo({ name: 'J', dob: '', gender: '', bloodType: '' })).rejects.toThrow(
            'Server error'
        );
    });
});

// ---------------------------------------------------------------------------
// addDependent
// ---------------------------------------------------------------------------

describe('addDependent', () => {
    it('should POST /users/me/dependents', async () => {
        mockClient.post.mockResolvedValue({});

        const data = { name: 'Jane', cpf: '123', dob: '2010-01-01', relationship: 'child', gender: 'female' };
        await addDependent(data);

        expect(mockClient.post).toHaveBeenCalledWith('/users/me/dependents', data);
    });
});

// ---------------------------------------------------------------------------
// getDependents
// ---------------------------------------------------------------------------

describe('getDependents', () => {
    it('should GET /users/me/dependents', async () => {
        const deps = [{ id: 'd1', name: 'Jane', cpf: '123' }];
        mockClient.get.mockResolvedValue({ data: deps });

        const result = await getDependents();

        expect(mockClient.get).toHaveBeenCalledWith('/users/me/dependents');
        expect(result).toEqual(deps);
    });
});

// ---------------------------------------------------------------------------
// removeDependent
// ---------------------------------------------------------------------------

describe('removeDependent', () => {
    it('should DELETE /users/me/dependents/:id', async () => {
        mockClient.delete.mockResolvedValue({});

        await removeDependent('d1');

        expect(mockClient.delete).toHaveBeenCalledWith('/users/me/dependents/d1');
    });
});

// ---------------------------------------------------------------------------
// saveTheme
// ---------------------------------------------------------------------------

describe('saveTheme', () => {
    it('should PUT /users/me/preferences/theme', async () => {
        mockClient.put.mockResolvedValue({});

        await saveTheme('dark');

        expect(mockClient.put).toHaveBeenCalledWith('/users/me/preferences/theme', { theme: 'dark' });
    });
});

// ---------------------------------------------------------------------------
// saveLanguage
// ---------------------------------------------------------------------------

describe('saveLanguage', () => {
    it('should PUT /users/me/preferences/language', async () => {
        mockClient.put.mockResolvedValue({});

        await saveLanguage('pt-BR');

        expect(mockClient.put).toHaveBeenCalledWith('/users/me/preferences/language', { lang: 'pt-BR' });
    });
});

// ---------------------------------------------------------------------------
// saveAccessibility
// ---------------------------------------------------------------------------

describe('saveAccessibility', () => {
    it('should PUT /users/me/preferences/accessibility', async () => {
        mockClient.put.mockResolvedValue({});

        const prefs = { fontSize: 'large', highContrast: true, reducedMotion: false, screenReader: false };
        await saveAccessibility(prefs);

        expect(mockClient.put).toHaveBeenCalledWith('/users/me/preferences/accessibility', prefs);
    });
});

// ---------------------------------------------------------------------------
// lookupCep
// ---------------------------------------------------------------------------

describe('lookupCep', () => {
    it('should GET viacep URL', async () => {
        const cepResult = { logradouro: 'Rua X', bairro: 'Centro', localidade: 'SP', uf: 'SP' };
        mockClient.get.mockResolvedValue({ data: cepResult });

        const result = await lookupCep('01001000');

        expect(mockClient.get).toHaveBeenCalledWith('https://viacep.com.br/ws/01001000/json/');
        expect(result).toEqual(cepResult);
    });
});

// ---------------------------------------------------------------------------
// saveAddress
// ---------------------------------------------------------------------------

describe('saveAddress', () => {
    it('should POST /users/me/addresses', async () => {
        mockClient.post.mockResolvedValue({});

        const data = {
            label: 'Home',
            cep: '01001000',
            street: 'Rua X',
            number: '100',
            neighborhood: 'Centro',
            city: 'SP',
            state: 'SP',
        };
        await saveAddress(data);

        expect(mockClient.post).toHaveBeenCalledWith('/users/me/addresses', data);
    });
});

// ---------------------------------------------------------------------------
// getAddresses
// ---------------------------------------------------------------------------

describe('getAddresses', () => {
    it('should GET /users/me/addresses', async () => {
        const addresses = [{ id: 'a1', label: 'Home' }];
        mockClient.get.mockResolvedValue({ data: addresses });

        const result = await getAddresses();

        expect(mockClient.get).toHaveBeenCalledWith('/users/me/addresses');
        expect(result).toEqual(addresses);
    });
});

// ---------------------------------------------------------------------------
// removeAddress
// ---------------------------------------------------------------------------

describe('removeAddress', () => {
    it('should DELETE /users/me/addresses/:id', async () => {
        mockClient.delete.mockResolvedValue({});

        await removeAddress('a1');

        expect(mockClient.delete).toHaveBeenCalledWith('/users/me/addresses/a1');
    });
});

// ---------------------------------------------------------------------------
// submitFeedback
// ---------------------------------------------------------------------------

describe('submitFeedback', () => {
    it('should POST /feedback', async () => {
        mockClient.post.mockResolvedValue({});

        const data = { rating: 5, category: 'bug', comment: 'Found a bug' };
        await submitFeedback(data);

        expect(mockClient.post).toHaveBeenCalledWith('/feedback', data);
    });
});

// ---------------------------------------------------------------------------
// getInsuranceDocs
// ---------------------------------------------------------------------------

describe('getInsuranceDocs', () => {
    it('should GET /users/me/insurance/documents', async () => {
        const docs = [{ id: 'doc1', name: 'Policy.pdf' }];
        mockClient.get.mockResolvedValue({ data: docs });

        const result = await getInsuranceDocs();

        expect(mockClient.get).toHaveBeenCalledWith('/users/me/insurance/documents');
        expect(result).toEqual(docs);
    });
});

// ---------------------------------------------------------------------------
// downloadDoc
// ---------------------------------------------------------------------------

describe('downloadDoc', () => {
    it('should GET /users/me/insurance/documents/:id/download as blob', async () => {
        const blob = new Blob(['pdf content']);
        mockClient.get.mockResolvedValue({ data: blob });

        const result = await downloadDoc('doc1');

        expect(mockClient.get).toHaveBeenCalledWith('/users/me/insurance/documents/doc1/download', {
            responseType: 'blob',
        });
        expect(result).toEqual(blob);
    });
});

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------

describe('error handling', () => {
    it('should wrap non-Error rejections in Error', async () => {
        mockClient.put.mockRejectedValue('raw string error');

        await expect(saveTheme('dark')).rejects.toThrow('Unexpected error');
    });

    it('should pass through Error instances', async () => {
        mockClient.get.mockRejectedValue(new Error('Network error'));

        await expect(getDependents()).rejects.toThrow('Network error');
    });
});
