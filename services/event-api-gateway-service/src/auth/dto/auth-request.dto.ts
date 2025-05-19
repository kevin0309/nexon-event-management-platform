import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsNotEmpty, IsEnum } from 'class-validator';

// 사용자 권한 레벨을 정의하는 enum
export enum UserRole {
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN',
}

// 회원가입 요청 DTO
export class RegisterDto {
  @ApiProperty({
    description: 'User ID',
    example: 'john.doe',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.USER,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}

// 로그인 요청 DTO
export class LoginDto {
  @ApiProperty({
    description: 'User ID',
    example: 'john.doe',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

// 토큰 갱신 요청 DTO
export class RefreshTokenDto {
  @ApiProperty({
    description: 'User ID for refresh token',
    example: 'john.doe',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Refresh token to renew access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

// 테스트용 토큰 검증 DTO
export class TestTokenDto {
  @ApiProperty({ description: 'JWT 토큰' })
  @IsString()
  token: string;
} 