import { IsDefined, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OauthProviderId } from '../models/auth-enums.model';

@Entity()
export class OauthProvider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: OauthProviderId,
  })
  @IsDefined({ always: true })
  oauthProvider: number;

  @Column()
  @IsDefined({ always: true })
  @IsString({ always: true })
  oauthProviderUserId: string;

  @ManyToOne(() => User, (user) => user.oauthProviders, {
    eager: true,
    cascade: true,
  })
  user: User;
}
