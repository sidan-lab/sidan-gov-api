/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts", "**/src/*/test.ts"],
  setupFiles: ["<rootDir>/jest.setup.js"], // Add this line
  setupFilesAfterEnv: ["<rootDir>/test/singleton.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  transformIgnorePatterns: ["/node_modules/"],
  collectCoverageFrom: [
    "src/controllers/**",
    "src/services/**",
    "src/routes/**",
    "src/middleware/**",
    "!src/libs/**",
  ],
};
