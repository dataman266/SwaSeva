import * as path from 'path';
import * as fs from 'fs';
import { Pool } from 'pg';

// Load .env
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    if (key && !process.env[key]) process.env[key] = val;
  }
}

const connStr = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connStr) { console.error('No connection string found'); process.exit(1); }

const tables = [
  '_prisma_migrations',
  'users', 'user_roles', 'kyc_documents', 'categories',
  'products', 'cart_items', 'orders', 'order_items', 'payments',
  'deliveries', 'inquiries', 'reviews', 'notifications',
  'market_prices', 'price_alerts', 'otp_sessions',
];

async function main() {
  const pool = new Pool({ connectionString: connStr });
  const client = await pool.connect();
  try {
    console.log('Enabling RLS on all public tables...\n');
    for (const table of tables) {
      await client.query(`ALTER TABLE public."${table}" ENABLE ROW LEVEL SECURITY`);
      console.log(`  ✓ ${table}`);
    }

    const { rows } = await client.query(`
      SELECT tablename, rowsecurity AS rls_enabled
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);

    console.log('\nVerification:');
    let allGood = true;
    for (const row of rows) {
      const icon = row.rls_enabled ? '✓' : '✗';
      if (!row.rls_enabled) allGood = false;
      console.log(`  ${icon} ${row.tablename}: RLS ${row.rls_enabled ? 'ENABLED' : 'DISABLED'}`);
    }
    console.log(allGood ? '\nAll tables secured.' : '\nWarning: some tables still have RLS disabled.');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
