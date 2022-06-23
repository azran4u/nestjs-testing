import { MiddlewareConsumer, Module } from '@nestjs/common';
import { json } from 'express';
import { WinstonModule } from 'nest-winston';
import { AppConfigModule, AppConfigService } from './config';
import { loggerOptionsFactory } from './logger/logger';
import { UserModule } from './user/user.module';
import { UserMiddleware } from './utils/express.user.middleware';

@Module({
  imports: [
    AppConfigModule,
    WinstonModule.forRootAsync({
      useFactory: (configService: AppConfigService) => {
        return loggerOptionsFactory(configService.getConfig().logger.level);
      },
      inject: [AppConfigService],
    }),
    UserModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(json(), UserMiddleware).forRoutes('*');
  }
}
