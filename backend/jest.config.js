export default {
    transform: {
      "^.+\\.js$": "babel-jest"
    },
    testEnvironment: 'node',
    transformIgnorePatterns: [
      "node_modules/(?!variables/.*)"
    ]
  };