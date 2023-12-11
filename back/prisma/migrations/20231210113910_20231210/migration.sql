/*
  Warnings:

  - Added the required column `salt` to the `temporary_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `temporary_users` ADD COLUMN `salt` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `salt` VARCHAR(255) NOT NULL;
