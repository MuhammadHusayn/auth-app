import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private _usersRepo: Repository<User>) {}

    findAll() {
        return this._usersRepo.find();
    }

    findOne(id: number) {
        return this._usersRepo.findOne({ where: { id } });
    }

    findByName(username: string) {
        return this._usersRepo.findOne({ where: { username } });
    }

    createUser(username: string, password: string) {
        const user = this._usersRepo.create({ username, password });
        return this._usersRepo.save(user);
    }
}
