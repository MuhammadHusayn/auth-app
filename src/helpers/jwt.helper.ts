import { sign, verify, JwtPayload, SignOptions } from 'jsonwebtoken';
import {
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';

interface ObjectPayload {
    [key: string]: any;
}

export class JWT {
    static sign(payload: ObjectPayload, options: SignOptions): string {
        try {
            return sign(payload, process.env.JWT_SECRET as string, options);
        } catch (error) {
            throw new InternalServerErrorException('Server Error!');
        }
    }

    static verify(token: string): JwtPayload {
        try {
            return verify(
                token,
                process.env.JWT_SECRET as string,
            ) as JwtPayload;
        } catch (error) {
            throw new UnauthorizedException('Invalid Token: ' + error.message);
        }
    }
}
