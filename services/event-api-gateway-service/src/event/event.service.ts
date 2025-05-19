import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CreateEventDto, UpdateEventDto, RequestEventRewardDto } from './dto/event-request.dto';
import { EventResponseDto, EventRewardLogResponseDto } from './dto/event-response.dto';

// 내부적으로 사용할 DTO 타입 정의
interface CreateEventWithCreatorDto extends CreateEventDto {
  createdBy: string;
}

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);
  private readonly eventServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.eventServiceUrl = this.configService.get<string>('EVENT_SERVICE_URL');
    if (!this.eventServiceUrl) {
      throw new Error('EVENT_SERVICE_URL is not defined in environment variables');
    }
  }

  // Event APIs
  async createEvent(createEventDto: CreateEventWithCreatorDto): Promise<EventResponseDto> {
    try {
      const response = await axios.post<EventResponseDto>(
        `${this.eventServiceUrl}/events/create`,
        createEventDto,
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to create event: ${error.message}`);
      throw new HttpException(
        '이벤트 생성에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllEvents(): Promise<EventResponseDto[]> {
    try {
      const response = await axios.get<EventResponseDto[]>(
        `${this.eventServiceUrl}/events/list/all`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get all events: ${error.message}`);
      throw new HttpException(
        '이벤트 목록 조회에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findActiveEvents(): Promise<EventResponseDto[]> {
    try {
      const response = await axios.get<EventResponseDto[]>(
        `${this.eventServiceUrl}/events/list/active`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get active events: ${error.message}`);
      throw new HttpException(
        '활성 이벤트 목록 조회에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findEventById(id: string): Promise<EventResponseDto> {
    try {
      const response = await axios.get<EventResponseDto>(
        `${this.eventServiceUrl}/events/detail/${id}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get event by id: ${error.message}`);
      if (error.response?.status === 404) {
        throw new HttpException(
          '존재하지 않는 이벤트입니다.',
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        '이벤트 조회에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateEvent(id: string, updateEventDto: UpdateEventDto): Promise<EventResponseDto> {
    try {
      const response = await axios.post<EventResponseDto>(
        `${this.eventServiceUrl}/events/update/${id}`,
        updateEventDto,
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to update event: ${error.message}`);
      if (error.response?.status === 404) {
        throw new HttpException(
          '존재하지 않는 이벤트입니다.',
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        '이벤트 수정에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Event Reward APIs
  async requestEventReward(requestEventRewardDto: RequestEventRewardDto): Promise<EventRewardLogResponseDto> {
    try {
      const response = await axios.post<EventRewardLogResponseDto>(
        `${this.eventServiceUrl}/event-rewards/request`,
        requestEventRewardDto,
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to request event reward: ${error.message}`);
      throw new HttpException(
        '이벤트 보상 요청에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllEventRewardLogs(): Promise<EventRewardLogResponseDto[]> {
    try {
      const response = await axios.get<EventRewardLogResponseDto[]>(
        `${this.eventServiceUrl}/event-rewards/list`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get all event reward logs: ${error.message}`);
      throw new HttpException(
        '이벤트 보상 로그 목록 조회에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findEventRewardLogsByUser(userId: string): Promise<EventRewardLogResponseDto[]> {
    try {
      const response = await axios.get<EventRewardLogResponseDto[]>(
        `${this.eventServiceUrl}/event-rewards/list/user/${userId}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get event reward logs by user: ${error.message}`);
      throw new HttpException(
        '사용자의 이벤트 보상 로그 조회에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 