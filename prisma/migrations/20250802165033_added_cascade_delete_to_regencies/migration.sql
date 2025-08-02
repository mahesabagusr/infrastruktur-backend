-- DropForeignKey
ALTER TABLE `address` DROP FOREIGN KEY `Address_province_id_fkey`;

-- DropForeignKey
ALTER TABLE `address` DROP FOREIGN KEY `Address_regency_id_fkey`;

-- DropForeignKey
ALTER TABLE `address` DROP FOREIGN KEY `Address_report_id_fkey`;

-- DropForeignKey
ALTER TABLE `address` DROP FOREIGN KEY `Address_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `regencies` DROP FOREIGN KEY `Regencies_province_id_fkey`;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `Provinces`(`province_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_regency_id_fkey` FOREIGN KEY (`regency_id`) REFERENCES `Regencies`(`regency_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_report_id_fkey` FOREIGN KEY (`report_id`) REFERENCES `Report`(`report_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Regencies` ADD CONSTRAINT `Regencies_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `Provinces`(`province_id`) ON DELETE CASCADE ON UPDATE CASCADE;
