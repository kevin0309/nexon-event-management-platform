import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { loggerConfig } from './common/logger/logger.config';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: loggerConfig,
  });
  const configService = app.get(ConfigService);
  
  // Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Event Management Platform API Gateway')
    .setDescription('The API Gateway service for Event Management Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // CORS 설정
  app.enableCors();

  const port = configService.get<number>('API_GW_SERVER_PORT', 3000);
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap(); 