/*
  Warnings:

  - Added the required column `phoneNumber` to the `MediaRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MediaRequest` ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL;
