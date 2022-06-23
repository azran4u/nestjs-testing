import { ConfigFactory } from '@nestjs/config';
import { parseInt } from 'lodash';

export const configFactory: ConfigFactory<{ config: Configuration }> = () => {
  return {
    config: {
      server: {
        port: envToNumberOrDefault('SERVER_PORT', 3500),
      },
      logger: {
        level: envToStringOrDefault('LOGGER_LEVEL', 'debug'),
      },
      afid: {
        enabled: true,
      },
    } as Configuration,
  };
};

export interface ServerConfig {
  port: number;
}
export interface LoggerConfig {
  level: string;
}

export interface AfidConfig {
  enabled: boolean;
}

export interface Configuration {
  server: ServerConfig;
  logger: LoggerConfig;
  afid: AfidConfig;
}

function envToNumberOrDefault(env: string, defaultValue: number): number {
  const value = process.env[env];
  if (!value) return defaultValue;
  const valueNumber = parseInt(value);
  return valueNumber;
}

function envToStringOrDefault(env: string, defaultValue: string): string {
  const value = process.env[env];
  if (!value) return defaultValue;
  return value;
}
