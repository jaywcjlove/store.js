module.exports = {
  "bail": true,
  "verbose": true,
  "coverageReporters": [
    "lcov",
    "json-summary"
  ],
  "testMatch": [
    "**/__tests__/**/*.js?(x)",
    "**/?(*.)+(spec|test).js?(x)"
  ],
  "collectCoverageFrom": [
    "**/*.{js}",
    "!**/*.{js,d.ts}",
    "!**/node_modules/**",
    "!<rootDir>/coverage/**"
  ]
};
