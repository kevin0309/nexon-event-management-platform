import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { validateObjectId } from '../common/utils/mongodb.utils';

/**
 * Event Service
 * @description 이벤트의 CRUD와 상태 관리를 담당하는 서비스
 * - 이벤트 생성, 조회, 수정, 활성화 상태 관리
 * - 이벤트 유효성 검증 (활성화 상태, 기간 체크)
 */
@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const createdEvent = new this.eventModel(createEventDto);
    return createdEvent.save();
  }

  /**
   * 모든 이벤트 조회 (생성일 기준 내림차순)
   * @description 생성일 기준 최신순으로 정렬하여 반환
   */
  async findAll(): Promise<Event[]> {
    return this.eventModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * 현재 활성화된 이벤트만 조회
   * @description 현재 시간이 이벤트 기간 내에 있고, isEnabled가 true인 이벤트만 반환
   */
  async findActive(): Promise<Event[]> {
    const now = new Date();
    return this.eventModel
      .find({
        startDate: { $lte: now },
        endDate: { $gte: now },
        isEnabled: true
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * 단일 이벤트 조회
   * @throws NotFoundException 이벤트가 존재하지 않는 경우
   */
  async findOne(id: string): Promise<Event> {
    validateObjectId(id);
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }
    return event;
  }

  /**
   * 이벤트 정보 수정
   * @throws NotFoundException 이벤트가 존재하지 않는 경우
   */
  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    validateObjectId(id);
    const updatedEvent = await this.eventModel
      .findByIdAndUpdate(id, updateEventDto, { new: true })
      .exec();
    if (!updatedEvent) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }
    return updatedEvent;
  }

  /**
   * 이벤트 유효성 검증
   * @description 이벤트가 활성화 상태이고, 현재 시간이 이벤트 기간 내에 있는지 검증
   */
  async isEventValid(id: string): Promise<boolean> {
    validateObjectId(id);
    const event = await this.findOne(id);
    const now = new Date();
    return (
      event.isEnabled &&
      event.startDate <= now &&
      event.endDate >= now
    );
  }
} 