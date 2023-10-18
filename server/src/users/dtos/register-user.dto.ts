import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class RegisterUserDTO {
  // REQUIRED:

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  // OPTIONAL STUFF

  @IsString()
  @IsOptional()
  profile_picture: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  phone_number: string;
}
