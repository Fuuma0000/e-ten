/*
  Warnings:

  - Made the column `expired_at` on table `temporary_users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `temporary_users` MODIFY `expired_at` DATETIME(0) NOT NULL;
