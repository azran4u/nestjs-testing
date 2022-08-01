import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { isNil } from 'lodash';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AppConfigService } from '../config';
import { DomainError } from '../model/DomainError';
import { Either } from '../model/Either';
import { ExternalApiError } from '../model/ExternalApiError';
import { Failure, failure } from '../model/Failure';
import { ParsingError } from '../model/ParsingError';
import { success } from '../model/Success';
import { logAndThrow } from '../utils/logAndError';
import { CatsFactsInvalid } from './CatsFactsInvalid';
import { CatsFactsResult } from './CatsFactsResult';
import { CatsFactsSuccess } from './CatsFactsSuccess';

interface AxiosResponseCatFacts extends AxiosResponse<{ fact: string }> {}

@Injectable()
export class CatsFactsService {
  private url: string;
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private configService: AppConfigService
  ) {
    this.url = this.configService.getConfig().catFacts.url;
  }

  async getCatFacts(): Promise<CatsFactsResult> {
    const fetchedOrError = await this.fetch();

    if (fetchedOrError.isFailure()) {
      return failure(fetchedOrError.value);
    }

    const parsedOrError = this.parse(fetchedOrError.value);

    if (parsedOrError.isFailure()) {
      return failure(parsedOrError.value);
    }

    return success(new CatsFactsSuccess(parsedOrError.value));
  }

  private parse(
    axiosResponse: AxiosResponseCatFacts
  ): Either<string, CatsFactsInvalid> {
    const fact = axiosResponse?.data?.fact;
    if (isNil(fact)) return failure(new CatsFactsInvalid(fact));
    else return success(fact);
  }

  private async fetch(): Promise<Either<AxiosResponse, ExternalApiError>> {
    let axiosResponse: AxiosResponse;
    try {
      axiosResponse = await axios.get(this.url);
      return success(axiosResponse);
    } catch (error) {
      return failure(new ExternalApiError(`network error`));
    }
  }
}
