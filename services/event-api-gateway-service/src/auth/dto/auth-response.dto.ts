import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '2024-02-20T12:00:00.000Z' })
  createdAt: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refreshToken: string;

  @ApiProperty({ example: 3600 })
  expiresIn: number;
}

export class RefreshTokenResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ example: 3600 })
  expiresIn: number;
}

export class TestTokenResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'USER' })
  role: string;
} 