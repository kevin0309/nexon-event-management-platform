import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
} 