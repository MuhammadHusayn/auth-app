import { Controller, Get, UseGuards } from '@nestjs/common';
import { SessionGuard } from '../guards/session.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { UsersService } from './users.service';

@Controller('api/users')
@UseGuards(SessionGuard, AuthGuard)
export class UsersController {
    constructor(private _usersService: UsersService) {}

    @Get()
    getUsers() {
        return this._usersService.findAll();
    }
}
