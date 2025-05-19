import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventRewardLog, EventRewardLogSchema } from './schemas/event-reward-log.schema';
import { EventRewardLogsService } from './event-reward-logs.service';
import { EventRewardLogsController } from './event-reward-logs.controller';
import { EventsModule } from '../events/events.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventRewardLog.name, schema: EventRewardLogSchema },
    ]),
    EventsModule,
    CommonModule,
  ],
  providers: [EventRewardLogsService],
  controllers: [EventRewardLogsController],
})
export class EventRewardLogsModule {} 