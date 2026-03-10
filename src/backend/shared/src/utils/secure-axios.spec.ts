import { createSecureAxios, createInternalApiClient } from './secure-axios';

describe('Secure Axios', () => {
    describe('createSecureAxios', () => {
        it('should create an axios instance', () => {
            const instance = createSecureAxios();

            expect(instance).toBeDefined();
            expect(instance.interceptors).toBeDefined();
            expect(instance.interceptors.request).toBeDefined();
        });
    });

    describe('createInternalApiClient', () => {
        it('should create an axios instance with base URL', () => {
            const instance = createInternalApiClient('http://api.example.com');

            expect(instance.defaults.baseURL).toBe('http://api.example.com');
            expect(instance.defaults.timeout).toBe(10000);
        });

        it('should merge custom headers', () => {
            const instance = createInternalApiClient('http://api.example.com', {
                'X-Custom': 'value',
            });

            expect(instance.defaults.headers.common['X-Custom']).toBe('value');
            expect(instance.defaults.headers.common['Content-Type']).toBe('application/json');
        });
    });

    describe('SSRF protection', () => {
        it('should block requests to localhost', async () => {
            const instance = createSecureAxios();

            await expect(
                instance.get('http://localhost/secret'),
            ).rejects.toThrow('SSRF Protection');
        });

        it('should block requests to private IP 10.x.x.x', async () => {
            const instance = createSecureAxios();

            await expect(
                instance.get('http://10.0.0.1/internal'),
            ).rejects.toThrow('SSRF Protection');
        });

        it('should block requests to private IP 192.168.x.x', async () => {
            const instance = createSecureAxios();

            await expect(
                instance.get('http://192.168.1.1/admin'),
            ).rejects.toThrow('SSRF Protection');
        });

        it('should block requests to 127.0.0.1', async () => {
            const instance = createSecureAxios();

            await expect(
                instance.get('http://127.0.0.1:8080/api'),
            ).rejects.toThrow('SSRF Protection');
        });

        it('should block requests to .local domains', async () => {
            const instance = createSecureAxios();

            await expect(
                instance.get('http://server.local/api'),
            ).rejects.toThrow('SSRF Protection');
        });
    });
});
