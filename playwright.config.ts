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
 *
 * TEST_FILE 환경변수가 있으면(=Jenkins에서 파일별로 쪼갠 job에서 실행된 경우)
 * 그 파일 이름만 쓰고, 없으면(=로컬 또는 전체 실행) tests/ 폴더 전체를 스캔함
 */
const specNames = process.env.TEST_FILE
  ? process.env.TEST_FILE
  : fs
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
  /* CI에서도 병렬로 돌리게 변경 (기존엔 1개로 고정돼서 순차 실행됐음) */
  workers: process.env.CI ? 4 : undefined,
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

    /* 환경 하나만 돌리기로 해서 firefox/webkit은 잠시 꺼둠. 다시 켜려면 주석 해제 */
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

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