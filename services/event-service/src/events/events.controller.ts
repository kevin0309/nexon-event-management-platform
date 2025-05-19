import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './schemas/event.schema';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('/create')
  create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventsService.create(createEventDto);
  }

  @Get('/list/all')
  findAll(): Promise<Event[]> {
    return this.eventsService.findAll();
  }

  @Get('/list/active')
  findActive(): Promise<Event[]> {
    return this.eventsService.findActive();
  }

  @Get('/detail/:id')
  findOne(@Param('id') id: string): Promise<Event> {
    return this.eventsService.findOne(id);
  }

  @Post('/update/:id')
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    return this.eventsService.update(id, updateEventDto);
  }
} 