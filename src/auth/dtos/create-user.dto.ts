import {
    IsString,
    MaxLength,
    MinLength,
    IsAlphanumeric,
} from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsAlphanumeric()
    @MaxLength(50)
    username: string;

    @IsString()
    @MinLength(4)
    @MaxLength(16)
    password: string;
}
