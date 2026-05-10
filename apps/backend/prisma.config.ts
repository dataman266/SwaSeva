import path from 'node:path';
import { defineConfig } from 'prisma/config';
import * as fs from 'node:fs';

// Load .env manually so prisma CLI commands work without dotenv-cli
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    if (key && !process.env[key]) process.env[key] = val;
  }
}

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  datasource: {
    // Use direct URL for all Prisma CLI operations (pooler blocks DDL statements)
    // Fallback dummy URL allows `prisma generate` to run in CI/build without a real DB
    url: process.env['DIRECT_URL'] ?? process.env['DATABASE_URL'] ?? 'postgresql://dummy:dummy@localhost:5432/dummy',
  } as any,
  migrations: {
    seed: 'npx ts-node --transpile-only prisma/seed.ts',
  },
});
