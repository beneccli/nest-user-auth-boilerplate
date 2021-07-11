import { IsDefined, IsEmail, IsString } from 'class-validator';
import { OauthProvider } from 'src/auth/entities/oauth-provider.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsDefined({ always: true })
  @IsString({ always: true })
  @IsEmail()
  email: string;

  @Column({
    nullable: true,
    type: 'varchar',
  })
  username: string | null;

  @OneToMany(() => OauthProvider, (oauthProvider) => oauthProvider.user)
  oauthProviders: OauthProvider[];
}
