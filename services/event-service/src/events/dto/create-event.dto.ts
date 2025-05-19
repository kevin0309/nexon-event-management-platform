import { IsNotEmpty, IsDate, IsObject, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsObject()
  desiredCondition: Record<string, unknown>;

  @IsNotEmpty()
  @IsObject()
  reward: Record<string, unknown>;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsNotEmpty()
  @IsString()
  createdBy: string;
} 