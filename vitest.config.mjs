import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    pool: 'forks',
    clearMocks: true,
    include: ['unittest/**/*.test.js'],
    poolOptions: {
      forks: {
        execArgv: ['-r', './scripts/crypto-polyfill.cjs'],
      },
    },
  },
});
