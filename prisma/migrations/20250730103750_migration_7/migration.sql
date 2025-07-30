/*
  Warnings:

  - You are about to drop the column `adress` on the `user` table. All the data in the column will be lost.
  - Added the required column `reviewer_id` to the `ReportProgress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reportprogress` ADD COLUMN `reviewer_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `adress`,
    ADD COLUMN `address` TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE `ReportProgress` ADD CONSTRAINT `ReportProgress_reviewer_id_fkey` FOREIGN KEY (`reviewer_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
