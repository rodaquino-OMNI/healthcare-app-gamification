import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

interface GqlContext {
    req: {
        user: unknown;
    };
}

export const CurrentUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext): unknown => {
        const ctx = GqlExecutionContext.create(context);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- GqlExecutionContext.getContext() returns any
        const gqlContext: GqlContext = ctx.getContext();
        return gqlContext.req.user;
    }
);
