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
  .query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name")
  .then((r) => {
    console.log('Tables:');
    r.rows.forEach((row) => console.log(' -', row.table_name));
    pool.end();
  })
  .catch((e) => {
    console.error('Error:', e.message);
    pool.end();
    process.exit(1);
  });
