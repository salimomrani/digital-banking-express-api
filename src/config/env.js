const dotenv = require('dotenv');

dotenv.config();

const parseAllowedOrigins = (rawOrigins) => {
  return rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  serviceName: process.env.SERVICE_NAME || 'digital-banking-api',
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? parseAllowedOrigins(process.env.ALLOWED_ORIGINS)
    : ['http://localhost:4200']
};
