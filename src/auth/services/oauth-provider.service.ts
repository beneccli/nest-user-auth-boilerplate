import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OauthProvider } from '../entities/oauth-provider.entity';

@Injectable()
export class OAuthProviderService extends TypeOrmCrudService<OauthProvider> {
  constructor(@InjectRepository(OauthProvider) repo) {
    super(repo);
  }
}
