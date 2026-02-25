import { SSL_PINS, isPinConfigured, getPinConfig, PinConfig } from '../ssl-pinning';

describe('SSL Pinning Configuration', () => {
  it('should have pin configuration for api.austa.com.br', () => {
    expect(SSL_PINS['api.austa.com.br']).toBeDefined();
    expect(SSL_PINS['api.austa.com.br'].pins).toHaveLength(2);
    expect(SSL_PINS['api.austa.com.br'].includeSubdomains).toBe(true);
  });

  it('should have primary and backup pins for each domain', () => {
    for (const [domain, config] of Object.entries(SSL_PINS)) {
      expect(config.pins).toHaveLength(2);
      expect(config.pins[0]).toMatch(/^sha256\//);
      expect(config.pins[1]).toMatch(/^sha256\//);
    }
  });

  it('isPinConfigured returns true for configured domains', () => {
    expect(isPinConfigured('api.austa.com.br')).toBe(true);
    expect(isPinConfigured('auth.austa.com.br')).toBe(true);
  });

  it('isPinConfigured returns false for unknown domains', () => {
    expect(isPinConfigured('evil.com')).toBe(false);
    expect(isPinConfigured('google.com')).toBe(false);
  });

  it('getPinConfig returns config for direct hostname match', () => {
    const config = getPinConfig('api.austa.com.br');
    expect(config).toBeDefined();
    expect(config!.pins).toHaveLength(2);
  });

  it('getPinConfig returns config for subdomain when includeSubdomains is true', () => {
    const config = getPinConfig('v2.api.austa.com.br');
    expect(config).toBeDefined();
    expect(config!.includeSubdomains).toBe(true);
  });

  it('getPinConfig returns undefined for unknown domains', () => {
    const config = getPinConfig('unknown.example.com');
    expect(config).toBeUndefined();
  });
});
