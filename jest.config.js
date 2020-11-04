module.exports = {
  rootDir: 'src',
  testMatch: [
    '**/*.spec.ts'
  ],
  transform: {
    '.*\.ts$': 'ts-jest'
  },
  testEnvironment: 'node',
  clearMocks: true,
  coverageDirectory: '../coverage',
  coverageProvider: 'v8'
};
