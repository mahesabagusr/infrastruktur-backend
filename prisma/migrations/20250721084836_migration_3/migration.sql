/*
  Warnings:

  - You are about to alter the column `stage` on the `reportprogress` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `reportprogress` MODIFY `stage` ENUM('review', 'inProgress', 'completed') NOT NULL DEFAULT 'review';
