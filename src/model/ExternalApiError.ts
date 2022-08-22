import { isString } from 'lodash';
import { ApplicationError } from './ApplicationError';

export class ExternalApiError implements ApplicationError {
  message: string;
  constructor(public error: any, private url?: string) {
    this.message = `External API error occurred ${
      isString(this.url) ? `while fetching ${this.url}` : ''
    }`;
  }
}
