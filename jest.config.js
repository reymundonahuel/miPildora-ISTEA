module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
  },
  testMatch: ['**/__tests__/**/*.test.(ts|tsx|js)'],
  moduleNameMapper: {
    '^react-native$': '<rootDir>/__mocks__/react-native.ts',
    '^@expo/vector-icons$': '<rootDir>/__mocks__/vector-icons.ts',
  },
  setupFilesAfterEnv: [],
};
