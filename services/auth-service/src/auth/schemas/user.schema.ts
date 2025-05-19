import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * 역할 기반 접근 제어(RBAC)를 위한 사용자 역할 정의
 * - USER: 보상 요청 가능
 * - OPERATOR: 이벤트/보상 등록
 * - AUDITOR: 보상 이력 조회만 가능
 * - ADMIN: 시스템 전체 접근 권한
 */
export enum UserRole {
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN',
}

/**
 * 사용자 인증 및 권한 관리를 위한 스키마
 */
@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  id: string;

  /**
   * bcrypt로 해시화된 비밀번호 (salt rounds: 10)
   * 원본 비밀번호는 저장하지 않음
   */
  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
