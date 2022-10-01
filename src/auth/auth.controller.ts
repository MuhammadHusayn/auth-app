import { IAuthenticationResponse } from '../interfaces/responses/authhentication.response';
import { SessionGuard, Session } from 'src/guards/session.guard';
import { Sessions } from './decorators/session.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';
import {
    UnauthorizedException,
    Controller,
    UseGuards,
    HttpCode,
    Headers,
    Post,
    Body,
    Get,
} from '@nestjs/common';

@Controller('api/auth')
@UseGuards(SessionGuard)
export class AuthController {
    constructor(private _authService: AuthService) {}

    @Post('getToken')
    @HttpCode(201)
    getToken(
        @Body() body: CreateUserDto,
        @Sessions() sessions: Session,
        @Headers('x-refresh-token') refreshToken: string,
    ): Promise<IAuthenticationResponse> {
        if (Object.keys(body).length) {
            return this._authService.signup(body, sessions);
        } else if (refreshToken) {
            return this._authService.refreshToken(refreshToken, sessions);
        } else {
            throw new UnauthorizedException(
                "Either 'x-refresh-token' header or body must be provided!",
            );
        }
    }

    @Get('logout')
    @HttpCode(200)
    logout(
        @Headers('x-auth-token') accessToken: string,
        @Sessions() sessions: Session,
    ) {
        if (accessToken) {
            this._authService.logout(accessToken, sessions);
            return 'Logged out!';
        } else {
            throw new UnauthorizedException(
                "'x-auth-token' header must be provided!",
            );
        }
    }
}
