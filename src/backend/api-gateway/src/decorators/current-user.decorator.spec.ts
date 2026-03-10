import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

import { CurrentUser } from './current-user.decorator';

describe('CurrentUser Decorator (API Gateway)', () => {
    it('should be defined', () => {
        expect(CurrentUser).toBeDefined();
    });

    it('should create a parameter decorator', () => {
        // When applied to a class method, it stores metadata
        class TestClass {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            testMethod(@CurrentUser() _user: unknown) {}
        }

        const metadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestClass, 'testMethod');
        expect(metadata).toBeDefined();
    });
});
