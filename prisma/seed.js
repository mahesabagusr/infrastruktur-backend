import { PrismaClient } from 'generated/prisma/index.js';
import { provincesData, regenciesData } from './constants.js';

const prisma = new PrismaClient();

async function upsertProvinces() {
  console.log('Upserting provinces...');
  for (const p of provincesData) {
    const province_id = parseInt(p.province_id, 10);
    await prisma.province.upsert({
      where: { province_id },
      update: { name: p.name },
      create: { province_id, name: p.name },
    });
  }
}

async function upsertRegencies() {
  console.log('Upserting regencies...');
  const batchSize = 200;
  for (let i = 0; i < regenciesData.length; i += batchSize) {
    const batch = regenciesData.slice(i, i + batchSize);
    await prisma.$transaction(
      batch.map((r) => {
        const regency_id = parseInt(r.regency_id, 10);
        const province_id = parseInt(r.province_id, 10);
        return prisma.regency.upsert({
          where: { regency_id },
          update: { name: r.name, province_id },
          create: { regency_id, name: r.name, province_id },
        });
      })
    );
  }
}

async function main() {
  // Never delete; avoid cascading address deletions
  const [provinceCount, regencyCount] = await Promise.all([
    prisma.province.count(),
    prisma.regency.count(),
  ]);

  const provincesComplete = provinceCount >= provincesData.length;
  const regenciesComplete = regencyCount >= regenciesData.length;

  if (provincesComplete && regenciesComplete) {
    console.log('Seed skipped: provinces and regencies already exist.');
    return;
  }

  if (!provincesComplete) {
    await upsertProvinces();
  } else {
    console.log('Provinces already complete, skipping.');
  }

  if (!regenciesComplete) {
    await upsertRegencies();
  } else {
    console.log('Regencies already complete, skipping.');
  }

  console.log('Seeding selesai');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });