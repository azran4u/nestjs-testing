type UUID = string;
type UPN = string;
type KeyValuePair<Key extends string = string, Value = string> = Record<
  Key,
  Value
>;

type EnvironmentKind = 'prod' | 'pp' | 'int' | 'dev';

interface BaseEntity {
  id: UUID;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: UPN;
  updatedBy?: UPN;
}

interface Drill extends BaseEntity {
  environment_kind: EnvironmentKind;
}

interface Repository extends BaseEntity {
  environment_kind: EnvironmentKind;
}

interface RepositoryRealityTechnicalDetails extends BaseEntity {
  repository_id: UUID;
  drill_id?: UUID;
  baseUrl: string;
  queryParams?: KeyValuePair;
  httpHeaders?: KeyValuePair;
  body?: KeyValuePair;
}
