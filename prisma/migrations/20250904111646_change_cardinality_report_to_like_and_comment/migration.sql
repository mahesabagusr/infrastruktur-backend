/*
  Warnings:

  - You are about to drop the column `comments_id` on the `report` table. All the data in the column will be lost.
  - You are about to drop the column `likes_id` on the `report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `report` DROP COLUMN `comments_id`,
    DROP COLUMN `likes_id`;
