/*
  Warnings:

  - The primary key for the `Procurement` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `Procurement` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `description` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `AnnounceResult` (
    `id` VARCHAR(191) NOT NULL,
    `procurementId` VARCHAR(191) NOT NULL,
    `pdfFile` VARCHAR(191) NULL,
    `announcedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AnnounceResult` ADD CONSTRAINT `AnnounceResult_procurementId_fkey` FOREIGN KEY (`procurementId`) REFERENCES `Procurement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
