import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { isNil, isString } from 'lodash';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AppConfigService } from '../config';
import { CatFactsConfig } from '../config/config.factory';
import { Either } from '../model/Either';
import { ExternalApiError } from '../model/ExternalApiError';
import { failure } from '../model/Failure';
import { success } from '../model/Success';
import { CatsFactsExtractError } from './CatsFactsExtractError';
import { CatsFactsErrors } from './CatsFactsResult';

interface AxiosResponseCatFacts extends AxiosResponse<string> {}

@Injectable()
export class CatsFactsService {
  private config: CatFactsConfig;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private configService: AppConfigService
  ) {
    this.config = this.configService.getConfig().catFacts;
    this.logger = this.logger.child({ component: 'CatsFactsService' });
  }

  async get(): Promise<Either<string, CatsFactsErrors>> {
    const fetchedOrError = await this.fetch();

    if (fetchedOrError.isFailure()) {
      return failure(fetchedOrError.value);
    }

    const extractedOrError = this.extract(fetchedOrError.value);

    if (extractedOrError.isFailure()) {
      return failure(extractedOrError.value);
    }

    return success(extractedOrError.value);
  }

  private extract(
    axiosResponse: AxiosResponseCatFacts
  ): Either<string, CatsFactsExtractError> {
    const fact = axiosResponse?.data;
    if (!isString(fact)) return failure(new CatsFactsExtractError(fact));
    return success(fact);
  }

  private async fetch(): Promise<
    Either<AxiosResponseCatFacts, ExternalApiError>
  > {
    let axiosResponse: AxiosResponseCatFacts;

    const axiosInstance = axios.create({ timeout: this.config.httpTimeout });

    try {
      axiosResponse = await axiosInstance.get(this.config.url);
    } catch (error) {
      const errorMessage = `couldn't fetch url ${this.config.url} ${error}`;
      this.logger.error(errorMessage);
      return failure(new ExternalApiError(new Error(errorMessage)));
    }

    return success(axiosResponse);
  }
}
