type MockRowResult = { rows: unknown[] };

type MockDatabase = {
  executeSync: jest.Mock<void, [string]>;
  execute: jest.Mock<Promise<MockRowResult>, [string, Scalar[]?]>;
  transaction: jest.Mock<Promise<void>, [(tx: unknown) => Promise<void>]>;
  close: jest.Mock<void, []>;
};

export type Scalar = string | number | null | Uint8Array;
export type Transaction = Record<string, never>;

export const open = jest.fn(
  (): MockDatabase => ({
    executeSync: jest.fn(),
    execute: jest.fn(async (_query: string, _params?: Scalar[]) => ({
      rows: [] as unknown[],
    })),
    transaction: jest.fn(async work => {
      await work({});
    }),
    close: jest.fn(),
  }),
);
