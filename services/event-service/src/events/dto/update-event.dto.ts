import { IsOptional, IsDate, IsObject, IsBoolean, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  desiredCondition?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  reward?: Record<string, unknown>;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
} 