/*
  Warnings:

  - You are about to drop the column `resultDetails` on the `Procurement` table. All the data in the column will be lost.
  - You are about to drop the column `resultFilePath` on the `Procurement` table. All the data in the column will be lost.
  - The values [ANNOUNCED] on the enum `Procurement_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Procurement` DROP COLUMN `resultDetails`,
    DROP COLUMN `resultFilePath`,
    MODIFY `status` ENUM('DRAFT', 'OPEN', 'CLOSED', 'CANCELLED') NOT NULL;
