import { prisma } from "@/helpers/db/prisma.js";

export default class ProvinceRepository {
  static async findAllProvinces() {
    return prisma.province.findMany({});
  }

  static async findAllRegencies() {
    return prisma.regency.findMany({
      include: {
        province: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  static async findRegenciesByProvinceId(provinceId) {
    return prisma.regency.findMany({
      where: {
        province_id: parseInt(provinceId),
      },
      include: {
        province: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}