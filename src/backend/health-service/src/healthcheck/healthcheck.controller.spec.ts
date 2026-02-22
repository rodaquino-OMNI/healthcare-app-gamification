import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckController } from './healthcheck.controller';

describe('HealthCheckController', () => {
  let controller: HealthCheckController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthCheckController],
    }).compile();

    controller = module.get<HealthCheckController>(HealthCheckController);
  });

  describe('check', () => {
    it('should return status ok with service name', () => {
      const result = controller.check();
      expect(result.status).toBe('ok');
      expect(result.service).toBe('health-service');
      expect(result.timestamp).toBeDefined();
    });

    it('should return a numeric timestamp', () => {
      const result = controller.check();
      expect(typeof result.timestamp).toBe('number');
      expect(result.timestamp).toBeGreaterThan(0);
    });

    it('should return a new timestamp on each call', () => {
      const first = controller.check();
      const second = controller.check();
      expect(second.timestamp).toBeGreaterThanOrEqual(first.timestamp);
    });
  });

  describe('ready', () => {
    it('should return readiness with database true', () => {
      const result = controller.ready();
      expect(result.status).toBe('ok');
      expect(result.database).toBe(true);
      expect(result.service).toBe('health-service');
    });

    it('should indicate the service is ready', () => {
      const result = controller.ready();
      expect(result.status).toBe('ok');
    });
  });
});
