import { IAuthenticationResponse } from 'src/interfaces/responses/authhentication.response';
import { IUserPayload } from 'src/interfaces/payloads/user.payload';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { Session } from '../guards/session.guard';
import { JWT } from '../helpers/jwt.helper';
import { addSeconds } from 'date-fns';
import {
    ConflictException,
    NotFoundException,
    Injectable,
} from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(private _usersService: UsersService) {}

    async signup(body: CreateUserDto, sessions: Session) {
        const isUserExists = await this._usersService.findByName(body.username);
        if (isUserExists) {
            throw new ConflictException('User Already Exists!');
        }

        const user = await this._usersService.createUser(
            body.username,
            body.password,
        );

        const response = this.createToken(user);

        sessions[user.id] = true

        return response;
    }

    createToken(user: User): IAuthenticationResponse {
        const accessToken = JWT.sign(
            { id: user.id, username: user.username },
            {
                expiresIn: parseInt(
                    process.env.ACCESS_TOKEN_EXPIRATION as string,
                ),
            },
        );

        const refreshToken = JWT.sign(
            { id: user.id, username: user.username },
            {
                expiresIn: parseInt(
                    process.env.REFRESH_TOKEN_EXPIRATION as string,
                ),
            },
        );

        return {
            token: accessToken,
            refreshToken: refreshToken,
            expiresAt: addSeconds(
                new Date(),
                parseInt(process.env.ACCESS_TOKEN_EXPIRATION as string),
            ),
        };
    }

    async refreshToken(refreshToken: string, sessions: Session) {
        const payload = JWT.verify(refreshToken) as IUserPayload;
        const user = await this._usersService.findOne(payload.id);

        if (!user) {
            throw new NotFoundException('User Not Found!');
        }

        const response = this.createToken(user);

        sessions[user.id] = true

        return response;
    }

    logout(accessToken: string, sessions: Session): void {
        const payload = JWT.verify(accessToken) as IUserPayload;

        sessions[payload.id] = false;
    }
}
