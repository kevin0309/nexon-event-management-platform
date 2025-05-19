import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Event } from '../../events/schemas/event.schema';

/**
 * 보상 처리 결과 상태
 * @description 보상 요청의 처리 결과를 나타내는 enum
 */
export enum ProcessResult {
  ACCEPTED = 'accepted',  // 보상 지급 성공
  REJECTED = 'rejected',  // 보상 지급 실패
}

/**
 * Event Reward Log Schema
 * @description 이벤트 보상 요청의 처리 결과를 기록하는 스키마
 * - 읽기 전용 스키마 (생성만 가능, 수정 불가)
 * - Event 스키마와의 참조 관계 포함
 */
@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class EventRewardLog extends Document {
  @Prop({ required: true })
  userId: string;

  /**
   * @description Event 스키마와의 참조 관계
   * API 응답에서는 ObjectId 문자열로만 반환
   */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event', required: true })
  eventId: Event;

  @Prop({ required: true, enum: ProcessResult })
  processResult: ProcessResult;

  /**
   * 거부 사유
   * @description 보상 지급이 거부된 경우의 사유
   * ProcessResult.REJECTED 상태일 때만 사용
   */
  @Prop()
  rejectedReason?: string;
}

export const EventRewardLogSchema = SchemaFactory.createForClass(EventRewardLog); 