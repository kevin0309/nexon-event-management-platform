import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto, TestTokenDto } from './dto/auth.dto';
import { SuccessResponse, ErrorApiResponse, ApiResponseDto } from '../common/dto/api-response.dto';
import { RegisterResponseDto, LoginResponseDto, RefreshTokenResponseDto, TestTokenResponseDto } from './dto/auth-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '신규 회원 등록' })
  @SwaggerResponse({ 
    status: 201, 
    description: '회원 등록 성공',
    type: () => ApiResponseDto<RegisterResponseDto>
  })
  @SwaggerResponse({ 
    status: 400, 
    description: '잘못된 요청',
    type: () => ErrorApiResponse
  })
  async register(@Body() registerDto: RegisterDto): Promise<ApiResponseDto<RegisterResponseDto>> {
    const result = await this.authService.register(registerDto);
    return new SuccessResponse(result);
  }

  @Post('login')
  @ApiOperation({ summary: '로그인' })
  @SwaggerResponse({ 
    status: 200, 
    description: 'JWT 토큰 발급 성공',
    type: () => ApiResponseDto<LoginResponseDto>
  })
  @SwaggerResponse({ 
    status: 401, 
    description: '인증 실패',
    type: () => ErrorApiResponse
  })
  async login(@Body() loginDto: LoginDto): Promise<ApiResponseDto<LoginResponseDto>> {
    const result = await this.authService.login(loginDto);
    return new SuccessResponse(result);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'JWT 토큰 갱신' })
  @SwaggerResponse({ 
    status: 200, 
    description: '토큰 갱신 성공',
    type: () => ApiResponseDto<RefreshTokenResponseDto>
  })
  @SwaggerResponse({ 
    status: 401, 
    description: '유효하지 않은 토큰',
    type: () => ErrorApiResponse
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<ApiResponseDto<RefreshTokenResponseDto>> {
    const result = await this.authService.refreshToken(refreshTokenDto);
    return new SuccessResponse(result);
  }

  @Post('test-token')
  @ApiOperation({ summary: 'JWT 토큰 검증 및 사용자 정보 조회' })
  @SwaggerResponse({ 
    status: 200, 
    description: '토큰 검증 성공',
    type: () => ApiResponseDto<TestTokenResponseDto>
  })
  @SwaggerResponse({ 
    status: 401, 
    description: '유효하지 않은 토큰',
    type: () => ErrorApiResponse
  })
  async testToken(@Body() testTokenDto: TestTokenDto): Promise<ApiResponseDto<TestTokenResponseDto>> {
    const result = await this.authService.testToken(testTokenDto);
    return new SuccessResponse(result);
  }
} 