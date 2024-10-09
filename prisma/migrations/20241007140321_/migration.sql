-- CreateTable
CREATE TABLE `Procurement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projectCode` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `coverImage` VARCHAR(191) NULL,
    `pdfFile` VARCHAR(191) NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `status` ENUM('DRAFT', 'OPEN', 'CLOSED', 'CANCELLED') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Procurement_projectCode_key`(`projectCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
