import { Either } from './Either';
import { Failure } from './Failure';

export class Success<S, F> {
  readonly value: S;
  constructor(value: S) {
    this.value = value;
  }
  isSuccess(): this is Success<S, F> {
    return true;
  }
  isFailure(): this is Failure<S, F> {
    return false;
  }
}

export const success = <S, F>(value: S): Either<S, F> => {
  return new Success(value);
};
