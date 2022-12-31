export const winstonLoggerMock = {
  error: jest.fn(),
  child: jest.fn().mockReturnValue({ error: jest.fn() }),
};
