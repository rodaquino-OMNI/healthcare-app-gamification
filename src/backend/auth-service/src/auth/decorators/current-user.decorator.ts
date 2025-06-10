import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

type ContextType = 'http' | 'graphql' | 'rpc' | 'ws';

/**
 * Extracts the current authenticated user from the request
 * Works with both RESTful and GraphQL requests
 */
export const CurrentUser = createParamDecorator(
  (data: string | symbol | undefined, context: ExecutionContext) => {
    // Check if this is a GraphQL context
    if (context.getType<ContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      return data ? ctx.getContext().req.user?.[data] : ctx.getContext().req.user;
    }
    
    // HTTP context
    const request = context.switchToHttp().getRequest();
    return data ? request.user?.[data] : request.user;
  },
);