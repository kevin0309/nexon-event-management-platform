import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';
import { RegisterDto, LoginDto, RefreshTokenDto, TestTokenDto } from './dto/auth-request.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly authServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL');
  }

  async register(registerDto: RegisterDto) {
    try {
      const response = await axios.post(`${this.authServiceUrl}/auth/register`, registerDto);
      return response.data;
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`);
      throw new HttpException(
        error.response?.data?.message || '회원가입 처리 중 오류가 발생했습니다.',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const response = await axios.post(`${this.authServiceUrl}/auth/login`, loginDto);
      return response.data;
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      throw new HttpException(
        error.response?.data?.message || '로그인 처리 중 오류가 발생했습니다.',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const response = await axios.post(`${this.authServiceUrl}/auth/refresh-token`, refreshTokenDto);
      return response.data;
    } catch (error) {
      this.logger.error(`Token refresh failed: ${error.message}`);
      throw new HttpException(
        error.response?.data?.message || '토큰 갱신 중 오류가 발생했습니다.',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async testToken(testTokenDto: TestTokenDto) {
    try {
      const decoded = jwt.verify(
        testTokenDto.token, 
        this.configService.get<string>('JWT_SECRET'),
      ) as unknown as JwtPayload;

      return {
        id: decoded.sub,
        role: decoded.role,
      };
    } catch (error) {
      this.logger.error(`Token verification failed: ${error.message}`);
      throw new HttpException(
        '유효하지 않은 토큰입니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
} 