import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { OauthProviderId } from './models/auth-enums.model';
import { User } from 'src/users/entities/user.entity';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  @Redirect('/me')
  async googleLoginRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    if (!req.user) {
      throw new BadRequestException('Unable to find user data in the request.');
    }

    const user: User = await this.authService.validateUser(
      OauthProviderId.GOOGLE,
      (<any>req).user.user.id,
      (<any>req).user.user.email,
    );

    this.authService.generateUserSession(response, user);
  }
}
