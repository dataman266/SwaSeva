import { PrismaClient, RoleType, ProductStatus, UnitType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { seedCategories } from './seeders/categories.seeder';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log('Starting seed...');

  // Categories
  await seedCategories(prisma);

  // Get category IDs
  const fruitsCategory = await prisma.category.findUnique({ where: { slug: 'fruits' } });
  const veggiesCategory = await prisma.category.findUnique({ where: { slug: 'vegetables' } });
  const grainsCategory = await prisma.category.findUnique({ where: { slug: 'grains-pulses' } });
  const fertCategory = await prisma.category.findUnique({ where: { slug: 'fertilizers' } });
  const irrCategory = await prisma.category.findUnique({ where: { slug: 'irrigation' } });

  if (!fruitsCategory || !veggiesCategory || !grainsCategory || !fertCategory || !irrCategory) {
    throw new Error('Categories not seeded properly');
  }

  // Admin user
  const admin = await prisma.user.upsert({
    where: { phone: '+919999999999' },
    update: {},
    create: {
      phone: '+919999999999',
      name_en: 'Admin',
      name_mr: 'व्यवस्थापक',
      state: 'Maharashtra',
      roles: { create: [{ role: RoleType.ADMIN }] },
    },
  });
  console.log('Seeded admin:', admin.phone);

  // Farmer 1 — Ramesh
  const farmer1 = await prisma.user.upsert({
    where: { phone: '+919876543210' },
    update: {},
    create: {
      phone: '+919876543210',
      name_en: 'Ramesh Patil',
      name_mr: 'रमेश पाटील',
      state: 'Maharashtra',
      district: 'Nashik',
      taluka: 'Niphad',
      village: 'Pimpalgaon Baswant',
      roles: { create: [{ role: RoleType.FARMER }] },
    },
  });

  // Farmer 2 — Sunita
  const farmer2 = await prisma.user.upsert({
    where: { phone: '+919876543211' },
    update: {},
    create: {
      phone: '+919876543211',
      name_en: 'Sunita Deshmukh',
      name_mr: 'सुनिता देशमुख',
      state: 'Maharashtra',
      district: 'Pune',
      taluka: 'Haveli',
      village: 'Uruli Kanchan',
      roles: { create: [{ role: RoleType.FARMER }, { role: RoleType.BUYER }] },
    },
  });

  // Buyer
  await prisma.user.upsert({
    where: { phone: '+919876543212' },
    update: {},
    create: {
      phone: '+919876543212',
      name_en: 'Mahesh Traders',
      name_mr: 'महेश ट्रेडर्स',
      state: 'Maharashtra',
      district: 'Mumbai',
      roles: { create: [{ role: RoleType.BUYER }] },
    },
  });

  console.log('Seeded 4 users');

  // Products
  const products = [
    {
      sellerId: farmer1.id,
      categoryId: fruitsCategory.id,
      name_en: 'Fresh Alphonso Mangoes',
      name_mr: 'ताजे हापूस आंबे',
      pricePerUnit: 150.00,
      unit: UnitType.KG,
      quantityAvailable: 500,
      district: 'Nashik',
      status: ProductStatus.ACTIVE,
    },
    {
      sellerId: farmer1.id,
      categoryId: veggiesCategory.id,
      name_en: 'Onion (Rabi)',
      name_mr: 'कांदा (रब्बी)',
      pricePerUnit: 25.00,
      unit: UnitType.KG,
      quantityAvailable: 2000,
      district: 'Nashik',
      status: ProductStatus.ACTIVE,
    },
    {
      sellerId: farmer2.id,
      categoryId: grainsCategory.id,
      name_en: 'Soybean',
      name_mr: 'सोयाबीन',
      pricePerUnit: 4800.00,
      unit: UnitType.QUINTAL,
      quantityAvailable: 50,
      district: 'Pune',
      status: ProductStatus.ACTIVE,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log('Seeded 3 products');

  // APMC Market Prices
  const marketPrices = [
    { categoryId: fruitsCategory.id, commodity_en: 'Mango', market: 'Nashik APMC', district: 'Nashik', minPrice: 40, maxPrice: 120, modalPrice: 80 },
    { categoryId: veggiesCategory.id, commodity_en: 'Onion', market: 'Lasalgaon APMC', district: 'Nashik', minPrice: 8, maxPrice: 22, modalPrice: 15 },
    { categoryId: veggiesCategory.id, commodity_en: 'Tomato', market: 'Pune APMC', district: 'Pune', minPrice: 12, maxPrice: 40, modalPrice: 25 },
    { categoryId: grainsCategory.id, commodity_en: 'Soybean', market: 'Latur APMC', district: 'Latur', minPrice: 4400, maxPrice: 5200, modalPrice: 4800 },
    { categoryId: grainsCategory.id, commodity_en: 'Wheat', market: 'Ahmednagar APMC', district: 'Ahmednagar', minPrice: 1900, maxPrice: 2400, modalPrice: 2100 },
    { categoryId: grainsCategory.id, commodity_en: 'Jowar', market: 'Solapur APMC', district: 'Solapur', minPrice: 2200, maxPrice: 3000, modalPrice: 2600 },
    { categoryId: fruitsCategory.id, commodity_en: 'Pomegranate', market: 'Solapur APMC', district: 'Solapur', minPrice: 60, maxPrice: 150, modalPrice: 100 },
    { categoryId: veggiesCategory.id, commodity_en: 'Potato', market: 'Pune APMC', district: 'Pune', minPrice: 15, maxPrice: 30, modalPrice: 22 },
    { categoryId: grainsCategory.id, commodity_en: 'Tur Dal', market: 'Nagpur APMC', district: 'Nagpur', minPrice: 6000, maxPrice: 8500, modalPrice: 7200 },
    { categoryId: veggiesCategory.id, commodity_en: 'Cabbage', market: 'Nashik APMC', district: 'Nashik', minPrice: 5, maxPrice: 18, modalPrice: 10 },
  ];

  for (const mp of marketPrices) {
    await prisma.marketPrice.create({
      data: {
        ...mp,
        minPrice: mp.minPrice,
        maxPrice: mp.maxPrice,
        modalPrice: mp.modalPrice,
        unit: 'quintal',
        recordedAt: new Date(),
      },
    });
  }

  console.log('Seeded 10 APMC market prices');
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
