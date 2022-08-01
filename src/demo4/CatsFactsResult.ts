import { Either } from '../model/Either';
import { ExternalApiError } from '../model/ExternalApiError';
import { CatsFactsSuccess } from './CatsFactsSuccess';

export type CatsFactsResult = Either<
  // Success
  CatsFactsSuccess,
  // Failures
  ExternalApiError
>;
