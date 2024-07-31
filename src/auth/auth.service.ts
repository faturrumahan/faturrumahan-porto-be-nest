import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user.password !== pass || !user) {
      return null;
    }
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    return { user: payload, token: this.jwtService.sign(payload) };
  }
}
