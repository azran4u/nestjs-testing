import { ApplicationError } from './ApplicationError';

export class ExternalApiError implements ApplicationError {
  message: string;
  error?: any;
  constructor(error: string) {
    this.message = 'External API error occurred';
    this.error = error;
  }
}
