import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * 리포트 폴더/제목 이름 = 그날 날짜 + 실행된 테스트 파일명들
 * (+ Jenkins에서 실행된 경우 같은 날 여러 번 돌려도 안 덮어써지게 빌드 번호도 붙임)
 */
const specNames = fs
  .readdirSync(path.resolve(__dirname, 'tests'))
  .filter((f) => f.endsWith('.spec.ts'))
  .map((f) => f.replace('.spec.ts', ''))
  .sort()
  .join('-');

const today = new Date().toISOString().slice(0, 10);
const buildSuffix = process.env.BUILD_NUMBER ? `_build${process.env.BUILD_NUMBER}` : '';
const reportName = `${today}_${specNames}${buildSuffix}`;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters
   * monocart-reporter: 기본 HTML 리포트 대신 쓰는 커스텀 가능한 리포터
   * (트렌드 차트, 필터, 커스텀 컬럼 등 지원). 설치: npm i -D monocart-reporter */
  reporter: [
    ['list'],
    ['monocart-reporter', {
      name: 'Nidus Playwright Report',
      outputFile: `./results/${reportName}/index.html`,
    }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'https://staging-nidus.netlify.app',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});