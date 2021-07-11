import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

const cookieExtractor = (req: any): string => {
  if (req) {
    const jwt: string = req.cookies.jwt; // Head + Payload
    const jwtSecure: string = req.cookies['jwt-secure']; // Signature
    if (jwt && jwtSecure) {
      return `${jwt}.${jwtSecure}`;
    }
  }
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.APP_SECRET,
    });
  }

  async validate(
    payload: any,
    done: (err: any, user: any, info?: any) => void,
  ) {
    if (!payload?.id) return done(null, false);
    const userId = payload?.id;
    const user = await this.usersService.findOne(userId);
    return done(null, user);
  }
}
