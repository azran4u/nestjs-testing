export function envToNumberOrDefault(
  env: string,
  defaultValue: number
): number {
  const value = process.env[env];
  if (!value) return defaultValue;
  const valueNumber = parseInt(value);
  return valueNumber;
}
