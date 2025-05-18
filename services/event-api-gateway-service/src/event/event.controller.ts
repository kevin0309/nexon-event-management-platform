import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../auth/dto/auth.dto';

@ApiTags('Event')
@Controller('event')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventController {
  @Get('test')
  @ApiBearerAuth()
  @ApiOperation({ summary: '이벤트 API 권한 테스트' })
  @Roles(UserRole.OPERATOR)
  async test() {
    return {
      message: '이벤트 API 접근이 허용된 사용자입니다.',
      timestamp: new Date().toISOString(),
    };
  }
} 