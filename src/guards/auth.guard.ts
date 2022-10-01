import { IUserPayload } from '../interfaces/payloads/user.payload';
import { JWT } from 'src/helpers/jwt.helper';
import {
    UnauthorizedException,
    ExecutionContext,
    CanActivate,
} from '@nestjs/common';

export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        const sessions = request.sessions;

        const accessToken = request.headers['x-auth-token'];

        if (!accessToken) {
            throw new UnauthorizedException('Token Not Provided!');
        }

        const payload = JWT.verify(accessToken) as IUserPayload;

        if (!sessions[payload.id]) {
            throw new UnauthorizedException('Token Expired!');
        }

        return true;
    }
}
