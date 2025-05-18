import { ApiProperty } from '@nestjs/swagger';
import { ApiResponse } from '../interfaces/api-response.interface';

export class ErrorResponse {
  @ApiProperty({ example: 'ERR_001' })
  code: string;

  @ApiProperty({ example: '에러 메시지' })
  message: string;
}

export class ApiResponseDto<T> implements ApiResponse<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ required: false })
  data?: T;

  @ApiProperty({ required: false, type: ErrorResponse })
  error?: ErrorResponse;

  @ApiProperty({ example: '2024-02-20T12:00:00.000Z' })
  timestamp: string;

  constructor(partial: Partial<ApiResponseDto<T>>) {
    Object.assign(this, partial);
    this.timestamp = new Date().toISOString();
  }
}

export class SuccessResponse<T> extends ApiResponseDto<T> {
  constructor(data: T) {
    super({
      success: true,
      data,
    });
  }
}

export class ErrorApiResponse extends ApiResponseDto<null> {
  constructor(code: string, message: string) {
    super({
      success: false,
      error: {
        code,
        message,
      },
    });
  }
} 