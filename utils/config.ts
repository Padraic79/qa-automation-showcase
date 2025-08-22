import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface TestConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  headless: boolean;
  slowMo: number;
  screenshot: 'off' | 'on' | 'only-on-failure';
  video: 'off' | 'on' | 'retain-on-failure' | 'on-first-retry';
  trace: 'off' | 'on' | 'retain-on-failure' | 'on-first-retry';
}

export interface APIConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

class Config {
  // Environment detection
  public readonly environment = process.env.NODE_ENV || 'development';
  public readonly isCI = !!process.env.CI;
  public readonly isDebug = process.env.DEBUG === 'true';

  // Test configuration
  public readonly test: TestConfig = {
    baseURL: process.env.BASE_URL || 'https://automationexercise.com',
    timeout: parseInt(process.env.TIMEOUT || '30000'),
    retries: this.isCI ? 2 : 0,
    headless: this.isCI ? true : process.env.HEADLESS !== 'false',
    slowMo: parseInt(process.env.SLOW_MO || '0'),
    screenshot: (process.env.SCREENSHOT as any) || 'only-on-failure',
    video: (process.env.VIDEO as any) || 'retain-on-failure',
    trace: (process.env.TRACE as any) || 'on-first-retry'
  };

  // API configuration
  public readonly api: APIConfig = {
    baseURL: process.env.API_BASE_URL || 'https://automationexercise.com/api',
    timeout: parseInt(process.env.API_TIMEOUT || '10000'),
    retries: 3,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'QA-Automation-Tests/1.0'
    }
  };

  // Database configuration (for future use)
  public readonly database: DatabaseConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'test_db',
    username: process.env.DB_USER || 'test_user',
    password: process.env.DB_PASSWORD || 'test_password'
  };

  // Test data paths
  public readonly paths = {
    testData: './tests/ui/fixtures/',
    reports: './reports/',
    screenshots: './test-results/screenshots/',
    videos: './test-results/videos/',
    downloads: './test-results/downloads/'
  };

  // Browser configurations
  public readonly browsers = {
    chromium: {
      name: 'chromium',
      viewport: { width: 1280, height: 720 },
      userAgent: 'QA-Test-Chromium'
    },
    firefox: {
      name: 'firefox',
      viewport: { width: 1280, height: 720 },
      userAgent: 'QA-Test-Firefox'
    },
    webkit: {
      name: 'webkit',
      viewport: { width: 1280, height: 720 },
      userAgent: 'QA-Test-Safari'
    }
  };

  // Test execution settings
  public readonly execution = {
    parallel: this.isCI ? 1 : 4,
    maxFailures: this.isCI ? 10 : 5,
    globalTimeout: 60000 * 10, // 10 minutes
    testTimeout: 60000 * 2,     // 2 minutes
    expectTimeout: 30000        // 30 seconds
  };

  // Logging configuration
  public readonly logging = {
    level: process.env.LOG_LEVEL || (this.isCI ? 'info' : 'debug'),
    console: !this.isCI || this.isDebug,
    file: true,
    path: './reports/logs/'
  };

  // Get environment-specific configuration
  public getEnvironmentConfig(env?: string): Partial<TestConfig> {
    const targetEnv = env || this.environment;
    
    switch (targetEnv) {
      case 'production':
        return {
          baseURL: 'https://automationexercise.com',
          timeout: 45000,
          retries: 3,
          headless: true
        };
      case 'staging':
        return {
          baseURL: 'https://staging.automationexercise.com',
          timeout: 35000,
          retries: 2,
          headless: true
        };
      case 'development':
      default:
        return {
          baseURL: 'https://automationexercise.com',
          timeout: 30000,
          retries: 1,
          headless: false
        };
    }
  }

  // Utility methods
  public isDevelopment(): boolean {
    return this.environment === 'development';
  }

  public isProduction(): boolean {
    return this.environment === 'production';
  }

  public isStaging(): boolean {
    return this.environment === 'staging';
  }
}

// Export singleton instance
export const config = new Config();
export default config;