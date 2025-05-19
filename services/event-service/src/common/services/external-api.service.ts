import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';

/**
 * External API Service
 * @description 외부 API 호출을 추상화한 서비스
 * - HTTP 요청 실패 시 null 반환 (에러 로깅 후)
 * - 재사용 가능한 HTTP 클라이언트 제공
 */
@Injectable()
export class ExternalApiService {
  private readonly logger = new Logger(ExternalApiService.name);

  constructor(
    private readonly httpService: HttpService,
  ) {}

  /**
   * 외부 API 호출
   * @description 
   * - POST 요청만 지원
   * - 실패 시 null 반환 (에러 로깅)
   * - 응답 데이터는 제네릭 타입으로 지정 가능
   */
  async request<T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<T | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<T>(url, data, config)
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to request external API ${url}:`, error);
      return null;
    }
  }
} 