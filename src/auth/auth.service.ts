import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async findUserFromGoogleId(googleId: string): Promise<any> {
    const user = await this.usersService.findByProviderUserId(
      'google',
      googleId,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
