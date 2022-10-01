import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Sessions = createParamDecorator(
    (data: never, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        return request.sessions;
    },
);
