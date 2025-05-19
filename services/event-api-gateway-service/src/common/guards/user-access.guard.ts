import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class UserAccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const paramUserId = request.params.userId;

    // ADMIN은 모든 접근 허용
    if (user.role === 'ADMIN') {
      return true;
    }

    // 일반 사용자는 자신의 데이터만 접근 가능
    return user.id.toString() === paramUserId;
  }
} 