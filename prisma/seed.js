import { PrismaClient } from 'generated/prisma/index.js';
import { provincesData, regenciesData } from './constants.js';
const prisma = new PrismaClient();

async function main() {
  console.log('Menghapus data lama...');
  await prisma.province.deleteMany();
  await prisma.regency.deleteMany();

  console.log('Data lama berhasil dihapus.');

  console.log('Menambahkan data provinsi...');
  await prisma.province.createMany({
    data: provincesData.map(province => ({
      province_id: parseInt(province.province_id, 10),
      name: province.name,
    })),
  });

  console.log('Data provinsi berhasil ditambahkan.');

  console.log('Menambahkan data kabupaten/kota...');

  const batchSize = 100;
  for (let i = 0; i < regenciesData.length; i += batchSize) {
    const batch = regenciesData.slice(i, i + batchSize);
    await prisma.regency.createMany({
      data: batch.map(regency => ({
        regency_id: parseInt(regency.regency_id, 10),
        name: regency.name,
        province_id: parseInt(regency.province_id, 10),
      })),
    });
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