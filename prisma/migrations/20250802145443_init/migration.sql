-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NULL,
    `username` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NOT NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `signature` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    INDEX `User_email_idx`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Report` (
    `report_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `photoUrl` VARCHAR(191) NOT NULL,
    `verification_status` ENUM('PENDING', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `verification_notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `author_id` INTEGER NOT NULL,
    `verifier_id` INTEGER NULL,

    INDEX `Report_author_id_idx`(`author_id`),
    INDEX `Report_verifier_id_idx`(`verifier_id`),
    PRIMARY KEY (`report_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Address` (
    `address_id` INTEGER NOT NULL AUTO_INCREMENT,
    `street` TEXT NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
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

-- CreateTable
CREATE TABLE `ReportProgress` (
    `report_progress_id` INTEGER NOT NULL AUTO_INCREMENT,
    `photo_url` VARCHAR(191) NOT NULL,
    `progress_notes` TEXT NOT NULL,
    `stage` ENUM('REVIEW', 'INPROGRESS', 'COMPLETED') NOT NULL DEFAULT 'REVIEW',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `reviewer_id` INTEGER NOT NULL,
    `report_id` INTEGER NOT NULL,

    INDEX `ReportProgress_reviewer_id_idx`(`reviewer_id`),
    INDEX `ReportProgress_report_id_idx`(`report_id`),
    PRIMARY KEY (`report_progress_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Provinces` (
    `province_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Provinces_name_key`(`name`),
    PRIMARY KEY (`province_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Regencies` (
    `regency_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `province_id` INTEGER NOT NULL,

    INDEX `Regencies_province_id_idx`(`province_id`),
    PRIMARY KEY (`regency_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_verifier_id_fkey` FOREIGN KEY (`verifier_id`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `Provinces`(`province_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_regency_id_fkey` FOREIGN KEY (`regency_id`) REFERENCES `Regencies`(`regency_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_report_id_fkey` FOREIGN KEY (`report_id`) REFERENCES `Report`(`report_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReportProgress` ADD CONSTRAINT `ReportProgress_reviewer_id_fkey` FOREIGN KEY (`reviewer_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReportProgress` ADD CONSTRAINT `ReportProgress_report_id_fkey` FOREIGN KEY (`report_id`) REFERENCES `Report`(`report_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Regencies` ADD CONSTRAINT `Regencies_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `Provinces`(`province_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
