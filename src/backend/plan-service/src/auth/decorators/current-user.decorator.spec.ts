import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

import { CurrentUser } from './current-user.decorator';

describe('CurrentUser Decorator (Plan Service)', () => {
    it('should be defined', () => {
        expect(CurrentUser).toBeDefined();
    });

    it('should create a parameter decorator', () => {
        class TestClass {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Parameter required by decorator signature
            testMethod(@CurrentUser() _user: unknown) {}
        }

        const metadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestClass, 'testMethod');
        expect(metadata).toBeDefined();
    });

    it('should support property path', () => {
        class TestClass {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Parameter required by decorator signature
            testMethod(@CurrentUser('id') _id: unknown) {}
        }

        const metadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestClass, 'testMethod');
        expect(metadata).toBeDefined();
    });
});
