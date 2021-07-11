import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { OauthProvider } from './entities/oauth-provider.entity';
import { OauthProviderId } from './models/auth-enums.model';
import { OAuthProviderService } from './services/oauth-provider.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly oauthProviderService: OAuthProviderService,
    @InjectRepository(OauthProvider)
    private oauthProviderRepository: Repository<OauthProvider>,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    oauthProvider: OauthProviderId,
    oauthProviderUserId: string,
    providerUserEmail: string,
  ): Promise<User> {
    const oauthProviderUser: OauthProvider =
      // Already existing user, load it
      (await this.oauthProviderService.findOne({
        oauthProvider,
        oauthProviderUserId,
      })) ||
      // New user, create it
      (await this.oauthProviderRepository.save({
        oauthProvider,
        oauthProviderUserId,
        user: {
          email: providerUserEmail,
        },
      }));

    if (!oauthProviderUser?.user) {
      throw new InternalServerErrorException(
        'Unable to load or create user and its associated oauth profile.',
      );
    }

    const user: User = oauthProviderUser.user;

    return user;
  }

  generateUserSession(response: Response, user: User) {
    const jwtPayload: any = { id: user.id };
    const jwtSplit = this.jwtService.sign(jwtPayload).split('.');

    response.cookie('jwt', `${jwtSplit[0]}.${jwtSplit[1]}`, {
      domain: process.env.DOMAIN,
    });

    response.cookie('jwt-secure', jwtSplit[2], {
      httpOnly: true,
      secure: false,
      domain: process.env.DOMAIN,
      /* prod: secure: true, maxAge: 10000000000, signed: true */
    });
  }
}
