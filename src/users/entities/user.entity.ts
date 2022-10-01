import { PrimaryGeneratedColumn, Column, Entity, BeforeInsert } from 'typeorm';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @BeforeInsert()
    async hashAndSaltPassword() {
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(this.password, salt, 32)) as Buffer;
        this.password = salt + '.' + hash.toString('hex');
    }
}
