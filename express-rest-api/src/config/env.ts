import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

export function loadEnv(): void {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const rootDir = path.resolve(__dirname, '../../');

  const defaultEnvPath = path.join(rootDir, '.env');
  const envSpecificPath = path.join(rootDir, `.env.${nodeEnv}`);

  // まずデフォルトを読み込み、その後に環境別で上書き
  if (fs.existsSync(defaultEnvPath)) {
    dotenv.config({ path: defaultEnvPath, override: false });
  }
  if (fs.existsSync(envSpecificPath)) {
    dotenv.config({ path: envSpecificPath, override: true });
  }
}


