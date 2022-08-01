import { Module } from '@nestjs/common';
import { UserController } from './cats.facts.controller';
import { CatsFactsService } from './cats.facts.service';

@Module({
  controllers: [UserController],
  providers: [CatsFactsService],
})
export class Demo4Module {}
