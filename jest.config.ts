import 'reflect-metadata';
import {pathsToModuleNameMapper} from 'ts-jest'
import {compilerOptions} from './tsconfig.json'

export default {
  bail: true,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom:["<rootDir>/src/modules/**/useCases/**/*.ts"],
  coverageProvider: 'v8',
  coverageReporters: [
    "text-summary",
   "lcov",
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src/',
  }),
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/jest.config.ts'],
  testMatch: ['**/*.spec.ts'],
};
