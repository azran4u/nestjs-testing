import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { AppConfigModule, AppConfigService } from './config';
import { Demo1Module } from './demo1/demo1.module';
import { Demo2Module } from './demo2/demo2.module';
import { loggerOptionsFactory } from './logger/logger';

@Module({
  imports: [
    AppConfigModule,
    WinstonModule.forRootAsync({
      useFactory: (configService: AppConfigService) => {
        return loggerOptionsFactory(configService.getConfig().logger.level);
      },
      inject: [AppConfigService],
    }),
    Demo1Module,
    Demo2Module,
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  // consumer.apply(json(), UserMiddleware).forRoutes('*');
  // }
}
