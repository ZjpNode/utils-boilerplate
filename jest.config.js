
module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  globals: {
    'ts-jest': {
      compiler: 'ttypescript',
      babelConfig: true,
      isolatedModules: false,
    },
  },
  // https://jestjs.io/docs/en/configuration.html#modulenamemapper-objectstring-string--arraystring
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
};
