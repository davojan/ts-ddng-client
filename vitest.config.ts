import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['dist/**', 'es/**', 'lib/**', 'test/**'],
    },
    globals: true,
    include: ['test/**/*.ts'],
  },
})
