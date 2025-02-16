import { IsEmail, IsString, IsStrongPassword, MinLength } from "class-validator";

export class RegisterUserDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;
}
