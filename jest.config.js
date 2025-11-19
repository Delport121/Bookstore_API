// jest.config.js

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // Use ts-jest preset to correctly handle TypeScript files
  preset: 'ts-jest', 
  testEnvironment: 'node',
  // Look for test files in the 'src' directory (or sub-directories) with .test.ts extension
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  // Directories to ignore
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  // Collect coverage from the source files
  collectCoverageFrom: ['src/services/**/*.ts'],
};