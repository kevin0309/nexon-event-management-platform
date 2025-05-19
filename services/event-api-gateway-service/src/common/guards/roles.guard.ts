import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../auth/dto/auth-request.dto';

// 역할 기반 접근 제어를 위한 가드
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 컨트롤러에 정의된 @Roles() 데코레이터에서 필요한 역할 목록을 가져옴
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // 사용자 정보나 역할이 없는 경우 접근 거부
    if (!user || !user.role) {
      throw new UnauthorizedException('사용자 권한이 없습니다.');
    }

    // ADMIN은 모든 엔드포인트에 접근 가능
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // 사용자의 역할이 필요한 역할 목록에 포함되어 있는지 확인
    return requiredRoles.includes(user.role as UserRole);
  }
} 