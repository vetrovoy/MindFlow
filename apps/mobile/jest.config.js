const config = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@mindflow)/)',
  ],
  moduleNameMapper: {
    '^@mindflow/domain$': '<rootDir>/../../packages/domain/src',
    '^@mindflow/data$': '<rootDir>/../../packages/data/src',
    '^@mindflow/ui$': '<rootDir>/../../packages/ui/src',
    '^@mindflow/copy$': '<rootDir>/../../packages/copy/src',
  },
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { rootMode: 'upward' }],
  },
  testEnvironment: 'node',
  transformIgnorePatterns: [
  'node_modules/(?!(?:.pnpm/)?((jest-)?react-native|@react-native(-community)?|react-navigation|@react-navigation/.*|native-base|react-native-svg))',
],
};

export default config