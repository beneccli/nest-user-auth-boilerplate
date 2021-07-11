import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import * as dotenv from 'dotenv';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { OAuthProviderService } from './services/oauth-provider.service';
import { OauthProvider } from './entities/oauth-provider.entity';

dotenv.config(); // needed to access process.env.*

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.APP_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
    TypeOrmModule.forFeature([User, OauthProvider]),
  ],
  controllers: [AuthController],
  providers: [
    UsersService,
    GoogleStrategy,
    JwtStrategy,
    AuthService,
    OAuthProviderService,
  ],
  exports: [AuthService, OAuthProviderService, JwtModule],
})
export class AuthModule {}
