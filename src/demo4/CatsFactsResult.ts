import { Either } from '../model/Either';
import { ExternalApiError } from '../model/ExternalApiError';
import { CatsFactsExtractError } from './CatsFactsExtractError';
import { CatsFactsSuccess } from './CatsFactsSuccess';

export type CatsFactsResult = Either<
  // Success
  CatsFactsSuccess,
  // Failures
  CatsFactsErrors
>;

export type CatsFactsErrors = ExternalApiError | CatsFactsExtractError;
