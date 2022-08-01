import { Failure } from './Failure';
import { Success } from './Success';

export type Either<S, F> = Success<S, F> | Failure<S, F>;
