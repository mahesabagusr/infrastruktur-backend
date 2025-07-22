import * as wrapper from "@/helpers/utils/wrapper.js";
import {
  BadRequestError,
} from "@/helpers/error/index.js";
import { prisma } from "@/helpers/db/prisma.js";

export default class ProvinceService {
  static async getAllProvinces() {
    try {
      const provinces = await prisma.provinces.findMany({
      });

      if (!provinces || provinces.length === 0) {
        return wrapper.error(new BadRequestError("No provinces found."));
      }

      return wrapper.data(provinces);
    } catch (err) {
      return wrapper.error(new BadRequestError(err.message));
    }
  }
}