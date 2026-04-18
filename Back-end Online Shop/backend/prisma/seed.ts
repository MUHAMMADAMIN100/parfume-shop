import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Создаём admin пользователя
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@elixir.com' },
    update: {},
    create: {
      email: 'admin@elixir.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin created:', admin.email);

  // Удаляем старые продукты
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.product.deleteMany();
  console.log('🗑️  Old products cleared');

  const products = [
    // ── МУЖСКИЕ ──
    {
      name: 'Sauvage Eau de Parfum',
      brand: 'Dior',
      description: 'Верхние ноты: бергамот, перец. Сердце: лаванда, жёсткий виски. База: амброксан, кедр, ветивер. Свежий, дикий и благородный аромат — символ мужской элегантности.',
      price: 4500,
      category: 'Мужские',
      sizes: JSON.stringify(['30 мл', '60 мл', '100 мл', '200 мл']),
      stock: 25,
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=600&fit=crop',
    },
    {
      name: 'Bleu de Chanel Parfum',
      brand: 'Chanel',
      description: 'Верхние ноты: цитрус, лаванда. Сердце: жасмин, ладан, сандал. База: пачули, ветивер. Мощный, древесный и чувственный — для современного мужчины.',
      price: 5200,
      category: 'Мужские',
      sizes: JSON.stringify(['50 мл', '100 мл', '150 мл']),
      stock: 18,
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&h=600&fit=crop',
    },
    {
      name: 'Tobacco Vanille',
      brand: 'Tom Ford',
      description: 'Верхние ноты: табак, специи. Сердце: ваниль, какао. База: сухофрукты, деревянные ноты. Роскошный восточный аромат — тёплый, пряный, соблазнительный.',
      price: 8900,
      category: 'Мужские',
      sizes: JSON.stringify(['30 мл', '50 мл', '100 мл']),
      stock: 12,
      image: 'https://images.unsplash.com/photo-1595535873420-a599195b3f4a?w=600&h=600&fit=crop',
    },
    {
      name: 'Oud Wood',
      brand: 'Tom Ford',
      description: 'Верхние ноты: розовый перец, арабский уд. Сердце: сандал, ветивер. База: амбра, тонка. Редкий и экзотический аромат с нотами уда и специй Востока.',
      price: 9500,
      category: 'Мужские',
      sizes: JSON.stringify(['30 мл', '50 мл', '100 мл', '250 мл']),
      stock: 8,
      image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&h=600&fit=crop',
    },
    {
      name: 'Acqua di Giò Profondo',
      brand: 'Giorgio Armani',
      description: 'Верхние ноты: морские ноты, бергамот. Сердце: лабданум, розмарин. База: пачули, ветивер, мускус. Свежий морской аромат — бесконечная синева океана.',
      price: 3800,
      category: 'Мужские',
      sizes: JSON.stringify(['40 мл', '80 мл', '125 мл']),
      stock: 20,
      image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=600&h=600&fit=crop',
    },
    {
      name: 'Viking',
      brand: 'Roger & Gallet',
      description: 'Верхние ноты: розовый перец, лаванда. Сердце: герань, пачули. База: ветивер, кедр. Мощный и харизматичный аромат для уверенных мужчин.',
      price: 5600,
      category: 'Мужские',
      sizes: JSON.stringify(['50 мл', '100 мл', '200 мл']),
      stock: 15,
      image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&h=600&fit=crop',
    },

    // ── ЖЕНСКИЕ ──
    {
      name: 'N°5 Eau de Parfum',
      brand: 'Chanel',
      description: 'Верхние ноты: нероли, иланг-иланг, альдегиды. Сердце: роза, жасмин, лилия. База: сандал, ветивер, цибет. Легендарный аромат — воплощение женственности.',
      price: 6800,
      category: 'Женские',
      sizes: JSON.stringify(['35 мл', '50 мл', '100 мл', '200 мл']),
      stock: 22,
      image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&h=600&fit=crop',
    },
    {
      name: 'Miss Dior Blooming Bouquet',
      brand: 'Dior',
      description: 'Верхние ноты: пион, грейпфрут. Сердце: роза Дамасская, жасмин. База: белый мускус, пачули. Романтичный букет для нежных и жизнерадостных женщин.',
      price: 4900,
      category: 'Женские',
      sizes: JSON.stringify(['30 мл', '50 мл', '100 мл', '150 мл']),
      stock: 28,
      image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&h=600&fit=crop',
    },
    {
      name: 'Black Orchid',
      brand: 'Tom Ford',
      description: 'Верхние ноты: трюфель, гардения. Сердце: орхидея, фрукты. База: пачули, ваниль, сандал. Тёмный, чувственный и завораживающий — для настоящих соблазнительниц.',
      price: 8200,
      category: 'Женские',
      sizes: JSON.stringify(['30 мл', '50 мл', '100 мл']),
      stock: 14,
      image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&h=600&fit=crop',
    },
    {
      name: 'La Vie Est Belle',
      brand: 'Lancôme',
      description: 'Верхние ноты: чёрная смородина, груша. Сердце: ирис, жасмин, оранжевый цветок. База: пралине, ваниль, мускус. Сладкий гурманский аромат — жизнь прекрасна!',
      price: 4200,
      category: 'Женские',
      sizes: JSON.stringify(['30 мл', '50 мл', '75 мл', '100 мл']),
      stock: 30,
      image: 'https://images.unsplash.com/photo-1619994121345-b61cd610c5a6?w=600&h=600&fit=crop',
    },
    {
      name: 'Flowerbomb',
      brand: 'Viktor & Rolf',
      description: 'Верхние ноты: бергамот, чай. Сердце: самбак, жасмин, роза, фрезия, орхидея. База: пачули, мускус. Взрыв цветов — неотразимый и запоминающийся аромат.',
      price: 5500,
      category: 'Женские',
      sizes: JSON.stringify(['30 мл', '50 мл', '100 мл']),
      stock: 19,
      image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&h=600&fit=crop',
    },
    {
      name: 'Good Girl',
      brand: 'Carolina Herrera',
      description: 'Верхние ноты: жасмин самбак, миндаль. Сердце: туберроза. База: тонка, какао, кофе. Двойственный аромат — невинность и соблазн в одном флаконе.',
      price: 4600,
      category: 'Женские',
      sizes: JSON.stringify(['30 мл', '50 мл', '80 мл']),
      stock: 17,
      image: 'https://images.unsplash.com/photo-1566977776052-6e61e35bf9be?w=600&h=600&fit=crop',
    },

    // ── УНИСЕКС ──
    {
      name: 'Silver Mountain Water',
      brand: 'Creed',
      description: 'Верхние ноты: зелёный чай, вербена. Сердце: чёрная смородина, нарцисс. База: мускус, сандал. Свежий и чистый, как горный поток — аромат без границ.',
      price: 12500,
      category: 'Унисекс',
      sizes: JSON.stringify(['50 мл', '100 мл', '250 мл', '500 мл']),
      stock: 10,
      image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&h=600&fit=crop',
    },
    {
      name: 'Replica — Jazz Club',
      brand: 'Maison Margiela',
      description: 'Верхние ноты: нероли, ром. Сердце: табак, ветивер. База: ваниль, мускус, тонка. Атмосфера джаз-клуба 60-х — дым, дерево и джаз в одном флаконе.',
      price: 7200,
      category: 'Унисекс',
      sizes: JSON.stringify(['30 мл', '100 мл', '200 мл']),
      stock: 16,
      image: 'https://images.unsplash.com/photo-1590156562745-5462ac8a5ea2?w=600&h=600&fit=crop',
    },
    {
      name: 'Gypsy Water',
      brand: 'Byredo',
      description: 'Верхние ноты: бергамот, лимон, перец. Сердце: можжевельник, орис, сосна. База: сандал, ваниль, амбра. Дух свободы и странствий — для тех, кто живёт без правил.',
      price: 9800,
      category: 'Унисекс',
      sizes: JSON.stringify(['50 мл', '100 мл']),
      stock: 11,
      image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=600&fit=crop',
    },
    {
      name: 'Oud Satin Mood',
      brand: 'Maison Francis Kurkdjian',
      description: 'Верхние ноты: дамасская роза. Сердце: уд, ваниль. База: мускус, амбра. Шелковистый восточный аромат — роскошь и утончённость Востока.',
      price: 15000,
      category: 'Унисекс',
      sizes: JSON.stringify(['35 мл', '70 мл']),
      stock: 7,
      image: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=600&h=600&fit=crop',
    },
    {
      name: 'CK One',
      brand: 'Calvin Klein',
      description: 'Верхние ноты: бергамот, ананас, мандарин. Сердце: жасмин, лилия, ирис. База: мускус, сандал, дубовый мох. Культовый унисекс — свежий, лёгкий, для всех.',
      price: 2800,
      category: 'Унисекс',
      sizes: JSON.stringify(['50 мл', '100 мл', '200 мл']),
      stock: 35,
      image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&h=600&fit=crop',
    },

    // ── ПОДАРОЧНЫЕ НАБОРЫ ──
    {
      name: 'Подарочный набор Dior Sauvage',
      brand: 'Dior',
      description: 'Набор включает: Sauvage EDP 100 мл + гель для душа 50 мл + бальзам после бритья 50 мл. Идеальный подарок для мужчины на любой праздник.',
      price: 7500,
      category: 'Подарочные наборы',
      sizes: JSON.stringify(['Набор 3 предмета']),
      stock: 10,
      image: 'https://images.unsplash.com/photo-1549396535-c11d5c55b9df?w=600&h=600&fit=crop',
    },
    {
      name: 'Подарочный набор Chanel N°5',
      brand: 'Chanel',
      description: 'Набор включает: N°5 EDP 50 мл + лосьон для тела 100 мл + мыло 75 г. Роскошный подарок для неё — в фирменной коробке Chanel.',
      price: 10500,
      category: 'Подарочные наборы',
      sizes: JSON.stringify(['Набор 3 предмета']),
      stock: 8,
      image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop',
    },
    {
      name: 'Мини-набор Tom Ford',
      brand: 'Tom Ford',
      description: 'Набор из 4 миниатюр: Black Orchid 10 мл + Tobacco Vanille 10 мл + Oud Wood 10 мл + Neroli Portofino 10 мл. Попробуй лучшее от Tom Ford.',
      price: 8800,
      category: 'Подарочные наборы',
      sizes: JSON.stringify(['Набор 4 × 10 мл']),
      stock: 12,
      image: 'https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=600&h=600&fit=crop',
    },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p as any });
    console.log(`✅ Added: ${p.brand} — ${p.name}`);
  }

  console.log(`\n🎉 Done! Added ${products.length} products.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
