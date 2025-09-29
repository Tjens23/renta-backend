import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords } from 'src/Utils/auth';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    await comparePasswords(pass, user.password).catch(() => {
      throw new UnauthorizedException('Invalid credentials');
    });

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async registerUser(
    username: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<{
    id: number;
    username: string;
    firstName: string;
    lastName: string;
  }> {
    const user = await this.usersService.createUser({
      username,
      password,
      firstName,
      lastName,
    });
    return {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
