import dotenv from 'dotenv';

dotenv.config();

const parseAllowedOrigins = (rawOrigins?: string): string[] => {
  if (!rawOrigins) {
    return ['http://localhost:4200'];
  }

  return rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export interface AppConfig {
  env: string;
  port: number;
  serviceName: string;
  allowedOrigins: string[];
}

const config: AppConfig = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  serviceName: process.env.SERVICE_NAME || 'digital-banking-api',
  allowedOrigins: parseAllowedOrigins(process.env.ALLOWED_ORIGINS)
};

export default config;
