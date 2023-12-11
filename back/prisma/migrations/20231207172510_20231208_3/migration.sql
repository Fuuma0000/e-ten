-- AlterTable
ALTER TABLE `temporary_users` MODIFY `hashed_password` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `password` VARCHAR(255) NOT NULL;
