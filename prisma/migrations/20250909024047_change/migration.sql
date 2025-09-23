/*
  Warnings:

  - A unique constraint covering the columns `[user_id,report_id]` on the table `comment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `comment_user_id_report_id_key` ON `comment`(`user_id`, `report_id`);
