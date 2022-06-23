import { Module } from '@nestjs/common';
import { CatsController } from './user.controller';

@Module({
  controllers: [CatsController],
})
export class UserModule {}
