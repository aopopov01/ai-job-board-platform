import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./packages/testing/setup.ts'],
    include: ['**/__tests__/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: [
      'node_modules',
      'dist',
      '.next',
      'build',
      'coverage'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: [
        'node_modules/',
        'dist/',
        '.next/',
        'build/',
        'coverage/',
        '**/__tests__/**',
        '**/*.test.{js,ts,jsx,tsx}',
        '**/*.spec.{js,ts,jsx,tsx}',
        '**/types/**',
        '**/mocks/**',
        '**/*.config.{js,ts}',
        '**/*.setup.{js,ts}',
        'packages/testing/**'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    reporters: ['verbose', 'html'],
    outputFile: {
      html: './coverage/index.html',
      json: './coverage/coverage.json'
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@job-board/ui': resolve(__dirname, './packages/ui/src'),
      '@job-board/shared': resolve(__dirname, './packages/shared/src'),
      '@job-board/database': resolve(__dirname, './packages/database'),
      '@job-board/ai': resolve(__dirname, './packages/ai'),
      '@job-board/integrations': resolve(__dirname, './packages/integrations'),
      '@job-board/testing': resolve(__dirname, './packages/testing')
    }
  },
  esbuild: {
    target: 'node14'
  }
})