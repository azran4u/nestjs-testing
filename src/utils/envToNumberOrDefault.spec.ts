import { envToNumberOrDefault } from './envToNumberOrDefault';

describe(`envToNumberOrDefault.spec`, () => {
  const env = 'TEST_ENV';
  const value = 15;
  const defaultValue = 10;

  it(`should return env value if exists`, async () => {
    process.env[env] = value.toString();
    const res = envToNumberOrDefault(env, defaultValue);
    expect(res).toEqual(value);
  });

  it(`should return default value if env doesn't exists`, async () => {
    const res = envToNumberOrDefault(env, defaultValue);
    expect(res).toEqual(defaultValue);
  });

  it(`should return undefined if either env nor default exists`, async () => {
    const res = envToNumberOrDefault(env, null);
    expect(res).toEqual(undefined);
  });

  afterEach(() => {
    process.env[env] = undefined;
  });
});
