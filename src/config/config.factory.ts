import { ConfigFactory } from '@nestjs/config';
import { envToNumberOrDefault } from '../utils/envToNumberOrDefault';
import { envToStringOrDefault } from '../utils/envToStringOrDefault';

export const configFactory: ConfigFactory<{ config: Configuration }> = () => {
  return {
    config: {
      server: {
        port: envToNumberOrDefault('SERVER_PORT', 3500),
      },
      logger: {
        level: envToStringOrDefault('LOGGER_LEVEL', 'debug'),
      },
      catFacts: {
        url: envToStringOrDefault(
          'CAT_FACTS_URL',
          'https://catfact.ninja/fact'
        ),
        httpTimeout: envToNumberOrDefault('CAT_FACTS_HTTP_TIMEOUT', 5000),
      },
      afid: {
        enabled: false,
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

export interface CatFactsConfig {
  url: string;
  httpTimeout: number;
}

export interface AfidConfig {
  enabled: boolean;
}

export interface Configuration {
  server: ServerConfig;
  logger: LoggerConfig;
  catFacts: CatFactsConfig;
  afid: AfidConfig;
}
