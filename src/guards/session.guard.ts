import { CanActivate, ExecutionContext } from '@nestjs/common';

export interface Session {
    [key: string]: boolean;
}

const sessions: Session = {};

export class SessionGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        request.sessions = sessions;
        return true;
    }
}
