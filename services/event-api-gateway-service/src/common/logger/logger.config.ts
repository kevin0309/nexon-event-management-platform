import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

export const loggerConfig = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike('ApiGatewayService', {
          prettyPrint: true,
          colors: true,
        }),
      ),
    }),
  ],
}); 