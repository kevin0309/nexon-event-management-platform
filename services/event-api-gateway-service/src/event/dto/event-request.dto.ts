import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsObject, IsDate, IsBoolean, IsOptional, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

// Event Request DTOs
export class CreateEventDto {
  @ApiProperty({
    description: '이벤트 설명',
    example: '신규 유저 환영 이벤트',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: '이벤트 참여 조건',
    example: { level: 10, loginDays: 3 },
  })
  @IsNotEmpty()
  @IsObject()
  desiredCondition: Record<string, unknown>;

  @ApiProperty({
    description: '이벤트 보상',
    example: { itemId: 'item_001', amount: 100 },
  })
  @IsNotEmpty()
  @IsObject()
  reward: Record<string, unknown>;

  @ApiProperty({
    description: '이벤트 시작일',
    example: '2025-05-20T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    description: '이벤트 종료일',
    example: '2025-05-20T23:59:59.999Z',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate: Date;
}

export class UpdateEventDto {
  @ApiProperty({
    description: '이벤트 설명',
    example: '신규 유저 환영 이벤트 (수정)',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: '이벤트 참여 조건',
    example: { level: 15, loginDays: 5 },
    required: false,
  })
  @IsOptional()
  @IsObject()
  desiredCondition?: Record<string, unknown>;

  @ApiProperty({
    description: '이벤트 보상',
    example: { itemId: 'item_002', amount: 200 },
    required: false,
  })
  @IsOptional()
  @IsObject()
  reward?: Record<string, unknown>;

  @ApiProperty({
    description: '이벤트 시작일',
    example: '2025-05-20T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({
    description: '이벤트 종료일',
    example: '2025-05-20T23:59:59.999Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({
    description: '이벤트 활성화 여부',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}

// Event Reward Request DTOs
export class RequestEventRewardDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 'user123',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: '이벤트 ID',
    example: '65f1a2b3c4d5e6f7g8h9i0j1',
  })
  @IsNotEmpty()
  @IsMongoId()
  eventId: string;
} 