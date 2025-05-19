import { IsNotEmpty, IsMongoId } from 'class-validator';

export class RequestEventRewardDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsMongoId()
  eventId: string;
} 