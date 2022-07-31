import { isNil, isString } from 'lodash';

export function envToStringOrDefault(
  env: string,
  defaultValue: string
): string {
  defaultValue = isString(defaultValue) ? defaultValue : undefined;
  const value = process.env[env];
  if (isNil(value)) return defaultValue;
  return value;
}
