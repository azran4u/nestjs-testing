export function envToStringOrDefault(
  env: string,
  defaultValue: string
): string {
  const value = process.env[env];
  if (!value) return defaultValue;
  return value;
}
