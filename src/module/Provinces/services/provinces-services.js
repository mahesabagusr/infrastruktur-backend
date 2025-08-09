import * as wrapper from "@/helpers/utils/wrapper.js";
import { BadRequestError } from "@/helpers/error/index.js";
import ProvinceRepository from "@/module/Provinces/repository/provinces-repository.js";

export default class ProvinceService {
  static async getAllProvinces() {
    try {
      const provinces = await ProvinceRepository.findAllProvinces();

      if (!provinces || provinces.length === 0) {
        return wrapper.error(new BadRequestError("No provinces found."));
      }

      return wrapper.data(provinces);
    } catch (err) {
      return wrapper.error(new BadRequestError(err.message));
    }
  }

  static async getAllRegencies() {
    try {
      const regencies = await ProvinceRepository.findAllRegencies();

      if (!regencies || regencies.length === 0) {
        return wrapper.error(new BadRequestError("No regencies found."));
      }

      return wrapper.data(regencies);
    } catch (err) {
      return wrapper.error(new BadRequestError(err.message));
    }
  }

  static async getRegenciesByProvinceId(provinceId) {
    try {
      const regencies = await ProvinceRepository.findRegenciesByProvinceId(
        provinceId
      );

      if (!regencies || regencies.length === 0) {
        return wrapper.error(
          new BadRequestError("No regencies found for this province.")
        );
      }

      return wrapper.data(regencies);
    } catch (err) {
      return wrapper.error(new BadRequestError(err.message));
    }
  }
}