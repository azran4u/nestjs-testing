import { isNil } from 'lodash';

export function exists(value: any): boolean {
  return !isNil(value);
}
