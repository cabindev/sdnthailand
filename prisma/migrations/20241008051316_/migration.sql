-- AlterTable
ALTER TABLE `Procurement` ADD COLUMN `announcementDate` DATETIME(3) NULL,
    ADD COLUMN `resultDetails` TEXT NULL,
    ADD COLUMN `winnerName` VARCHAR(191) NULL,
    ADD COLUMN `winningBid` DECIMAL(10, 2) NULL,
    MODIFY `status` ENUM('DRAFT', 'OPEN', 'CLOSED', 'CANCELLED', 'ANNOUNCED') NOT NULL;
