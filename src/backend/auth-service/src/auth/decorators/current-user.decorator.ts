import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

type ContextType = 'http' | 'graphql' | 'rpc' | 'ws';

interface RequestWithUser {
    user: Record<string, unknown>;
}

interface GqlContext {
    req: RequestWithUser;
}

/**
 * Extracts the current authenticated user from the request
 * Works with both RESTful and GraphQL requests
 */
export const CurrentUser = createParamDecorator(
    (data: string | symbol | undefined, context: ExecutionContext): unknown => {
        // Check if this is a GraphQL context
        if (context.getType<ContextType>() === 'graphql') {
            const ctx = GqlExecutionContext.create(context);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- GqlExecutionContext.getContext() returns any
            const gqlCtx: GqlContext = ctx.getContext();
            const key = data as string | undefined;
            return key ? gqlCtx.req.user?.[key] : gqlCtx.req.user;
        }

        // HTTP context
        const request = context.switchToHttp().getRequest<RequestWithUser>();
        const key = data as string | undefined;
        return key ? request.user?.[key] : request.user;
    }
);
