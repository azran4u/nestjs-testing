import { Either } from '../model/Either';
import { failure } from '../model/Failure';
import { success } from '../model/Success';

declare type HandlerWithInput<IN, S, F> = (input: IN) => Promise<Either<S, F>>;
declare type HandlerWithoutInput<S, F> = () => Promise<Either<S, F>>;
async function createTandem<S1, F1, S2, F2>(
  s1: HandlerWithoutInput<S1, F1>,
  s2: HandlerWithInput<S1, S2, F2>
): Promise<Either<S2, F1 | F2>> {
  const s1Res = await s1();
  if (s1Res.isFailure()) {
    return failure(s1Res.value);
  }
  const s2Res = await s2(s1Res.value);
  if (s2Res.isFailure()) {
    return failure(s2Res.value);
  }

  return success(s2Res.value);
}
