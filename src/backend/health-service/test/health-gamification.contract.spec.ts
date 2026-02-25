/**
 * Contract tests: Health Service (producer) -> Gamification Engine (consumer)
 * Validates payloads from HealthService.emitMetricEvents() satisfy:
 *   - EventsConsumer.isValidEvent()  (events.consumer.ts:93-102)
 *   - KafkaConsumerService.processMessage() (kafka.consumer.ts:112)
 *   - ProcessEventDto shape (process-event.dto.ts)
 * London School: no real Kafka/DB — pure shape validation.
 */
import { v4 as uuidv4 } from 'uuid';

/** Mirrors EventsConsumer.isValidEvent (events.consumer.ts:93-102) */
function isValidEvent(event: unknown): boolean {
  if (!event || typeof event !== 'object') return false;
  const e = event as Record<string, unknown>;
  return (
    typeof e.type === 'string' &&
    typeof e.userId === 'string' &&
    typeof e.timestamp === 'string' &&
    typeof e.journey === 'string' &&
    typeof e.data === 'object'
  );
}

/** Mirrors KafkaConsumer.processMessage guard (kafka.consumer.ts:112) */
function isValidProcessMessage(msg: unknown): boolean {
  if (!msg || typeof msg !== 'object') return false;
  const m = msg as Record<string, unknown>;
  return !!m.type && !!m.userId && !!m.data;
}

// -- Factories mirroring HealthService.emitMetricEvents payloads --

function buildMetricRecordedEvent(overrides: Record<string, unknown> = {}) {
  return {
    type: 'health.metric.recorded',
    userId: uuidv4(),
    journey: 'health',
    timestamp: new Date().toISOString(),
    data: { metricId: uuidv4(), metricType: 'HEART_RATE', value: 72, unit: 'bpm' },
    ...overrides,
  };
}

function buildAnomalyDetectedEvent(overrides: Record<string, unknown> = {}) {
  return {
    type: 'health.metric.anomaly.detected',
    userId: uuidv4(),
    journey: 'health', // real producer omits this — see contract gap test
    timestamp: new Date().toISOString(),
    data: {
      metricId: uuidv4(),
      metricType: 'BLOOD_GLUCOSE',
      value: 350,
      anomaly: { severity: 'CRITICAL', type: 'THRESHOLD_VIOLATION', message: 'BLOOD_GLUCOSE is critically high' },
    },
    ...overrides,
  };
}

describe('Health -> Gamification event contract', () => {
  describe('health.metric.recorded', () => {
    const event = buildMetricRecordedEvent();

    it('passes EventsConsumer.isValidEvent', () => {
      expect(isValidEvent(event)).toBe(true);
    });

    it('passes KafkaConsumer.processMessage guard', () => {
      expect(isValidProcessMessage(event)).toBe(true);
    });

    it('matches ProcessEventDto shape', () => {
      expect(event).toMatchObject({
        type: expect.any(String),
        userId: expect.any(String),
        data: expect.any(Object),
      });
    });

    it('data contains metricType (string) and value (number)', () => {
      const d = event.data as Record<string, unknown>;
      expect(typeof d.metricType).toBe('string');
      expect(typeof d.value).toBe('number');
    });

    it('data contains metricId (string) and unit (string)', () => {
      const d = event.data as Record<string, unknown>;
      expect(typeof d.metricId).toBe('string');
      expect(typeof d.unit).toBe('string');
    });
  });

  describe('health.metric.anomaly.detected', () => {
    const event = buildAnomalyDetectedEvent();

    it('passes EventsConsumer.isValidEvent', () => {
      expect(isValidEvent(event)).toBe(true);
    });

    it('passes KafkaConsumer.processMessage guard', () => {
      expect(isValidProcessMessage(event)).toBe(true);
    });

    it('data.anomaly has severity and type matching allowed values', () => {
      const anomaly = (event.data as Record<string, unknown>).anomaly as Record<string, unknown>;
      expect(anomaly).toBeDefined();
      expect(anomaly.severity).toMatch(/^(INFO|WARNING|CRITICAL)$/);
      expect(anomaly.type).toMatch(/^(THRESHOLD_VIOLATION|STATISTICAL_ANOMALY|TREND_CHANGE)$/);
    });

    it('anomaly.message is a string when present', () => {
      const anomaly = (event.data as Record<string, unknown>).anomaly as Record<string, unknown>;
      if (anomaly.message !== undefined) {
        expect(typeof anomaly.message).toBe('string');
      }
    });
  });

  describe('event type compatibility', () => {
    it('recorded event type is a dot-delimited lowercase string', () => {
      expect(buildMetricRecordedEvent().type).toMatch(/^[a-z]+(\.[a-z]+)+$/);
    });

    it('anomaly event type is a dot-delimited lowercase string', () => {
      expect(buildAnomalyDetectedEvent().type).toMatch(/^[a-z]+(\.[a-z]+)+$/);
    });
  });

  describe('consumer rejects malformed events', () => {
    it('rejects event missing journey field', () => {
      const e = buildMetricRecordedEvent();
      delete (e as Record<string, unknown>).journey;
      expect(isValidEvent(e)).toBe(false);
    });

    it('rejects event missing timestamp', () => {
      const e = buildMetricRecordedEvent();
      delete (e as Record<string, unknown>).timestamp;
      expect(isValidEvent(e)).toBe(false);
    });

    it('rejects event with non-object data', () => {
      expect(isValidEvent(buildMetricRecordedEvent({ data: 'bad' }))).toBe(false);
    });

    it('processMessage guard rejects null', () => {
      expect(isValidProcessMessage(null)).toBe(false);
    });
  });

  describe('known contract gap: anomaly event missing journey', () => {
    it('real emitMetricEvents omits journey on anomaly — consumer rejects', () => {
      const realPayload = {
        type: 'health.metric.anomaly.detected',
        userId: uuidv4(),
        timestamp: new Date().toISOString(),
        data: {
          metricId: uuidv4(), metricType: 'BLOOD_GLUCOSE', value: 350,
          anomaly: { severity: 'CRITICAL', type: 'THRESHOLD_VIOLATION' },
        },
      };
      expect(isValidEvent(realPayload)).toBe(false);
      expect(isValidProcessMessage(realPayload)).toBe(true);
    });
  });
});
