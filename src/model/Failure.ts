import { Either } from './Either';
import { Success } from './Success';

export class Failure<S, F> {
  readonly value: F;
  constructor(value: F) {
    this.value = value;
  }
  isSuccess(): this is Success<S, F> {
    return false;
  }
  isFailure(): this is Failure<S, F> {
    return true;
  }
}

export const failure = <S, F>(value: F): Either<S, F> => {
  return new Failure<S, F>(value);
};
