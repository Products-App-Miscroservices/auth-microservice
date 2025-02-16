import { IsEmail, IsString, IsStrongPassword, MinLength } from "class-validator";

export class LoginUserDto {

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @IsStrongPassword()
    password: string;

    @IsString()
    @MinLength(3)
    username: string;
}
