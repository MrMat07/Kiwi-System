-- Seed admin user for Kiwi System
-- Run after creating the database/schema (e.g. after mysql_schema.sql or Prisma migrations)
USE `kiwi_system`;

INSERT INTO `User` (`nombre`, `email`, `passwordHash`, `rol`)
VALUES ('Administrador', 'admin@localhost', '$2a$10$yXCPMLb7SJ/Od8xrJhKi6uB4MTi5WumlB5Uco3nd8BxzbT0VOheT6', 'admin')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `passwordHash` = VALUES(`passwordHash`),
  `rol` = VALUES(`rol`);
