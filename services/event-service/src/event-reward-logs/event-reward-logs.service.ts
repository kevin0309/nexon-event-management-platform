import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventRewardLog, ProcessResult } from './schemas/event-reward-log.schema';
import { EventsService } from '../events/events.service';
import { ExternalApiService } from '../common/services/external-api.service';
import { validateObjectId } from '../common/utils/mongodb.utils';
import { ConfigService } from '@nestjs/config';

interface ValidationResponse {
  isValid: boolean;
}

interface RewardResponse {
  success: boolean;
}

/**
 * Event Reward Logs Service
 * @description 이벤트 보상 요청 처리와 로깅을 담당하는 서비스
 * - 이벤트 보상 요청 처리 (조건 검증, 보상 지급)
 * - 보상 처리 결과 로깅
 * - 외부 API를 통한 조건 검증과 보상 지급 처리
 */
@Injectable()
export class EventRewardLogsService {
  private readonly logger = new Logger(EventRewardLogsService.name);
  private readonly validationUrl: string;
  private readonly rewardUrl: string;

  constructor(
    @InjectModel(EventRewardLog.name)
    private readonly eventRewardLogModel: Model<EventRewardLog>,
    private readonly eventsService: EventsService,
    private readonly externalApiService: ExternalApiService,
    private readonly configService: ConfigService,
  ) {
    this.validationUrl = this.configService.getOrThrow<string>('EVENT_VALIDATION_URL');
    this.rewardUrl = this.configService.getOrThrow<string>('EVENT_REWARD_URL');
  }

  /**
   * 이벤트 보상 요청 처리
   * @description 
   * 1. 이벤트 유효성 검사
   * 2. 외부 API를 통한 조건 검증
   * 3. 외부 API를 통한 보상 지급
   * 4. 처리 결과 로깅
   * 
   * 모든 단계에서 실패하더라도 반드시 로그를 남기도록 구현
   * @throws Error 로그 생성 실패 시
   */
  async requestReward(
    eventId: string, 
    userId: string, 
  ): Promise<EventRewardLog> {
    try {
      validateObjectId(eventId);
      
      // 1. 이벤트 유효성 검사
      const event = await this.eventsService.findOne(eventId).catch(error => {
        this.logger.error(`Failed to find event: ${error.message}`, error.stack);
        throw error;
      });

      const now = new Date();
      const isEventValid = event.isEnabled && 
        event.startDate <= now && 
        event.endDate >= now;

      if (!isEventValid) {
        return this.eventRewardLogModel.create({
          userId,
          eventId,
          processResult: ProcessResult.REJECTED,
          rejectedReason: 'Event is not valid or not active',
        });
      }

      // 2. 조건 검증 - 이벤트 달성 조건을 검증하는 책임을 처리하는 방법은 여러가지가 있을 수 있기 때문에, 본 서버에서는 해당 책임을 외부 API로 위임하는 방식으로 구현
      // ex) 게임 데이터 관리 플랫폼 API 서버에서 대신 위임받아 처리
      let validationResult: ValidationResponse;
      try {
        validationResult = await this.externalApiService.request<ValidationResponse>(
          this.validationUrl,
          {
            userId,
            condition: event.desiredCondition
          }
        );
      } catch (error) {
        this.logger.error(
          `Validation API call failed for userId: ${userId}, eventId: ${eventId}`,
          error.stack
        );
        return this.eventRewardLogModel.create({
          userId,
          eventId,
          processResult: ProcessResult.REJECTED,
          rejectedReason: 'Failed to validate event conditions',
        });
      }

      if (!validationResult?.isValid) {
        return this.eventRewardLogModel.create({
          userId,
          eventId,
          processResult: ProcessResult.REJECTED,
          rejectedReason: 'Event conditions not met',
        });
      }

      // 3. 보상 처리 - 위의 조건 검증과 동일하게 보상 지급에 대한 책임은 외부 API로 위임
      // ex) 게임 데이터 관리 플랫폼 API 서버에서 대신 위임받아 처리
      let rewardResult: RewardResponse;
      try {
        rewardResult = await this.externalApiService.request<RewardResponse>(
          this.rewardUrl,
          {
            userId,
            reward: event.reward
          }
        );
      } catch (error) {
        this.logger.error(
          `Reward API call failed for userId: ${userId}, eventId: ${eventId}`,
          error.stack
        );
        return this.eventRewardLogModel.create({
          userId,
          eventId,
          processResult: ProcessResult.REJECTED,
          rejectedReason: 'Failed to process reward',
        });
      }

      if (!rewardResult?.success) {
        return this.eventRewardLogModel.create({
          userId,
          eventId,
          processResult: ProcessResult.REJECTED,
          rejectedReason: 'Failed to process reward',
        });
      }

      // 4. 성공 로그 생성
      try {
        return await this.eventRewardLogModel.create({
          userId,
          eventId,
          processResult: ProcessResult.ACCEPTED,
        });
      } catch (error) {
        this.logger.error(
          `Failed to create reward log for userId: ${userId}, eventId: ${eventId}`,
          error.stack
        );
        throw error; // 로그 생성 실패는 치명적이므로 상위로 전파
      }
    } catch (error) {
      this.logger.error(
        `Unexpected error in requestReward for userId: ${userId}, eventId: ${eventId}`,
        error.stack
      );
      throw error; // 예상치 못한 에러는 상위로 전파
    }
  }

  /**
   * 모든 보상 로그 조회 (생성일 기준 내림차순)
   */
  async findAll(): Promise<EventRewardLog[]> {
    return this.eventRewardLogModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * 특정 사용자의 보상 로그 조회 (생성일 기준 내림차순)
   */
  async findByUser(userId: string): Promise<EventRewardLog[]> {
    return this.eventRewardLogModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }
} 