/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';
// @ts-ignore
import * as path from 'path';

 //Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// Define the allure results folder using today's date
//const allureResultsFolder = path.join('allure-results', today);

const testEnv = process.env.TEST_ENV || './.';
const allureResultsFolder = path.join('allure-results', testEnv);

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 900000, // Global timeout for each test (5 minutes)
  globalTimeout: 20 * 60 * 1000,
  
 testDir: './.',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 1, // Number of retries for failed tests
  //retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  // workers: process.env.CI ? 1 : undefined,
  workers: 1, // Number of parallel workers
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['dot'],
    ['list'],
    ['json', { outputFile: 'test-results/.last-run.json' }],
    ['allure-playwright',
      {
        detail: true,
        outputFolder: "allure-results",
        //outputFolder: allureResultsFolder,   // Dynamic allure results folder //npm run allure:generate //npm run allure:open
        suiteTitle: true,
        categories: [
          {
            name: "Outdated tests",
            messageRegex: ".*FileNotFound.*",
          },
        ],
        environmentInfo: {
          framework: "myPlaywrightAutomation",
          E2E_NODE_VERSION: process.version,
          E2E_OS: process.platform,
          User_Name: "Sandeep Kumar",
          EmpId: "selfEmployed"
        },
      },
    ],
  ],
  
  use: {
    baseURL: 'https://automationexercise.com',
    actionTimeout: 10 * 1000,
    navigationTimeout: 60 * 1000,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    headless: false,  // Run tests in headed mode (visible browser)
    trace:'on-first-retry',
    screenshot:'only-on-failure',
    video:'retain-on-failure',

    // Emulates `'prefers-colors-scheme'` media feature.
    colorScheme: 'dark',
  
    // Context geolocation.
    geolocation: { longitude: 12.492507, latitude: 41.889938 },

    // Emulates the user locale.
    locale: 'en-IN',

    // Grants specified permissions to the browser context.
    permissions: ['geolocation'],

    // Emulates the user timezone.
    timezoneId: 'Asia/Kolkata',

  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--start-maximized'],
        },
      },
      fullyParallel: true,
     },

     {
       name: 'firefox',
       use: { ...devices['Desktop Firefox'] }
    },

     {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    // /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    // /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     ...devices['Desktop Edge'],
    //     channel: 'msedge'
    //   },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     channel: 'chrome'
    //   },
    // },


    // Setup project
    //{ name: 'setup', testMatch: /.*\.setup\.ts/ }

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
    //  {
    //    name: 'Google Chrome',
    //    use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    //  },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
