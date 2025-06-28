/*
  Warnings:

  - You are about to drop the column `announcementDate` on the `Procurement` table. All the data in the column will be lost.
  - You are about to drop the column `winnerName` on the `Procurement` table. All the data in the column will be lost.
  - You are about to drop the column `winningBid` on the `Procurement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Procurement` DROP COLUMN `announcementDate`,
    DROP COLUMN `winnerName`,
    DROP COLUMN `winningBid`,
    ADD COLUMN `resultFilePath` VARCHAR(191) NULL,
    MODIFY `resultDetails` VARCHAR(191) NULL;
