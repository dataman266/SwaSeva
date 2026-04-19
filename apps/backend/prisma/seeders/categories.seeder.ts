import { PrismaClient } from '@prisma/client';

export async function seedCategories(prisma: PrismaClient) {
  const categories = [
    { name_en: 'Fruits', name_mr: 'फळे', slug: 'fruits' },
    { name_en: 'Vegetables', name_mr: 'भाजीपाला', slug: 'vegetables' },
    { name_en: 'Grains & Pulses', name_mr: 'धान्य व कडधान्य', slug: 'grains-pulses' },
    { name_en: 'Oilseeds', name_mr: 'तेलबिया', slug: 'oilseeds' },
    { name_en: 'Spices', name_mr: 'मसाले', slug: 'spices' },
    { name_en: 'Flowers', name_mr: 'फुले', slug: 'flowers' },
    { name_en: 'Dairy & Livestock', name_mr: 'दुग्ध व पशुधन', slug: 'dairy-livestock' },
    { name_en: 'Seeds & Saplings', name_mr: 'बियाणे व रोपे', slug: 'seeds-saplings' },
    { name_en: 'Fertilizers', name_mr: 'खते', slug: 'fertilizers' },
    { name_en: 'Pesticides', name_mr: 'कीटकनाशके', slug: 'pesticides' },
    { name_en: 'Farm Equipment', name_mr: 'शेती उपकरणे', slug: 'farm-equipment' },
    { name_en: 'Irrigation', name_mr: 'सिंचन', slug: 'irrigation' },
    { name_en: 'Organic Products', name_mr: 'सेंद्रिय उत्पादने', slug: 'organic-products' },
    { name_en: 'Other', name_mr: 'इतर', slug: 'other' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat, sortOrder: categories.indexOf(cat) },
    });
  }

  console.log(`Seeded ${categories.length} categories`);
}
