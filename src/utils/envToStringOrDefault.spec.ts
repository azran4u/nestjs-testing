import { envToStringOrDefault } from './envToStringOrDefault';

describe.only(`envToStringOrDefault.spec`, () => {
  const env = 'TEST_ENV';
  const value = 'a';
  const defaultValue = 'b';

  it(`should return env value if exists`, async () => {
    process.env[env] = value;
    const res = envToStringOrDefault(env, defaultValue);
    expect(res).toEqual(value);
  });

  it(`should return default value if env doesn't exists`, async () => {
    const res = envToStringOrDefault(env, defaultValue);
    expect(res).toEqual(defaultValue);
  });

  it(`should return undefined if neither env nor default exists`, async () => {
    const res = envToStringOrDefault(env, null);
    expect(res).toEqual(undefined);
  });

  afterEach(() => {
    delete process.env[env];
  });
});
