import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { EventRewardLogsService } from './event-reward-logs.service';
import { RequestEventRewardDto } from './dto/request-event-reward.dto';
import { EventRewardLog } from './schemas/event-reward-log.schema';

@Controller('event-rewards')
export class EventRewardLogsController {
  constructor(private readonly eventRewardLogsService: EventRewardLogsService) {}

  @Post('/request')
  requestReward(
    @Body() requestEventRewardDto: RequestEventRewardDto,
  ): Promise<EventRewardLog> {
    return this.eventRewardLogsService.requestReward(
      requestEventRewardDto.eventId,
      requestEventRewardDto.userId,
    );
  }

  @Get('/list')
  findAll(): Promise<EventRewardLog[]> {
    return this.eventRewardLogsService.findAll();
  }

  @Get('/list/user/:userId')
  findByUser(@Param('userId') userId: string): Promise<EventRewardLog[]> {
    return this.eventRewardLogsService.findByUser(userId);
  }
} 