import { Controller, Get } from '@nestjs/common';
import { CatsFactsService } from './cats.facts.service';

@Controller('demo4')
export class UserController {
  constructor(private catsFactsService: CatsFactsService) {}

  @Get('json')
  async getJson() {
    const fact = await this.catsFactsService.getCatFacts();
    return { fact };
  }

  @Get('text')
  async getText() {
    return this.catsFactsService.getCatFacts();
  }
}
