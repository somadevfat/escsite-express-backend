import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

export function loadEnv(): void {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const rootDir = path.resolve(__dirname, '../../');
  const devEnvPath = path.join(rootDir, '.env.development');
  const defaultEnvPath = path.join(rootDir, '.env');

  if (nodeEnv === 'development' && fs.existsSync(devEnvPath)) {
    dotenv.config({ path: devEnvPath, override: true });
    return;
  }

  if (fs.existsSync(defaultEnvPath)) {
    dotenv.config({ path: defaultEnvPath, override: true });
  }
}


