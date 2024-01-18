-- CreateTable
CREATE TABLE `tools` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `works_data_tools` (
    `works_data_id` INTEGER UNSIGNED NOT NULL,
    `tools_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted_at` DATETIME(0) NULL,

    INDEX `tools_id`(`tools_id`),
    INDEX `works_data_id`(`works_data_id`),
    PRIMARY KEY (`works_data_id`, `tools_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `works_data_tools` ADD CONSTRAINT `works_data_tools_ibfk_1` FOREIGN KEY (`works_data_id`) REFERENCES `works_data`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `works_data_tools` ADD CONSTRAINT `works_data_tools_ibfk_2` FOREIGN KEY (`tools_id`) REFERENCES `tools`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
