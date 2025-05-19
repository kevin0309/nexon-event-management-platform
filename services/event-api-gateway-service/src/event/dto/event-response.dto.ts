import { ApiProperty } from '@nestjs/swagger';

// Event Response DTOs
export class EventResponseDto {
  @ApiProperty({ example: '65f1a2b3c4d5e6f7g8h9i0j1' })
  _id: string;

  @ApiProperty({ example: '신규 유저 환영 이벤트' })
  description: string;

  @ApiProperty({ example: { level: 10, loginDays: 3 } })
  desiredCondition: Record<string, unknown>;

  @ApiProperty({ example: { itemId: 'item_001', amount: 100 } })
  reward: Record<string, unknown>;

  @ApiProperty({ example: '2025-05-20T00:00:00.000Z' })
  startDate: Date;

  @ApiProperty({ example: '2025-05-20T23:59:59.999Z' })
  endDate: Date;

  @ApiProperty({ example: true })
  isEnabled: boolean;

  @ApiProperty({ example: 'admin' })
  createdBy: string;

  @ApiProperty({ example: '2025-05-20T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-05-20T12:00:00.000Z' })
  updatedAt: Date;
}

export class EventRewardLogResponseDto {
  @ApiProperty({ example: '65f1a2b3c4d5e6f7g8h9i0j1' })
  _id: string;

  @ApiProperty({ example: 'user123' })
  userId: string;

  @ApiProperty({ example: '65f1a2b3c4d5e6f7g8h9i0j1' })
  eventId: string;

  @ApiProperty({ example: 'SUCCESS' })
  processResult: string;

  @ApiProperty({ example: null, required: false })
  rejectedReason?: string;

  @ApiProperty({ example: '2025-05-20T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-05-20T12:00:00.000Z' })
  updatedAt: Date;
} 