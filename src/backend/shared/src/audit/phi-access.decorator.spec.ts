import { PHI_ACCESS_KEY, PhiAccess, PhiAccessMetadata } from './phi-access.decorator';

// SetMetadata returns a decorator that stores metadata via Reflect.defineMetadata.
// We can verify the stored metadata by applying the decorator to a test target.
describe('PhiAccess Decorator', () => {
  it('should set PHI metadata with the given resource type', () => {
    // Apply decorator to a test class method
    class TestController {
      @PhiAccess('HealthMetric')
      testMethod() {}
    }

    const metadata: PhiAccessMetadata = Reflect.getMetadata(
      PHI_ACCESS_KEY,
      TestController.prototype.testMethod,
    );

    expect(metadata).toBeDefined();
    expect(metadata.resourceType).toBe('HealthMetric');
    expect(metadata.isPhi).toBe(true);
  });

  it('should set different resource types for different methods', () => {
    class TestController {
      @PhiAccess('Appointment')
      appointmentMethod() {}

      @PhiAccess('Medication')
      medicationMethod() {}
    }

    const appointmentMeta: PhiAccessMetadata = Reflect.getMetadata(
      PHI_ACCESS_KEY,
      TestController.prototype.appointmentMethod,
    );
    const medicationMeta: PhiAccessMetadata = Reflect.getMetadata(
      PHI_ACCESS_KEY,
      TestController.prototype.medicationMethod,
    );

    expect(appointmentMeta.resourceType).toBe('Appointment');
    expect(medicationMeta.resourceType).toBe('Medication');
  });

  it('should export PHI_ACCESS_KEY as "phi_access"', () => {
    expect(PHI_ACCESS_KEY).toBe('phi_access');
  });
});
