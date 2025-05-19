import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../auth/dto/auth-request.dto';
 
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles); 