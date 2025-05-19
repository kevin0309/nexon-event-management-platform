import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

export function validateObjectId(id: string): string {
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestException(`Invalid ID format: ${id}`);
  }
  return id;
} 