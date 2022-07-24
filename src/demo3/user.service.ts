import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { isNil } from 'lodash';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AppConfigService } from '../config';
import { logAndThrow } from '../utils/logAndError';

interface AxiosResponseCatFacts extends AxiosResponse<{ fact: string }> {}

@Injectable()
export class UserService {
  private url: string;
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private configService: AppConfigService
  ) {
    this.url = this.configService.getConfig().catFacts.url;
  }

  async getCatFacts() {
    const axiosResponse = await this.fetchCatFacts();
    return this.parseCatFacts(axiosResponse);
  }

  parseCatFacts(axiosResponse: AxiosResponseCatFacts) {
    const fact = axiosResponse?.data?.fact;
    if (isNil(fact)) logAndThrow(undefined, this.logger, 'cannot parse facts');
    return fact;
  }

  private async fetchCatFacts() {
    let axiosResponse: AxiosResponseCatFacts;
    try {
      axiosResponse = await axios.get(this.url);
    } catch (error) {
      logAndThrow(error, this.logger, 'fetching cat facts failed');
    }
    return axiosResponse;
  }
}
