import { GraphQLClient, gql } from 'graphql-request';
import { GraphQLResponse } from 'graphql-request/src/types';

interface ILogger {
  info(message: string): void;
  error(message: string): void;
}

type GraphqlVariables = { [key: string]: any };

interface HttpHeaders extends Record<string, string> {}

interface ReplicationMonitorState {
  count: number;
  dataversion: string;
}

interface ReplicationMonitorSample {
  parlament: ReplicationMonitorState;
  maagar: ReplicationMonitorState;
}

interface IReplicationMonitor {
  monitor(): Promise<void>;
}

interface IReplicationMonitorOptions {}

interface IReplicationMonitorFactory {
  create(options: IReplicationMonitorOptions): IReplicationMonitor;
}

interface IReplicationMonitorStateFetcher {
  fetch(): Promise<ReplicationMonitorState>;
}

interface IReplicationMonitorSampleFetcher {
  fetch(): Promise<ReplicationMonitorSample>;
}

class ReplicationMonitor implements IReplicationMonitor {
  constructor(
    private fetcher: IReplicationMonitorSampleFetcher,
    private logger?: ILogger,
    private interval?: number
  ) {}

  async monitor(): Promise<void> {
    setInterval(async () => {
      try {
        const sample = await this.fetcher.fetch();
        this.sendToSplunk(sample);
      } catch (error) {
        this.logger.error(error);
      }
    }, this.interval);
  }

  sendToSplunk(sample: ReplicationMonitorSample) {
    this.logger.info(JSON.stringify(sample));
  }
}

abstract class GraphQLFetcher<RESULT> {
  private graphqlClient: GraphQLClient;

  constructor(private url: string) {
    this.graphqlClient = new GraphQLClient(this.url, {
      headers: this.getHttpHeaders(),
      timeout: this.getHttpTimeout(),
    });
  }

  abstract getGraphqlQuery(): string;
  abstract getGraphqlVariables(): GraphqlVariables;
  abstract getHttpHeaders(): HttpHeaders;
  abstract getQueryName(): string;

  protected extractContent(res: GraphQLResponse<RESULT>): RESULT {
    return res.data[this.getQueryName()];
  }

  protected validateContent(value: RESULT): boolean {
    return true;
  }

  protected getHttpTimeout(): number {
    return 5000;
  }

  public async fetch(): Promise<RESULT> {
    let res: GraphQLResponse<RESULT>;

    res = await this.graphqlClient.rawRequest<RESULT>(
      this.getGraphqlQuery(),
      this.getGraphqlVariables()
    );

    const extracted = this.extractContent(res);

    if (this.validateContent(extracted)) {
      return extracted;
    }
  }
}

class HasuraReplicationMonitorStateFetcher
  extends GraphQLFetcher<ReplicationMonitorState>
  implements IReplicationMonitorStateFetcher
{
  getGraphqlQuery(): string {
    return gql``;
  }
  getGraphqlVariables(): GraphqlVariables {
    return {};
  }
  getHttpHeaders(): HttpHeaders {
    return {};
  }
  getQueryName(): string {
    return '';
  }
}

class FireCoreReplicationMonitorStateFetcher
  extends GraphQLFetcher<ReplicationMonitorState>
  implements IReplicationMonitorStateFetcher
{
  getGraphqlQuery(): string {
    return gql``;
  }
  getGraphqlVariables(): GraphqlVariables {
    return {};
  }
  getHttpHeaders(): HttpHeaders {
    return {};
  }
  getQueryName(): string {
    return '';
  }
}

class ToshReplicationMonitorCountFetcher extends GraphQLFetcher<number> {
  getGraphqlQuery(): string {
    return gql``;
  }
  getGraphqlVariables(): GraphqlVariables {
    return {};
  }
  getHttpHeaders(): HttpHeaders {
    return {};
  }
  getQueryName(): string {
    return '';
  }
}

class ToshReplicationMonitorDataversionFetcher extends GraphQLFetcher<string> {
  getGraphqlQuery(): string {
    return gql``;
  }
  getGraphqlVariables(): GraphqlVariables {
    return {};
  }
  getHttpHeaders(): HttpHeaders {
    return {};
  }
  getQueryName(): string {
    return '';
  }
}

class ToshReplicationMonitorStateFetcher
  implements IReplicationMonitorStateFetcher
{
  constructor(
    private counterFetcher: ToshReplicationMonitorCountFetcher,
    private dataversionFetcher: ToshReplicationMonitorDataversionFetcher
  ) {}
  async fetch(): Promise<ReplicationMonitorState> {
    const count = await this.counterFetcher.fetch();
    const dataversion = await this.dataversionFetcher.fetch();
    return { count, dataversion };
  }
}

class ReplicationMonitorSampleFetcher
  implements IReplicationMonitorSampleFetcher
{
  constructor(
    private maagarStateFetcher: IReplicationMonitorStateFetcher,
    private ourStateFetcher: IReplicationMonitorStateFetcher
  ) {}

  async fetch(): Promise<ReplicationMonitorSample> {
    const maagar = await this.maagarStateFetcher.fetch();
    const parlament = await this.ourStateFetcher.fetch();
    return {
      maagar,
      parlament,
    };
  }
}

function BuildReplicationMonitorFromStateFetchers(
  maagarStateFetcher: IReplicationMonitorStateFetcher,
  ourStateFetcher: IReplicationMonitorStateFetcher
) {
  const replicationMonitorSampleFetcher = new ReplicationMonitorSampleFetcher(
    maagarStateFetcher,
    ourStateFetcher
  );
  const replicationMonitor = new ReplicationMonitor(
    replicationMonitorSampleFetcher
  );

  return replicationMonitor;
}

function ToshReplicationMonitorStateFetcherFactory(
  options: IReplicationMonitorOptions
): IReplicationMonitorStateFetcher {
  const toshCounterFetcher = new ToshReplicationMonitorCountFetcher('');
  const toshDataversionFetcher = new ToshReplicationMonitorDataversionFetcher(
    ''
  );
  const toshReplicationMonitorStateFetcher =
    new ToshReplicationMonitorStateFetcher(
      toshCounterFetcher,
      toshDataversionFetcher
    );

  return toshReplicationMonitorStateFetcher;
}

function ToshReplicationMonitorFactory(
  options: IReplicationMonitorOptions
): IReplicationMonitor {
  const hasuraStateFetcher = new HasuraReplicationMonitorStateFetcher('');

  const toshReplicationMonitorStateFetcher =
    ToshReplicationMonitorStateFetcherFactory(options);

  const replicationMonitorFactory = BuildReplicationMonitorFromStateFetchers(
    toshReplicationMonitorStateFetcher,
    hasuraStateFetcher
  );

  return replicationMonitorFactory;
}

class FireCoreReplicationMonitorFactory implements IReplicationMonitorFactory {
  constructor() {}

  create(): IReplicationMonitor {
    const hasuraStateFetcher = new HasuraReplicationMonitorStateFetcher('');

    const fireCoreStateFetcher = new FireCoreReplicationMonitorStateFetcher('');

    const replicationMonitorFactory = new ReplicationMonitorFactory(
      fireCoreStateFetcher,
      hasuraStateFetcher
    );

    return replicationMonitorFactory.create();
  }
}
