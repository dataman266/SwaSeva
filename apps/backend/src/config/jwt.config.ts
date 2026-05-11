export const jwtConfig = {
  accessSecret: process.env.JWT_ACCESS_SECRET || 'swaseva-access-secret',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'swaseva-refresh-secret',
  accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
  refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '30d',
};
