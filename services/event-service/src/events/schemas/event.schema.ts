import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

/**
 * Event Schema
 * @description 이벤트 정보를 저장하는 스키마
 * - 이벤트의 기본 정보 (설명, 기간, 활성화 상태)
 * - 이벤트의 조건과 보상 정보 (MongoDB Mixed 타입으로 유연한 구조 지원)
 * - 생성자 정보 포함
 */
@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  description: string;

  /**
   * 이벤트 달성 조건
   * @description Mixed 타입으로 다양한 조건 구조 지원
   * ex) { "level": 10, "quests": ["quest1", "quest2"] }
   */
  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  desiredCondition: Record<string, unknown>;

  /**
   * 이벤트 보상 정보
   * @description Mixed 타입으로 다양한 보상 구조 지원
   * ex) { "items": [{ "id": "item1", "count": 1 }], "currency": 1000 }
   */
  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  reward: Record<string, unknown>;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true, default: true })
  isEnabled: boolean;

  @Prop({ required: true })
  createdBy: string;
}

export const EventSchema = SchemaFactory.createForClass(Event); 