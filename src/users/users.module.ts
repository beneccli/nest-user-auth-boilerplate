import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { GoogleStrategy } from './auth/strategies/google.strategy';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import * as dotenv from 'dotenv';

dotenv.config(); // needed to access process.env.*

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.APP_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService, GoogleStrategy, JwtStrategy, AuthService],
  exports: [AuthService, JwtModule],
})
export class UsersModule {}
