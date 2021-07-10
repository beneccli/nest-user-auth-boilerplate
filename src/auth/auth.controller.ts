import {
  Controller,
  Get,
  HttpStatus,
  Redirect,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  @Redirect('/users/me')
  async googleLoginRedirect(
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    // Retrieve user and generate jwt token
    // let user = await User.findOne({ id: userId });
    const user = { name: 'hello World' };
    const jwtSplit = this.jwtService.sign(user).split('.');

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
