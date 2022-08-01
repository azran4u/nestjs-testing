import { DomainError } from './DomainError';

export interface ApplicationError extends DomainError {
  error?: any;
}
