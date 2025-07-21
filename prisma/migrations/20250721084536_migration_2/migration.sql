/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `role` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - Added the required column `user_id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `firstName` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `username` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    MODIFY `firstName` VARCHAR(191) NOT NULL,
    MODIFY `username` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`user_id`);

-- CreateTable
CREATE TABLE `Report` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `photoUrl` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `address` TEXT NOT NULL,
    `verificationStatus` ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
    `verificationNotes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `author_id` INTEGER NOT NULL,
    `verifier_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReportProgress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `report_id` INTEGER NOT NULL,
    `photoUrl` VARCHAR(191) NOT NULL,
    `progressNotes` TEXT NOT NULL,
    `stage` ENUM('meninjau', 'perbaikan', 'selesai') NOT NULL DEFAULT 'meninjau',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_verifier_id_fkey` FOREIGN KEY (`verifier_id`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReportProgress` ADD CONSTRAINT `ReportProgress_report_id_fkey` FOREIGN KEY (`report_id`) REFERENCES `Report`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
