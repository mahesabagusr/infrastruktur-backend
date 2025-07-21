/*
  Warnings:

  - The primary key for the `report` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `report` table. All the data in the column will be lost.
  - The primary key for the `reportprogress` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `reportprogress` table. All the data in the column will be lost.
  - Added the required column `report_id` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `report_progress_id` to the `ReportProgress` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `reportprogress` DROP FOREIGN KEY `ReportProgress_report_id_fkey`;

-- DropIndex
DROP INDEX `ReportProgress_report_id_fkey` ON `reportprogress`;

-- AlterTable
ALTER TABLE `report` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `report_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`report_id`);

-- AlterTable
ALTER TABLE `reportprogress` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `report_progress_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`report_progress_id`);

-- CreateTable
CREATE TABLE `Provinces` (
    `province_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`province_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Regencies` (
    `regency_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `province_id` INTEGER NOT NULL,

    PRIMARY KEY (`regency_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ReportProgress` ADD CONSTRAINT `ReportProgress_report_id_fkey` FOREIGN KEY (`report_id`) REFERENCES `Report`(`report_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Regencies` ADD CONSTRAINT `Regencies_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `Provinces`(`province_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
