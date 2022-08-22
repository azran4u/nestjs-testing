import { isNaN, isNil } from 'lodash';

export function envToNumberOrDefault(
  env: string,
  defaultValue?: number
): number {
  defaultValue =
    isNil(defaultValue) || isNaN(defaultValue) ? undefined : defaultValue;
  const value = process.env[env];
  if (isNil(value)) return defaultValue;
  const parsed = parseInt(value);
  if (isNaN(parsed)) return defaultValue;
  return parsed;
}
