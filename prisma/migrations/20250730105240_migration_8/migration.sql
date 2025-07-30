/*
  Warnings:

  - You are about to drop the column `address` on the `report` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `report` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `report` table. All the data in the column will be lost.
  - You are about to drop the column `province_id` on the `report` table. All the data in the column will be lost.
  - You are about to drop the column `regency_id` on the `report` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `province_id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `regency_id` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Provinces` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `report` DROP FOREIGN KEY `Report_province_id_fkey`;

-- DropForeignKey
ALTER TABLE `report` DROP FOREIGN KEY `Report_regency_id_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_province_id_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_regency_id_fkey`;

-- DropIndex
DROP INDEX `Report_province_id_fkey` ON `report`;

-- DropIndex
DROP INDEX `Report_regency_id_fkey` ON `report`;

-- DropIndex
DROP INDEX `User_province_id_fkey` ON `user`;

-- DropIndex
DROP INDEX `User_regency_id_fkey` ON `user`;

-- AlterTable
ALTER TABLE `report` DROP COLUMN `address`,
    DROP COLUMN `latitude`,
    DROP COLUMN `longitude`,
    DROP COLUMN `province_id`,
    DROP COLUMN `regency_id`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `address`,
    DROP COLUMN `province_id`,
    DROP COLUMN `regency_id`;

-- CreateTable
CREATE TABLE `Address` (
    `address_id` INTEGER NOT NULL AUTO_INCREMENT,
    `street` TEXT NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `province_id` INTEGER NOT NULL,
    `regency_id` INTEGER NOT NULL,
    `user_id` INTEGER NULL,
    `report_id` INTEGER NULL,

    UNIQUE INDEX `Address_user_id_key`(`user_id`),
    UNIQUE INDEX `Address_report_id_key`(`report_id`),
    INDEX `Address_province_id_idx`(`province_id`),
    INDEX `Address_regency_id_idx`(`regency_id`),
    PRIMARY KEY (`address_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Provinces_name_key` ON `Provinces`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `User_username_key` ON `User`(`username`);

-- CreateIndex
CREATE INDEX `User_email_idx` ON `User`(`email`);

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `Provinces`(`province_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_regency_id_fkey` FOREIGN KEY (`regency_id`) REFERENCES `Regencies`(`regency_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_report_id_fkey` FOREIGN KEY (`report_id`) REFERENCES `Report`(`report_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `regencies` RENAME INDEX `Regencies_province_id_fkey` TO `Regencies_province_id_idx`;

-- RenameIndex
ALTER TABLE `report` RENAME INDEX `Report_author_id_fkey` TO `Report_author_id_idx`;

-- RenameIndex
ALTER TABLE `report` RENAME INDEX `Report_verifier_id_fkey` TO `Report_verifier_id_idx`;

-- RenameIndex
ALTER TABLE `reportprogress` RENAME INDEX `ReportProgress_report_id_fkey` TO `ReportProgress_report_id_idx`;

-- RenameIndex
ALTER TABLE `reportprogress` RENAME INDEX `ReportProgress_reviewer_id_fkey` TO `ReportProgress_reviewer_id_idx`;
