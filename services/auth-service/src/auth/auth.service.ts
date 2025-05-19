import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './schemas/user.schema';
import { ConfigService } from '@nestjs/config';

/**
 * 사용자 등록, 로그인, 토큰 관리를 담당하는 인증 서비스
 * JWT 기반 인증과 리프레시 토큰을 지원
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * 새로운 사용자 등록 (비밀번호 해시화)
   * @throws UnauthorizedException 이미 존재하는 사용자인 경우
   */
  async register(id: string, password: string, role: UserRole): Promise<User> {
    const existingUser = await this.userModel.findOne({ id }).exec();
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      id,
      password: hashedPassword,
      role,
    });

    return user.save();
  }

  /**
   * 로그인 시 사용자 인증 정보 검증
   * @throws UnauthorizedException 인증 정보가 유효하지 않은 경우
   */
  async validateUser(id: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ id }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  /**
   * 사용자 인증 및 JWT 토큰 발급
   * 액세스 토큰과 리프레시 토큰 생성
   * 리프레시 토큰은 해시화하여 데이터베이스에 저장
   */
  async login(user: User) {
    const payload = { sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION'),
    });

    // Store hashed refresh token
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userModel.findOneAndUpdate(
      { id: user.id },
      { refreshToken: hashedRefreshToken },
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: this.configService.get<string>('JWT_EXPIRATION'),
    };
  }

  /**
   * 리프레시 토큰을 사용하여 액세스 토큰 갱신
   * 리프레시 토큰 유효성 검증 후 새로운 액세스 토큰 발급
   * @throws UnauthorizedException 리프레시 토큰이 유효하지 않은 경우
   */
  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.userModel.findOne({ id: userId }).exec();
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: this.configService.get<string>('JWT_EXPIRATION'),
    };
  }
}
