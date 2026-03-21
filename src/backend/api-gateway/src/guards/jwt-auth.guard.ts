import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    getRequest(context: ExecutionContext): unknown {
        const ctx = GqlExecutionContext.create(context);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- GqlExecutionContext.getContext() returns any
        const request: unknown = ctx.getContext().req;
        return request;
    }
}
