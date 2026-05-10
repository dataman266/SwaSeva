const { Pool } = require('pg');
const pool = new Pool({
  host: 'db.yayregcdkzpusbdvbush.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Kalakari@266',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});
pool
  .query("SELECT count(*) as cnt FROM information_schema.tables WHERE table_schema = 'public'")
  .then((r) => {
    console.log('Connected! Tables in public schema:', r.rows[0].cnt);
    pool.end();
  })
  .catch((e) => {
    console.error('Connection error:', e.message);
    pool.end();
    process.exit(1);
  });
