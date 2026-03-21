/** Cross-Service Contract Test Utilities — London School (pure functions + mocks) */
export interface HealthEvent {
    type: string;
    userId: string;
    journey: string;
    timestamp: string;
    data: Record<string, unknown>;
}
export interface PlanEvent {
    eventType: string;
    timestamp: string;
    claim: { id: string; userId: string; planId: string; status: string; amount: number };
}
export interface JwtPayload {
    sub: string;
    email: string;
    roles: string[];
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
type VResult = { valid: boolean; errors: string[] };

function obj(v: unknown): v is Record<string, unknown> {
    return !!v && typeof v === 'object' && !Array.isArray(v);
}
function str(v: unknown): v is string {
    return typeof v === 'string' && v.length > 0;
}

export function validateHealthEvent(evt: unknown): VResult {
    if (!obj(evt)) {
        return { valid: false, errors: ['not an object'] };
    }
    const errors: string[] = [];
    if (!str(evt.type)) {
        errors.push('type must be a non-empty string');
    }
    if (typeof evt.userId !== 'string' || !UUID_RE.test(evt.userId)) {
        errors.push('userId must be a UUID');
    }
    if (!str(evt.journey)) {
        errors.push('journey must be a non-empty string');
    }
    if (typeof evt.timestamp !== 'string' || !ISO_RE.test(evt.timestamp)) {
        errors.push('timestamp must be ISO-8601');
    }
    if (!obj(evt.data)) {
        errors.push('data must be an object');
    }
    return { valid: errors.length === 0, errors };
}

export function validatePlanEvent(evt: unknown): VResult {
    if (!obj(evt)) {
        return { valid: false, errors: ['not an object'] };
    }
    const errors: string[] = [];
    if (!str(evt.eventType)) {
        errors.push('eventType must be a non-empty string');
    }
    if (typeof evt.timestamp !== 'string' || !ISO_RE.test(evt.timestamp)) {
        errors.push('timestamp must be ISO-8601');
    }
    const c = evt.claim as Record<string, unknown> | undefined;
    if (!obj(c)) {
        errors.push('claim must be an object');
    } else {
        if (!str(c.id)) {
            errors.push('claim.id must be a non-empty string');
        }
        if (typeof c.userId !== 'string' || !UUID_RE.test(c.userId)) {
            errors.push('claim.userId must be a UUID');
        }
        if (!str(c.planId)) {
            errors.push('claim.planId must be a non-empty string');
        }
        if (!str(c.status)) {
            errors.push('claim.status must be a non-empty string');
        }
        if (typeof c.amount !== 'number' || c.amount < 0) {
            errors.push('claim.amount must be non-negative');
        }
    }
    return { valid: errors.length === 0, errors };
}

export function validateJwtPayload(payload: unknown): VResult {
    if (!obj(payload)) {
        return { valid: false, errors: ['not an object'] };
    }
    const errors: string[] = [];
    if (typeof payload.sub !== 'string' || !UUID_RE.test(payload.sub)) {
        errors.push('sub must be a UUID');
    }
    if (typeof payload.email !== 'string' || !payload.email.includes('@')) {
        errors.push('email must be valid');
    }
    if (
        !Array.isArray(payload.roles) ||
        payload.roles.some((r: unknown) => typeof r !== 'string')
    ) {
        errors.push('roles must be string[]');
    }
    return { valid: errors.length === 0, errors };
}

export class MockEventBus {
    publish = jest.fn<void, [string, unknown]>();
    private handlers = new Map<string, Array<(p: unknown) => void>>();
    subscribe(topic: string, handler: (p: unknown) => void): void {
        const h = this.handlers.get(topic) ?? [];
        h.push(handler);
        this.handlers.set(topic, h);
    }
    emit(topic: string, payload: unknown): void {
        this.publish(topic, payload);
        (this.handlers.get(topic) ?? []).forEach((h) => h(payload));
    }
    reset(): void {
        this.publish.mockClear();
        this.handlers.clear();
    }
}

const DEFAULT_UUID = '550e8400-e29b-41d4-a716-446655440000';

export function createMockJwtPayload(ov: Partial<JwtPayload> = {}): JwtPayload {
    return { sub: DEFAULT_UUID, email: 'test@austa.health', roles: ['patient'], ...ov };
}
export function createMockHealthEvent(ov: Partial<HealthEvent> = {}): HealthEvent {
    return {
        type: 'HEALTH_METRIC_RECORDED',
        userId: DEFAULT_UUID,
        journey: 'health',
        timestamp: new Date().toISOString(),
        data: { metricType: 'blood_pressure', value: 120 },
        ...ov,
    };
}
export function createMockPlanEvent(ov: Partial<PlanEvent> = {}): PlanEvent {
    return {
        eventType: 'CLAIM_SUBMITTED',
        timestamp: new Date().toISOString(),
        claim: {
            id: 'claim-001',
            userId: DEFAULT_UUID,
            planId: 'plan-001',
            status: 'pending',
            amount: 150.0,
        },
        ...ov,
    };
}
describe('Cross-Service Contract Utilities', () => {
    describe('validateHealthEvent', () => {
        it('should accept a valid health event', () => {
            const r = validateHealthEvent(createMockHealthEvent());
            expect(r.valid).toBe(true);
            expect(r.errors).toHaveLength(0);
        });
        it('should reject health event with invalid userId', () => {
            const r = validateHealthEvent(createMockHealthEvent({ userId: 'not-a-uuid' }));
            expect(r.valid).toBe(false);
            expect(r.errors).toContain('userId must be a UUID');
        });
    });

    describe('validatePlanEvent', () => {
        it('should accept a valid plan event', () => {
            const r = validatePlanEvent(createMockPlanEvent());
            expect(r.valid).toBe(true);
            expect(r.errors).toHaveLength(0);
        });
        it('should reject plan event with negative amount', () => {
            const r = validatePlanEvent(
                createMockPlanEvent({
                    claim: { ...createMockPlanEvent().claim, amount: -10 },
                })
            );
            expect(r.valid).toBe(false);
            expect(r.errors).toContain('claim.amount must be non-negative');
        });
    });

    describe('validateJwtPayload', () => {
        it('should accept a valid JWT payload', () => {
            const r = validateJwtPayload(createMockJwtPayload());
            expect(r.valid).toBe(true);
            expect(r.errors).toHaveLength(0);
        });
        it('should reject JWT with invalid email', () => {
            const r = validateJwtPayload({ sub: DEFAULT_UUID, email: 'bad', roles: [] });
            expect(r.valid).toBe(false);
            expect(r.errors).toContain('email must be valid');
        });
    });

    describe('MockEventBus', () => {
        let bus: MockEventBus;
        beforeEach(() => {
            bus = new MockEventBus();
        });

        it('should deliver events to subscribers and track publish calls', () => {
            const handler = jest.fn();
            bus.subscribe('health.events', handler);
            const evt = createMockHealthEvent();
            bus.emit('health.events', evt);
            expect(bus.publish).toHaveBeenCalledWith('health.events', evt);
            expect(handler).toHaveBeenCalledWith(evt);
        });
        it('should clear handlers and spy on reset', () => {
            bus.subscribe('t', jest.fn());
            bus.emit('t', {});
            bus.reset();
            expect(bus.publish).not.toHaveBeenCalled();
        });
    });
});
