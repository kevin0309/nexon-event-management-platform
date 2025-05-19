import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Logger } from '@nestjs/common';

/**
 * 처리되지 않은 모든 예외를 처리하는 전역 예외 필터
 * 일관된 에러 응답 형식 제공
 * 디버깅을 위한 스택 트레이스 로깅
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  /**
   * 모든 예외를 처리하고 포맷된 에러 응답 반환
   * HTTP 예외가 아닌 경우 스택 트레이스를 포함한 상세 로그 기록
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    };

    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : null,
      'AllExceptionsFilter',
    );

    response.status(status).json(errorResponse);
  }
} 