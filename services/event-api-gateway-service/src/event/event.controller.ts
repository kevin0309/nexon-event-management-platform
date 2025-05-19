import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse as SwaggerResponse, ApiSecurity, ApiExtraModels } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserAccessGuard } from '../common/guards/user-access.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../auth/dto/auth-request.dto';
import { EventService } from './event.service';
import { CreateEventDto, UpdateEventDto, RequestEventRewardDto } from './dto/event-request.dto';
import { EventResponseDto, EventRewardLogResponseDto } from './dto/event-response.dto';
import { SuccessResponse, ApiResponseDto } from '../common/dto/api-response.dto';

// 내부적으로 사용할 DTO 타입 정의
interface CreateEventWithCreatorDto extends CreateEventDto {
  createdBy: string;
}

@ApiTags('Event')
@Controller('event')
@UseGuards(JwtAuthGuard, RolesGuard)  // JWT 인증과 역할 기반 접근 제어 적용
@ApiBearerAuth()
@ApiSecurity('bearer')
@ApiExtraModels(EventResponseDto, EventRewardLogResponseDto, ApiResponseDto)
/**
 * 이벤트 관리 API
 * 
 * 모든 API는 Bearer 토큰 인증이 필요합니다.
 * 각 API는 사용자의 역할(Role)에 따라 접근이 제한됩니다:
 * 
 * - OPERATOR: 이벤트 생성, 조회, 수정 권한
 * - USER: 보상 요청 권한
 * - AUDITOR: 보상 이력 조회 권한
 * - ADMIN: 모든 API 접근 권한
 * 
 * 인증 토큰은 로그인 API(/auth/login)를 통해 발급받을 수 있습니다.
 * 토큰은 Authorization 헤더에 'Bearer {token}' 형식으로 포함해야 합니다.
 */
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // Event APIs
  @Post('create')
  @Roles(UserRole.OPERATOR)
  @ApiOperation({ summary: '이벤트 생성' })
  @SwaggerResponse({
    status: 201,
    description: '이벤트가 성공적으로 생성되었습니다.',
    type: () => ApiResponseDto<EventResponseDto>
  })
  async createEvent(@Request() req, @Body() createEventDto: CreateEventDto): Promise<ApiResponseDto<EventResponseDto>> {
    const eventWithCreator: CreateEventWithCreatorDto = {
      ...createEventDto,
      createdBy: req.user.id.toString(),
    };
    const event = await this.eventService.createEvent(eventWithCreator);
    return new SuccessResponse(event);
  }

  @Get('list/all')
  @Roles(UserRole.OPERATOR)
  @ApiOperation({ summary: '모든 이벤트 조회' })
  @SwaggerResponse({
    status: 200,
    description: '모든 이벤트 목록을 반환합니다.',
    type: () => ApiResponseDto<EventResponseDto[]>
  })
  async findAllEvents(): Promise<ApiResponseDto<EventResponseDto[]>> {
    const events = await this.eventService.findAllEvents();
    return new SuccessResponse(events);
  }

  @Get('list/active')
  @Roles(UserRole.OPERATOR)
  @ApiOperation({ summary: '활성 이벤트 조회' })
  @SwaggerResponse({
    status: 200,
    description: '현재 활성화된 이벤트 목록을 반환합니다. 현재 활성화된 이벤트는 enabled 필드와 현재 시간과 이벤트 시작/종료 시간을 기준으로 판단합니다.',
    type: () => ApiResponseDto<EventResponseDto[]>
  })
  async findActiveEvents(): Promise<ApiResponseDto<EventResponseDto[]>> {
    const events = await this.eventService.findActiveEvents();
    return new SuccessResponse(events);
  }

  @Get('detail/:id')
  @Roles(UserRole.OPERATOR)
  @ApiOperation({ summary: '이벤트 상세 조회' })
  @SwaggerResponse({
    status: 200,
    description: '특정 이벤트의 상세 정보를 반환합니다.',
    type: () => ApiResponseDto<EventResponseDto>
  })
  async findEventById(@Param('id') id: string): Promise<ApiResponseDto<EventResponseDto>> {
    const event = await this.eventService.findEventById(id);
    return new SuccessResponse(event);
  }

  @Post('update/:id')
  @Roles(UserRole.OPERATOR)
  @ApiOperation({ summary: '이벤트 수정' })
  @SwaggerResponse({
    status: 200,
    description: '이벤트가 성공적으로 수정되었습니다.',
    type: () => ApiResponseDto<EventResponseDto>
  })
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<ApiResponseDto<EventResponseDto>> {
    const event = await this.eventService.updateEvent(id, updateEventDto);
    return new SuccessResponse(event);
  }

  // Event Reward APIs
  @Post('reward/request')
  @Roles(UserRole.USER)
  @ApiOperation({ summary: '이벤트 보상 요청' })
  @SwaggerResponse({
    status: 201,
    description: '이벤트 보상 요청이 성공적으로 처리되었습니다.',
    type: () => ApiResponseDto<EventRewardLogResponseDto>
  })
  async requestEventReward(@Body() requestEventRewardDto: RequestEventRewardDto): Promise<ApiResponseDto<EventRewardLogResponseDto>> {
    const rewardLog = await this.eventService.requestEventReward(requestEventRewardDto);
    return new SuccessResponse(rewardLog);
  }

  @Get('reward/list')
  @Roles(UserRole.AUDITOR)
  @ApiOperation({ summary: '모든 이벤트 보상 로그 조회' })
  @SwaggerResponse({
    status: 200,
    description: '모든 이벤트 보상 로그 목록을 반환합니다.',
    type: () => ApiResponseDto<EventRewardLogResponseDto[]>
  })
  async findAllEventRewardLogs(): Promise<ApiResponseDto<EventRewardLogResponseDto[]>> {
    const rewardLogs = await this.eventService.findAllEventRewardLogs();
    return new SuccessResponse(rewardLogs);
  }

  @Get('reward/list/user/:userId')
  @Roles(UserRole.AUDITOR, UserRole.USER)
  @UseGuards(JwtAuthGuard, RolesGuard, UserAccessGuard)
  @ApiOperation({ summary: '사용자별 이벤트 보상 로그 조회' })
  @SwaggerResponse({
    status: 200,
    description: '특정 사용자의 이벤트 보상 로그 목록을 반환합니다. 일반 사용자는 자신의 데이터만 조회 가능합니다.',
    type: () => ApiResponseDto<EventRewardLogResponseDto[]>
  })
  async findEventRewardLogsByUser(@Param('userId') userId: string): Promise<ApiResponseDto<EventRewardLogResponseDto[]>> {
    const rewardLogs = await this.eventService.findEventRewardLogsByUser(userId);
    return new SuccessResponse(rewardLogs);
  }
} 