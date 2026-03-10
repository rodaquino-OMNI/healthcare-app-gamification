import { Roles } from './roles.decorator';

describe('Roles Decorator (Plan Service)', () => {
    it('should be defined', () => {
        expect(Roles).toBeDefined();
    });

    it('should set metadata with provided roles', () => {
        @Roles('admin', 'manager')
        class TestClass {}

        const metadata = Reflect.getMetadata('roles', TestClass);
        expect(metadata).toEqual(['admin', 'manager']);
    });

    it('should handle single role', () => {
        @Roles('user')
        class TestClass {}

        const metadata = Reflect.getMetadata('roles', TestClass);
        expect(metadata).toEqual(['user']);
    });
});
