/*
  Warnings:

  - You are about to drop the column `verificationNotes` on the `report` table. All the data in the column will be lost.
  - You are about to drop the column `verificationStatus` on the `report` table. All the data in the column will be lost.
  - You are about to drop the column `progressNotes` on the `reportprogress` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `user` table. All the data in the column will be lost.
  - Added the required column `progress_notes` to the `ReportProgress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `report` DROP COLUMN `verificationNotes`,
    DROP COLUMN `verificationStatus`,
    ADD COLUMN `verification_notes` TEXT NULL,
    ADD COLUMN `verification_status` ENUM('PENDING', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `reportprogress` DROP COLUMN `progressNotes`,
    ADD COLUMN `progress_notes` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `phoneNumber`,
    ADD COLUMN `phone_number` INTEGER NOT NULL;
