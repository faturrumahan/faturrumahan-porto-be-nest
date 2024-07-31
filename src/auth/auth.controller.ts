import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDto } from 'src/dto/signInDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: signInDto) {
    const user = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    if (!user) throw new HttpException('Invalid credentials', 401);
    return user;
  }
}
