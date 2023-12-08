CREATE TABLE `events` (
    `id` INT UNSIGNED AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `start_at` DATETIME,
    `end_at` DATETIME,
    `icon_url` VARCHAR(255),
    `description` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME,
    PRIMARY KEY (`id`)
);

CREATE TABLE `courses` (
    `id` INT UNSIGNED AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME,
    PRIMARY KEY (`id`)
);

CREATE TABLE `users` (
    `id` INT UNSIGNED AUTO_INCREMENT,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `password` VARCHAR(50) NOT NULL,
    `username` VARCHAR(50),
    `courses_id` INT UNSIGNED,
    `enrollment_year` INT,
    `graduation_year` INT,
    `is_job_hunt_completed` BOOLEAN DEFAULT FALSE,
    `self_introduction` TEXT,
    `icon_url` VARCHAR(255),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`courses_id`) REFERENCES courses(`id`)
);

CREATE TABLE `genres` (
    `id` INT UNSIGNED AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME,
    PRIMARY KEY (`id`)
);

CREATE TABLE `technologies` (
    `id` INT UNSIGNED AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME,
    PRIMARY KEY (`id`)
);

CREATE TABLE `jobs` (
    `id` INT UNSIGNED AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME,
    PRIMARY KEY (`id`)
);

CREATE TABLE `roles` (
    `id` INT UNSIGNED AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME,
    PRIMARY KEY (`id`)
);

CREATE TABLE `works` (
    `id` INT UNSIGNED AUTO_INCREMENT,
    `events_id` INT UNSIGNED NOT NULL,
    `latest_reviewed_id` INT UNSIGNED,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`events_id`) REFERENCES events(`id`)
);

CREATE TABLE `works_data` (
    `id` INT UNSIGNED AUTO_INCREMENT,
    `works_id` INT UNSIGNED NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `catch_copy` VARCHAR(100) NOT NULL,
    `description` VARCHAR(500) NOT NULL,
    `works_url` VARCHAR(255),
    `movie_url` VARCHAR(255),
    `system_diagram_url` VARCHAR(255),
    `detail` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME,
    PRIMARY KEY (`id`)
);

CREATE TABLE `bookmarks` (
    `id` INT UNSIGNED AUTO_INCREMENT,
    `works_id` INT UNSIGNED NOT NULL,
    `users_id` INT UNSIGNED NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`works_id`) REFERENCES works(`id`),
    FOREIGN KEY (`users_id`) REFERENCES users(`id`)
);

CREATE TABLE `works_data_users` (
    `works_data_id` INT UNSIGNED NOT NULL,
    `users_id` INT UNSIGNED  NOT NULL,
    `role_explanation` VARCHAR(50),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME,
    FOREIGN KEY (`works_data_id`) REFERENCES works_data(`id`),
    FOREIGN KEY (`users_id`) REFERENCES users(`id`)
);

CREATE TABLE `users_jobs` (
    `users_id` INT UNSIGNED NOT NULL,
    `jobs_id` INT UNSIGNED NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME,
    FOREIGN KEY (`users_id`) REFERENCES users(`id`),
    FOREIGN KEY (`jobs_id`) REFERENCES jobs(`id`)
);

CREATE TABLE `users_urls` (
    `id` INT UNSIGNED AUTO_INCREMENT,
    `users_id` INT UNSIGNED NOT NULL,
    `url_name` VARCHAR(30) NOT NULL,
    `url` VARCHAR(255) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`users_id`) REFERENCES users(`id`)
);

CREATE TABLE `works_data_genres` (
    `works_data_id` INT UNSIGNED NOT NULL,
    `genres_id` INT UNSIGNED NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME,
    FOREIGN KEY (`works_data_id`) REFERENCES works_data(`id`),
    FOREIGN KEY (`genres_id`) REFERENCES genres(`id`)
);

CREATE TABLE `works_data_technologies` (
    `works_data_id` INT UNSIGNED NOT NULL,
    `technologies_id` INT UNSIGNED NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME,
    FOREIGN KEY (`works_data_id`) REFERENCES works_data(`id`),
    FOREIGN KEY (`technologies_id`) REFERENCES technologies(`id`)
);

CREATE TABLE `works_data_images` (
    `id` INT UNSIGNED AUTO_INCREMENT,
    `works_data_id` INT UNSIGNED NOT NULL,
    `url` VARCHAR(255),
    `order` TINYINT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`works_data_id`) REFERENCES works_data(`id`)
);

CREATE TABLE `event_users_roles` (
    `events_id` INT UNSIGNED NOT NULL,
    `user_id` INT UNSIGNED NOT NULL,
    `roles_id` INT UNSIGNED NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME,
    FOREIGN KEY (`events_id`) REFERENCES events(`id`),
    FOREIGN KEY (`user_id`) REFERENCES users(`id`),
    FOREIGN KEY (`roles_id`) REFERENCES roles(`id`)
);

CREATE TABLE temporary_users (
    `id` INT UNSIGNED AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `hashed_password` VARCHAR(50) NOT NULL,
    `token` VARCHAR(32) NOT NULL,
    `expired_at` DATETIME NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);

ALTER TABLE `works_data` ADD CONSTRAINT `fk_works_data_works` FOREIGN KEY (`works_id`) REFERENCES works(`id`);
ALTER TABLE `works` ADD CONSTRAINT `fk_works_works_data` FOREIGN KEY (`latest_reviewed_id`) REFERENCES works_data(`id`);
