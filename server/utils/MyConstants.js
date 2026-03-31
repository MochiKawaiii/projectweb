const fs = require('fs');
const path = require('path');

const loadLocalEnv = () => {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, '');

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
};

loadLocalEnv();

const parseNumber = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const MyConstants = {
  DB_URI: process.env.DB_URI || process.env.MONGODB_URI || '',

  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail',
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',

  OTP_LENGTH: parseNumber(process.env.OTP_LENGTH, 6),
  OTP_EXPIRES_MS: parseNumber(process.env.OTP_EXPIRES_MS, 10 * 60 * 1000),

  JWT_SECRET: process.env.JWT_SECRET || 'development-only-secret',
  JWT_EXPIRES: process.env.JWT_EXPIRES || '86400000',
};

module.exports = MyConstants;
