import { IsString, IsEmail, MinLength } from 'class-validator';

export class signInDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
