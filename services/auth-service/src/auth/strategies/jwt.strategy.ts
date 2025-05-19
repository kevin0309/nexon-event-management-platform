import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/**
 * JWT 인증 전략
 * Authorization 헤더에서 JWT 토큰을 검증
 * 토큰 페이로드에서 사용자 정보 추출
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * JWT 페이로드 검증 및 사용자 정보 반환
   * Passport가 JWT 검증 후 호출
   */
  async validate(payload: any) {
    return { userId: payload.sub, role: payload.role };
  }
}
