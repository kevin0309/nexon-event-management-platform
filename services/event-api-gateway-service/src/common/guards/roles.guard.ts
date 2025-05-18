import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../auth/dto/auth.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new UnauthorizedException('사용자 권한이 없습니다.');
    }

    // ADMIN은 모든 엔드포인트에 접근 가능
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    return requiredRoles.includes(user.role as UserRole);
  }
} 