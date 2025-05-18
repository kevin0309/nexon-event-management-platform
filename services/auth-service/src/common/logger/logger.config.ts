import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { ConfigService } from '@nestjs/config';

export const createLoggerConfig = (configService: ConfigService) => {
  return WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        level: configService.get<string>('LOG_LEVEL', 'info'),
        format: winston.format.combine(
          winston.format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike('AuthService', {
            prettyPrint: true,
            colors: true,
          }),
        ),
      }),
    ],
  });
}; 