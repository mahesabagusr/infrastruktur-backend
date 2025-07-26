/*
  Warnings:

  - Added the required column `province_id` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regency_id` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adress` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province_id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regency_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `report` ADD COLUMN `province_id` INTEGER NOT NULL,
    ADD COLUMN `regency_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `adress` TEXT NOT NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NULL,
    ADD COLUMN `province_id` INTEGER NOT NULL,
    ADD COLUMN `regency_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `Provinces`(`province_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_regency_id_fkey` FOREIGN KEY (`regency_id`) REFERENCES `Regencies`(`regency_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `Provinces`(`province_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_regency_id_fkey` FOREIGN KEY (`regency_id`) REFERENCES `Regencies`(`regency_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
