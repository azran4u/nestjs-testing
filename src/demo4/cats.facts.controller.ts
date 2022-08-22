import {
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ExternalApiError } from '../model/ExternalApiError';
import { CatsFactsService } from './cats.facts.service';

@Controller('demo4')
export class UserController {
  constructor(private catsFactsService: CatsFactsService) {}

  @Get()
  async getCatFact(): Promise<{ fact: string }> {
    const catFactOrError = await this.catsFactsService.get();
    if (catFactOrError.isFailure()) {
      this.errorsHandler(catFactOrError.value);
    } else {
      return { fact: catFactOrError.value };
    }
  }

  private errorsHandler(error: any) {
    switch (error.constructor) {
      case ExternalApiError:
        throw new HttpException(error.message, 501);
      // case CatsFactsExtractError:
      //   throw new InternalServerErrorException(error.message);
      default:
        throw new InternalServerErrorException(error.message);
    }
  }
}
