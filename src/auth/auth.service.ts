import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    const userPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.ENCRYPT_KEY || 'secret',
    ).toString(CryptoJS.enc.Utf8);

    const inputPassword = CryptoJS.AES.decrypt(
      pass,
      process.env.ENCRYPT_KEY || 'secret',
    ).toString(CryptoJS.enc.Utf8);

    console.log('user:', userPassword);
    console.log('input:', pass);

    if (userPassword !== inputPassword || !user) {
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
