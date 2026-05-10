import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Railway sets RAILWAY_ENVIRONMENT automatically; NODE_ENV may not be set.
    // Production: use pooler URL (port 6543, IPv4-accessible from Railway).
    // Supabase's direct connection (port 5432) is IPv6-only on free tier.
    // Dev: prefer DIRECT_URL (port 5432) to avoid pooler prepared-statement limits.
    const isHosted = !!(process.env.RAILWAY_ENVIRONMENT || process.env.NODE_ENV === 'production');
    const connStr = isHosted
      ? (process.env.DATABASE_URL ?? process.env.DIRECT_URL)
      : (process.env.DIRECT_URL ?? process.env.DATABASE_URL);

    const pool = new Pool({
      connectionString: connStr,
      ssl: isHosted ? { rejectUnauthorized: false } : false,
    });
    const adapter = new PrismaPg(pool);
    super({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
