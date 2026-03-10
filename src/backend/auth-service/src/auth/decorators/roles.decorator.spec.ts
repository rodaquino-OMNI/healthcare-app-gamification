import { ROLES_KEY, Roles } from './roles.decorator';

describe('Roles Decorator', () => {
    it('should be defined', () => {
        expect(Roles).toBeDefined();
    });

    it('should export ROLES_KEY constant', () => {
        expect(ROLES_KEY).toBe('roles');
    });

    it('should set metadata with the provided roles', () => {
        @Roles('admin', 'superadmin')
        class TestClass {}

        const metadata = Reflect.getMetadata(ROLES_KEY, TestClass);
        expect(metadata).toEqual(['admin', 'superadmin']);
    });

    it('should handle single role', () => {
        @Roles('user')
        class TestClass {}

        const metadata = Reflect.getMetadata(ROLES_KEY, TestClass);
        expect(metadata).toEqual(['user']);
    });

    it('should handle empty roles', () => {
        @Roles()
        class TestClass {}

        const metadata = Reflect.getMetadata(ROLES_KEY, TestClass);
        expect(metadata).toEqual([]);
    });
});
