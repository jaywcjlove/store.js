// jest.config.js
module.exports = {
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/', '/types/'],
  collectCoverageFrom: [
    "**/dist/store.common.js"
  ]
};
