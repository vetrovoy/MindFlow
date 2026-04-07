module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@mindflow/domain$': '<rootDir>/../../packages/domain/src',
    '^@mindflow/data$': '<rootDir>/../../packages/data/src',
    '^@mindflow/ui$': '<rootDir>/../../packages/ui/src',
    '^@mindflow/copy$': '<rootDir>/../../packages/copy/src',
    '^@op-engineering/op-sqlite$': '<rootDir>/test-mocks/op-sqlite.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { rootMode: 'upward' }],
  },
  testEnvironment: 'node',
  transformIgnorePatterns: [
    'node_modules/(?!(?:.pnpm/)?((jest-)?react-native|@react-native(-community)?|react-navigation|@react-navigation/.*|native-base|react-native-svg))',
  ],
  testPathIgnorePatterns: ['/node_modules/', 'test-utils.tsx'],
  testMatch: ['**/src/**/*.test.[jt]s?(x)'],
};
