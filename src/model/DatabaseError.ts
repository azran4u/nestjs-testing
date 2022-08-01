import { ApplicationError } from './ApplicationError';

export class DatabaseError implements ApplicationError {
  message: string;
  error?: any;
  constructor(error: string) {
    this.message = 'A database error occurred';
    this.error = error;
  }
}
